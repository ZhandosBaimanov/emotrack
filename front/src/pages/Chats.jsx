import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	ChevronLeft,
	Loader2,
	MessageCircle,
	MessageSquare,
	Send,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotionsAPI } from '../api/api'
import { DashboardHeader } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

const Chats = () => {
	const navigate = useNavigate()
	const { user } = useAuth()
	const messagesEndRef = useRef(null)

	const [patients, setPatients] = useState([])
	const [selectedPatient, setSelectedPatient] = useState(null)
	const [loading, setLoading] = useState(true)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const [sending, setSending] = useState(false)

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const data = await emotionsAPI.getMyPatients()
				setPatients(data)
			} catch (err) {
				console.error('Ошибка загрузки пациентов:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchPatients()
	}, [])

	useEffect(() => {
		if (selectedPatient) {
			// В реальном приложении здесь будет загрузка сообщений из API
			// Для демонстрации используем mock данные
			loadMockMessages()
		}
	}, [selectedPatient])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	const loadMockMessages = () => {
		// Mock данные для демонстрации
		const mockMessages = [
			{
				id: 1,
				text: 'Здравствуйте! Как вы себя чувствуете сегодня?',
				sender: 'psychologist',
				timestamp: new Date(Date.now() - 3600000),
			},
			{
				id: 2,
				text: 'Добрый день! Чувствую себя немного лучше, спасибо.',
				sender: 'patient',
				timestamp: new Date(Date.now() - 3000000),
			},
			{
				id: 3,
				text: 'Отлично! Заметили ли вы какие-то изменения после наших последних сеансов?',
				sender: 'psychologist',
				timestamp: new Date(Date.now() - 2400000),
			},
			{
				id: 4,
				text: 'Да, стал легче засыпать и меньше тревожусь по мелочам.',
				sender: 'patient',
				timestamp: new Date(Date.now() - 1800000),
			},
		]
		setMessages(mockMessages)
	}

	const handleSendMessage = async e => {
		e.preventDefault()
		if (!newMessage.trim() || sending) return

		setSending(true)
		try {
			// В реальном приложении здесь будет отправка через API
			const message = {
				id: Date.now(),
				text: newMessage,
				sender: 'psychologist',
				timestamp: new Date(),
			}
			setMessages([...messages, message])
			setNewMessage('')

			// Имитация ответа пациента (для демонстрации)
			setTimeout(() => {
				const autoReply = {
					id: Date.now() + 1,
					text: 'Спасибо за сообщение! Я подумаю над вашим вопросом.',
					sender: 'patient',
					timestamp: new Date(),
				}
				setMessages(prev => [...prev, autoReply])
			}, 2000)
		} catch (err) {
			console.error('Ошибка отправки сообщения:', err)
		} finally {
			setSending(false)
		}
	}

	const formatMessageTime = date => {
		return format(date, 'HH:mm', { locale: ru })
	}

	const formatMessageDate = date => {
		return format(date, 'd MMMM', { locale: ru })
	}

	return (
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<DashboardHeader activeTab='chat' />

				<div className='grid md:grid-cols-12 gap-6'>
					{/* Список пациентов */}
					<div className='md:col-span-4 glass-card p-6'>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							<Users className='w-5 h-5 text-[#8b5cf6]' />
							Чаты с пациентами
						</h2>

						{loading ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
							</div>
						) : patients.length === 0 ? (
							<div className='text-center py-8'>
								<Users className='w-12 h-12 text-white/20 mx-auto mb-3' />
								<p className='text-white/50'>Пока нет пациентов</p>
							</div>
						) : (
							<div className='space-y-2'>
								{patients.map(patient => (
									<button
										key={patient.id}
										onClick={() => setSelectedPatient(patient)}
										className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
											selectedPatient?.id === patient.id
												? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50'
												: 'bg-white/5 border-white/10 hover:bg-white/10'
										}`}
									>
										<div className='relative'>
											<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
												<User className='w-5 h-5 text-white' />
											</div>
											{/* Индикатор онлайн статуса */}
											<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a2e]' />
										</div>
										<div className='text-left flex-1'>
											<p className='text-white font-medium'>
												{patient.first_name} {patient.last_name}
											</p>
											<p className='text-white/40 text-xs truncate'>
												Последнее сообщение...
											</p>
										</div>
										{/* Непрочитанные сообщения */}
										<div className='w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center text-xs text-white font-bold'>
											2
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Окно чата */}
					<div className='md:col-span-8 glass-card flex flex-col' style={{ height: '600px' }}>
						{!selectedPatient ? (
							<div className='flex-1 flex flex-col items-center justify-center p-6'>
								<MessageCircle className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									Выберите пациента для начала общения
								</p>
							</div>
						) : (
							<>
								{/* Заголовок чата */}
								<div className='p-6 border-b border-white/10'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='relative'>
												<div className='w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
													<User className='w-6 h-6 text-white' />
												</div>
												<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a2e]' />
											</div>
											<div>
												<h3 className='text-white font-semibold'>
													{selectedPatient.first_name} {selectedPatient.last_name}
												</h3>
												<p className='text-[#22c55e] text-xs flex items-center gap-1'>
													<span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
													Онлайн
												</p>
											</div>
										</div>
										<button
											onClick={() => setSelectedPatient(null)}
											className='text-white/50 hover:text-white flex items-center gap-1'
										>
											<ChevronLeft className='w-4 h-4' />
											<span className='text-sm'>Назад</span>
										</button>
									</div>
								</div>

								{/* Область сообщений */}
								<div className='flex-1 overflow-y-auto p-6 space-y-4'>
									{messages.map(message => (
										<div
											key={message.id}
											className={`flex ${
												message.sender === 'psychologist'
													? 'justify-end'
													: 'justify-start'
											}`}
										>
											<div
												className={`max-w-[70%] ${
													message.sender === 'psychologist'
														? 'bg-[#8b5cf6]/30 border-[#8b5cf6]/50'
														: 'bg-white/10 border-white/20'
												} border rounded-2xl p-4`}
											>
												<p className='text-white text-sm leading-relaxed'>
													{message.text}
												</p>
												<p className='text-white/40 text-xs mt-2'>
													{formatMessageTime(message.timestamp)}
												</p>
											</div>
										</div>
									))}
									<div ref={messagesEndRef} />
								</div>

								{/* Поле ввода */}
								<div className='p-6 border-t border-white/10'>
									<form onSubmit={handleSendMessage} className='flex gap-3'>
										<input
											type='text'
											value={newMessage}
											onChange={e => setNewMessage(e.target.value)}
											placeholder='Напишите сообщение...'
											className='flex-1 glass-input'
											disabled={sending}
										/>
										<button
											type='submit'
											disabled={!newMessage.trim() || sending}
											className='glass-button px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
										>
											{sending ? (
												<Loader2 className='w-5 h-5 animate-spin' />
											) : (
												<>
													<Send className='w-5 h-5' />
													<span className='hidden md:inline'>Отправить</span>
												</>
											)}
										</button>
									</form>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Chats
