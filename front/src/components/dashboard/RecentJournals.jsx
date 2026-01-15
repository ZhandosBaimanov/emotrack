import { ArrowUpRight, Calendar, MessageSquare } from 'lucide-react'

const emotionTags = {
	'Очень плохо': { color: 'bg-red-500/20 text-red-400', label: 'Тревога' },
	'Плохо': { color: 'bg-orange-500/20 text-orange-400', label: 'Усталость' },
	'Нормально': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Спокойствие' },
	'Хорошо': { color: 'bg-green-500/20 text-green-400', label: 'Радость' },
	'Отлично': { color: 'bg-purple-500/20 text-purple-400', label: 'Эйфория' },
}

const RecentJournals = ({ emotions = [] }) => {
	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
	}

	const recentEmotions = emotions.slice(0, 5)

	return (
		<div className='glass-card p-6'>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h3 className='text-white font-medium'>Недавние записи</h3>
					<p className='text-white/50 text-sm'>Ваши последние отметки настроения</p>
				</div>
				<button className='w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all'>
					<ArrowUpRight className='w-4 h-4 text-white' />
				</button>
			</div>

			{recentEmotions.length > 0 ? (
				<div className='space-y-3'>
					{recentEmotions.map((emotion, index) => {
						const tag = emotionTags[emotion.emotion_type] || emotionTags['Нормально']
						return (
							<div 
								key={emotion.id || index}
								className='flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all'
							>
								<div className='w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0'>
									<MessageSquare className='w-4 h-4 text-white/50' />
								</div>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2 mb-1'>
										<p className='text-white text-sm font-medium truncate'>
											{emotion.note || emotion.emotion_type}
										</p>
									</div>
									<div className='flex items-center gap-2'>
										<span className={`px-2 py-0.5 rounded-full text-xs ${tag.color}`}>
											{tag.label}
										</span>
										<span className='text-white/40 text-xs flex items-center gap-1'>
											<Calendar className='w-3 h-3' />
											{formatDate(emotion.created_at)}
										</span>
									</div>
								</div>
								<button className='text-white/30 hover:text-white/60 transition-all'>
									⋮
								</button>
							</div>
						)
					})}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-8 text-center'>
					<div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3'>
						<MessageSquare className='w-8 h-8 text-white/30' />
					</div>
					<p className='text-white/50 text-sm'>
						Пока нет записей. Начните отслеживать настроение!
					</p>
				</div>
			)}
		</div>
	)
}

export default RecentJournals
