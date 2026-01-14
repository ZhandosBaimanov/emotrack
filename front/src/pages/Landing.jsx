import { Link } from 'react-router-dom'
import { HoverBorderGradient } from '../components/ui/hover-border-gradient'
import { WavyBackground } from '../components/ui/wavy-background'

function Landing() {
	return (
		<div className='min-h-screen bg-[#1a1a2e] overflow-hidden'>
			{/* Hero Section */}
			<section className='relative min-h-screen flex flex-col'>
				{/* Wavy Background */}
				<WavyBackground
					className='w-full h-full'
					containerClassName='absolute inset-0'
					colors={['#1e40af', '#4338ca', '#6d28d9', '#7c3aed', '#8b5cf6']}
					waveWidth={50}
					backgroundFill='#1a1a2e'
					blur={10}
					speed='slow'
					waveOpacity={0.5}
				/>

				{/* Navigation */}
				<nav className='relative z-10 flex items-center justify-between px-8 lg:px-16 py-6'>
					<div className='text-white font-semibold text-lg'></div>
					<div className='flex items-center gap-8'>
						<a
							href='#how-it-works'
							className='text-white/70 hover:text-white transition-colors text-sm tracking-wide'
						>
							Как это работает?
						</a>
						<a
							href='#contacts'
							className='text-white/70 hover:text-white transition-colors text-sm tracking-wide'
						>
							Контакты
						</a>
						<Link
							to='/login'
							className='border border-white/30 rounded-full px-6 py-2 text-white text-sm hover:bg-white/10 transition-all'
						>
							Личный кабинет
						</Link>
					</div>
				</nav>

				{/* Hero Content */}
				<div className='relative z-10 flex-1 flex items-center px-8 lg:px-16'>
					<div className='w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
						{/* Left side - Text */}
						<div className='space-y-8'>
							{/* Logo/Title */}
							<h1 className='text-[80px] lg:text-[120px] font-light tracking-tight leading-none'>
								<span className='text-[#c4a7e7] italic'>EMO</span>
								<span className='text-white'>TRACK</span>
							</h1>

							{/* Description */}
							<p className='text-white/60 text-sm leading-relaxed max-w-md uppercase tracking-wider'>
								EMOTRACK помогает отслеживать настроение, выявлять скрытые
								триггеры стресса и находить баланс в суете дней. Твой личный
								помощник по ментальному здоровью всегда под рукой.
							</p>

							{/* CTA Button */}
							<Link to='/register' className='mt-8'>
								<HoverBorderGradient
									containerClassName='rounded-full'
									as='div'
									className='bg-[#1a1a2e] text-white flex items-center space-x-2'
								>
									<span>Попробовать бесплатно</span>
								</HoverBorderGradient>
							</Link>
						</div>

						{/* Right side - Chart */}
						<div className='hidden lg:flex justify-center items-center'>
							<div className='relative w-full max-w-md'>
								{/* Chart SVG */}
								<svg
									viewBox='0 0 400 200'
									className='w-full h-auto'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									{/* Chart line */}
									<path
										d='M 20 150 L 60 120 L 100 140 L 140 80 L 180 100 L 220 60 L 260 90 L 300 40 L 340 70 L 380 30'
										stroke='white'
										strokeWidth='2'
										fill='none'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									{/* Baseline */}
									<line
										x1='20'
										y1='180'
										x2='380'
										y2='180'
										stroke='white'
										strokeWidth='1'
										opacity='0.3'
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className='relative z-10 flex justify-center pb-8'>
					<div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2'>
						<div className='w-1 h-2 bg-white/50 rounded-full animate-bounce'></div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section id='how-it-works' className='relative py-24 px-8 lg:px-16'>
				{/* Background decorations */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div className='absolute left-[-300px] bottom-[-200px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#1e40af] via-[#4338ca] to-[#6d28d9] blur-[120px] opacity-40'></div>
				</div>

				<div className='relative z-10 max-w-7xl mx-auto'>
					{/* Section Title */}
					<h2 className='text-[48px] lg:text-[72px] font-bold text-white text-center mb-20 tracking-tight'>
						КАК ЭТО
						<br />
						РАБОТАЕТ?
					</h2>

					{/* Features Grid */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16'>
						{/* Feature 1 */}
						<div className='text-center space-y-6'>
							<div className='flex justify-center'>
								<span className='text-[48px] font-bold text-white tracking-wider'>
									123
								</span>
							</div>
							<p className='text-white/60 text-xs leading-relaxed uppercase tracking-wider'>
								Пользователь получает код приглашения от психолога если он есть.
								Это нужно для дальнейшего отслеживания состояния. Если у вас
								нету кода, то не беспокойтесь. Вы можете выбрать себе психолога
								прямо на нашем сайте.
							</p>
						</div>

						{/* Feature 2 */}
						<div className='text-center space-y-6'>
							<div className='flex justify-center'>
								<svg
									className='w-12 h-12 text-white'
									viewBox='0 0 48 48'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<rect
										x='4'
										y='8'
										width='40'
										height='32'
										rx='4'
										stroke='currentColor'
										strokeWidth='2'
									/>
									<path
										d='M12 28L18 22L24 28L36 16'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<circle cx='36' cy='16' r='3' fill='currentColor' />
								</svg>
							</div>
							<p className='text-white/60 text-xs leading-relaxed uppercase tracking-wider'>
								Вы регулярно проходите короткие опросы и отмечаете настроение.
								Система визуализирует эти данные в понятные графики. Это
								помогает вам и вашему специалисту объективно оценить динамику
								терапии.
							</p>
						</div>

						{/* Feature 3 */}
						<div className='text-center space-y-6'>
							<div className='flex justify-center'>
								<svg
									className='w-12 h-12 text-white'
									viewBox='0 0 48 48'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<rect
										x='8'
										y='8'
										width='32'
										height='24'
										rx='4'
										stroke='currentColor'
										strokeWidth='2'
									/>
									<circle cx='18' cy='18' r='2' fill='currentColor' />
									<circle cx='30' cy='18' r='2' fill='currentColor' />
									<path
										d='M18 24H30'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
									/>
									<path
										d='M16 32V36'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
									/>
									<path
										d='M32 32V36'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
									/>
									<path
										d='M12 36H20'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
									/>
									<path
										d='M28 36H36'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
									/>
								</svg>
							</div>
							<p className='text-white/60 text-xs leading-relaxed uppercase tracking-wider'>
								Наш ИИ-ассистент анализирует ваши записи между сессиями. Он
								поможет выявить скрытые триггеры стресса и предложит
								персонализированные техники самопомощи именно в тот момент,
								когда психолог недоступен.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id='contacts' className='relative py-24 px-8 lg:px-16'>
				<div className='relative z-10 max-w-4xl mx-auto text-center'>
					<h2 className='text-[36px] lg:text-[48px] font-bold text-white mb-8'>
						Контакты
					</h2>
					<p className='text-white/60 text-sm mb-8'>
						Есть вопросы? Свяжитесь с нами
					</p>
					<a
						href='mailto:support@emotrack.ru'
						className='text-white/80 hover:text-white transition-colors text-lg'
					>
						support@emotrack.ru
					</a>
				</div>
			</section>

			{/* Footer */}
			<footer className='relative py-8 px-8 lg:px-16 border-t border-white/10'>
				<div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
					<div className='text-white/40 text-sm'>
						© 2026 EMOTRACK. Все права защищены.
					</div>
					<div className='flex gap-6'>
						<a
							href='#'
							className='text-white/40 hover:text-white/60 transition-colors text-sm'
						>
							Политика конфиденциальности
						</a>
						<a
							href='#'
							className='text-white/40 hover:text-white/60 transition-colors text-sm'
						>
							Условия использования
						</a>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default Landing
