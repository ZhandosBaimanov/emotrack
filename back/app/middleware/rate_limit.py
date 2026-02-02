"""
Rate Limiting Middleware for EmoTrack API
"""
import time
from collections import defaultdict
from dataclasses import dataclass, field
from typing import DefaultDict, Dict, Optional

from fastapi import Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware


# In-memory storage for rate limiting (use Redis in production)
class RateLimitStorage:
    """Simple in-memory rate limit storage."""
    
    def __init__(self):
        self.requests: DefaultDict[str, list[float]] = defaultdict(list)
    
    def get_remaining(self, key: str, limit: int, window: int) -> int:
        """Get remaining requests for a key."""
        now = time.time()
        # Clean old requests
        self.requests[key] = [t for t in self.requests[key] if now - t < window]
        return max(0, limit - len(self.requests[key]))
    
    def add_request(self, key: str) -> bool:
        """Add a request and return True if within limit."""
        now = time.time()
        self.requests[key].append(now)
        return True
    
    def reset(self, key: str):
        """Reset counter for a key."""
        self.requests[key] = []


# Create limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379",  # Will use in-memory if Redis unavailable
    default_limits=["100/minute"],
    headers_enabled=True,
)


@dataclass
class RateLimitConfig:
    """Rate limit configuration for different endpoints."""
    
    # Authentication endpoints
    login: tuple = (5, 60)  # 5 requests per 60 seconds
    register: tuple = (3, 60)  # 3 requests per 60 seconds
    
    # General API endpoints
    default: tuple = (100, 60)  # 100 requests per minute
    
    # Message endpoints (real-time, more restrictive)
    messages: tuple = (30, 60)  # 30 messages per minute
    
    # Emotion tracking (personal, moderate)
    emotions: tuple = (50, 60)  # 50 entries per minute
    
    # Resource uploads (heavy, very restrictive)
    uploads: tuple = (10, 3600)  # 10 uploads per hour


def get_rate_limit_key(request: Request) -> str:
    """Generate rate limit key based on user or IP."""
    # Try to get user from token
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        # Use user ID from token (simplified)
        return f"user:{auth_header[:50]}"
    return f"ip:{request.client.host}"


def get_rate_limit_for_endpoint(path: str) -> tuple:
    """Get rate limit configuration for an endpoint."""
    config = RateLimitConfig()
    
    if "/auth/login" in path:
        return config.login
    elif "/auth/register" in path:
        return config.register
    elif "/messages" in path:
        return config.messages
    elif "/emotions" in path:
        return config.emotions
    elif "/resources" in path and "upload" in path.lower():
        return config.uploads
    else:
        return config.default


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware for applying rate limits."""
    
    def __init__(self, app):
        super().__init__(app)
        self.storage = RateLimitStorage()
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path == "/" or request.url.path.startswith("/health"):
            return await call_next(request)
        
        # Get rate limit config for this endpoint
        limit, window = get_rate_limit_for_endpoint(request.url.path)
        key = get_rate_limit_key(request)
        
        # Check rate limit
        remaining = self.storage.get_remaining(key, limit, window)
        
        if remaining <= 0:
            # Rate limit exceeded
            return Response(
                content='{"error": "Rate limit exceeded", "message": "Too many requests"}',
                status_code=429,
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + window),
                    "Retry-After": str(window),
                    "Content-Type": "application/json",
                },
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        self.storage.add_request(key)
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(max(0, remaining - 1))
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + window)
        
        return response
