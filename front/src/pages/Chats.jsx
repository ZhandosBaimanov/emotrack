import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	ChevronLeft,
	FileText,
	Headphones,
	Image,
	Loader2,
	MessageCircle,
	Paperclip,
	Send,
	User,
	Users,
	Video,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messagesAPI } from '../api/api'
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
	const [typingUsers, setTypingUsers] = useState([])
	const [currentFile, setCurrentFile] = useState(null)
	const [uploadingFile, setUploadingFile] = useState(false)

	// WebSocket хук с heartbeat
	const {
		isConnected,
		onlineUsers,
		sendMessage,
		disconnect: disconnectWS,
	} = useWebSocket(user?.id, {
		onMessage: useCallback(
			data => {
				switch (data.type) {
					case 'message':
						setMessages(prev => [...prev, data.message])
						break
					case 'typing':
						if (data.user_id !== user?.id) {
							setTypingUsers(prev => [...prev, data.user_id])
							setTimeout(() => {
								setTypingUsers(prev => prev.filter(id => id !== data.user_id))
							}, 3000)
						}
						break
					case 'read_receipt':
						setMessages(prev =>
							prev.map(msg =>
								msg.id === data.message_id ? { ...msg, is_read: true } : msg,
							),
						)
						break
					default:
						break
				}
			},
			[user?.id],
		),
		onConnect: useCallback(() => {
			console.log('WebSocket connected')
		}, []),
		onDisconnect: useCallback(() => {
			console.log('WebSocket disconnected')
		}, []),
		onError: useCallback(error => {
			console.error('WebSocket error:', error)
		}, []),
	})

	useEffect(() => {
		const initializeChat = async () => {
			try {
				if (user.role === 'psychologist') {
					const data = await messagesAPI.getMyPatients()
					setPatients(data)
				} else if (user.role === 'user') {
					const therapist = await messagesAPI.getMyTherapist()
					if (therapist) {
						setPatients([therapist])
					}
				}
			} catch (err) {
				console.error('Ошибка загрузки пользователей:', err)
			} finally {
				setLoading(false)
			}
		}
		initializeChat()

		// Establish WebSocket connection
		connectWebSocket()

		// Cleanup on unmount
		return () => {
			if (ws.current) {
				ws.current.close()
			}
		}
	}, [])

	useEffect(() => {
		if (selectedPatient) {
			loadChatHistory()
		}
	}, [selectedPatient])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const connectWebSocket = () => {
		const wsUrl = `ws://localhost:8000/api/messages/ws/${user.id}`
		ws.current = new WebSocket(wsUrl)

		ws.current.onopen = () => {
			console.log('WebSocket connected')
		}

		ws.current.onmessage = event => {
			const data = JSON.parse(event.data)

			switch (data.type) {
				case 'message':
					setMessages(prev => [...prev, data.message])
					break
				case 'typing':
					if (data.user_id !== user.id) {
						setTypingUsers(prev => [...prev, data.user_id])
						// Clear typing indicator after delay
						setTimeout(() => {
							setTypingUsers(prev => prev.filter(id => id !== data.user_id))
						}, 3000)
					}
					break
				case 'stop_typing':
					setTypingUsers(prev => prev.filter(id => id !== data.user_id))
					break
				case 'online_status':
					setOnlineUsers(data.online_users)
					break
				case 'read_receipt':
					// Update message read status
					setMessages(prev =>
						prev.map(msg =>
							msg.id === data.message_id ? { ...msg, is_read: true } : msg,
						),
					)
					break
				default:
					break
			}
		}

		ws.current.onerror = error => {
			console.error('WebSocket error:', error)
		}

		ws.current.onclose = () => {
			console.log('WebSocket disconnected')
			// Attempt to reconnect after delay
			setTimeout(connectWebSocket, 3000)
		}
	}

	const loadChatHistory = async () => {
		try {
			let targetUserId = selectedPatient.id
			if (user.role === 'user') {
				// For patient, always chat with their therapist
				targetUserId = selectedPatient.id
			}

			const chatHistory = await messagesAPI.getChatHistory(targetUserId)
			setMessages(chatHistory)
		} catch (err) {
			console.error('Ошибка загрузки истории чата:', err)
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	const handleSendMessage = async e => {
		e.preventDefault()
		if ((!newMessage.trim() && !currentFile) || sending) return

		setSending(true)
		try {
			// Отправляем через WebSocket
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				ws.current.send(
					JSON.stringify({
						type: 'message',
						content: newMessage.trim(),
						recipient_id: selectedPatient.id,
					}),
				)
			}

			if (currentFile) {
				// Handle file upload
				await uploadFile(currentFile, selectedPatient.id)
				setCurrentFile(null)
			}

			setNewMessage('')
		} catch (err) {
			console.error('Ошибка отправки сообщения:', err)
		} finally {
			setSending(false)
		}
	}

	const uploadFile = async (file, recipientId) => {
		try {
			setUploadingFile(true)
			const response = await messagesAPI.sendFile(file, recipientId)
			// Добавляем сообщение с файлом в список
			setMessages(prev => [...prev, response])
		} catch (error) {
			console.error('Ошибка загрузки файла:', error)
		} finally {
			setUploadingFile(false)
		}
	}

	const handleFileSelect = e => {
		const file = e.target.files[0]
		if (file) {
			setCurrentFile(file)
		}
	}

	const removeFile = () => {
		setCurrentFile(null)
	}

	const handleTyping = () => {
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(
				JSON.stringify({
					type: 'typing',
					recipient_id: selectedPatient.id,
				}),
			)
		}
	}

	const stopTyping = () => {
		// Опционально - можно добавить stop typing event
	}

	const formatMessageTime = date => {
		return format(date, 'HH:mm', { locale: ru })
	}

	const formatMessageDate = date => {
		return format(date, 'd MMMM', { locale: ru })
	}

	const isOnline = userId => {
		return onlineUsers.includes(userId)
	}

	return (
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<DashboardHeader activeTab='chat' />

				<div className='grid md:grid-cols-12 gap-6'>
					{/* Список пользователей */}
					<div className='md:col-span-4 glass-card p-6'>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							{user.role === 'psychologist' ? (
								<Users className='w-5 h-5 text-[#8b5cf6]' />
							) : (
								<User className='w-5 h-5 text-[#8b5cf6]' />
							)}
							{user.role === 'psychologist'
								? 'Чаты с пациентами'
								: 'Чаты с психологом'}
						</h2>

						{loading ? (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
							</div>
						) : patients.length === 0 ? (
							<div className='text-center py-8'>
								{user.role === 'psychologist' ? (
									<Users className='w-12 h-12 text-white/20 mx-auto mb-3' />
								) : (
									<User className='w-12 h-12 text-white/20 mx-auto mb-3' />
								)}
								<p className='text-white/50'>
									{user.role === 'psychologist'
										? 'Пока нет пациентов'
										: 'Нет доступных психологов'}
								</p>
							</div>
						) : (
							<div className='space-y-2'>
								{patients.map(patient => (
									<button
										key={patient.id}
										onClick={() => {
											setSelectedPatient(patient)
										}}
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
											<div
												className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1a2e] ${isOnline(patient.id) ? 'bg-green-400' : 'bg-gray-400'}`}
											/>
										</div>
										<div className='text-left flex-1'>
											<p className='text-white font-medium'>
												{patient.first_name} {patient.last_name}
											</p>
											{messages.length > 0 && (
												<p className='text-white/40 text-xs truncate'>
													{messages[messages.length - 1]?.text ||
														'Последнее сообщение...'}
												</p>
											)}
										</div>
										{/* Непрочитанные сообщения */}
										{patient.unread_count > 0 && (
											<div className='w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center text-xs text-white font-bold'>
												{patient.unread_count}
											</div>
										)}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Окно чата */}
					<div
						className='md:col-span-8 glass-card flex flex-col'
						style={{ height: '600px' }}
					>
						{!selectedPatient ? (
							<div className='flex-1 flex flex-col items-center justify-center p-6'>
								<MessageCircle className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									{user.role === 'psychologist'
										? 'Выберите пациента для начала общения'
										: 'Выберите психолога для начала общения'}
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
												<div
													className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1a2e] ${isOnline(selectedPatient.id) ? 'bg-green-400' : 'bg-gray-400'}`}
												/>
											</div>
											<div>
												<h3 className='text-white font-semibold'>
													{selectedPatient.first_name}{' '}
													{selectedPatient.last_name}
												</h3>
												<p
													className={`${isOnline(selectedPatient.id) ? 'text-[#22c55e]' : 'text-gray-400'} text-xs flex items-center gap-1`}
												>
													<span
														className={`w-2 h-2 rounded-full animate-pulse ${isOnline(selectedPatient.id) ? 'bg-green-400' : 'bg-gray-400'}`}
													/>
													{isOnline(selectedPatient.id)
														? 'Онлайн'
														: 'Не в сети'}
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
												message.sender_id === user.id
													? 'justify-end'
													: 'justify-start'
											}`}
										>
											<div
												className={`max-w-[70%] ${
													message.sender_id === user.id
														? 'bg-[#8b5cf6]/30 border-[#8b5cf6]/50'
														: 'bg-white/10 border-white/20'
												} border rounded-2xl p-4 relative`}
											>
												{message.file_url && (
													<a
														href={`http://localhost:8000${message.file_url}`}
														download={message.file_name}
														target='_blank'
														rel='noopener noreferrer'
														className='flex items-center gap-2 mb-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10'
													>
														<FileIcon fileType={message.file_type} />
														<div className='flex-1 min-w-0'>
															<p className='text-white text-sm font-medium truncate'>
																{message.file_name || 'Файл'}
															</p>
															{message.file_size && (
																<p className='text-white/50 text-xs'>
																	{(message.file_size / 1024).toFixed(1)} KB
																</p>
															)}
														</div>
														<span className='text-blue-300 text-xs whitespace-nowrap'>
															Скачать
														</span>
													</a>
												)}
												{message.content && (
													<p className='text-white text-sm leading-relaxed'>
														{message.content}
													</p>
												)}
												<div className='flex justify-between items-center mt-1'>
													<p className='text-white/40 text-xs'>
														{formatMessageTime(new Date(message.timestamp))}
													</p>
													{message.sender_id === user.id && message.is_read && (
														<span className='text-xs text-[#22c55e] ml-2'>
															Прочитано
														</span>
													)}
												</div>
											</div>
										</div>
									))}

									{typingUsers.includes(selectedPatient.id) && (
										<div className='flex justify-start'>
											<div className='bg-white/10 border border-white/20 rounded-2xl p-4 max-w-[70%]'>
												<p className='text-white/60 text-sm italic'>
													печатает...
												</p>
											</div>
										</div>
									)}

									<div ref={messagesEndRef} />
								</div>

								{/* Поле ввода */}
								<div className='p-6 border-t border-white/10'>
									{/* Selected file preview */}
									{currentFile && (
										<div className='flex items-center gap-2 mb-3 p-2 bg-white/10 rounded-lg'>
											<FileIcon fileType={currentFile.type} />
											<span className='text-white text-sm truncate'>
												{currentFile.name}
											</span>
											<span className='text-white/60 text-xs'>
												({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
											</span>
											<button
												onClick={removeFile}
												className='ml-auto text-white/60 hover:text-white'
											>
												<X className='w-4 h-4' />
											</button>
										</div>
									)}

									<form onSubmit={handleSendMessage} className='flex gap-3'>
										<div className='relative'>
											<input
												type='file'
												id='file-upload'
												className='hidden'
												onChange={handleFileSelect}
												accept='image/*,application/pdf,text/plain,audio/*,video/*'
											/>
											<label
												htmlFor='file-upload'
												className='cursor-pointer glass-button p-2 flex items-center'
											>
												<Paperclip className='w-5 h-5' />
											</label>
										</div>

										<input
											type='text'
											value={newMessage}
											onChange={e => {
												setNewMessage(e.target.value)
												if (e.target.value.trim()) {
													handleTyping()
												} else {
													stopTyping()
												}
											}}
											onKeyDown={() => handleTyping()}
											onBlur={stopTyping}
											placeholder='Напишите сообщение...'
											className='flex-1 glass-input'
											disabled={sending}
										/>
										<button
											type='submit'
											disabled={
												(!newMessage.trim() && !currentFile) ||
												sending ||
												uploadingFile
											}
											className='glass-button px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
										>
											{sending || uploadingFile ? (
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

// Helper component to render file icons based on file type
const FileIcon = ({ fileType }) => {
	if (fileType === 'image') return <Image className='w-4 h-4' />
	if (fileType === 'video') return <Video className='w-4 h-4' />
	if (fileType === 'audio') return <Headphones className='w-4 h-4' />
	if (fileType === 'pdf') return <FileText className='w-4 h-4 text-red-400' />
	return <FileText className='w-4 h-4' />
}

export default Chats
