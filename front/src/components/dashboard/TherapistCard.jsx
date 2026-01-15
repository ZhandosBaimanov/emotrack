import { Calendar, Check, User, X } from 'lucide-react'

const TherapistCard = ({ psychologist, recommendedPsychologists = [] }) => {
	const hasPsychologist = !!psychologist

	if (hasPsychologist) {
		return (
			<div className='glass-card p-6 h-full'>
				<h3 className='text-white font-medium mb-2'>Ваш психолог</h3>
				<p className='text-white/50 text-sm mb-4'>Специалист закреплён за вами</p>

				<div className='flex flex-col items-center text-center mb-4'>
					<div className='w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center mb-3 ring-4 ring-[#8b5cf6]/20'>
						<User className='w-10 h-10 text-white' />
					</div>
					<h4 className='text-white font-medium'>
						{psychologist.first_name} {psychologist.last_name}
					</h4>
					<p className='text-white/50 text-sm'>{psychologist.email}</p>
				</div>

				<div className='flex gap-2'>
					<button className='flex-1 glass-button py-2 px-3 text-sm flex items-center justify-center gap-2'>
						<X className='w-4 h-4' />
					</button>
					<button className='flex-1 bg-[#22c55e]/80 hover:bg-[#22c55e] text-white py-2 px-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all'>
						<Calendar className='w-4 h-4' />
						Записаться
						<Check className='w-4 h-4' />
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='glass-card p-6 h-full'>
			<h3 className='text-white font-medium mb-2'>Рекомендуемые психологи</h3>
			<p className='text-white/50 text-sm mb-4'>Выберите специалиста для работы</p>

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
					<p className='text-white/50 text-sm'>
						Нет доступных психологов
					</p>
				</div>
			)}
		</div>
	)
}

export default TherapistCard
