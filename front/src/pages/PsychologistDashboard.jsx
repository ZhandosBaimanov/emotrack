import {
	Activity,
	Check,
	ChevronLeft,
	ChevronRight,
	Copy,
	Loader2,
	LogOut,
	Mail,
	MessageSquare,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotionsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { DashboardHeader } from '../components/dashboard'

const emotionEmojis = {
	'Очень плохо': '😢',
	Плохо: '😟',
	Нормально: '😐',
	Хорошо: '😊',
	Отлично: '😄',
}

const emotionColors = {
	'Очень плохо': '#ef4444',
	Плохо: '#f97316',
	Нормально: '#eab308',
	Хорошо: '#22c55e',
	Отлично: '#8b5cf6',
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

	const getWeeklyMoodData = emotions => {
		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const weekEmotions = emotions.filter(e => new Date(e.created_at) >= weekAgo)
		
		if (weekEmotions.length === 0) return { percentage: 0, trend: 'neutral' }
		
		const avgIntensity = weekEmotions.reduce((sum, e) => sum + e.intensity, 0) / weekEmotions.length
		return {
			percentage: Math.round((avgIntensity / 10) * 100),
			trend: avgIntensity >= 5 ? 'positive' : 'negative'
		}
	}

	const renderMoodTracker = () => {
		if (patientEmotions.length === 0) return null

		const weeklyData = getWeeklyMoodData(patientEmotions)
		const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const weekEmotions = patientEmotions.filter(e => new Date(e.created_at) >= weekAgo)

		const bars = days.map((day, index) => {
			const dayEmotions = weekEmotions.filter(e => {
				const date = new Date(e.created_at)
				return date.getDay() === (index + 1) % 7
			})
			const avgDay = dayEmotions.length > 0 
				? dayEmotions.reduce((sum, e) => sum + e.intensity, 0) / dayEmotions.length 
				: 0
			return { day, value: avgDay, hasData: dayEmotions.length > 0 }
		})

		return (
			<div className='glass-card p-6 mb-6'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-white font-medium'>Трекер настроения</h3>
					<div className='w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center'>
						<TrendingUp className='w-4 h-4 text-[#c4a7e7]' />
					</div>
				</div>

				<p className='text-white/50 text-sm mb-4'>Сводка за неделю</p>

				<div className='text-4xl font-bold text-white mb-2'>
					{weeklyData.percentage}%
				</div>

				<p className='text-white/60 text-sm mb-6'>
					{weeklyData.percentage >= 50 ? 'Хорошая неделя' : 'Требует внимания'}
				</p>

				<div className='flex items-end justify-between h-16 gap-1'>
					{bars.map((bar, index) => (
						<div key={index} className='flex-1 flex flex-col items-center gap-1'>
							<div 
								className='w-full rounded-t transition-all duration-300'
								style={{ 
									height: `${Math.max(bar.value * 6, 4)}px`,
									backgroundColor: bar.hasData 
										? bar.value >= 7 ? '#22c55e' : bar.value >= 4 ? '#8b5cf6' : '#ef4444'
										: 'rgba(255,255,255,0.1)'
								}}
							/>
							<span className='text-[10px] text-white/40'>{bar.day}</span>
						</div>
					))}
				</div>
			</div>
		)
	}

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
								<div key={emotion.id} className='flex-1 flex flex-col items-center gap-2'>
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

	const getEmotionStats = () => {
		if (patientEmotions.length === 0) return null

		const avgIntensity = patientEmotions.reduce((acc, e) => acc + e.intensity, 0) / patientEmotions.length
		const emotionCounts = patientEmotions.reduce((acc, e) => {
			acc[e.emotion_type] = (acc[e.emotion_type] || 0) + 1
			return acc
		}, {})

		const mostCommon = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]

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
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<DashboardHeader activeTab='home' />

				{user?.psychologist_code && (
					<div className='glass-card p-4 mb-6'>
						<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
							<div>
								<p className='text-white/60 text-sm mb-1'>
									Ваш уникальный код для пациентов:
								</p>
								<p className='text-2xl font-mono font-bold text-[#c4a7e7] tracking-wider'>
									{user.psychologist_code}
								</p>
							</div>
							<button
								onClick={copyCode}
								className={`glass-button flex items-center gap-2 px-4 py-2 ${
									copied ? 'bg-[#22c55e]/20 border-[#22c55e]/30' : ''
								}`}
							>
								{copied ? (
									<>
										<Check className='w-5 h-5 text-[#22c55e]' />
										<span className='text-[#22c55e]'>Скопировано!</span>
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

				<div className='grid md:grid-cols-12 gap-6'>
					<div className='md:col-span-4 glass-card p-6'>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							<Users className='w-5 h-5 text-[#8b5cf6]' />
							Мои пациенты
						</h2>

						{loading ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
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
										className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
											selectedPatient?.id === patient.id
												? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50'
												: 'bg-white/5 border-white/10 hover:bg-white/10'
										}`}
									>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
												<User className='w-5 h-5 text-white' />
											</div>
											<div className='text-left'>
												<p className='text-white font-medium'>
													{patient.first_name} {patient.last_name}
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
													? 'text-[#8b5cf6]'
													: 'text-white/30'
											}`}
										/>
									</button>
								))}
							</div>
						)}
					</div>

					<div className='md:col-span-8'>
						{!selectedPatient ? (
							<div className='glass-card p-6 flex flex-col items-center justify-center h-full py-12'>
								<Activity className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									Выберите пациента, чтобы просмотреть историю его эмоций
								</p>
							</div>
						) : (
							<>
								<div className='glass-card p-6 mb-6'>
									<div className='flex items-center justify-between mb-6'>
										<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
											<Activity className='w-5 h-5 text-[#8b5cf6]' />
											{selectedPatient.first_name} {selectedPatient.last_name}
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
											<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
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
											{getEmotionStats()}
											{renderEmotionChart()}
										</>
									)}
								</div>

								{patientEmotions.length > 0 && renderMoodTracker()}

								{patientEmotions.length > 0 && (
									<div className='glass-card p-6'>
										<h3 className='text-white font-medium mb-4 flex items-center gap-2'>
											<MessageSquare className='w-5 h-5 text-[#8b5cf6]' />
											История записей
										</h3>
										<div className='space-y-3 max-h-[400px] overflow-y-auto pr-2'>
											{patientEmotions.map((emotion, index) => (
												<div
													key={emotion.id}
													className='bg-white/5 rounded-xl p-4 border border-white/10'
												>
													<div className='flex items-start gap-4'>
														<span className='text-3xl'>
															{emotionEmojis[emotion.emotion_type] || '😐'}
														</span>
														<div className='flex-1'>
															<div className='flex items-center justify-between mb-1'>
																<span className='text-white font-medium'>
																	{emotion.emotion_type}
																</span>
																<span className='text-white/40 text-sm'>
																	{formatDate(emotion.created_at)}
																</span>
															</div>
															{emotion.note && (
																<p className='text-white/60 text-sm'>
																	{emotion.note}
																</p>
															)}
															<div className='mt-2'>
																<div className='flex items-center gap-2'>
																	<div className='flex-1 h-2 bg-white/10 rounded-full overflow-hidden'>
																		<div
																			className='h-full rounded-full transition-all'
																			style={{
																				width: `${emotion.intensity * 10}%`,
																				backgroundColor: emotionColors[emotion.emotion_type] || '#8b5cf6',
																			}}
																		/>
																	</div>
																	<span className='text-white/50 text-xs'>
																		{emotion.intensity}/10
																	</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
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
