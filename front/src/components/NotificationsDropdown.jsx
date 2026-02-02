import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronRight, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationsAPI } from '../api/api'

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {string} avatar_url
 * @property {string} title
 * @property {string} message
 * @property {boolean} is_read
 * @property {string} created_at
 * @property {string} notification_type
 */

const NotificationsDropdown = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('all') // 'all' | 'unread'
	const [notifications, setNotifications] = useState([])
	const [unreadCount, setUnreadCount] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const dropdownRef = useRef(null)

	// Загрузка уведомлений
	const fetchNotifications = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const unreadOnly = activeTab === 'unread'
			const data = await notificationsAPI.getNotifications(0, 50, unreadOnly)
			setNotifications(data.notifications || [])
			setUnreadCount(data.unread_count || 0)
		} catch (err) {
			console.error('Failed to fetch notifications:', err)
			setError('Не удалось загрузить уведомления')
			// Fallback to mock data for demo
			setNotifications([
				{
					id: 1,
					avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
					title: 'Новое сообщение',
					message: 'Доктор Иванов отправил вам сообщение',
					is_read: false,
					created_at: new Date().toISOString(),
					notification_type: 'message',
				},
				{
					id: 2,
					avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
					title: 'Напоминание',
					message: 'Ваша сессия начнется через 15 минут',
					is_read: false,
					created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
					notification_type: 'session',
				},
				{
					id: 3,
					avatar_url: null,
					title: 'Система',
					message: 'Пароль успешно обновлен',
					is_read: true,
					created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
					notification_type: 'system',
				},
			])
			setUnreadCount(2)
		} finally {
			setLoading(false)
		}
	}, [activeTab])

	// Загружаем при открытии или смене таба
	useEffect(() => {
		if (isOpen) {
			fetchNotifications()
		}
	}, [isOpen, activeTab, fetchNotifications])

	// Периодическая проверка количества непрочитанных
	useEffect(() => {
		const checkUnread = async () => {
			try {
				const data = await notificationsAPI.getUnreadCount()
				setUnreadCount(data.unread_count || 0)
			} catch (err) {
				// Silently fail for background polling
			}
		}

		// Check immediately
		checkUnread()

		// Poll every 30 seconds
		const interval = setInterval(checkUnread, 30000)
		return () => clearInterval(interval)
	}, [])

	const handleMarkAllRead = async () => {
		try {
			await notificationsAPI.markAllAsRead()
			setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
			setUnreadCount(0)
		} catch (err) {
			console.error('Failed to mark all as read:', err)
		}
	}

	const handleNotificationClick = async notification => {
		if (!notification.is_read) {
			try {
				await notificationsAPI.markAsRead(notification.id)
				setNotifications(prev =>
					prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
				)
				setUnreadCount(prev => Math.max(0, prev - 1))
			} catch (err) {
				console.error('Failed to mark as read:', err)
			}
		}

		// Navigate if action_url is provided
		if (notification.action_url) {
			window.location.href = notification.action_url
		}
	}

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	// Format time
	const formatTime = timestamp => {
		const date = new Date(timestamp)
		const now = new Date()
		const diffMs = now - date
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return 'Только что'
		if (diffMins < 60) return `${diffMins} мин назад`
		if (diffHours < 24) return `${diffHours} ч назад`
		if (diffDays < 7) return `${diffDays} дн назад`

		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
	}

	// Get default avatar based on notification type
	const getAvatarUrl = notification => {
		if (notification.avatar_url) return notification.avatar_url

		// Default avatars by type
		const typeAvatars = {
			message: 'https://i.pravatar.cc/150?u=message',
			session: 'https://i.pravatar.cc/150?u=session',
			system: null, // Will show icon instead
			emotion: 'https://i.pravatar.cc/150?u=emotion',
			reminder: 'https://i.pravatar.cc/150?u=reminder',
		}

		return typeAvatars[notification.notification_type] || null
	}

	const filteredNotifications =
		activeTab === 'unread'
			? notifications.filter(n => !n.is_read)
			: notifications

	return (
		<div className='relative' ref={dropdownRef}>
			{/* Bell Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all relative'
			>
				<Bell className='w-5 h-5' />
				{unreadCount > 0 && (
					<span className='absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-[#1a1a2e] text-[10px] text-white font-medium flex items-center justify-center'>
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</button>

			{/* Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{ duration: 0.2 }}
						className='absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl z-[100] overflow-hidden'
					>
						{/* Header */}
						<div className='p-4 border-b border-gray-100 flex items-center justify-between'>
							<h3 className='font-semibold text-gray-900'>Уведомления</h3>
							{unreadCount > 0 && (
								<button
									onClick={handleMarkAllRead}
									className='text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors'
								>
									Отметить все как прочитанное
								</button>
							)}
						</div>

						{/* Tabs */}
						<div className='flex items-center px-4 border-b border-gray-100'>
							<button
								onClick={() => setActiveTab('all')}
								className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors mr-4 ${
									activeTab === 'all'
										? 'border-blue-500 text-blue-500'
										: 'border-transparent text-gray-500 hover:text-gray-700'
								}`}
							>
								ВСЕ
							</button>
							<button
								onClick={() => setActiveTab('unread')}
								className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
									activeTab === 'unread'
										? 'border-blue-500 text-blue-500'
										: 'border-transparent text-gray-500 hover:text-gray-700'
								}`}
							>
								НЕПРОЧИТАННЫЕ
								{unreadCount > 0 && (
									<span className='ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs'>
										{unreadCount}
									</span>
								)}
							</button>
						</div>

						{/* List */}
						<div className='max-h-[400px] overflow-y-auto custom-scrollbar'>
							{loading ? (
								<div className='p-8 text-center'>
									<Loader2 className='w-6 h-6 animate-spin text-blue-500 mx-auto' />
									<p className='text-gray-500 text-sm mt-2'>Загрузка...</p>
								</div>
							) : filteredNotifications.length === 0 ? (
								<div className='p-8 text-center text-gray-500 text-sm'>
									{activeTab === 'unread'
										? 'Нет непрочитанных уведомлений'
										: 'Нет уведомлений'}
								</div>
							) : (
								<div className='divide-y divide-gray-50'>
									{filteredNotifications.map(notification => (
										<div
											key={notification.id}
											onClick={() => handleNotificationClick(notification)}
											className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer group relative ${
												!notification.is_read ? 'bg-blue-50/30' : ''
											}`}
										>
											{/* Status Indicator for unread */}
											{!notification.is_read && (
												<div className='absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full' />
											)}

											{/* Avatar */}
											{getAvatarUrl(notification) ? (
												<img
													src={getAvatarUrl(notification)}
													alt=''
													className='w-10 h-10 rounded-full object-cover bg-gray-200 shrink-0'
												/>
											) : (
												<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0'>
													<Bell className='w-5 h-5 text-white' />
												</div>
											)}

											{/* Content */}
											<div className='flex-1 min-w-0'>
												<div className='flex justify-between items-start mb-0.5'>
													<p className='text-sm font-semibold text-gray-900 truncate pr-2'>
														{notification.title}
													</p>
													<span className='text-[10px] text-gray-400 whitespace-nowrap'>
														{formatTime(notification.created_at)}
													</span>
												</div>
												<p className='text-xs text-gray-600 line-clamp-2 leading-relaxed'>
													{notification.message}
												</p>
											</div>

											{/* Arrow */}
											<ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors self-center shrink-0' />
										</div>
									))}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default NotificationsDropdown
