import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	Calendar,
	ChevronLeft,
	Clock,
	Filter,
	Loader2,
	MessageSquare,
	Search,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotionsAPI } from '../api/api'
import { DashboardHeader } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

const emotionEmojis = {
	'Очень плохо': '😢',
	Плохо: '😟',
	Нормально: '😐',
	Хорошо: '😊',
	Отлично: '😄',
}

const emotionColors = {
	'Очень плохо': '#ef4444',
	Плохо: '#f97316',
	Нормально: '#eab308',
	Хорошо: '#22c55e',
	Отлично: '#8b5cf6',
}

const Journal = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

	const [patients, setPatients] = useState([])
	const [selectedPatient, setSelectedPatient] = useState(null)
	const [patientEmotions, setPatientEmotions] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadingEmotions, setLoadingEmotions] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterEmotion, setFilterEmotion] = useState('all')

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
			const fetchEmotions = async () => {
				setLoadingEmotions(true)
				try {
					const data = await emotionsAPI.getPatientEmotions(selectedPatient.id)
					setPatientEmotions(data)
				} catch (err) {
					console.error('Ошибка загрузки эмоций:', err)
				} finally {
					setLoadingEmotions(false)
				}
			}
			fetchEmotions()
		}
	}, [selectedPatient])

	const formatDateTime = dateString => {
		const date = new Date(dateString)
		return format(date, 'd MMMM yyyy, HH:mm', { locale: ru })
	}

	const filteredEmotions = patientEmotions
		.filter(emotion => {
			// Фильтр по типу эмоции
			if (filterEmotion !== 'all' && emotion.emotion_type !== filterEmotion) {
				return false
			}
			// Поиск по заметке
			if (
				searchQuery &&
				!emotion.note?.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				return false
			}
			return true
		})
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

	return (
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
			<div className='max-w-7xl mx-auto'>
				<DashboardHeader activeTab='journal' />

				<div className='grid md:grid-cols-12 gap-6'>
					{/* Список пациентов */}
					<div className='md:col-span-4 glass-card p-6'>
						<h2 className='text-lg font-semibold text-white mb-4 flex items-center gap-2'>
							<Users className='w-5 h-5 text-[#8b5cf6]' />
							Выберите пациента
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
										<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
											<User className='w-5 h-5 text-white' />
										</div>
										<div className='text-left'>
											<p className='text-white font-medium'>
												{patient.first_name} {patient.last_name}
											</p>
											<p className='text-white/40 text-xs'>{patient.email}</p>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Журнал записей */}
					<div className='md:col-span-8'>
						{!selectedPatient ? (
							<div className='glass-card p-6 flex flex-col items-center justify-center h-full py-12'>
								<MessageSquare className='w-16 h-16 text-white/10 mb-4' />
								<p className='text-white/50 text-center'>
									Выберите пациента для просмотра журнала
								</p>
							</div>
						) : (
							<>
								{/* Заголовок и фильтры */}
								<div className='glass-card p-6 mb-6'>
									<div className='flex items-center justify-between mb-6'>
										<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
											<MessageSquare className='w-5 h-5 text-[#8b5cf6]' />
											Журнал: {selectedPatient.first_name}{' '}
											{selectedPatient.last_name}
										</h2>
										<button
											onClick={() => setSelectedPatient(null)}
											className='text-white/50 hover:text-white flex items-center gap-1'
										>
											<ChevronLeft className='w-4 h-4' />
											<span className='text-sm'>Назад</span>
										</button>
									</div>

									{/* Поиск и фильтр */}
									<div className='grid md:grid-cols-2 gap-4'>
										<div className='relative'>
											<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40' />
											<input
												type='text'
												placeholder='Поиск по заметкам...'
												value={searchQuery}
												onChange={e => setSearchQuery(e.target.value)}
												className='glass-input w-full pl-10'
											/>
										</div>
										<div className='relative'>
											<Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40' />
											<select
												value={filterEmotion}
												onChange={e => setFilterEmotion(e.target.value)}
												className='glass-input w-full pl-10 appearance-none cursor-pointer'
											>
												<option value='all'>Все эмоции</option>
												<option value='Отлично'>😄 Отлично</option>
												<option value='Хорошо'>😊 Хорошо</option>
												<option value='Нормально'>😐 Нормально</option>
												<option value='Плохо'>😟 Плохо</option>
												<option value='Очень плохо'>😢 Очень плохо</option>
											</select>
										</div>
									</div>
								</div>

								{/* Список записей */}
								<div className='glass-card p-6'>
									{loadingEmotions ? (
										<div className='flex items-center justify-center py-12'>
											<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
										</div>
									) : filteredEmotions.length === 0 ? (
										<div className='text-center py-12'>
											<MessageSquare className='w-12 h-12 text-white/10 mx-auto mb-3' />
											<p className='text-white/50'>
												{patientEmotions.length === 0
													? 'У этого пациента пока нет записей'
													: 'Записи не найдены'}
											</p>
										</div>
									) : (
										<div className='space-y-4 max-h-[600px] overflow-y-auto pr-2'>
											{filteredEmotions.map(emotion => (
												<div
													key={emotion.id}
													className='bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300'
												>
													<div className='flex items-start justify-between mb-3'>
														<div className='flex items-center gap-3'>
															<div
																className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl'
																style={{
																	backgroundColor: `${emotionColors[emotion.emotion_type]}20`,
																	border: `2px solid ${emotionColors[emotion.emotion_type]}40`,
																}}
															>
																{emotionEmojis[emotion.emotion_type] || '😐'}
															</div>
															<div>
																<p className='font-semibold text-lg text-white'>
																	{emotion.emotion_type}
																</p>
																<div className='flex items-center gap-3 text-white/40 text-sm mt-1'>
																	<span className='flex items-center gap-1'>
																		<Calendar className='w-3 h-3' />
																		{formatDateTime(emotion.created_at)}
																	</span>
																</div>
															</div>
														</div>
														<div className='text-right'>
															<div className='text-white/50 text-xs mb-1'>
																Интенсивность
															</div>
															<div className='text-2xl font-bold text-white'>
																{emotion.intensity}/10
															</div>
														</div>
													</div>

													{emotion.note && (
														<div className='bg-white/5 rounded-lg p-4 border border-white/5 mt-3'>
															<p className='text-white/60 text-sm leading-relaxed'>
																{emotion.note}
															</p>
														</div>
													)}

													{/* Индикатор интенсивности */}
													<div className='mt-4'>
														<div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
															<div
																className='h-full rounded-full transition-all duration-500'
																style={{
																	width: `${emotion.intensity * 10}%`,
																	backgroundColor:
																		emotionColors[emotion.emotion_type],
																}}
															/>
														</div>
													</div>
												</div>
											))}
										</div>
									)}

									{/* Статистика */}
									{patientEmotions.length > 0 && (
										<div className='mt-6 pt-6 border-t border-white/10'>
											<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
												<div className='text-center'>
													<div className='text-white/50 text-xs mb-1'>
														Всего записей
													</div>
													<div className='text-xl font-bold text-white'>
														{patientEmotions.length}
													</div>
												</div>
												<div className='text-center'>
													<div className='text-white/50 text-xs mb-1'>
														Найдено
													</div>
													<div className='text-xl font-bold text-[#8b5cf6]'>
														{filteredEmotions.length}
													</div>
												</div>
												<div className='text-center'>
													<div className='text-white/50 text-xs mb-1'>
														Средний показатель
													</div>
													<div className='text-xl font-bold text-white'>
														{(
															patientEmotions.reduce(
																(sum, e) => sum + e.intensity,
																0,
															) / patientEmotions.length
														).toFixed(1)}
														/10
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Journal
