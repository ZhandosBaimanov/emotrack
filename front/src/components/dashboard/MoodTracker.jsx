import { TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

const MoodTracker = ({ emotions = [] }) => {
	const weeklyData = useMemo(() => {
		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		
		const weekEmotions = emotions.filter(e => {
			const date = new Date(e.created_at)
			return date >= weekAgo
		})

		if (weekEmotions.length === 0) return { percentage: 0, trend: 'neutral', bars: [] }

		const avgIntensity = weekEmotions.reduce((sum, e) => sum + e.intensity, 0) / weekEmotions.length
		const percentage = Math.round((avgIntensity / 10) * 100)

		const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
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

		return { percentage, trend: percentage >= 50 ? 'positive' : 'negative', bars }
	}, [emotions])

	const getMessage = () => {
		if (weeklyData.percentage >= 75) return 'Отличная неделя! Так держать!'
		if (weeklyData.percentage >= 50) return 'Неплохая неделя. Продолжайте отслеживать.'
		if (weeklyData.percentage >= 25) return 'Сложная неделя. Мы рядом.'
		return 'Начните отслеживать своё настроение'
	}

	return (
		<div className='glass-card p-6 h-full'>
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

			<p className='text-white/60 text-sm mb-6'>{getMessage()}</p>

			<div className='flex items-end justify-between h-16 gap-1'>
				{weeklyData.bars.map((bar, index) => (
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

			<div className='flex justify-between mt-4 text-xs text-white/40'>
				<span>Плохо</span>
				<span>Хорошо</span>
			</div>
		</div>
	)
}

export default MoodTracker
