/**
 * КАРТОЧКА ДОСТУПНЫХ ПСИХОЛОГОВ - Показывает назначенного специалиста
 * Отображает фото, имя психолога и время ближайшего сеанса
 * Кнопки для записи на сеанс или отмены
 */
import { Check, User, X } from 'lucide-react'

const TherapistCard = ({ psychologist, recommendedPsychologists = [] }) => {
	const hasPsychologist = !!psychologist

	if (hasPsychologist) {
		return (
			<div className='glass-card overflow-hidden flex-1 flex flex-col'>
				{/* Header */}
				<div className='p-6 pb-4'>
					<h3 className='text-white font-medium mb-1'>Доступный психолог</h3>
					<p className='text-white/50 text-sm'>Специалист на сегодня</p>
				</div>

				{/* Therapist Image Section */}
				<div className='relative bg-gradient-to-br from-[#e8f5e9]/10 to-[#c8e6c9]/5 px-6 pt-2 pb-6'>
					<div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-transparent blur-2xl' />

					<div className='relative z-10 flex items-end justify-between'>
						{/* Avatar/Photo placeholder */}
						<div className='flex-1' />
						<div className='w-40 h-52 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden'>
							<div className='w-full h-full flex items-center justify-center'>
								<User className='w-20 h-20 text-white/40' />
							</div>
						</div>
					</div>
				</div>

				{/* Details Section */}
				<div className='px-6 pb-4 mt-6'>
					<div className='mb-4'>
						<h4 className='text-white text-lg font-medium mb-1'>
							{psychologist.first_name} {psychologist.last_name}
						</h4>
						<div className='flex items-center gap-2 text-white/60 text-sm'>
							<div className='w-1.5 h-1.5 rounded-full bg-[#22c55e]' />
							<span>Сегодня, 08:00 - 09:00 (1hr)</span>
						</div>
					</div>

					{/* Booking Buttons */}
					<div className='flex gap-3'>
						<button className='w-12 h-12 rounded-2xl border-2 border-white/20 hover:bg-white/10 flex items-center justify-center transition-all group'>
							<X className='w-5 h-5 text-white/60 group-hover:text-white' />
						</button>
						<button className='flex-1 bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4a] hover:from-[#2a2a4a] hover:to-[#3a3a5a] text-white py-3 px-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all border border-white/10'>
							Записаться на сеанс
							<div className='w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center'>
								<Check className='w-4 h-4 text-white' />
							</div>
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='glass-card p-6 h-full'>
			<h3 className='text-white font-medium mb-2'>Рекомендуемые психологи</h3>
			<p className='text-white/50 text-sm mb-4'>
				Выберите специалиста для работы
			</p>

			{recommendedPsychologists.length > 0 ? (
				<div className='space-y-3'>
					{recommendedPsychologists.slice(0, 3).map((psych, index) => (
						<div
							key={psych.id || index}
							className='flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer'
						>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
								<User className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-white text-sm font-medium truncate'>
									{psych.first_name} {psych.last_name}
								</p>
								<p className='text-white/50 text-xs truncate'>{psych.email}</p>
							</div>
							<button className='px-3 py-1 text-xs bg-[#8b5cf6]/30 hover:bg-[#8b5cf6]/50 text-white rounded-full transition-all'>
								Выбрать
							</button>
						</div>
					))}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-8 text-center'>
					<div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3'>
						<User className='w-8 h-8 text-white/30' />
					</div>
					<p className='text-white/50 text-sm'>Нет доступных психологов</p>
				</div>
			)}
		</div>
	)
}

export default TherapistCard
