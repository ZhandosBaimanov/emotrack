import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { emotionsAPI, usersAPI } from '../api/api'
import {
	AIJournal,
	DashboardHeader,
	MoodTracker,
	SessionCalendar,
	TherapistCard,
} from '../components/dashboard'

const PatientDashboard = () => {
	const [emotions, setEmotions] = useState([])
	const [psychologist, setPsychologist] = useState(null)
	const [recommendedPsychologists, setRecommendedPsychologists] = useState([])
	const [sessions, setSessions] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const emotionsData = await emotionsAPI.getMyEmotions()
				setEmotions(emotionsData)

				try {
					const psychData = await usersAPI.getMyPsychologist()
					setPsychologist(psychData)
				} catch (err) {
					setPsychologist(null)
				}

				try {
					const recommendedData = await usersAPI.getRecommendedPsychologists()
					setRecommendedPsychologists(recommendedData)
				} catch (err) {
					setRecommendedPsychologists([])
				}
			} catch (err) {
				console.error('Error fetching data:', err)
				toast.error('Ошибка загрузки данных')
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const getEmotionType = intensity => {
		if (intensity <= 2) return 'Очень плохо'
		if (intensity <= 4) return 'Плохо'
		if (intensity <= 6) return 'Нормально'
		if (intensity <= 8) return 'Хорошо'
		return 'Отлично'
	}

	const handleAddEmotion = async (intensity, note) => {
		// Проверка частоты записей (опциональное напоминание)
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
		const recentEmotions = emotions.filter(
			e => new Date(e.created_at) > oneHourAgo,
		)

		if (recentEmotions.length >= 3) {
			toast('Вы уже добавили 3 записи за последний час', {
				description: 'Продолжить?',
				duration: 4000,
			})
		}

		const tempId = `temp_${Date.now()}`
		const emotionType = getEmotionType(intensity)

		// Оптимистичное обновление
		const newEmotion = {
			id: tempId,
			emotion_type: emotionType,
			intensity,
			note: note || null,
			created_at: new Date().toISOString(),
			isNew: true, // флаг для highlight
		}

		setEmotions(prev => [newEmotion, ...prev])
		toast.success('Настроение сохранено')

		try {
			// Отправка на сервер
			const savedEmotion = await emotionsAPI.createEmotion({
				emotion_type: emotionType,
				intensity,
				note: note || undefined,
			})

			// Обновление ID после ответа сервера
			setEmotions(prev =>
				prev.map(e => (e.id === tempId ? { ...savedEmotion, isNew: true } : e)),
			)

			// Убираем highlight через 2 секунды
			setTimeout(() => {
				setEmotions(prev =>
					prev.map(e =>
						e.id === savedEmotion.id ? { ...e, isNew: false } : e,
					),
				)
			}, 2000)
		} catch (error) {
			// Откат при ошибке
			setEmotions(prev => prev.filter(e => e.id !== tempId))
			toast.error('Не удалось сохранить настроение')
			console.error('Error creating emotion:', error)
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-[#1a1a2e]'>
				<Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
			</div>
		)
	}

	return (
		<div className='min-h-screen p-4 md:p-6 lg:p-8'>
				<div className='max-w-7xl mx-auto'>
					<DashboardHeader activeTab='home' />

					<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
						<div className='lg:col-span-4 flex flex-col gap-6'>
							<AIJournal />
						</div>

						<div className='lg:col-span-4 flex flex-col gap-6'>
							<MoodTracker emotions={emotions} onAddEmotion={handleAddEmotion} />
							<SessionCalendar sessions={sessions} />
						</div>

						<div className='lg:col-span-4 flex flex-col gap-6'>
							<TherapistCard
								psychologist={psychologist}
								recommendedPsychologists={recommendedPsychologists}
							/>
						</div>
					</div>
				</div>
		</div>
	)
}

export default PatientDashboard
