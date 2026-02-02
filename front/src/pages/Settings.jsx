import {
	ArrowLeft,
	Bell,
	Check,
	CheckCircle,
	CreditCard,
	Edit,
	Eye,
	EyeOff,
	Globe,
	Key,
	Loader2,
	Lock,
	LogOut,
	Mail,
	Phone,
	Settings,
	Shield,
	Trash2,
	Upload,
	User,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

import ConfirmationModal from '../components/ui/ConfirmationModal'

const SettingsPage = () => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const fileInputRef = useRef(null)

	// Tab State
	const [activeTab, setActiveTab] = useState('general')

	// UI States
	const [loading, setLoading] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	// User Profile States
	const [avatar, setAvatar] = useState(null)
	const [uploading, setUploading] = useState(false)
	const [editingName, setEditingName] = useState(false)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')

	// Contacts States
	const [editingContacts, setEditingContacts] = useState(false)
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')

	// Social States
	const [editingSocial, setEditingSocial] = useState(false)
	const [linkedin, setLinkedin] = useState('')
	const [dribbble, setDribbble] = useState('')

	// Language & Currency States
	const [language, setLanguage] = useState('Русский')
	const [currency, setCurrency] = useState('RUB')
	const [editingLocale, setEditingLocale] = useState(false)

	// Notification States
	const [editingNotifications, setEditingNotifications] = useState(false)
	const [notificationSettings, setNotificationSettings] = useState({
		email: {
			news: true,
			security: true,
			activity: true,
		},
		push: {
			news: false,
			security: true,
			activity: true,
		},
	})

	// Theme State
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

	// Integration State
	const [connected, setConnected] = useState(false)

	// Security States
	const [editingSecurity, setEditingSecurity] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	// Initialize data from user object
	useEffect(() => {
		if (user) {
			setAvatar(user.avatar_url || null)
			setFirstName(user.first_name || '')
			setLastName(user.last_name || '')
			setPhone(user.phone || '')
			setEmail(user.email || '')
			setLinkedin(user.social_links?.linkedin || '')
			setDribbble(user.social_links?.dribbble || '')
			setLanguage(user.language || 'Русский')
			setCurrency(user.currency || 'RUB')
			setConnected(user.integrations_connected || false)
			if (
				user.notification_settings &&
				Object.keys(user.notification_settings).length > 0
			) {
				setNotificationSettings(user.notification_settings)
			}
		}
	}, [user])

	// Toast notification helper
	const showSuccess = msg => {
		setSuccessMessage(msg)
		setTimeout(() => setSuccessMessage(''), 3000)
	}

	const showError = msg => {
		setErrorMessage(msg)
		setTimeout(() => setErrorMessage(''), 3000)
	}

	// Handlers
	const handleAvatarUpload = async e => {
		const file = e.target.files[0]
		if (!file) return

		setUploading(true)
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await api.post('/users/me/avatar', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			setAvatar(response.data.avatar_url)
			showSuccess('Аватар обновлен')
		} catch (err) {
			console.error(err)
			showError('Ошибка загрузки аватара')
		} finally {
			setUploading(false)
		}
	}

	const handleDeleteAvatar = () => {
		setIsDeleteModalOpen(true)
	}

	const confirmDeleteAvatar = async () => {
		try {
			await api.delete('/users/me/avatar')
			setAvatar(null)
			showSuccess('Аватар удален')
			setIsDeleteModalOpen(false)
		} catch (err) {
			console.error(err)
			showError('Ошибка удаления аватара')
		}
	}

	const handleSaveName = async () => {
		if (!firstName.trim() || !lastName.trim()) {
			showError('Имя и фамилия не могут быть пустыми')
			return
		}

		try {
			await api.patch('/users/me', {
				first_name: firstName,
				last_name: lastName,
			})
			setEditingName(false)
			showSuccess('Имя обновлено')
		} catch (err) {
			console.error(err)
			showError('Ошибка обновления имени')
		}
	}

	const handleSaveContacts = async () => {
		// Basic validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			showError('Некорректный Email')
			return
		}

		try {
			await api.patch('/users/me', { phone, email })
			setEditingContacts(false)
			showSuccess('Контакты обновлены')
		} catch (err) {
			console.error(err)
			showError('Ошибка обновления контактов')
		}
	}

	const handleSaveSocial = async () => {
		try {
			await api.patch('/users/me', {
				social_links: { linkedin, dribbble },
			})
			setEditingSocial(false)
			showSuccess('Социальные сети обновлены')
		} catch (err) {
			console.error(err)
			showError('Ошибка обновления соцсетей')
		}
	}

	const handleSaveLocale = async () => {
		try {
			await api.patch('/users/me', { language, currency })
			setEditingLocale(false)
			showSuccess('Настройки языка сохранены')
		} catch (err) {
			console.error(err)
			showError('Ошибка сохранения настроек')
		}
	}

	const handleSaveNotifications = async () => {
		try {
			await api.patch('/users/me', {
				notification_settings: notificationSettings,
			})
			setEditingNotifications(false)
			showSuccess('Настройки уведомлений сохранены')
		} catch (err) {
			console.error(err)
			showError('Ошибка сохранения настроек уведомлений')
		}
	}

	const handleThemeChange = newTheme => {
		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)

		if (
			newTheme === 'dark' ||
			(newTheme === 'auto' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}

	const handleIntegrationToggle = async () => {
		try {
			// Mock integration toggle since backend endpoint might not exist yet
			setConnected(!connected)
			showSuccess(!connected ? 'Интеграция подключена' : 'Интеграция отключена')
		} catch (err) {
			console.error(err)
			showError('Ошибка переключения интеграции')
		}
	}

	const handleChangePassword = async () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			showError('Заполните все поля')
			return
		}

		if (newPassword !== confirmPassword) {
			showError('Новые пароли не совпадают')
			return
		}

		if (newPassword.length < 6) {
			showError('Пароль должен содержать минимум 6 символов')
			return
		}

		try {
			setLoading(true)
			await api.put('/users/change-password', {
				current_password: currentPassword,
				new_password: newPassword,
			})
			showSuccess('Пароль успешно изменен')
			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')
			setEditingSecurity(false)
		} catch (err) {
			console.error(err)
			showError(err.response?.data?.detail || 'Ошибка при смене пароля')
		} finally {
			setLoading(false)
		}
	}

	const handleToggle2FA = async () => {
		try {
			setLoading(true)
			const newState = !twoFactorEnabled
			await api.put('/users/toggle-2fa', { enabled: newState })
			setTwoFactorEnabled(newState)
			showSuccess(
				newState
					? 'Двухфакторная аутентификация включена'
					: 'Двухфакторная аутентификация отключена',
			)
		} catch (err) {
			console.error(err)
			showError('Ошибка при изменении настроек 2FA')
		} finally {
			setLoading(false)
		}
	}

	const handleLogout = async () => {
		try {
			logout() // AuthContext logout
			navigate('/login')
		} catch (err) {
			console.error(err)
			navigate('/login')
		}
	}

	// Sidebar Items
	const menuItems = [
		{ id: 'general', label: 'Общие', icon: User },
		{ id: 'notifications', label: 'Уведомления', icon: Bell },
		{ id: 'billing', label: 'Тарифные планы', icon: CreditCard },
		{ id: 'security', label: 'Безопасность', icon: Shield },
	]

	return (
		<div className='min-h-screen bg-gray-900/50 p-4 md:p-8 text-white font-sans'>
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDeleteAvatar}
				title='Удалить аватар?'
				message='Вы уверены, что хотите удалить фото профиля? Это действие нельзя отменить.'
				confirmText='Удалить'
				type='danger'
			/>

			<div className='max-w-7xl mx-auto grid md:grid-cols-[240px,1fr] gap-6'>
				{/* Sidebar */}
				<div
					className='glass-card p-4 h-fit animate-fade-in'
					style={{ animationDelay: '0s' }}
				>
					<button
						onClick={() => navigate(-1)}
						className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 px-2'
					>
						<ArrowLeft size={20} />
						<span>Назад</span>
					</button>
					<h2 className='text-xl font-bold mb-6 px-2'>Настройки</h2>
					<nav className='space-y-2'>
						{menuItems.map(item => {
							const Icon = item.icon
							return (
								<button
									key={item.id}
									onClick={() => setActiveTab(item.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
										activeTab === item.id
											? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
											: 'hover:bg-white/5 text-gray-400 hover:text-white'
									}`}
								>
									<Icon size={20} />
									<span>{item.label}</span>
								</button>
							)
						})}
					</nav>
				</div>

				{/* Main Content */}
				<div className='space-y-6'>
					{/* Notifications */}
					{successMessage && (
						<div className='flex items-center gap-2 p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/30 mb-4 animate-fade-in'>
							<CheckCircle className='w-5 h-5 text-[#22c55e]' />
							<span className='text-white text-sm'>{successMessage}</span>
						</div>
					)}
					{errorMessage && (
						<div className='flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 mb-4 animate-fade-in'>
							<X className='w-5 h-5 text-red-500' />
							<span className='text-white text-sm'>{errorMessage}</span>
						</div>
					)}

					{activeTab === 'general' && (
						<>
							{/* Profile Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.1s' }}
							>
								<h3 className='text-lg font-semibold mb-6'>
									Профиль пользователя
								</h3>

								<div className='flex flex-col md:flex-row gap-8 items-start'>
									{/* Avatar */}
									<div className='flex flex-col items-center gap-4'>
										<div className='w-32 h-32 rounded-full overflow-hidden bg-gray-700 relative group border-2 border-white/10'>
											{avatar ? (
												<img
													src={avatar}
													alt='Avatar'
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-gray-400'>
													<User size={48} />
												</div>
											)}
											{uploading && (
												<div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
													<Loader2 className='animate-spin text-white' />
												</div>
											)}
										</div>

										<div className='flex gap-2'>
											<input
												type='file'
												ref={fileInputRef}
												hidden
												accept='image/*'
												onChange={handleAvatarUpload}
											/>
											<button
												onClick={() => fileInputRef.current.click()}
												className='glass-button p-2 px-3 text-sm flex items-center gap-2'
												disabled={uploading}
											>
												<Upload size={16} /> Загрузить
											</button>
											<button
												onClick={handleDeleteAvatar}
												className='glass-button p-2 px-3 text-sm hover:bg-red-500/20 hover:border-red-500/30 text-red-300'
												disabled={uploading || !avatar}
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>

									{/* Name Info */}
									<div className='flex-1 w-full space-y-4'>
										<div className='space-y-2'>
											<label className='text-sm text-gray-400'>
												Имя и Фамилия
											</label>
											<div className='flex items-center gap-3'>
												{editingName ? (
													<>
														<div className='flex gap-2 flex-1'>
															<input
																type='text'
																value={firstName}
																onChange={e => setFirstName(e.target.value)}
																className='glass-input flex-1'
																placeholder='Имя'
																autoFocus
															/>
															<input
																type='text'
																value={lastName}
																onChange={e => setLastName(e.target.value)}
																className='glass-input flex-1'
																placeholder='Фамилия'
															/>
														</div>
														<button
															onClick={handleSaveName}
															className='p-2 bg-green-500/20 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors'
														>
															<Check size={20} />
														</button>
														<button
															onClick={() => setEditingName(false)}
															className='p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors'
														>
															<X size={20} />
														</button>
													</>
												) : (
													<>
														<div className='flex-1 text-xl font-medium'>
															{firstName || lastName
																? `${firstName} ${lastName}`
																: 'Не указано'}
														</div>
														<button
															onClick={() => setEditingName(true)}
															className='text-gray-400 hover:text-white transition-colors'
														>
															<Edit size={18} />
														</button>
													</>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Contacts Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.2s' }}
							>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='text-lg font-semibold'>Контакты</h3>
									{!editingContacts ? (
										<button
											onClick={() => setEditingContacts(true)}
											className='text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2'
										>
											<Edit size={16} /> Изменить
										</button>
									) : (
										<div className='flex gap-2'>
											<button
												onClick={handleSaveContacts}
												className='text-green-400 hover:text-green-300 text-sm'
											>
												Сохранить
											</button>
											<button
												onClick={() => setEditingContacts(false)}
												className='text-gray-400 hover:text-gray-300 text-sm'
											>
												Отмена
											</button>
										</div>
									)}
								</div>

								<div className='grid md:grid-cols-2 gap-6'>
									<div className='space-y-2'>
										<label className='text-sm text-gray-400 flex items-center gap-2'>
											<Phone size={14} /> Номер телефона
										</label>
										{editingContacts ? (
											<input
												type='tel'
												value={phone}
												onChange={e => setPhone(e.target.value)}
												className='glass-input'
												placeholder='+7 (999) 000-00-00'
											/>
										) : (
											<div className='p-3 text-gray-200'>
												{phone || 'Не указан'}
											</div>
										)}
									</div>

									<div className='space-y-2'>
										<label className='text-sm text-gray-400 flex items-center gap-2'>
											<Mail size={14} /> Email адрес
										</label>
										{editingContacts ? (
											<input
												type='email'
												value={email}
												onChange={e => setEmail(e.target.value)}
												className='glass-input'
												placeholder='example@mail.com'
											/>
										) : (
											<div className='p-3 text-gray-200'>
												{email || 'Не указан'}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Socials Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.3s' }}
							>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='text-lg font-semibold'>Социальные сети</h3>
									{!editingSocial ? (
										<button
											onClick={() => setEditingSocial(true)}
											className='text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2'
										>
											<Edit size={16} /> Изменить
										</button>
									) : (
										<div className='flex gap-2'>
											<button
												onClick={handleSaveSocial}
												className='text-green-400 hover:text-green-300 text-sm'
											>
												Сохранить
											</button>
											<button
												onClick={() => setEditingSocial(false)}
												className='text-gray-400 hover:text-gray-300 text-sm'
											>
												Отмена
											</button>
										</div>
									)}
								</div>

								<div className='grid md:grid-cols-2 gap-6'>
									<div className='space-y-2'>
										<label className='text-sm text-gray-400 flex items-center gap-2'>
											<Globe size={14} /> LinkedIn
										</label>
										{editingSocial ? (
											<input
												type='text'
												value={linkedin}
												onChange={e => setLinkedin(e.target.value)}
												className='glass-input'
												placeholder='https://linkedin.com/in/...'
											/>
										) : (
											<div className='p-3 text-gray-200 truncate'>
												{linkedin || 'Не привязано'}
											</div>
										)}
									</div>

									<div className='space-y-2'>
										<label className='text-sm text-gray-400 flex items-center gap-2'>
											<Globe size={14} /> Dribbble
										</label>
										{editingSocial ? (
											<input
												type='text'
												value={dribbble}
												onChange={e => setDribbble(e.target.value)}
												className='glass-input'
												placeholder='https://dribbble.com/...'
											/>
										) : (
											<div className='p-3 text-gray-200 truncate'>
												{dribbble || 'Не привязано'}
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Language & Currency */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.4s' }}
							>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='text-lg font-semibold'>Язык и Регион</h3>
									{!editingLocale ? (
										<button
											onClick={() => setEditingLocale(true)}
											className='text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2'
										>
											<Edit size={16} /> Изменить
										</button>
									) : (
										<div className='flex gap-2'>
											<button
												onClick={handleSaveLocale}
												className='text-green-400 hover:text-green-300 text-sm'
											>
												Сохранить
											</button>
											<button
												onClick={() => setEditingLocale(false)}
												className='text-gray-400 hover:text-gray-300 text-sm'
											>
												Отмена
											</button>
										</div>
									)}
								</div>

								<div className='grid md:grid-cols-2 gap-6'>
									<div className='space-y-2'>
										<label className='text-sm text-gray-400'>
											Язык интерфейса
										</label>
										{editingLocale ? (
											<select
												value={language}
												onChange={e => setLanguage(e.target.value)}
												className='glass-input w-full'
											>
												<option value='Русский'>Русский</option>
												<option value='English'>English</option>
												<option value='Қазақша'>Қазақша</option>
											</select>
										) : (
											<div className='p-3 text-gray-200'>{language}</div>
										)}
									</div>

									<div className='space-y-2'>
										<label className='text-sm text-gray-400'>Валюта</label>
										{editingLocale ? (
											<select
												value={currency}
												onChange={e => setCurrency(e.target.value)}
												className='glass-input w-full'
											>
												<option value='RUB'>RUB (₽)</option>
												<option value='USD'>USD ($)</option>
												<option value='KZT'>KZT (₸)</option>
											</select>
										) : (
											<div className='p-3 text-gray-200'>{currency}</div>
										)}
									</div>
								</div>
							</div>

							{/* Theme & Appearance */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.5s' }}
							>
								<h3 className='text-lg font-semibold mb-6'>Внешний вид</h3>

								<div className='grid grid-cols-3 gap-4'>
									<button
										onClick={() => handleThemeChange('light')}
										className={`p-4 rounded-xl border-2 transition-all ${
											theme === 'light'
												? 'border-primary-500 bg-primary-500/10'
												: 'border-white/10 hover:border-white/30'
										}`}
									>
										<div className='flex flex-col items-center gap-2'>
											<div className='w-full h-20 bg-white rounded-lg shadow-sm border border-gray-200'></div>
											<span className='text-sm'>Светлая</span>
										</div>
									</button>

									<button
										onClick={() => handleThemeChange('dark')}
										className={`p-4 rounded-xl border-2 transition-all ${
											theme === 'dark'
												? 'border-primary-500 bg-primary-500/10'
												: 'border-white/10 hover:border-white/30'
										}`}
									>
										<div className='flex flex-col items-center gap-2'>
											<div className='w-full h-20 bg-gray-900 rounded-lg shadow-sm border border-gray-800'></div>
											<span className='text-sm'>Темная</span>
										</div>
									</button>

									<button
										onClick={() => handleThemeChange('auto')}
										className={`p-4 rounded-xl border-2 transition-all ${
											theme === 'auto'
												? 'border-primary-500 bg-primary-500/10'
												: 'border-white/10 hover:border-white/30'
										}`}
									>
										<div className='flex flex-col items-center gap-2'>
											<div className='w-full h-20 bg-gradient-to-br from-white to-gray-900 rounded-lg shadow-sm border border-white/10'></div>
											<span className='text-sm'>Системная</span>
										</div>
									</button>
								</div>
							</div>
						</>
					)}

					{activeTab === 'notifications' && (
						<div className='glass-card p-6 animate-fade-in'>
							<div className='flex justify-between items-center mb-6'>
								<h3 className='text-lg font-semibold'>Настройки уведомлений</h3>
								{!editingNotifications ? (
									<button
										onClick={() => setEditingNotifications(true)}
										className='text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2'
									>
										<Edit size={16} /> Изменить
									</button>
								) : (
									<div className='flex gap-2'>
										<button
											onClick={handleSaveNotifications}
											className='text-green-400 hover:text-green-300 text-sm'
										>
											Сохранить
										</button>
										<button
											onClick={() => {
												setEditingNotifications(false)
												if (user?.notification_settings) {
													setNotificationSettings(user.notification_settings)
												}
											}}
											className='text-gray-400 hover:text-gray-300 text-sm'
										>
											Отмена
										</button>
									</div>
								)}
							</div>

							<div className='space-y-8'>
								{/* Email Notifications */}
								<div>
									<h4 className='text-md font-medium mb-4 flex items-center gap-2'>
										<Mail size={18} /> Email уведомления
									</h4>
									<div className='space-y-4 pl-6'>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>
													Новости и обновления
												</p>
												<p className='text-xs text-gray-400'>
													Получать информацию о новых функциях
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.email?.news}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															email: { ...prev.email, news: e.target.checked },
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>Безопасность</p>
												<p className='text-xs text-gray-400'>
													Уведомления о входе и смене пароля
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.email?.security}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															email: {
																...prev.email,
																security: e.target.checked,
															},
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>Активность</p>
												<p className='text-xs text-gray-400'>
													Еженедельные отчеты о прогрессе
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.email?.activity}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															email: {
																...prev.email,
																activity: e.target.checked,
															},
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
									</div>
								</div>

								{/* Push Notifications */}
								<div>
									<h4 className='text-md font-medium mb-4 flex items-center gap-2'>
										<Bell size={18} /> Push уведомления
									</h4>
									<div className='space-y-4 pl-6'>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>
													Новости и обновления
												</p>
												<p className='text-xs text-gray-400'>
													Получать информацию о новых функциях
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.push?.news}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															push: { ...prev.push, news: e.target.checked },
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>Безопасность</p>
												<p className='text-xs text-gray-400'>
													Уведомления о входе и смене пароля
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.push?.security}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															push: {
																...prev.push,
																security: e.target.checked,
															},
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												<p className='text-sm font-medium'>Активность</p>
												<p className='text-xs text-gray-400'>
													Напоминания о записях в дневник
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={notificationSettings.push?.activity}
													disabled={!editingNotifications}
													onChange={e =>
														setNotificationSettings(prev => ({
															...prev,
															push: {
																...prev.push,
																activity: e.target.checked,
															},
														}))
													}
												/>
												<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Security Tab */}
					{activeTab === 'security' && (
						<>
							{/* Password Change Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.1s' }}
							>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='text-lg font-semibold flex items-center gap-2'>
										<Lock size={20} /> Смена пароля
									</h3>
									{!editingSecurity ? (
										<button
											onClick={() => setEditingSecurity(true)}
											className='text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2'
										>
											<Edit size={16} /> Изменить пароль
										</button>
									) : (
										<div className='flex gap-2'>
											<button
												onClick={handleChangePassword}
												disabled={loading}
												className='text-green-400 hover:text-green-300 text-sm disabled:opacity-50 flex items-center gap-1'
											>
												{loading ? (
													<Loader2 size={14} className='animate-spin' />
												) : (
													<Check size={14} />
												)}
												Сохранить
											</button>
											<button
												onClick={() => {
													setEditingSecurity(false)
													setCurrentPassword('')
													setNewPassword('')
													setConfirmPassword('')
												}}
												className='text-gray-400 hover:text-gray-300 text-sm'
											>
												Отмена
											</button>
										</div>
									)}
								</div>

								{editingSecurity ? (
									<div className='space-y-4 max-w-md'>
										<div className='space-y-2'>
											<label className='text-sm text-gray-400 flex items-center gap-2'>
												<Key size={14} /> Текущий пароль
											</label>
											<div className='relative'>
												<input
													type={showCurrentPassword ? 'text' : 'password'}
													value={currentPassword}
													onChange={e => setCurrentPassword(e.target.value)}
													className='glass-input w-full pr-10'
													placeholder='Введите текущий пароль'
													autoFocus
												/>
												<button
													type='button'
													onClick={() =>
														setShowCurrentPassword(!showCurrentPassword)
													}
													className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
												>
													{showCurrentPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm text-gray-400 flex items-center gap-2'>
												<Key size={14} /> Новый пароль
											</label>
											<div className='relative'>
												<input
													type={showNewPassword ? 'text' : 'password'}
													value={newPassword}
													onChange={e => setNewPassword(e.target.value)}
													className='glass-input w-full pr-10'
													placeholder='Минимум 6 символов'
												/>
												<button
													type='button'
													onClick={() => setShowNewPassword(!showNewPassword)}
													className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
												>
													{showNewPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>
										</div>

										<div className='space-y-2'>
											<label className='text-sm text-gray-400 flex items-center gap-2'>
												<Key size={14} /> Подтвердите новый пароль
											</label>
											<div className='relative'>
												<input
													type={showConfirmPassword ? 'text' : 'password'}
													value={confirmPassword}
													onChange={e => setConfirmPassword(e.target.value)}
													className='glass-input w-full pr-10'
													placeholder='Введите пароль повторно'
												/>
												<button
													type='button'
													onClick={() =>
														setShowConfirmPassword(!showConfirmPassword)
													}
													className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
												>
													{showConfirmPassword ? (
														<EyeOff size={18} />
													) : (
														<Eye size={18} />
													)}
												</button>
											</div>
										</div>

										<div className='mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
											<p className='text-sm text-blue-300'>
												<strong>Требования к паролю:</strong>
											</p>
											<ul className='text-xs text-gray-400 mt-2 space-y-1 ml-4 list-disc'>
												<li>Минимум 6 символов</li>
												<li>
													Рекомендуется использовать заглавные и строчные буквы
												</li>
												<li>
													Рекомендуется добавить цифры и специальные символы
												</li>
											</ul>
										</div>
									</div>
								) : (
									<div className='text-gray-400'>
										<p className='text-sm'>Последнее изменение пароля: давно</p>
										<p className='text-xs mt-2'>
											Для безопасности рекомендуется регулярно менять пароль
										</p>
									</div>
								)}
							</div>

							{/* Two-Factor Authentication Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.2s' }}
							>
								<h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
									<Shield size={20} /> Двухфакторная аутентификация (2FA)
								</h3>

								<div className='flex items-start justify-between gap-4'>
									<div className='flex-1'>
										<p className='text-sm text-gray-300 mb-2'>
											Добавьте дополнительный уровень защиты к вашему аккаунту
										</p>
										<p className='text-xs text-gray-400'>
											При входе в систему вам будет необходимо ввести код из
											приложения-аутентификатора
										</p>
									</div>

									<label className='relative inline-flex items-center cursor-pointer'>
										<input
											type='checkbox'
											className='sr-only peer'
											checked={twoFactorEnabled}
											onChange={handleToggle2FA}
											disabled={loading}
										/>
										<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-disabled:opacity-50"></div>
									</label>
								</div>

								{twoFactorEnabled && (
									<div className='mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
										<p className='text-sm text-green-400 flex items-center gap-2'>
											<CheckCircle size={16} />
											Двухфакторная аутентификация активна
										</p>
										<p className='text-xs text-gray-400 mt-2'>
											Ваш аккаунт защищён дополнительным уровнем безопасности
										</p>
									</div>
								)}
							</div>

							{/* Active Sessions Section */}
							<div
								className='glass-card p-6 animate-fade-in'
								style={{ animationDelay: '0.3s' }}
							>
								<h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
									<Globe size={20} /> Активные сессии
								</h3>

								<div className='space-y-3'>
									<div className='p-4 bg-white/5 rounded-lg border border-white/10'>
										<div className='flex items-start justify-between'>
											<div className='flex-1'>
												<p className='text-sm font-medium text-white flex items-center gap-2'>
													<CheckCircle size={14} className='text-green-400' />
													Текущая сессия
												</p>
												<p className='text-xs text-gray-400 mt-1'>
													Windows • Chrome • Сейчас
												</p>
											</div>
											<span className='text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded'>
												Активна
											</span>
										</div>
									</div>

									<div className='text-center py-4'>
										<p className='text-sm text-gray-500'>
											Других активных сессий не обнаружено
										</p>
									</div>
								</div>
							</div>
						</>
					)}

					{/* Other tabs placeholders */}
					{activeTab !== 'general' &&
						activeTab !== 'notifications' &&
						activeTab !== 'security' && (
							<div className='glass-card p-12 text-center animate-fade-in'>
								<div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Settings className='text-gray-400' size={32} />
								</div>
								<h3 className='text-xl font-bold mb-2'>Раздел в разработке</h3>
								<p className='text-gray-400'>
									Настройки для раздела "
									{menuItems.find(i => i.id === activeTab)?.label}" скоро
									появятся.
								</p>
							</div>
						)}

					{/* Logout Button */}
					<div className='flex justify-end pt-6'>
						<button
							onClick={handleLogout}
							className='flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all'
						>
							<LogOut size={20} />
							<span>Выйти из аккаунта</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SettingsPage
