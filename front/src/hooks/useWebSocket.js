import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Улучшенный хук для WebSocket соединения с поддержкой heartbeats
 */
export const useWebSocket = (userId, options = {}) => {
	const {
		url,
		onMessage,
		onConnect,
		onDisconnect,
		onError,
		heartbeatInterval = 30000, // 30 секунд
		reconnectDelay = 3000,
		maxReconnectAttempts = 5,
	} = options

	const wsRef = useRef(null)
	const reconnectAttemptsRef = useRef(0)
	const heartbeatTimerRef = useRef(null)
	const reconnectTimerRef = useRef(null)
	const isManualDisconnectRef = useRef(false)

	const [isConnected, setIsConnected] = useState(false)
	const [onlineUsers, setOnlineUsers] = useState([])
	const [lastPingTime, setLastPingTime] = useState(null)

	// Отправка ping
	const sendPing = useCallback(() => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({ type: 'ping', timestamp: Date.now() }),
			)
			setLastPingTime(Date.now())
		}
	}, [])

	// Очистка таймеров
	const clearTimers = useCallback(() => {
		if (heartbeatTimerRef.current) {
			clearInterval(heartbeatTimerRef.current)
			heartbeatTimerRef.current = null
		}
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current)
			reconnectTimerRef.current = null
		}
	}, [])

	// Запуск heartbeat
	const startHeartbeat = useCallback(() => {
		clearTimers()
		heartbeatTimerRef.current = setInterval(sendPing, heartbeatInterval)
	}, [clearTimers, sendPing, heartbeatInterval])

	// Остановка heartbeat
	const stopHeartbeat = useCallback(() => {
		if (heartbeatTimerRef.current) {
			clearInterval(heartbeatTimerRef.current)
			heartbeatTimerRef.current = null
		}
	}, [])

	// Переподключение
	const reconnect = useCallback(() => {
		if (isManualDisconnectRef.current) return

		if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
			console.log('Max reconnect attempts reached')
			onError?.(new Error('Max reconnect attempts reached'))
			return
		}

		reconnectAttemptsRef.current += 1
		const delay = reconnectDelay * reconnectAttemptsRef.current

		console.log(
			`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`,
		)

		reconnectTimerRef.current = setTimeout(() => {
			connect()
		}, delay)
	}, [reconnectDelay, maxReconnectAttempts, onError])

	// Обработка входящих сообщений
	const handleMessage = useCallback(
		event => {
			try {
				const data = JSON.parse(event.data)

				switch (data.type) {
					case 'ping':
						// Получили ping от сервера, отвечаем pong
						wsRef.current?.send(
							JSON.stringify({
								type: 'pong',
								timestamp: Date.now(),
							}),
						)
						break

					case 'pong':
						// Получили ответ на наш ping
						const pingLatency = Date.now() - data.timestamp
						console.log(`Ping latency: ${pingLatency}ms`)
						break

					case 'online_status':
						setOnlineUsers(data.online_users || [])
						break

					case 'message':
					case 'typing':
					case 'read_receipt':
						onMessage?.(data)
						break

					default:
						onMessage?.(data)
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error)
			}
		},
		[onMessage],
	)

	// Обработка ошибок
	const handleError = useCallback(
		error => {
			console.error('WebSocket error:', error)
			onError?.(error)
			stopHeartbeat()
			setIsConnected(false)
			reconnect()
		},
		[onError, stopHeartbeat, reconnect],
	)

	// Обработка отключения
	const handleDisconnect = useCallback(
		event => {
			console.log('WebSocket disconnected:', event.code, event.reason)
			stopHeartbeat()
			setIsConnected(false)
			onDisconnect?.(event)

			if (!isManualDisconnectRef.current) {
				reconnect()
			}
		},
		[stopHeartbeat, onDisconnect, reconnect],
	)

	// Подключение
	const connect = useCallback(() => {
		if (!userId) return

		isManualDisconnectRef.current = false
		const wsUrl = url || `ws://localhost:8000/api/messages/ws/${userId}`

		try {
			wsRef.current = new WebSocket(wsUrl)

			wsRef.current.onopen = () => {
				console.log('WebSocket connected')
				setIsConnected(true)
				reconnectAttemptsRef.current = 0
				startHeartbeat()
				onConnect?.()
			}

			wsRef.current.onmessage = handleMessage
			wsRef.current.onerror = handleError
			wsRef.current.onclose = handleDisconnect
		} catch (error) {
			console.error('WebSocket connection error:', error)
			handleError(error)
		}
	}, [
		userId,
		url,
		onConnect,
		onDisconnect,
		handleMessage,
		handleError,
		handleDisconnect,
		startHeartbeat,
	])

	// Отключение
	const disconnect = useCallback(() => {
		isManualDisconnectRef.current = true
		clearTimers()
		stopHeartbeat()

		if (wsRef.current) {
			wsRef.current.close(1000, 'Manual disconnect')
			wsRef.current = null
		}

		setIsConnected(false)
	}, [clearTimers, stopHeartbeat])

	// Отправка сообщения
	const sendMessage = useCallback(message => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify(message))
			return true
		}
		return false
	}, [])

	// Настройка эффекта
	useEffect(() => {
		connect()

		return () => {
			disconnect()
		}
	}, [connect, disconnect])

	return {
		isConnected,
		onlineUsers,
		sendMessage,
		sendPing,
		disconnect,
		reconnect: () => {
			disconnect()
			setTimeout(connect, 100)
		},
	}
}

export default useWebSocket
