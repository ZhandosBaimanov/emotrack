import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { emotionsAPI, usersAPI } from '../api/api'
import {
        DashboardHeader,
        EmotionInput,
        MoodTracker,
        RecentJournals,
        SessionCalendar,
        TherapistCard,
        WelcomeCard,
} from '../components/dashboard'

const PatientDashboard = () => {
        const [emotions, setEmotions] = useState([])
        const [psychologist, setPsychologist] = useState(null)
        const [recommendedPsychologists, setRecommendedPsychologists] = useState([])
        const [sessions, setSessions] = useState([])
        const [loading, setLoading] = useState(true)
        const [submitting, setSubmitting] = useState(false)

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
                        } finally {
                                setLoading(false)
                        }
                }

                fetchData()
        }, [])

        const handleEmotionSubmit = async emotionData => {
                setSubmitting(true)
                try {
                        const newEmotion = await emotionsAPI.createEmotion(emotionData)
                        setEmotions(prev => [newEmotion, ...prev])
                } catch (err) {
                        console.error('Error saving emotion:', err)
                } finally {
                        setSubmitting(false)
                }
        }

        if (loading) {
                return (
                        <div className='min-h-screen flex items-center justify-center'>
                                <Loader2 className='w-8 h-8 text-[#8b5cf6] animate-spin' />
                        </div>
                )
        }

        return (
                <div className='min-h-screen p-4 md:p-6 lg:p-8'>
                        <div className='max-w-7xl mx-auto'>
                                <DashboardHeader activeTab='home' />

                                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                                        <div className='lg:col-span-4 space-y-6'>
                                                <WelcomeCard />
                                                <EmotionInput onSubmit={handleEmotionSubmit} loading={submitting} />
                                        </div>

                                        <div className='lg:col-span-4 space-y-6'>
                                                <MoodTracker emotions={emotions} />
                                                <SessionCalendar sessions={sessions} />
                                        </div>

                                        <div className='lg:col-span-4 space-y-6'>
                                                <TherapistCard 
                                                        psychologist={psychologist} 
                                                        recommendedPsychologists={recommendedPsychologists} 
                                                />
                                                <RecentJournals emotions={emotions} />
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

export default PatientDashboard
