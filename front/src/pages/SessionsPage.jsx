import { differenceInMinutes, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	AlertCircle,
	Calendar,
	Check,
	Clock,
	Loader2,
	User,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { availabilityAPI, sessionsAPI } from '../api/api'
import { DashboardHeader } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

const timeSlots = [
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
]

const SessionsPage = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	const [sessions, setSessions] = useState([])
	const [pendingRequests, setPendingRequests] = useState([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [processingId, setProcessingId] = useState(null)
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [selectedSlots, setSelectedSlots] = useState([])
	const [availableSlots, setAvailableSlots] = useState([])
	const [showAllSessions, setShowAllSessions] = useState(false)

	// Загрузка сеансов и запросов
	useEffect(() => {
		const fetchSessions = async () => {
			try {
				setLoading(true)
				const data = await sessionsAPI.getMySessions()
				setSessions(data || [])

				// Фильтруем pending запросы
				const pending = data.filter(s => s.status === 'pending') || []
				setPendingRequests(pending)
			} catch (err) {
				console.error('Ошибка загрузки сеансов:', err)
				toast.error('Не удалось загрузить сеансы')
			} finally {
				setLoading(false)
			}
		}
		fetchSessions()
	}, [])

	// Загрузка доступных слотов при изменении даты
	useEffect(() => {
		const loadAvailability = async () => {
			try {
				const dateStr = format(selectedDate, 'yyyy-MM-dd')
				const data = await availabilityAPI.getAvailability(user.id, dateStr)
				setAvailableSlots(data.map(slot => slot.available_time.substring(0, 5)))
				setSelectedSlots([])
			} catch (err) {
				console.error('Ошибка загрузки доступности:', err)
				setAvailableSlots([])
				setSelectedSlots([])
			}
		}
		loadAvailability()
	}, [selectedDate, user.id])

	// Получить занятые слоты на выбранную дату
	const getOccupiedSlots = () => {
		const dateStr = format(selectedDate, 'yyyy-MM-dd')
		return sessions
			.filter(s => {
				const sessionDate = format(parseISO(s.scheduled_date), 'yyyy-MM-dd')
				return sessionDate === dateStr && s.status === 'approved'
			})
			.map(s => s.scheduled_time?.substring(0, 5))
			.filter(Boolean)
	}

	const handleToggleSlot = slot => {
		setSelectedSlots(prev =>
			prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot],
		)
	}

	const handleSaveSlots = async () => {
		if (selectedSlots.length === 0) {
			toast.error('Выберите хотя бы один слот')
			return
		}

		try {
			setSaving(true)
			const dateStr = format(selectedDate, 'yyyy-MM-dd')

			// Преобразуем времена в формат HH:00:00 для API
			const timesForAPI = selectedSlots.map(slot => `${slot}:00`)

			await availabilityAPI.bulkAddAvailability(dateStr, timesForAPI)

			// Перезагружаем доступность
			const data = await availabilityAPI.getAvailability(user.id, dateStr)
			setAvailableSlots(data.map(slot => slot.available_time.substring(0, 5)))

			toast.success(`${selectedSlots.length} слотов сохранены как свободные`)
			setSelectedSlots([])
		} catch (err) {
			console.error('Ошибка сохранения слотов:', err)
			toast.error('Не удалось сохранить слоты')
		} finally {
			setSaving(false)
		}
	}

	// Принять запрос на сеанс
	const handleApproveRequest = async sessionId => {
		try {
			setProcessingId(sessionId)
			await sessionsAPI.updateStatus(sessionId, 'approved', null)

			// Обновляем списки
			setPendingRequests(prev => prev.filter(s => s.id !== sessionId))
			setSessions(prev =>
				prev.map(s => (s.id === sessionId ? { ...s, status: 'approved' } : s)),
			)

			toast.success('Запрос принят')
		} catch (err) {
			console.error('Ошибка принятия запроса:', err)
			toast.error('Не удалось принять запрос')
		} finally {
			setProcessingId(null)
		}
	}

	// Отклонить запрос на сеанс
	const handleRejectRequest = async sessionId => {
		try {
			setProcessingId(sessionId)
			await sessionsAPI.updateStatus(
				sessionId,
				'cancelled',
				'Отклонено психологом',
			)

			// Обновляем списки
			setPendingRequests(prev => prev.filter(s => s.id !== sessionId))
			setSessions(prev =>
				prev.map(s => (s.id === sessionId ? { ...s, status: 'cancelled' } : s)),
			)

			toast.success('Запрос отклонен')
		} catch (err) {
			console.error('Ошибка отклонения запроса:', err)
			toast.error('Не удалось отклонить запрос')
		} finally {
			setProcessingId(null)
		}
	}

	// Все принятые сеансы
	const approvedSessions = sessions
		.filter(s => s.status === 'approved')
		.sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))

	// Ближайшие 2 или все сеансы
	const displayedSessions = showAllSessions
		? approvedSessions
		: approvedSessions.slice(0, 2)

	const getStatusColor = status => {
		const colors = {
			approved: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
			completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
			cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
			pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
		}
		return colors[status] || colors.pending
	}

	const getStatusLabel = status => {
		const labels = {
			approved: 'Принят',
			completed: 'Завершён',
			cancelled: 'Отменён',
			pending: 'На рассмотрении',
		}
		return labels[status] || status
	}

	if (!user || user.role !== 'psychologist') {
		return (
			<div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4'>
				<DashboardHeader activeTab='sessions' />
				<div className='text-center text-white/50 mt-20'>
					Доступ только для психологов
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4'>
			<DashboardHeader activeTab='sessions' />

			<div className='max-w-6xl mx-auto mt-6 space-y-6'>
				{/* Заголовок */}
				<div>
					<h1 className='text-3xl font-bold text-white mb-2'>Мои записи</h1>
					<p className='text-white/60'>
						Управляйте своим расписанием и посмотрите, кто записался к вам
					</p>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Левая колонка - Управление свободными слотами */}
					<div>
						<div className='glass-card p-6 rounded-2xl'>
							<h2 className='text-white font-semibold mb-4 flex items-center gap-2'>
								<Calendar className='w-5 h-5 text-[#8b5cf6]' />
								Свободные окошки
							</h2>

							<div className='mb-4'>
								<label className='text-white/60 text-sm mb-2 block'>
									Выберите дату
								</label>
								<input
									type='date'
									value={format(selectedDate, 'yyyy-MM-dd')}
									onChange={e => setSelectedDate(new Date(e.target.value))}
									className='w-full bg-white/10 text-white rounded-lg px-3 py-2 border border-white/20 focus:border-[#8b5cf6] focus:outline-none'
								/>
							</div>

							<div className='mb-4'>
								<p className='text-white/60 text-sm mb-3'>
									{format(selectedDate, 'd MMMM yyyy', { locale: ru })}
								</p>
								<div className='grid grid-cols-2 gap-2'>
									{timeSlots.map(slot => {
										const isOccupied = getOccupiedSlots().includes(slot)
										const isSaved = availableSlots.includes(slot)
										const isSelected = selectedSlots.includes(slot)

										return (
											<button
												key={slot}
												onClick={() => !isOccupied && handleToggleSlot(slot)}
												disabled={isOccupied}
												className={`
													py-2 px-2 rounded-lg text-sm font-medium transition-all
													${
														isOccupied
															? 'bg-red-500/20 text-red-400/50 cursor-not-allowed opacity-50'
															: isSelected
																? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/25'
																: isSaved
																	? 'bg-green-500/20 text-green-400 border border-green-500/30'
																	: 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
													}
												`}
												title={isSaved ? 'Сохранено' : 'Не сохранено'}
											>
												{slot}
											</button>
										)
									})}
								</div>
							</div>

							<div className='text-xs text-white/40 mb-4 p-2 bg-white/5 rounded border border-white/10'>
								<p>🟩 Зелёный = сохранённый слот</p>
								<p>🟥 Красный = занят</p>
								<p>🟪 Фиолетовый = выбран</p>
							</div>

							<button
								onClick={handleSaveSlots}
								disabled={selectedSlots.length === 0 || saving}
								className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
									selectedSlots.length > 0 && !saving
										? 'bg-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/25'
										: 'bg-white/10 text-white/30 cursor-not-allowed'
								}`}
							>
								{saving && <Loader2 className='w-4 h-4 animate-spin' />}
								Сохранить ({selectedSlots.length})
							</button>
						</div>
					</div>

					{/* Правая колонка - Сеансы и Запросы */}
					<div className='space-y-6'>
						{/* Секция Сеансы */}
						<div className='glass-card p-6 rounded-2xl'>
							<h2 className='text-white font-semibold mb-4 flex items-center gap-2'>
								<Clock className='w-5 h-5 text-[#8b5cf6]' />
								Сеансы ({approvedSessions.length})
							</h2>

							{loading ? (
								<div className='flex items-center justify-center py-12'>
									<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
								</div>
							) : approvedSessions.length > 0 ? (
								<>
									<div className='space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2'>
										{displayedSessions.map((session, idx) => {
											const sessionDate = parseISO(session.scheduled_date)
											const now = new Date()
											const isUpcoming = sessionDate > now
											const minutesUntil = differenceInMinutes(sessionDate, now)

											return (
												<div
													key={session.id || idx}
													className='p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all group'
												>
													<div className='flex items-start justify-between mb-2'>
														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-1'>
																<User className='w-4 h-4 text-[#8b5cf6]' />
																<p className='text-white font-medium'>
																	{session.patient?.first_name}{' '}
																	{session.patient?.last_name}
																</p>
															</div>
															<div className='flex items-center gap-2 text-white/60 text-sm'>
																<Calendar className='w-3.5 h-3.5' />
																{format(sessionDate, 'd MMM yyyy, EEEE', {
																	locale: ru,
																})}
															</div>
															<div className='flex items-center gap-2 text-white/60 text-sm mt-1'>
																<Clock className='w-3.5 h-3.5' />
																{session.scheduled_time?.substring(0, 5)}
																{isUpcoming &&
																	minutesUntil > 0 &&
																	minutesUntil <= 60 && (
																		<span className='ml-2 text-amber-400'>
																			Скоро!
																		</span>
																	)}
															</div>
														</div>

														<span
															className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(session.status)}`}
														>
															{getStatusLabel(session.status)}
														</span>
													</div>

													{session.notes && (
														<div className='mt-2 p-2 bg-white/5 rounded text-white/60 text-xs'>
															<p>📝 {session.notes}</p>
														</div>
													)}
												</div>
											)
										})}
									</div>

									{approvedSessions.length > 2 && (
										<button
											onClick={() => setShowAllSessions(!showAllSessions)}
											className='w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all'
										>
											{showAllSessions ? 'Показать меньше' : 'Посмотреть все'}
										</button>
									)}
								</>
							) : (
								<div className='text-center py-8 text-white/40'>
									<AlertCircle className='w-10 h-10 mx-auto mb-2 opacity-50' />
									<p className='text-sm'>Нет принятых сеансов</p>
								</div>
							)}
						</div>

						{/* Секция - Запросы на прием */}
						<div className='glass-card p-6 rounded-2xl'>
							<h2 className='text-white font-semibold mb-4 flex items-center gap-2'>
								<AlertCircle className='w-5 h-5 text-amber-400' />
								Запросы на прием ({pendingRequests.length})
							</h2>

							{pendingRequests.length > 0 ? (
								<div className='grid grid-cols-1 gap-3 max-h-96 overflow-y-auto custom-scrollbar'>
									{pendingRequests.map(request => {
										const sessionDate = parseISO(request.scheduled_date)
										const isLoading = processingId === request.id

										return (
											<div
												key={request.id}
												className='p-4 rounded-lg bg-white/5 border border-amber-500/30 hover:bg-white/10 transition-all'
											>
												<div className='flex items-start justify-between mb-3'>
													<div className='flex-1'>
														<div className='flex items-center gap-2 mb-1'>
															<User className='w-4 h-4 text-[#8b5cf6]' />
															<p className='text-white font-medium'>
																{request.patient?.first_name}{' '}
																{request.patient?.last_name}
															</p>
														</div>
														<div className='flex items-center gap-2 text-white/60 text-sm'>
															<Calendar className='w-3.5 h-3.5' />
															{format(sessionDate, 'd MMM yyyy', {
																locale: ru,
															})}
														</div>
														<div className='flex items-center gap-2 text-white/60 text-sm mt-1'>
															<Clock className='w-3.5 h-3.5' />
															{request.scheduled_time?.substring(0, 5)}
														</div>
													</div>
													<div className='text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30'>
														На рассмотрении
													</div>
												</div>

												{request.notes && (
													<div className='mb-3 p-2 bg-white/5 rounded text-white/60 text-xs border border-white/10'>
														<p className='font-medium mb-1'>Заметка:</p>
														<p>{request.notes}</p>
													</div>
												)}

												<div className='flex gap-2'>
													<button
														onClick={() => handleApproveRequest(request.id)}
														disabled={isLoading}
														className='flex-1 py-2 px-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 text-xs font-medium transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
													>
														{isLoading ? (
															<Loader2 className='w-3.5 h-3.5 animate-spin' />
														) : (
															<Check className='w-3.5 h-3.5' />
														)}
														Принять
													</button>
													<button
														onClick={() => handleRejectRequest(request.id)}
														disabled={isLoading}
														className='flex-1 py-2 px-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 text-xs font-medium transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
													>
														{isLoading ? (
															<Loader2 className='w-3.5 h-3.5 animate-spin' />
														) : (
															<X className='w-3.5 h-3.5' />
														)}
														Отклонить
													</button>
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<div className='text-center py-8 text-white/40'>
									<AlertCircle className='w-10 h-10 mx-auto mb-2 opacity-50' />
									<p className='text-sm'>Нет запросов на прием</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Статистика */}
				{approvedSessions.length > 0 && (
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='glass-card p-4 rounded-xl'>
							<p className='text-white/60 text-sm mb-1'>Всего сеансов</p>
							<p className='text-2xl font-bold text-white'>{sessions.length}</p>
						</div>
						<div className='glass-card p-4 rounded-xl'>
							<p className='text-white/60 text-sm mb-1'>Принято</p>
							<p className='text-2xl font-bold text-blue-400'>
								{approvedSessions.length}
							</p>
						</div>
						<div className='glass-card p-4 rounded-xl'>
							<p className='text-white/60 text-sm mb-1'>Завершённых</p>
							<p className='text-2xl font-bold text-green-400'>
								{sessions.filter(s => s.status === 'completed').length}
							</p>
						</div>
						<div className='glass-card p-4 rounded-xl'>
							<p className='text-white/60 text-sm mb-1'>Отменено</p>
							<p className='text-2xl font-bold text-red-400'>
								{sessions.filter(s => s.status === 'cancelled').length}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default SessionsPage
