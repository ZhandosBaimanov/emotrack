import { useAuth } from '../../context/AuthContext'

const WelcomeCard = () => {
	const { user } = useAuth()

	return (
		<div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] p-8 border border-white/10'>
			{/* Decorative gradient blob - top right */}
			<div className='absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-transparent blur-2xl' />

			{/* Decorative gradient blob - bottom left */}
			<div className='absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-[#c4a7e7]/10 to-transparent blur-xl' />

			{/* Animated orb */}
			<div className='absolute -top-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#7cb69d]/30 via-[#6b9ac4]/20 to-transparent blur-md animate-pulse' />

			<div className='relative z-10'>
				<h2 className='text-3xl md:text-4xl font-light text-white mb-3'>
					Не волнуйтесь 👋
				</h2>

				<p className='text-white/60 text-base md:text-lg font-light'>
					AI Журнал слушает вас...
				</p>
			</div>
		</div>
	)
}

export default WelcomeCard
