import { ArrowUpRight, MessageSquare } from 'lucide-react'

const emotionTags = {
	'Очень плохо': { color: 'bg-red-500/20 text-red-400', label: 'Тревога' },
	Плохо: { color: 'bg-orange-500/20 text-orange-400', label: 'Усталость' },
	Нормально: {
		color: 'bg-yellow-500/20 text-yellow-400',
		label: 'Спокойствие',
	},
	Хорошо: { color: 'bg-green-500/20 text-green-400', label: 'Радость' },
	Отлично: { color: 'bg-purple-500/20 text-purple-400', label: 'Эйфория' },
}

const RecentJournals = ({ emotions = [] }) => {
	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
	}

	const recentEmotions = emotions.slice(0, 3)

	return (
		<div className='glass-card p-4'>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='text-white font-medium text-sm'>Недавние записи</h3>
				<button className='w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all'>
					<ArrowUpRight className='w-3.5 h-3.5 text-white' />
				</button>
			</div>

			{recentEmotions.length > 0 ? (
				<div className='space-y-2'>
					{recentEmotions.map((emotion, index) => {
						const tag =
							emotionTags[emotion.emotion_type] || emotionTags['Нормально']
						return (
							<div
								key={emotion.id || index}
								className='flex items-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all'
							>
								<div className='flex-1 min-w-0'>
									<p className='text-white text-xs font-medium truncate mb-1'>
										{emotion.note || emotion.emotion_type}
									</p>
									<div className='flex items-center gap-1.5'>
										<span
											className={`px-1.5 py-0.5 rounded text-[10px] ${tag.color}`}
										>
											{tag.label}
										</span>
										<span className='text-white/40 text-[10px]'>
											{formatDate(emotion.created_at)}
										</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-4 text-center'>
					<MessageSquare className='w-8 h-8 text-white/20 mb-2' />
					<p className='text-white/40 text-xs'>Нет записей</p>
				</div>
			)}
		</div>
	)
}

export default RecentJournals
