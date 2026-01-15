import {
	Angry,
	CheckCircle,
	Frown,
	Loader2,
	Meh,
	Send,
	Smile,
	SmilePlus,
} from 'lucide-react'
import { useState } from 'react'

const emotions = [
	{ value: 1, label: 'Очень плохо', icon: Angry, color: '#ef4444', emoji: '😢' },
	{ value: 2, label: 'Плохо', icon: Frown, color: '#f97316', emoji: '😟' },
	{ value: 3, label: 'Нормально', icon: Meh, color: '#eab308', emoji: '😐' },
	{ value: 4, label: 'Хорошо', icon: Smile, color: '#22c55e', emoji: '😊' },
	{ value: 5, label: 'Отлично', icon: SmilePlus, color: '#8b5cf6', emoji: '😄' },
]

const EmotionInput = ({ onSubmit, loading = false }) => {
	const [selectedEmotion, setSelectedEmotion] = useState(null)
	const [note, setNote] = useState('')
	const [success, setSuccess] = useState(false)

	const handleSubmit = async () => {
		if (!selectedEmotion || loading) return

		const emotion = emotions[selectedEmotion - 1]
		await onSubmit({
			emotion_type: emotion.label,
			intensity: selectedEmotion * 2,
			note: note.trim() || null,
		})

		setSuccess(true)
		setSelectedEmotion(null)
		setNote('')
		setTimeout(() => setSuccess(false), 3000)
	}

	return (
		<div className='glass-card p-6'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/30 to-[#6d28d9]/30 flex items-center justify-center'>
					<span className='text-2xl'>💭</span>
				</div>
				<div>
					<h3 className='text-white font-medium'>Как вы себя чувствуете?</h3>
					<p className='text-white/50 text-sm'>Отметьте своё настроение</p>
				</div>
			</div>

			{success && (
				<div className='flex items-center gap-2 p-3 rounded-xl bg-[#22c55e]/20 border border-[#22c55e]/30 mb-4'>
					<CheckCircle className='w-5 h-5 text-[#22c55e]' />
					<span className='text-white text-sm'>Настроение сохранено!</span>
				</div>
			)}

			<div className='grid grid-cols-5 gap-2 mb-4'>
				{emotions.map(emotion => {
					const isSelected = selectedEmotion === emotion.value
					return (
						<button
							key={emotion.value}
							onClick={() => setSelectedEmotion(emotion.value)}
							className={`relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
								isSelected
									? 'bg-white/10 scale-105 shadow-lg'
									: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
							}`}
							style={{
								borderColor: isSelected ? emotion.color : undefined,
							}}
						>
							<span className='text-2xl md:text-3xl'>{emotion.emoji}</span>
							<span className={`text-[10px] md:text-xs text-center ${isSelected ? 'text-white' : 'text-white/50'}`}>
								{emotion.label}
							</span>
							{isSelected && (
								<div 
									className='absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center'
									style={{ backgroundColor: emotion.color }}
								>
									<CheckCircle className='w-3 h-3 text-white' />
								</div>
							)}
						</button>
					)
				})}
			</div>

			<textarea
				value={note}
				onChange={e => setNote(e.target.value)}
				placeholder='Добавьте комментарий (необязательно)...'
				rows={2}
				className='glass-input w-full resize-none mb-4 text-sm'
			/>

			<button
				onClick={handleSubmit}
				disabled={!selectedEmotion || loading}
				className={`w-full glass-button-primary flex items-center justify-center gap-2 ${
					!selectedEmotion ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				{loading ? (
					<>
						<Loader2 className='w-5 h-5 animate-spin' />
						Сохранение...
					</>
				) : (
					<>
						<Send className='w-5 h-5' />
						Сохранить
					</>
				)}
			</button>
		</div>
	)
}

export default EmotionInput
