/**
 * МОДАЛЬНОЕ ОКНО ОЦЕНКИ НАСТРОЕНИЯ
 * 10-балльная шкала с градиентной подсветкой и необязательной заметкой
 */
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

const MoodModal = ({ isOpen, onClose, onSave }) => {
	const [selectedIntensity, setSelectedIntensity] = useState(null)
	const [note, setNote] = useState('')

	// Блокировка скролла при открытом модале
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	// Закрытие по Escape
	useEffect(() => {
		const handleEscape = e => {
			if (e.key === 'Escape') onClose()
		}
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		}
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	// Сброс при закрытии
	useEffect(() => {
		if (!isOpen) {
			setSelectedIntensity(null)
			setNote('')
		}
	}, [isOpen])

	const handleSave = () => {
		if (selectedIntensity) {
			onSave(selectedIntensity, note)
			onClose()
		}
	}

	const getButtonColor = intensity => {
		if (intensity <= 3) return 'from-[#EF4444] to-[#F87171]' // красный
		if (intensity <= 6) return 'from-[#FBBF24] to-[#FCD34D]' // жёлтый
		return 'from-[#10B981] to-[#34D399]' // зелёный
	}

	const getEmoji = intensity => {
		if (intensity <= 2) return '😢'
		if (intensity <= 4) return '😕'
		if (intensity <= 6) return '😐'
		if (intensity <= 8) return '🙂'
		return '😊'
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn'
			onClick={onClose}
		>
			{/* Overlay */}
			<div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

			{/* Modal */}
			<div
				className='relative glass-card p-6 w-full max-w-md animate-scaleIn'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<div>
						<h3 className='text-white text-xl font-medium mb-1'>
							Как ваше настроение?
						</h3>
						<p className='text-white/60 text-sm'>Оцените от 1 до 10</p>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all'
					>
						<X className='w-4 h-4 text-white/60' />
					</button>
				</div>

				{/* Эмодзи-подсказка для выбранного значения */}
				{selectedIntensity && (
					<div className='text-center mb-4'>
						<div className='text-5xl mb-2'>{getEmoji(selectedIntensity)}</div>
						<div className='text-white/60 text-sm'>
							{selectedIntensity <= 2 && 'Очень плохо'}
							{selectedIntensity > 2 && selectedIntensity <= 4 && 'Грустно'}
							{selectedIntensity > 4 && selectedIntensity <= 6 && 'Нормально'}
							{selectedIntensity > 6 && selectedIntensity <= 8 && 'Хорошо'}
							{selectedIntensity > 8 && 'Отлично'}
						</div>
					</div>
				)}

				{/* 10-балльная шкала */}
				<div className='grid grid-cols-5 gap-3 mb-6'>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(intensity => (
						<button
							key={intensity}
							onClick={() => setSelectedIntensity(intensity)}
							className={`
								h-12 rounded-xl font-medium text-white transition-all relative
								${
									selectedIntensity === intensity
										? `bg-gradient-to-br ${getButtonColor(intensity)} scale-110 shadow-lg ring-2 ring-white/30`
										: 'bg-white/10 hover:bg-white/20'
								}
							`}
						>
							{intensity}
						</button>
					))}
				</div>

				{/* Цветовая шкала-подсказка с эмодзи */}
				<div className='flex items-center justify-between text-xs text-white/50 mb-6 px-2'>
					<div className='flex flex-col items-center'>
						<span className='text-lg mb-1'>😢</span>
						<span>Плохо</span>
					</div>
					<div className='flex flex-col items-center'>
						<span className='text-lg mb-1'>😐</span>
						<span>Нормально</span>
					</div>
					<div className='flex flex-col items-center'>
						<span className='text-lg mb-1'>😊</span>
						<span>Отлично</span>
					</div>
				</div>

				{/* Заметка (необязательно) */}
				<div className='mb-6'>
					<label className='text-white/80 text-sm mb-2 block'>
						Заметка (необязательно)
					</label>
					<textarea
						value={note}
						onChange={e => setNote(e.target.value)}
						placeholder='Что случилось сегодня?'
						rows='3'
						className='glass-input w-full resize-none text-sm'
						maxLength={200}
					/>
					<div className='text-white/40 text-xs mt-1 text-right'>
						{note.length}/200
					</div>
				</div>

				{/* Кнопки */}
				<div className='flex gap-3'>
					<button
						onClick={onClose}
						className='flex-1 glass-button py-3 text-sm'
					>
						Отменить
					</button>
					<button
						onClick={handleSave}
						disabled={!selectedIntensity}
						className={`
							flex-1 py-3 rounded-xl text-sm font-medium transition-all
							${
								selectedIntensity
									? 'bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white'
									: 'bg-white/10 text-white/40 cursor-not-allowed'
							}
						`}
					>
						Сохранить
					</button>
				</div>
			</div>
		</div>
	)
}

export default MoodModal
