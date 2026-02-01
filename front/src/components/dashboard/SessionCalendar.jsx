/**
 * КАРТОЧКА СТРИКА ЗАПИСИ - Календарь последовательных дней записей
 * Показывает streak (серию) - сколько дней подряд пользователь делал записи
 * Если пропустил день - стрик сбрасывается
 */
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
			hasSession: sessions.some(
				s => new Date(s.date).toDateString() === date.toDateString(),
			),
		})
	}

	const nextSession = sessions.find(s => new Date(s.date) >= today)

	return (
		<div className='glass-card p-4 flex-1'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-white font-medium text-sm'>Терапия</h3>
				{nextSession && (
					<div className='flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#c4a7e7]/10'>
						<Clock className='w-3 h-3 text-[#c4a7e7]' />
						<span className='text-[#c4a7e7] text-xs'>08:00</span>
					</div>
				)}
			</div>

			<div className='grid grid-cols-7 gap-1.5 mb-3'>
				{weekDays.map((day, index) => {
					const isActive = day.isToday || day.hasSession
					return (
						<div key={index} className='flex flex-col items-center gap-0.5'>
							<span className='text-white/40 text-[9px] font-medium'>
								{day.day}
							</span>
							<div
								className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
									day.isToday
										? 'bg-gradient-to-br from-[#7cb69d] to-[#6b9ac4] text-white shadow-lg'
										: day.hasSession
											? 'bg-[#7cb69d]/20 text-[#7cb69d] border border-[#7cb69d]/30'
											: 'bg-white/5 text-white/50 hover:bg-white/10'
								}`}
							>
								{day.date}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default SessionCalendar
