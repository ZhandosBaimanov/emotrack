import { Clock } from 'lucide-react'

const SessionCalendar = ({ sessions = [] }) => {
	const today = new Date()
	const weekDays = []
	
	for (let i = 0; i < 7; i++) {
		const date = new Date(today)
		date.setDate(today.getDate() - today.getDay() + 1 + i)
		weekDays.push({
			day: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i],
			date: date.getDate(),
			isToday: date.toDateString() === today.toDateString(),
			hasSession: sessions.some(s => new Date(s.date).toDateString() === date.toDateString()),
		})
	}

	const nextSession = sessions.find(s => new Date(s.date) >= today)

	return (
		<div className='glass-card p-6'>
			<div className='flex items-center justify-between mb-4'>
				<div>
					<h3 className='text-white font-medium'>Терапия</h3>
					<p className='text-white/50 text-sm'>Расписание сессий</p>
				</div>
				{nextSession && (
					<div className='flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/20'>
						<Clock className='w-3 h-3 text-[#c4a7e7]' />
						<span className='text-[#c4a7e7] text-xs'>
							{nextSession.time || '09:00'}
						</span>
					</div>
				)}
			</div>

			{nextSession && (
				<div className='mb-4 p-3 rounded-xl bg-white/5'>
					<p className='text-white text-sm font-medium'>Следующая сессия</p>
					<p className='text-white/50 text-xs'>
						{new Date(nextSession.date).toLocaleDateString('ru-RU', {
							day: 'numeric',
							month: 'long',
						})}
						{' '}{nextSession.time || '09:00 - 10:00'}
					</p>
				</div>
			)}

			<div className='grid grid-cols-7 gap-1'>
				{weekDays.map((day, index) => (
					<div key={index} className='flex flex-col items-center'>
						<span className='text-white/40 text-xs mb-1'>{day.day}</span>
						<div 
							className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
								day.isToday 
									? 'bg-[#8b5cf6] text-white' 
									: day.hasSession
										? 'bg-[#22c55e]/20 text-[#22c55e]'
										: 'text-white/60'
							}`}
						>
							{day.date}
						</div>
						{day.hasSession && !day.isToday && (
							<div className='w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1' />
						)}
					</div>
				))}
			</div>

			{sessions.length === 0 && (
				<p className='text-white/40 text-xs text-center mt-4'>
					Нет запланированных сессий
				</p>
			)}
		</div>
	)
}

export default SessionCalendar
