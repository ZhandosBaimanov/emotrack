import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { availabilityAPI, sessionsAPI } from '../../api/api'

const SessionRequestCalendar = ({ psychologistId, onRequestSubmit }) => {
	const [date, setDate] = useState(new Date())
	const [availableSlots, setAvailableSlots] = useState([])
	const [selectedTime, setSelectedTime] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchSlots = async () => {
			if (!psychologistId) return
			setLoading(true)
			try {
				const dateStr = format(date, 'yyyy-MM-dd')

				// Загружаем доступные времена психолога из доступности
				const availabilityData = await availabilityAPI.getAvailability(
					psychologistId,
					dateStr,
				)

				// Получаем занятые сеансы на эту дату
				const sessionsData = await sessionsAPI.getSlots(psychologistId, dateStr)

				// Из доступности берём только времена, которые не заняты
				const busySlots = sessionsData
					.map(s => s.scheduled_time?.substring(0, 5))
					.filter(Boolean)

				const freeSlots = availabilityData
					.map(slot => slot.available_time.substring(0, 5))
					.filter(slot => !busySlots.includes(slot))

				setAvailableSlots(freeSlots)
			} catch (error) {
				console.error('Error fetching slots:', error)
				// Если доступность не найдена, показываем пустой список
				setAvailableSlots([])
			} finally {
				setLoading(false)
			}
		}

		fetchSlots()
		setSelectedTime(null)
	}, [date, psychologistId])

	const handleDateChange = newDate => {
		setDate(newDate)
	}

	const handleSubmit = () => {
		if (date && selectedTime) {
			onRequestSubmit(date, selectedTime)
		}
	}

	return (
		<div className='flex flex-col gap-6'>
			<style>{`
                .react-calendar {
                    background: transparent;
                    border: none;
                    width: 100%;
                    font-family: inherit;
                }
                .react-calendar__navigation {
                    margin-bottom: 1rem;
                }
                .react-calendar__navigation button {
                    color: white;
                    min-width: 44px;
                    background: none;
                    font-size: 16px;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                .react-calendar__navigation button:disabled {
                    background: transparent !important;
                    color: rgba(255, 255, 255, 0.2);
                }
                .react-calendar__month-view__weekdays {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .react-calendar__month-view__days__day {
                    color: white;
                    font-size: 0.9rem;
                    padding: 8px;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                    color: rgba(255, 255, 255, 0.2);
                    background: transparent !important;
                }
                .react-calendar__month-view__days__day--neighboringMonth:hover {
                    background: transparent !important;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                .react-calendar__tile:disabled {
                    background: transparent !important;
                }
                .react-calendar__tile--now {
                    background: rgba(139, 92, 246, 0.3);
                    border-radius: 8px;
                }
                .react-calendar__tile--now:enabled:hover,
                .react-calendar__tile--now:enabled:focus {
                    background: rgba(139, 92, 246, 0.5);
                }
                .react-calendar__tile--active {
                    background: #8b5cf6 !important;
                    border-radius: 8px;
                    color: white;
                }
            `}</style>

			<div className='bg-white/5 rounded-2xl p-4'>
				<Calendar
					onChange={handleDateChange}
					value={date}
					locale='ru-RU'
					prevLabel={<ChevronLeft className='w-5 h-5' />}
					nextLabel={<ChevronRight className='w-5 h-5' />}
					prev2Label={null}
					next2Label={null}
					minDate={new Date()}
					view='month'
				/>
			</div>

			<div>
				<h4 className='text-white text-sm font-medium mb-3 flex items-center gap-2'>
					<Clock className='w-4 h-4 text-[#8b5cf6]' />
					Доступное время на {format(date, 'd MMMM', { locale: ru })}
				</h4>

				{loading ? (
					<div className='grid grid-cols-3 gap-2 animate-pulse'>
						{[1, 2, 3, 4, 5, 6].map(i => (
							<div key={i} className='h-10 bg-white/10 rounded-xl' />
						))}
					</div>
				) : availableSlots.length > 0 ? (
					<div className='grid grid-cols-3 gap-2'>
						{availableSlots.map(time => (
							<button
								key={time}
								onClick={() => setSelectedTime(time)}
								className={`
                                    py-2 px-3 rounded-xl text-sm font-medium transition-all
                                    ${
																			selectedTime === time
																				? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/25'
																				: 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
																		}
                                `}
							>
								{time}
							</button>
						))}
					</div>
				) : (
					<div className='text-center py-4 text-white/40 text-sm bg-white/5 rounded-xl border border-dashed border-white/10'>
						Нет свободного времени
					</div>
				)}
			</div>

			<button
				onClick={handleSubmit}
				disabled={!selectedTime || !date}
				className={`
                    w-full py-3 px-4 rounded-xl text-sm font-medium transition-all
                    ${
											selectedTime && date
												? 'bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/25'
												: 'bg-white/10 text-white/30 cursor-not-allowed'
										}
                `}
			>
				Отправить запрос
			</button>
		</div>
	)
}

export default SessionRequestCalendar
