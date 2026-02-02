/**
 * ТРЕКЕР НАСТРОЕНИЯ - Сводка эмоций за неделю с графиком
 * Показывает процент позитивных эмоций и визуализацию
 */
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import MoodModal from './MoodModal'

const MoodTracker = ({ emotions = [], onAddEmotion }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [hoveredDay, setHoveredDay] = useState(null)

	const getEmoji = intensity => {
		if (intensity <= 2) return '😢'
		if (intensity <= 4) return '😕'
		if (intensity <= 6) return '😐'
		if (intensity <= 8) return '🙂'
		return '😊'
	}

	const getEmotionLabel = intensity => {
		if (intensity <= 2) return 'Очень плохо'
		if (intensity <= 4) return 'Грустно'
		if (intensity <= 6) return 'Нормально'
		if (intensity <= 8) return 'Хорошо'
		return 'Отлично'
	}

	const weeklyData = useMemo(() => {
		const now = new Date()
		const weekStart = new Date(now)
		weekStart.setDate(now.getDate() - 6)
		weekStart.setHours(0, 0, 0, 0)

		const recentEmotions = emotions.filter(emotion => {
			const emotionDate = new Date(emotion.created_at)
			return emotionDate >= weekStart
		})

		if (recentEmotions.length === 0) {
			return {
				percentage: 0,
				message: 'Начните отслеживать своё настроение',
				dayStats: [],
			}
		}

		// Группировка по дням
		const dayStats = []
		const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

		for (let i = 0; i < 7; i++) {
			const date = new Date(weekStart)
			date.setDate(weekStart.getDate() + i)

			const dayEmotions = recentEmotions.filter(e => {
				const eDate = new Date(e.created_at)
				return eDate.toDateString() === date.toDateString()
			})

			const avgIntensity =
				dayEmotions.length > 0
					? dayEmotions.reduce((sum, e) => sum + e.intensity, 0) /
						dayEmotions.length
					: 0

			dayStats.push({
				day: dayNames[date.getDay()],
				date: date.getDate(),
				count: dayEmotions.length,
				avgIntensity,
				emotions: dayEmotions,
				isToday: date.toDateString() === now.toDateString(),
			})
		}

		const totalIntensity = recentEmotions.reduce(
			(sum, emotion) => sum + emotion.intensity,
			0,
		)
		const avgIntensity = totalIntensity / recentEmotions.length
		const percentage = Math.round((avgIntensity / 10) * 100)

		let message = 'Продолжайте в том же духе!'
		if (percentage >= 80) message = 'Отличное настроение! 🎉'
		else if (percentage >= 60) message = 'Всё идёт хорошо 😊'
		else if (percentage >= 40) message = 'Держитесь, всё наладится'
		else message = 'Мы здесь, чтобы помочь 💙'

		return { percentage, message, dayStats }
	}, [emotions])

	// Сортировка данных по дате для графика
	const sortedData = useMemo(() => {
		return [...emotions]
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
	}, [emotions])

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload
			return (
				<div className='glass-card p-4 shadow-lg rounded-xl'>
					<p className='text-sm font-medium text-white/60'>{label}</p>
					<div className='flex items-center gap-2 mt-1'>
						<span className='text-2xl font-bold text-white'>
							{data.intensity}
						</span>
						<span className='text-xl'>
							{data.intensity >= 8 ? '😊' : data.intensity >= 5 ? '😐' : '😔'}
						</span>
					</div>
					{data.note && (
						<p className='text-xs text-white/40 mt-2 max-w-[200px] truncate'>
							{data.note}
						</p>
					)}
				</div>
			)
		}
		return null
	}

	const getBarColor = intensity => {
		if (intensity >= 7) return 'bg-gradient-to-t from-[#10B981] to-[#34D399]'
		if (intensity >= 4)
			return 'bg-gradient-to-t from-[#FBBF24]/50 to-[#FCD34D]/50'
		if (intensity > 0)
			return 'bg-gradient-to-t from-[#EF4444]/50 to-[#F87171]/50'
		return 'bg-white/10'
	}

	return (
		<>
			<div className='glass-card p-6 pb-4'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='text-white font-medium'>Трекер настроения</h3>
					<button
						onClick={() => setIsModalOpen(true)}
						className='w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6]/30 to-[#6d28d9]/20 hover:from-[#8b5cf6]/40 hover:to-[#6d28d9]/30 flex items-center justify-center transition-all border border-[#8b5cf6]/30'
					>
						<Plus className='w-4 h-4 text-[#c4a7e7]' />
					</button>
				</div>

				<p className='text-white/50 text-sm mb-6'>Сводка за неделю</p>

				<div className='text-5xl font-bold text-white mb-2'>
					{weeklyData.percentage}%
				</div>
				<p className='text-white/60 text-sm mb-4'>{weeklyData.message}</p>

				{/* График */}
				<ResponsiveContainer width='100%' height={200}>
					<AreaChart
						data={sortedData}
						margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
					>
						<defs>
							<linearGradient id='colorScore' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.4} />
								<stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
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
							dy={10}
						/>
						<YAxis
							domain={[0, 10]}
							axisLine={false}
							tickLine={false}
							tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
						/>
						<ReferenceLine
							y={5}
							stroke='rgba(255, 255, 255, 0.1)'
							strokeDasharray='3 3'
						/>
						<Area
							type='monotone'
							dataKey='intensity'
							stroke='#8b5cf6'
							strokeWidth={3}
							fillOpacity={1}
							fill='url(#colorScore)'
							activeDot={{ r: 6, strokeWidth: 0, fill: '#7C3AED' }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<MoodModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={onAddEmotion}
			/>
		</>
	)
}

export default MoodTracker
