/**
 * КАРТОЧКА ПСИХОЛОГА
 * 
 * Режимы работы:
 * 1. Есть психолог ("Мой психолог"):
 *    - Показывает профиль психолога
 *    - Кнопка "Запросить сеанс" открывает календарь
 * 
 * 2. Нет психолога ("Доступные психологи"):
 *    - Список рекомендуемых специалистов
 *    - Кнопка "Выбрать" переводит на контакты
 */
import { Check, User, X, Star, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useState } from 'react'
import SessionRequestCalendar from './SessionRequestCalendar'
import { useNavigate } from 'react-router-dom'

import { sessionsAPI } from '../../api/api'
import { toast } from 'sonner'

const TherapistCard = ({ psychologist, recommendedPsychologists = [] }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const navigate = useNavigate()
	const hasPsychologist = !!psychologist

	const handleRequestSubmit = async (date, time) => {
		try {
			await sessionsAPI.requestSession(psychologist.id, date, time)
			toast.success('Запрос отправлен психологу')
			setIsModalOpen(false)
		} catch (error) {
			console.error('Session request error:', error)
			toast.error('Не удалось отправить запрос')
		}
	}

	const handleSelectPsychologist = (psychId) => {
		// Переход к контактам выбранного психолога
		// В реальном приложении здесь может быть создание чата или заявка
		navigate('/chats')
	}

	if (hasPsychologist) {
		return (
			<>
				<div className='glass-card overflow-hidden flex-1 flex flex-col h-full'>
					{/* Header */}
					<div className='p-6 pb-4'>
						<h3 className='text-white font-medium mb-1'>Мой психолог</h3>
						<p className='text-white/50 text-sm'>Ваш личный специалист</p>
					</div>

					{/* Therapist Image Section */}
					<div className='relative bg-gradient-to-br from-[#e8f5e9]/10 to-[#c8e6c9]/5 px-6 pt-2 pb-6 flex-1'>
						<div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-transparent blur-2xl' />

						<div className='relative z-10 flex items-end justify-between h-full'>
							<div className='flex-1 flex flex-col justify-end pb-2'>
								<div className='mb-4'>
									<div className='flex items-center gap-2 mb-2'>
										<span className='px-2 py-1 rounded-md bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-medium border border-[#8b5cf6]/20'>
											Психолог
										</span>
										<div className='flex items-center gap-1 text-yellow-400 text-xs'>
											<Star className='w-3 h-3 fill-yellow-400' />
											<span>4.9</span>
										</div>
									</div>
									<h4 className='text-white text-xl font-medium mb-1'>
										{psychologist.first_name} {psychologist.last_name}
									</h4>
									<p className='text-white/60 text-sm'>
										Клинический психолог, КПТ-терапевт
									</p>
								</div>
							</div>
							
							<div className='w-32 h-40 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden flex-shrink-0'>
								{/* Placeholder for real avatar */}
								<div className='w-full h-full flex items-center justify-center bg-[#8b5cf6]/20'>
									<User className='w-16 h-16 text-white/40' />
								</div>
							</div>
						</div>
					</div>

					{/* Action Section */}
					<div className='p-6 pt-4 mt-auto'>
						<button 
							onClick={() => setIsModalOpen(true)}
							className='w-full bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4a] hover:from-[#2a2a4a] hover:to-[#3a3a5a] text-white py-4 px-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-3 transition-all border border-white/10 shadow-lg shadow-black/20 group'
						>
							<div className='w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center group-hover:bg-[#8b5cf6]/30 transition-colors'>
								<CalendarIcon className='w-4 h-4 text-[#8b5cf6]' />
							</div>
							<span>Запросить сеанс</span>
						</button>
					</div>
				</div>

				{/* Modal for Session Request */}
				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
						<div className="relative glass-card p-6 w-full max-w-md animate-scaleIn">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-white text-lg font-medium">Запись на сеанс</h3>
								<button 
									onClick={() => setIsModalOpen(false)}
									className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
								>
									<X className="w-4 h-4 text-white/60" />
								</button>
							</div>
							
							<SessionRequestCalendar 
								psychologistId={psychologist.id} 
								onRequestSubmit={handleRequestSubmit}
							/>
						</div>
					</div>
				)}
			</>
		)
	}

	return (
		<div className='glass-card p-6 h-full flex flex-col'>
			<div className='mb-6'>
				<h3 className='text-white font-medium mb-1'>Доступные психологи</h3>
				<p className='text-white/50 text-sm'>
					Выберите специалиста для начала терапии
				</p>
			</div>

			{recommendedPsychologists.length > 0 ? (
				<div className='space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2'>
					{recommendedPsychologists.slice(0, 5).map((psych, index) => (
						<div
							key={psych.id || index}
							className='flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group'
						>
							<div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#8b5cf6]/20'>
								<User className='w-6 h-6 text-white' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-white text-sm font-medium truncate group-hover:text-[#8b5cf6] transition-colors'>
									{psych.first_name} {psych.last_name}
								</p>
								<div className='flex items-center gap-2 mt-0.5'>
									<div className='flex items-center gap-1 text-yellow-400 text-[10px]'>
										<Star className='w-3 h-3 fill-yellow-400' />
										<span>4.9</span>
									</div>
									<span className='text-white/30 text-[10px]'>•</span>
									<span className='text-white/50 text-xs truncate'>Клинический психолог</span>
								</div>
							</div>
							<button 
								onClick={() => handleSelectPsychologist(psych.id)}
								className='px-3 py-1.5 text-xs font-medium bg-[#8b5cf6]/10 hover:bg-[#8b5cf6] text-[#8b5cf6] hover:text-white rounded-lg transition-all border border-[#8b5cf6]/20 hover:border-[#8b5cf6]'
							>
								Выбрать
							</button>
						</div>
					))}
				</div>
			) : (
				<div className='flex flex-col items-center justify-center flex-1 text-center py-8'>
					<div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 animate-pulse'>
						<User className='w-8 h-8 text-white/30' />
					</div>
					<p className='text-white/50 text-sm'>Нет доступных специалистов</p>
				</div>
			)}
		</div>
	)
}

export default TherapistCard
