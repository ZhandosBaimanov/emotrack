import {
	Angry,
	Calendar,
	CheckCircle,
	Frown,
	Heart,
	History,
	Loader2,
	LogOut,
	Meh,
	MessageSquare,
	Send,
	Smile,
	SmilePlus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotionsAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'

// Определение эмоций с иконками и цветами
const emotions = [
	{
		value: 1,
		label: 'Очень плохо',
		icon: Angry,
		color: 'from-red-500/30 to-red-600/20',
		borderColor: 'border-red-400/50',
		emoji: '😢',
	},
	{
		value: 2,
		label: 'Плохо',
		icon: Frown,
		color: 'from-orange-500/30 to-orange-600/20',
		borderColor: 'border-orange-400/50',
		emoji: '😟',
	},
	{
		value: 3,
		label: 'Нормально',
		icon: Meh,
		color: 'from-yellow-500/30 to-yellow-600/20',
		borderColor: 'border-yellow-400/50',
		emoji: '😐',
	},
	{
		value: 4,
		label: 'Хорошо',
		icon: Smile,
		color: 'from-green-500/30 to-green-600/20',
		borderColor: 'border-green-400/50',
		emoji: '😊',
	},
	{
		value: 5,
		label: 'Отлично',
		icon: SmilePlus,
		color: 'from-primary-500/30 to-primary-600/20',
		borderColor: 'border-primary-400/50',
		emoji: '😄',
	},
]

const UserDashboard = () => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

	const [selectedEmotion, setSelectedEmotion] = useState(null)
	const [note, setNote] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [emotionHistory, setEmotionHistory] = useState([])
	const [loadingHistory, setLoadingHistory] = useState(true)
	const [showHistory, setShowHistory] = useState(false)

	// Загрузка истории эмоций
	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const data = await emotionsAPI.getMyEmotions()
				setEmotionHistory(data)
			} catch (err) {
				console.error('Ошибка загрузки истории:', err)
			} finally {
				setLoadingHistory(false)
			}
		}
		fetchHistory()
	}, [])

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const handleSubmit = async () => {
		if (!selectedEmotion) return

		setLoading(true)
		setSuccess(false)

		try {
			const emotionData = {
				emotion_type: emotions[selectedEmotion - 1].label,
				intensity: selectedEmotion * 2, // Преобразуем 1-5 в 2-10
				note: note.trim() || null,
			}

			const newEmotion = await emotionsAPI.createEmotion(emotionData)
			setEmotionHistory(prev => [newEmotion, ...prev])
			setSuccess(true)
			setSelectedEmotion(null)
			setNote('')

			// Скрываем сообщение об успехе через 3 секунды
			setTimeout(() => setSuccess(false), 3000)
		} catch (err) {
			console.error('Ошибка сохранения:', err)
		} finally {
			setLoading(false)
		}
	}

	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getEmotionEmoji = emotionType => {
		const emotion = emotions.find(e => e.label === emotionType)
		return emotion?.emoji || '😐'
	}

	return (
		<div className='min-h-screen p-4 md:p-8'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<header className='glass-card p-4 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in'>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center'>
							<Heart className='w-6 h-6 text-primary-400' />
						</div>
						<div>
							<h1 className='text-xl font-semibold text-white'>
								Привет, {user?.username || 'Пользователь'}! 👋
							</h1>
							<p className='text-white/60 text-sm'>
								Как ты себя чувствуешь сегодня?
							</p>
						</div>
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={() => setShowHistory(!showHistory)}
							className='glass-button flex items-center gap-2 px-4 py-2'
						>
							<History className='w-5 h-5' />
							<span className='hidden md:inline'>История</span>
						</button>
						<button
							onClick={handleLogout}
							className='glass-button flex items-center gap-2 px-4 py-2 hover:bg-red-500/20'
						>
							<LogOut className='w-5 h-5' />
							<span className='hidden md:inline'>Выйти</span>
						</button>
					</div>
				</header>

				{/* Success Message */}
				{success && (
					<div className='glass-card p-4 mb-6 bg-primary-500/20 border-primary-400/30 flex items-center gap-3 animate-fade-in'>
						<CheckCircle className='w-6 h-6 text-primary-400' />
						<span className='text-white'>Состояние успешно сохранено!</span>
					</div>
				)}

				{/* Main Content */}
				<div className='grid gap-6'>
					{/* Emotion Selector */}
					<div
						className='glass-card p-6 md:p-8 animate-fade-in'
						style={{ animationDelay: '0.1s' }}
					>
						<h2 className='text-xl font-semibold text-white mb-6 text-center'>
							Выберите своё настроение
						</h2>

						{/* Emotion Cards */}
						<div className='grid grid-cols-5 gap-2 md:gap-4 mb-8'>
							{emotions.map(emotion => {
								const Icon = emotion.icon
								const isSelected = selectedEmotion === emotion.value

								return (
									<button
										key={emotion.value}
										onClick={() => setSelectedEmotion(emotion.value)}
										className={`
                      relative p-3 md:p-6 rounded-xl border-2 transition-all duration-300
                      flex flex-col items-center gap-2 md:gap-3
                      ${
												isSelected
													? `bg-gradient-to-br ${emotion.color} ${emotion.borderColor} scale-105 shadow-lg`
													: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
											}
                    `}
									>
										<span className='text-3xl md:text-5xl'>
											{emotion.emoji}
										</span>
										<span
											className={`text-xs md:text-sm text-center ${
												isSelected ? 'text-white' : 'text-white/60'
											}`}
										>
											{emotion.label}
										</span>
										{isSelected && (
											<div className='absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center'>
												<CheckCircle className='w-4 h-4 text-white' />
											</div>
										)}
									</button>
								)
							})}
						</div>

						{/* Note Input */}
						<div className='space-y-4'>
							<label className='flex items-center gap-2 text-white/70'>
								<MessageSquare className='w-5 h-5' />
								Добавьте комментарий (необязательно)
							</label>
							<textarea
								value={note}
								onChange={e => setNote(e.target.value)}
								placeholder='Что повлияло на ваше настроение?'
								rows={3}
								className='glass-input w-full resize-none'
							/>
						</div>

						{/* Submit Button */}
						<button
							onClick={handleSubmit}
							disabled={!selectedEmotion || loading}
							className={`
                glass-button-primary w-full flex items-center justify-center gap-2 mt-6
                ${!selectedEmotion ? 'opacity-50 cursor-not-allowed' : ''}
              `}
						>
							{loading ? (
								<>
									<Loader2 className='w-5 h-5 animate-spin' />
									Сохранение...
								</>
							) : (
								<>
									<Send className='w-5 h-5' />
									Сохранить состояние
								</>
							)}
						</button>
					</div>

					{/* Emotion History */}
					{showHistory && (
						<div className='glass-card p-6 md:p-8 animate-fade-in'>
							<h2 className='text-xl font-semibold text-white mb-6 flex items-center gap-2'>
								<History className='w-6 h-6 text-primary-400' />
								История настроений
							</h2>

							{loadingHistory ? (
								<div className='flex items-center justify-center py-8'>
									<Loader2 className='w-8 h-8 text-primary-400 animate-spin' />
								</div>
							) : emotionHistory.length === 0 ? (
								<p className='text-center text-white/50 py-8'>
									Пока нет записей. Расскажите, как вы себя чувствуете!
								</p>
							) : (
								<div className='space-y-3 max-h-[400px] overflow-y-auto pr-2'>
									{emotionHistory.map((emotion, index) => (
										<div
											key={emotion.id}
											className='bg-white/5 rounded-xl p-4 border border-white/10 animate-fade-in'
											style={{ animationDelay: `${index * 0.05}s` }}
										>
											<div className='flex items-start gap-4'>
												<span className='text-3xl'>
													{getEmotionEmoji(emotion.emotion_type)}
												</span>
												<div className='flex-1'>
													<div className='flex items-center justify-between mb-1'>
														<span className='text-white font-medium'>
															{emotion.emotion_type}
														</span>
														<span className='text-white/40 text-sm flex items-center gap-1'>
															<Calendar className='w-4 h-4' />
															{formatDate(emotion.created_at)}
														</span>
													</div>
													{emotion.note && (
														<p className='text-white/60 text-sm'>
															{emotion.note}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default UserDashboard
