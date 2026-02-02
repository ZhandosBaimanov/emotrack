import { useState } from 'react'
import VoiceRecorder from './VoiceRecorder'

const AIJournal = () => {
	const [text, setText] = useState('')

	const handleSend = () => {
		if (text.trim()) {
			console.log('Отправлено:', text)
			setText('')
		}
	}

	return (
		<div className='glass-card p-6 relative overflow-hidden flex-1 flex flex-col'>
			<div className='absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#c4a7e7]/20 to-transparent blur-2xl' />
			<div className='absolute bottom-0 left-0 w-20 h-20 rounded-full bg-gradient-to-tr from-[#8b5cf6]/10 to-transparent blur-xl' />

			<div className='relative z-10 flex flex-col h-full'>
				<div className='flex items-start justify-between mb-4'>
					<div>
						<h3 className='text-white font-medium mb-1'>Не волнуйтесь 👋</h3>
						<p className='text-white/50 text-sm'>emoAI слушает вас...</p>
					</div>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 rounded-full bg-[#22c55e] animate-pulse' />
						<span className='text-white/60 text-xs'>В эфире</span>
					</div>
				</div>

				{/* Spacer Top */}
				<div className='flex-1' />

				{/* Voice Recorder Section - Centered */}
				<div className='flex justify-center items-center mb-4'>
					<VoiceRecorder />
				</div>

				{/* Spacer Bottom */}
				<div className='flex-1' />

				{/* Text Input with Send Arrow - Bottom */}
				<div className='flex justify-center'>
					<div className='flex gap-2 items-end w-full max-w-md'>
						<textarea
							value={text}
							onChange={e => setText(e.target.value)}
							placeholder='Как вы себя чувствуете сегодня? Введите текст или продиктуйте...'
							rows={2}
							className='glass-input flex-1 resize-none text-sm p-3'
						/>
						<button
							onClick={handleSend}
							disabled={!text.trim()}
							className='p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 text-lg font-medium flex items-center justify-center h-10 w-10 flex-shrink-0'
						>
							→
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AIJournal
