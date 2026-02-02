"""
Logging Middleware for EmoTrack API
"""
import time
import logging
import json
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware для логирования HTTP запросов и ответов."""
    
    def __init__(
        self,
        app: ASGIApp,
        *,
        logger: logging.Logger = logger,
        exclude_paths: tuple = ('/health', '/docs', '/openapi.json', '/assets', '/favicon.ico')
    ):
        super().__init__(app)
        self.logger = logger
        self.exclude_paths = exclude_paths
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Пропускаем определённые пути
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            return await call_next(request)
        
        # Засекаем время
        start_time = time.time()
        
        # Логируем запрос
        request_id = request.headers.get('X-Request-ID', 'N/A')
        self.logger.info(
            f"Request: {request.method} {request.url.path} | "
            f"ID: {request_id} | "
            f"IP: {request.client.host}"
        )
        
        try:
            # Выполняем запрос
            response = await call_next(request)
            
            # Вычисляем время выполнения
            process_time = time.time() - start_time
            
            # Логируем ответ
            self.logger.info(
                f"Response: {request.method} {request.url.path} | "
                f"Status: {response.status_code} | "
                f"Time: {process_time:.3f}s | "
                f"ID: {request_id}"
            )
            
            # Добавляем заголовки для отладки
            response.headers['X-Process-Time'] = f'{process_time:.3f}'
            response.headers['X-Request-ID'] = request_id
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            self.logger.error(
                f"Error: {request.method} {request.url.path} | "
                f"Error: {str(e)} | "
                f"Time: {process_time:.3f}s | "
                f"ID: {request_id}",
                exc_info=True
            )
            raise


class RequestLogger:
    """Класс для детального логирования запросов."""
    
    @staticmethod
    def log_request(request: Request) -> dict:
        """Логирует информацию о запросе."""
        return {
            'method': request.method,
            'url': str(request.url),
            'path': request.url.path,
            'query_params': dict(request.query_params),
            'headers': dict(request.headers),
            'client': {
                'host': request.client.host,
                'port': request.client.port,
            },
        }
    
    @staticmethod
    def log_response(response: Response, process_time: float) -> dict:
        """Логирует информацию об ответе."""
        return {
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'process_time': process_time,
        }
    
    @staticmethod
    def log_error(error: Exception, request: Request) -> dict:
        """Логирует информацию об ошибке."""
        return {
            'error_type': type(error).__name__,
            'error_message': str(error),
            'request': RequestLogger.log_request(request),
        }


def setup_logging():
    """Настройка логирования приложения."""
    # Создаём форматтер
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Настройка консольного обработчика
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.INFO)
    
    # Настройка файлового обработчика (опционально)
    # file_handler = logging.FileHandler('app.log')
    # file_handler.setFormatter(formatter)
    # file_handler.setLevel(logging.DEBUG)
    
    # Настройка корневого логгера
    root_logger = logging.getLogger()
    root_logger.addHandler(console_handler)
    root_logger.setLevel(logging.INFO)
    
    # Настройка логгера для SQLAlchemy
    sql_logger = logging.getLogger('sqlalchemy.engine')
    sql_logger.setLevel(logging.WARNING)
    
    # Настройка логгера для FastAPI
    fastapi_logger = logging.getLogger('fastapi')
    fastapi_logger.setLevel(logging.INFO)
    
    return logger
