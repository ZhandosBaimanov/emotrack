import { useAuth } from '../../context/AuthContext'

const WelcomeCard = () => {
	const { user } = useAuth()

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Доброе утро'
		if (hour < 18) return 'Добрый день'
		return 'Добрый вечер'
	}

	return (
		<div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] p-6 border border-white/10'>
			<div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-transparent blur-2xl' />
			<div className='absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-[#c4a7e7]/10 to-transparent blur-xl' />
			
			<div className='relative z-10'>
				<div className='flex items-center gap-2 mb-2'>
					<span className='text-2xl'>👋</span>
					<span className='text-white/60 text-sm'>{getGreeting()}</span>
				</div>
				
				<h2 className='text-2xl md:text-3xl font-light text-white mb-2'>
					{user?.first_name || 'Пользователь'}
				</h2>
				
				<p className='text-white/50 text-sm max-w-md'>
					Как вы себя чувствуете сегодня? Отметьте своё настроение, чтобы отслеживать прогресс.
				</p>
			</div>
		</div>
	)
}

export default WelcomeCard
