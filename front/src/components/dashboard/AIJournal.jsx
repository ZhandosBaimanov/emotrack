import { useState } from 'react'
import VoiceRecorder from './VoiceRecorder'

const AIJournal = () => {
	const [text, setText] = useState('')

	return (
		<div className='glass-card p-6 relative overflow-hidden flex-1 flex flex-col'>
			<div className='absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#c4a7e7]/20 to-transparent blur-2xl' />
			<div className='absolute bottom-0 left-0 w-20 h-20 rounded-full bg-gradient-to-tr from-[#8b5cf6]/10 to-transparent blur-xl' />

			<div className='relative z-10'>
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

				{/* Voice Recorder Section */}
				<div className="my-4">
					<VoiceRecorder />
				</div>

				<div className='relative mb-4'>
					<textarea
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder='Как вы себя чувствуете сегодня? Введите текст или продиктуйте...'
						rows={3}
						className='glass-input w-full resize-none text-sm p-4'
					/>
				</div>
			</div>
		</div>
	)
}

export default AIJournal