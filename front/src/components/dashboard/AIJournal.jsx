/**
 * AI ЧАТ - Компонент для голосового и текстового общения с AI
 * Пользователь может диктовать или вводить свои мысли
 */
import { Mic, Pause, Play, Send, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const AIJournal = () => {
	const [isListening, setIsListening] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [audioTime, setAudioTime] = useState(0)
	const [text, setText] = useState('')
	const [audioLevel, setAudioLevel] = useState(0)

	useEffect(() => {
		let interval
		if (isListening && !isPaused) {
			interval = setInterval(() => {
				setAudioTime(prev => prev + 1)
				setAudioLevel(Math.random() * 0.8 + 0.2)
			}, 1000)
		}
		return () => clearInterval(interval)
	}, [isListening, isPaused])

	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const toggleListening = () => {
		if (!isListening) {
			setIsListening(true)
			setIsPaused(false)
			setAudioTime(0)
		} else {
			setIsPaused(!isPaused)
		}
	}

	const stopListening = () => {
		setIsListening(false)
		setIsPaused(false)
		setAudioTime(0)
	}

	return (
		<div className='glass-card p-6 relative overflow-hidden flex-1 flex flex-col'>
			<div className='absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#c4a7e7]/20 to-transparent blur-2xl' />
			<div className='absolute bottom-0 left-0 w-20 h-20 rounded-full bg-gradient-to-tr from-[#8b5cf6]/10 to-transparent blur-xl' />

			<div className='relative z-10'>
				<div className='flex items-start justify-between mb-4'>
					<div>
						<h3 className='text-white font-medium mb-1'>Не волнуйтесь 👋</h3>
						<p className='text-white/50 text-sm'>AI Журнал слушает вас...</p>
					</div>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 rounded-full bg-[#22c55e] animate-pulse' />
						<span className='text-white/60 text-xs'>В эфире</span>
					</div>
				</div>

				<div className='bg-gradient-to-br from-[#5a7a5f]/30 to-[#7cb69d]/20 rounded-2xl p-6 mb-4 border border-[#7cb69d]/20'>
					<div className='flex items-center justify-between mb-3'>
						<h4 className='text-white/90 text-sm font-medium'>
							Solma AI Journal
						</h4>
						<button
							onClick={toggleListening}
							className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all'
						>
							{isListening && !isPaused ? (
								<Pause className='w-5 h-5 text-white' />
							) : (
								<Play className='w-5 h-5 text-white ml-0.5' />
							)}
						</button>
					</div>

					<p className='text-white/60 text-xs mb-4'>Слушаю вашу историю...</p>

					{/* Audio Waveform */}
					<div className='flex items-center justify-center gap-1 h-16 mb-3'>
						{Array.from({ length: 40 }).map((_, i) => {
							const height =
								isListening && !isPaused
									? Math.sin(i * 0.5 + audioTime * 2) * 20 +
										25 +
										Math.random() * 15
									: 5
							return (
								<div
									key={i}
									className='w-1 bg-white/60 rounded-full transition-all duration-200'
									style={{
										height: `${height}px`,
										opacity: isListening && !isPaused ? 0.8 : 0.3,
									}}
								/>
							)
						})}
					</div>

					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2 text-white/80 text-sm'>
							<Mic className='w-4 h-4' />
							<span>{formatTime(audioTime)}</span>
						</div>
						<span className='text-white/60 text-sm'>00:34</span>
					</div>
				</div>

				<div className='relative mb-4'>
					<textarea
						value={text}
						onChange={e => setText(e.target.value)}
						placeholder='Как вы себя чувствуете сегодня? Введите текст или продиктуйте...'
						rows={3}
						className='glass-input w-full resize-none text-sm pr-12'
					/>
					<div className='absolute bottom-4 right-4 flex items-center gap-2'>
						<span className='text-white/40 text-xs'>{text.length}/87</span>
						<div className='flex items-center gap-1'>
							<div className='w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/40'>
								$
							</div>
							<span className='text-white/60 text-sm'>87 /Month</span>
						</div>
					</div>
				</div>

				{isListening && (
					<div className='flex gap-2'>
						<button
							onClick={stopListening}
							className='flex-1 glass-button py-3 flex items-center justify-center gap-2 text-sm'
						>
							<Trash2 className='w-4 h-4' />
							Отменить
						</button>
						<button className='flex-1 bg-[#8b5cf6]/80 hover:bg-[#8b5cf6] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all'>
							<Send className='w-4 h-4' />
							Отправить
						</button>
					</div>
				)}

				{!isListening && (
					<button
						onClick={toggleListening}
						className='w-full glass-button-primary py-3 flex items-center justify-center gap-2'
					>
						<Mic className='w-5 h-5' />
						Начать запись
					</button>
				)}
			</div>
		</div>
	)
}

export default AIJournal
