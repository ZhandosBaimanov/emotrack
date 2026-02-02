import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	Activity,
	Calendar,
	ChevronLeft,
	Loader2,
	TrendingDown,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { emotionsAPI } from '../api/api'
import { DashboardHeader } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

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

const Analytics = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	const [patients, setPatients] = useState([])
	const [selectedPatient, setSelectedPatient] = useState(null)
	const [patientEmotions, setPatientEmotions] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingEmotions, setLoadingEmotions] = useState(false)

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

	const sortedEmotions = useMemo(() => {
		return [...patientEmotions]
			.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			)
			.map(entry => ({
				...entry,
				formattedDate: format(parseISO(entry.created_at), 'd MMM', {
					locale: ru,
				}),
			}))
	}, [patientEmotions])

	const emotionDistribution = useMemo(() => {
		if (patientEmotions.length === 0) return []

		const counts = patientEmotions.reduce((acc, e) => {
			acc[e.emotion_type] = (acc[e.emotion_type] || 0) + 1
			return acc
		}, {})

		return Object.entries(counts).map(([name, value]) => ({
			name,
			value,
			color: emotionColors[name] || '#8b5cf6',
		}))
	}, [patientEmotions])

	const weeklyComparison = useMemo(() => {
		if (patientEmotions.length === 0) return []

		const now = new Date()
		const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

		const thisWeek = patientEmotions.filter(
			e =>
				new Date(e.created_at) >= thisWeekStart && new Date(e.created_at) < now,
		)
		const lastWeek = patientEmotions.filter(
			e =>
				new Date(e.created_at) >= lastWeekStart &&
				new Date(e.created_at) < thisWeekStart,
		)

		const avgThisWeek =
			thisWeek.length > 0
				? thisWeek.reduce((sum, e) => sum + e.intensity, 0) / thisWeek.length
				: 0
		const avgLastWeek =
			lastWeek.length > 0
				? lastWeek.reduce((sum, e) => sum + e.intensity, 0) / lastWeek.length
				: 0

		return [
			{ name: 'Прошлая неделя', value: avgLastWeek.toFixed(1) },
			{ name: 'Эта неделя', value: avgThisWeek.toFixed(1) },
		]
	}, [patientEmotions])

	const getEmotionStats = () => {
		if (patientEmotions.length === 0) return null

		const avgIntensity =
			patientEmotions.reduce((acc, e) => acc + e.intensity, 0) /
			patientEmotions.length

		const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
		const recentEmotions = patientEmotions.filter(
			e => new Date(e.created_at) >= weekAgo,
		)
		const avgRecent =
			recentEmotions.length > 0
				? recentEmotions.reduce((sum, e) => sum + e.intensity, 0) /
					recentEmotions.length
				: avgIntensity

		const trend = avgRecent - avgIntensity
		const trendPercent = ((trend / avgIntensity) * 100).toFixed(1)

		return {
			avgIntensity: avgIntensity.toFixed(1),
			trend,
			trendPercent,
			totalEntries: patientEmotions.length,
			recentEntries: recentEmotions.length,
		}
	}

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className='glass-card p-3 shadow-lg rounded-xl'>
					<p className='text-sm text-white'>{payload[0].name}</p>
					<p className='text-lg font-bold text-[#8b5cf6]'>{payload[0].value}</p>
				</div>
			)
		}
		return null
	}

	const stats = getEmotionStats()

	return (
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<DashboardHeader activeTab='analytics' />

				<div className='grid md:grid-cols-12 gap-6'>
					{/* Список пациентов */}
					<div className='md:col-span-4 glass-card p-6'>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							<Users className='w-5 h-5 text-[#8b5cf6]' />
							Выберите пациента
						</h2>

						{loading ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
							</div>
						) : patients.length === 0 ? (
							<div className='text-center py-8'>
								<Users className='w-12 h-12 text-white/20 mx-auto mb-3' />
								<p className='text-white/50'>Пока нет пациентов</p>
							</div>
						) : (
							<div className='space-y-2'>
								{patients.map(patient => (
									<button
										key={patient.id}
										onClick={() => setSelectedPatient(patient)}
										className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
											selectedPatient?.id === patient.id
												? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50'
												: 'bg-white/5 border-white/10 hover:bg-white/10'
										}`}
									>
										<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
											<User className='w-5 h-5 text-white' />
										</div>
										<div className='text-left'>
											<p className='text-white font-medium'>
												{patient.first_name} {patient.last_name}
											</p>
											<p className='text-white/40 text-xs'>
												{patient.email}
											</p>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Аналитика */}
					<div className='md:col-span-8'>
						{!selectedPatient ? (
							<div className='glass-card p-6 flex flex-col items-center justify-center h-full py-12'>
								<Activity className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									Выберите пациента для просмотра аналитики
								</p>
							</div>
						) : (
							<>
								{/* Заголовок */}
								<div className='glass-card p-6 mb-6'>
									<div className='flex items-center justify-between mb-4'>
										<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
											<TrendingUp className='w-5 h-5 text-[#8b5cf6]' />
											Аналитика:{' '}
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
											<Activity className='w-12 h-12 text-white/10 mx-auto mb-3' />
											<p className='text-white/50'>
												У этого пациента пока нет записей
											</p>
										</div>
									) : (
										<>
											{/* Статистика */}
											{stats && (
												<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
													<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
														<div className='text-white/50 text-xs'>
															Всего записей
														</div>
														<div className='text-2xl font-bold text-white mt-1'>
															{stats.totalEntries}
														</div>
													</div>
													<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
														<div className='text-white/50 text-xs'>
															Средний показатель
														</div>
														<div className='text-2xl font-bold text-white mt-1'>
															{stats.avgIntensity}/10
														</div>
													</div>
													<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
														<div className='text-white/50 text-xs'>
															За неделю
														</div>
														<div className='text-2xl font-bold text-white mt-1'>
															{stats.recentEntries}
														</div>
													</div>
													<div className='bg-white/5 rounded-xl p-4 border border-white/10'>
														<div className='text-white/50 text-xs flex items-center gap-1'>
															Тренд
															{stats.trend > 0 ? (
																<TrendingUp className='w-3 h-3 text-green-400' />
															) : (
																<TrendingDown className='w-3 h-3 text-red-400' />
															)}
														</div>
														<div
															className={`text-2xl font-bold mt-1 ${
																stats.trend > 0 ? 'text-green-400' : 'text-red-400'
															}`}
														>
															{stats.trend > 0 ? '+' : ''}
															{stats.trendPercent}%
														</div>
													</div>
												</div>
											)}
										</>
									)}
								</div>

								{/* Графики */}
								{patientEmotions.length > 0 && (
									<>
										{/* График динамики */}
										<div className='glass-card p-6 mb-6'>
											<h3 className='text-white font-medium mb-4 flex items-center gap-2'>
												<TrendingUp className='w-5 h-5 text-[#8b5cf6]' />
												Динамика настроения
											</h3>
											<ResponsiveContainer width='100%' height={250}>
												<AreaChart
													data={sortedEmotions}
													margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
												>
													<defs>
														<linearGradient
															id='colorIntensity'
															x1='0'
															y1='0'
															x2='0'
															y2='1'
														>
															<stop
																offset='5%'
																stopColor='#8b5cf6'
																stopOpacity={0.4}
															/>
															<stop
																offset='95%'
																stopColor='#8b5cf6'
																stopOpacity={0}
															/>
														</linearGradient>
													</defs>
													<CartesianGrid
														strokeDasharray='3 3'
														vertical={false}
														stroke='rgba(255, 255, 255, 0.1)'
													/>
													<XAxis
														dataKey='formattedDate'
														axisLine={false}
														tickLine={false}
														tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
													/>
													<YAxis
														domain={[0, 10]}
														axisLine={false}
														tickLine={false}
														tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
													/>
													<Tooltip content={<CustomTooltip />} />
													<ReferenceLine
														y={5}
														stroke='rgba(255, 255, 255, 0.2)'
														strokeDasharray='3 3'
													/>
													<Area
														type='monotone'
														dataKey='intensity'
														stroke='#8b5cf6'
														strokeWidth={3}
														fillOpacity={1}
														fill='url(#colorIntensity)'
													/>
												</AreaChart>
											</ResponsiveContainer>
										</div>

										{/* Распределение эмоций и сравнение */}
										<div className='grid md:grid-cols-2 gap-6'>
											{/* Распределение эмоций */}
											<div className='glass-card p-6'>
												<h3 className='text-white font-medium mb-4'>
													Распределение эмоций
												</h3>
												<ResponsiveContainer width='100%' height={200}>
													<PieChart>
														<Pie
															data={emotionDistribution}
															cx='50%'
															cy='50%'
															outerRadius={80}
															dataKey='value'
															label
														>
															{emotionDistribution.map((entry, index) => (
																<Cell key={`cell-${index}`} fill={entry.color} />
															))}
														</Pie>
														<Tooltip />
													</PieChart>
												</ResponsiveContainer>
											</div>

											{/* Сравнение недель */}
											<div className='glass-card p-6'>
												<h3 className='text-white font-medium mb-4'>
													Сравнение по неделям
												</h3>
												<ResponsiveContainer width='100%' height={200}>
													<BarChart data={weeklyComparison}>
														<CartesianGrid
															strokeDasharray='3 3'
															vertical={false}
															stroke='rgba(255, 255, 255, 0.1)'
														/>
														<XAxis
															dataKey='name'
															axisLine={false}
															tickLine={false}
															tick={{
																fill: 'rgba(255, 255, 255, 0.4)',
																fontSize: 11,
															}}
														/>
														<YAxis
															axisLine={false}
															tickLine={false}
															tick={{
																fill: 'rgba(255, 255, 255, 0.4)',
																fontSize: 12,
															}}
														/>
														<Tooltip content={<CustomTooltip />} />
														<Bar dataKey='value' fill='#8b5cf6' radius={[8, 8, 0, 0]} />
													</BarChart>
												</ResponsiveContainer>
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

export default Analytics
