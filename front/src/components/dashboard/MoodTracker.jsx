/**
 * ТРЕКЕР НАСТРОЕНИЯ - Сводка эмоций за неделю с графиком
 * Показывает процент позитивных эмоций и визуализацию
 */
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
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
				<div className='relative h-24 mb-2'>
					<div className='flex items-end justify-between h-full gap-2'>
						{weeklyData.dayStats.map((day, index) => (
							<div
								key={index}
								className='flex-1 relative group'
								onMouseEnter={() => setHoveredDay(index)}
								onMouseLeave={() => setHoveredDay(null)}
							>
								{/* Столбец */}
								<div
									className={`
										w-full rounded-t-lg transition-all duration-300 relative
										${getBarColor(day.avgIntensity)}
										${day.isToday ? 'ring-2 ring-[#8b5cf6] ring-offset-2 ring-offset-[#1a1a2e]' : ''}
										${day.count > 0 ? 'cursor-pointer' : ''}
									`}
									style={{
										height: day.count > 0 ? `${day.avgIntensity * 10}%` : '4px',
										minHeight: day.count > 0 ? '12px' : '4px',
									}}
								>
									{/* Количество записей */}
									{day.count > 0 && (
										<div className='absolute inset-0 flex items-center justify-center'>
											<span className='text-white text-xs font-medium'>
												{day.count}
											</span>
										</div>
									)}
								</div>

								{/* Tooltip с эмодзи */}
								{hoveredDay === index && day.count > 0 && (
									<div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10'>
										<div className='glass-card p-3 text-xs whitespace-nowrap'>
											<div className='flex items-center gap-2 mb-2'>
												<span className='text-2xl'>
													{getEmoji(day.avgIntensity)}
												</span>
												<div>
													<div className='text-white font-medium'>
														{day.day} {day.date}
													</div>
													<div className='text-white/60'>
														{getEmotionLabel(day.avgIntensity)}
													</div>
												</div>
											</div>
											<div className='text-white/60 border-t border-white/10 pt-2'>
												Оценка: {day.avgIntensity.toFixed(1)}/10
											</div>
											<div className='text-white/60'>Записей: {day.count}</div>
											{day.emotions.length > 0 && day.emotions[0].note && (
												<div className='text-white/50 text-xs mt-1 max-w-[200px] truncate'>
													"{day.emotions[0].note}"
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Подписи дней */}
				<div className='flex justify-between items-center'>
					{weeklyData.dayStats.map((day, index) => (
						<div
							key={index}
							className={`flex-1 text-center text-xs ${
								day.isToday ? 'text-[#8b5cf6] font-medium' : 'text-white/40'
							}`}
						>
							{day.day}
						</div>
					))}
				</div>

				<div className='flex justify-between items-center text-xs mt-4'>
					<span className='text-white/40'>😢 Плохо</span>
					<span className='text-white/40'>😊 Отлично</span>
				</div>
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
