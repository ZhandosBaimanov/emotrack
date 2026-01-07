import {
	Activity,
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	Copy,
	Loader2,
	LogOut,
	Mail,
	MessageSquare,
	Stethoscope,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotionsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'

// Эмодзи для эмоций
const emotionEmojis = {
	'Очень плохо': '😢',
	Плохо: '😟',
	Нормально: '😐',
	Хорошо: '😊',
	Отлично: '😄',
}

// Цвета для графика
const emotionColors = {
	'Очень плохо': '#ef4444',
	Плохо: '#f97316',
	Нормально: '#eab308',
	Хорошо: '#22c55e',
	Отлично: '#10b981',
}

const PsychologistDashboard = () => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

	const [patients, setPatients] = useState([])
	const [selectedPatient, setSelectedPatient] = useState(null)
	const [patientEmotions, setPatientEmotions] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingEmotions, setLoadingEmotions] = useState(false)
	const [copied, setCopied] = useState(false)

	// Загрузка списка пациентов
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const data = await emotionsAPI.getMyPatients()
				setPatients(data)
			} catch (err) {
				console.error('Ошибка загрузки пациентов:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchPatients()
	}, [])

	// Загрузка эмоций выбранного пациента
	useEffect(() => {
		if (selectedPatient) {
			const fetchEmotions = async () => {
				setLoadingEmotions(true)
				try {
					const data = await emotionsAPI.getPatientEmotions(selectedPatient.id)
					setPatientEmotions(data)
				} catch (err) {
					console.error('Ошибка загрузки эмоций:', err)
				} finally {
					setLoadingEmotions(false)
				}
			}
			fetchEmotions()
		}
	}, [selectedPatient])

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const copyCode = async () => {
		if (user?.psychologist_code) {
			await navigator.clipboard.writeText(user.psychologist_code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const formatDateShort = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
	}

	// Простой график эмоций
	const renderEmotionChart = () => {
		if (patientEmotions.length === 0) return null

		const lastEmotions = patientEmotions.slice(0, 10).reverse()
		const maxIntensity = 10

		return (
			<div className='mt-6'>
				<h4 className='text-white/70 text-sm mb-4 flex items-center gap-2'>
					<TrendingUp className='w-4 h-4' />
					График настроения (последние записи)
				</h4>
				<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
					<div className='flex items-end justify-between gap-2 h-32'>
						{lastEmotions.map((emotion, index) => {
							const height = (emotion.intensity / maxIntensity) * 100
							const color = emotionColors[emotion.emotion_type] || '#6b7280'

							return (
								<div
									key={emotion.id}
									className='flex-1 flex flex-col items-center gap-2'
								>
									<div
										className='w-full rounded-t-lg transition-all duration-300 hover:opacity-80'
										style={{
											height: `${height}%`,
											backgroundColor: color,
											minHeight: '8px',
										}}
										title={`${emotion.emotion_type}: ${emotion.intensity}/10`}
									/>
									<span className='text-white/40 text-xs'>
										{formatDateShort(emotion.created_at)}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}

	// Статистика эмоций
	const getEmotionStats = () => {
		if (patientEmotions.length === 0) return null

		const avgIntensity =
			patientEmotions.reduce((acc, e) => acc + e.intensity, 0) /
			patientEmotions.length
		const emotionCounts = patientEmotions.reduce((acc, e) => {
			acc[e.emotion_type] = (acc[e.emotion_type] || 0) + 1
			return acc
		}, {})

		const mostCommon = Object.entries(emotionCounts).sort(
			(a, b) => b[1] - a[1]
		)[0]

		return (
			<div className='grid grid-cols-2 gap-4 mt-4'>
				<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
					<div className='text-white/50 text-sm'>Средний показатель</div>
					<div className='text-2xl font-bold text-white mt-1'>
						{avgIntensity.toFixed(1)}/10
					</div>
				</div>
				<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
					<div className='text-white/50 text-sm'>Частое настроение</div>
					<div className='text-lg font-bold text-white mt-1 flex items-center gap-2'>
						<span>{emotionEmojis[mostCommon[0]] || '😐'}</span>
						<span className='text-base'>{mostCommon[0]}</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen p-4 md:p-8'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<header className='glass-card p-4 md:p-6 mb-6 animate-fade-in'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<div className='w-12 h-12 rounded-full bg-calm-blue/20 flex items-center justify-center'>
								<Stethoscope className='w-6 h-6 text-calm-blue' />
							</div>
							<div>
								<h1 className='text-xl font-semibold text-white'>
									Добро пожаловать, {user?.username || 'Психолог'}! 👋
								</h1>
								<p className='text-white/60 text-sm'>
									Панель управления психолога
								</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className='glass-button flex items-center gap-2 px-4 py-2 hover:bg-red-500/20'
						>
							<LogOut className='w-5 h-5' />
							<span>Выйти</span>
						</button>
					</div>

					{/* Psychologist Code */}
					{user?.psychologist_code && (
						<div className='mt-6 p-4 bg-white/5 rounded-xl border border-white/10'>
							<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
								<div>
									<p className='text-white/60 text-sm mb-1'>
										Ваш уникальный код для пациентов:
									</p>
									<p className='text-2xl font-mono font-bold text-primary-400 tracking-wider'>
										{user.psychologist_code}
									</p>
								</div>
								<button
									onClick={copyCode}
									className={`glass-button flex items-center gap-2 px-4 py-2 ${
										copied ? 'bg-primary-500/20 border-primary-400/30' : ''
									}`}
								>
									{copied ? (
										<>
											<Check className='w-5 h-5 text-primary-400' />
											<span className='text-primary-400'>Скопировано!</span>
										</>
									) : (
										<>
											<Copy className='w-5 h-5' />
											<span>Скопировать</span>
										</>
									)}
								</button>
							</div>
						</div>
					)}
				</header>

				{/* Main Content */}
				<div className='grid md:grid-cols-3 gap-6'>
					{/* Patient List */}
					<div
						className='glass-card p-6 animate-fade-in'
						style={{ animationDelay: '0.1s' }}
					>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							<Users className='w-5 h-5 text-calm-blue' />
							Мои пациенты
						</h2>

						{loading ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='w-8 h-8 text-calm-blue animate-spin' />
							</div>
						) : patients.length === 0 ? (
							<div className='text-center py-8'>
								<Users className='w-12 h-12 text-white/20 mx-auto mb-3' />
								<p className='text-white/50'>Пока нет пациентов</p>
								<p className='text-white/30 text-sm mt-2'>
									Поделитесь своим кодом, чтобы пациенты могли привязаться
								</p>
							</div>
						) : (
							<div className='space-y-2'>
								{patients.map(patient => (
									<button
										key={patient.id}
										onClick={() => setSelectedPatient(patient)}
										className={`
                      w-full p-4 rounded-xl border transition-all duration-300
                      flex items-center justify-between
                      ${
												selectedPatient?.id === patient.id
													? 'bg-calm-blue/20 border-calm-blue/50'
													: 'bg-white/5 border-white/10 hover:bg-white/10'
											}
                    `}
									>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center'>
												<User className='w-5 h-5 text-white/70' />
											</div>
											<div className='text-left'>
												<p className='text-white font-medium'>
													{patient.username}
												</p>
												<p className='text-white/40 text-sm flex items-center gap-1'>
													<Mail className='w-3 h-3' />
													{patient.email}
												</p>
											</div>
										</div>
										<ChevronRight
											className={`w-5 h-5 transition-transform ${
												selectedPatient?.id === patient.id
													? 'text-calm-blue'
													: 'text-white/30'
											}`}
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Patient Emotions */}
					<div
						className='md:col-span-2 glass-card p-6 animate-fade-in'
						style={{ animationDelay: '0.2s' }}
					>
						{!selectedPatient ? (
							<div className='flex flex-col items-center justify-center h-full py-12'>
								<Activity className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									Выберите пациента, чтобы просмотреть историю его эмоций
								</p>
							</div>
						) : (
							<>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
										<Activity className='w-5 h-5 text-primary-400' />
										История эмоций: {selectedPatient.username}
									</h2>
									<button
										onClick={() => setSelectedPatient(null)}
										className='text-white/50 hover:text-white flex items-center gap-1'
									>
										<ChevronLeft className='w-4 h-4' />
										<span className='text-sm'>Назад</span>
									</button>
								</div>

								{loadingEmotions ? (
									<div className='flex items-center justify-center py-12'>
										<Loader2 className='w-8 h-8 text-primary-400 animate-spin' />
									</div>
								) : patientEmotions.length === 0 ? (
									<div className='text-center py-12'>
										<MessageSquare className='w-12 h-12 text-white/10 mx-auto mb-3' />
										<p className='text-white/50'>
											У этого пациента пока нет записей
										</p>
									</div>
								) : (
									<>
										{/* Stats */}
										{getEmotionStats()}

										{/* Chart */}
										{renderEmotionChart()}

										{/* Emotion List */}
										<div className='mt-6'>
											<h4 className='text-white/70 text-sm mb-4 flex items-center gap-2'>
												<Calendar className='w-4 h-4' />
												Все записи
											</h4>
											<div className='space-y-3 max-h-[300px] overflow-y-auto pr-2'>
												{patientEmotions.map((emotion, index) => (
													<div
														key={emotion.id}
														className='bg-white/5 rounded-xl p-4 border border-white/10 animate-fade-in'
														style={{ animationDelay: `${index * 0.03}s` }}
													>
														<div className='flex items-start gap-4'>
															<span className='text-2xl'>
																{emotionEmojis[emotion.emotion_type] || '😐'}
															</span>
															<div className='flex-1'>
																<div className='flex items-center justify-between mb-1'>
																	<div className='flex items-center gap-3'>
																		<span className='text-white font-medium'>
																			{emotion.emotion_type}
																		</span>
																		<span
																			className='px-2 py-0.5 rounded-full text-xs font-medium'
																			style={{
																				backgroundColor: `${
																					emotionColors[emotion.emotion_type]
																				}20`,
																				color:
																					emotionColors[emotion.emotion_type],
																			}}
																		>
																			{emotion.intensity}/10
																		</span>
																	</div>
																	<span className='text-white/40 text-sm flex items-center gap-1'>
																		<Calendar className='w-3 h-3' />
																		{formatDate(emotion.created_at)}
																	</span>
																</div>
																{emotion.note && (
																	<p className='text-white/60 text-sm flex items-start gap-2 mt-2'>
																		<MessageSquare className='w-4 h-4 mt-0.5 flex-shrink-0' />
																		{emotion.note}
																	</p>
																)}
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									</>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PsychologistDashboard
