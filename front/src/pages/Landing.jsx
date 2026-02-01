import { Link } from 'react-router-dom'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation'
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
			<section id='how-it-works' className='relative'>
				<BackgroundGradientAnimation
					gradientBackgroundStart='rgb(26, 26, 46)'
					gradientBackgroundEnd='rgb(30, 64, 175)'
					firstColor='109, 40, 217'
					secondColor='139, 92, 246'
					thirdColor='67, 56, 202'
					fourthColor='30, 64, 175'
					fifthColor='196, 167, 231'
					pointerColor='139, 92, 246'
					containerClassName='py-24 px-8 lg:px-16'
					interactive={true}
				>
					<div className='max-w-7xl mx-auto'>
						{/* Section Title */}
						<h2 className='text-[48px] lg:text-[72px] font-bold text-white text-center mb-20 tracking-tight'>
							КАК ЭТО
							<br />
							РАБОТАЕТ?
						</h2>

						{/* Features Grid */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16'>
							{/* Feature 1 */}
							<div className='text-center space-y-6 backdrop-blur-sm bg-white/5 rounded-2xl p-8'>
								<div className='flex justify-center'>
									<span className='text-[48px] font-bold text-white tracking-wider'>
										123
									</span>
								</div>
								<p className='text-white/70 text-sm leading-relaxed'>
									Пользователь получает код приглашения от психолога если он
									есть. Это нужно для дальнейшего отслеживания состояния. Если у
									вас нету кода, то не беспокойтесь. Вы можете выбрать себе
									психолога прямо на нашем сайте.
								</p>
							</div>

							{/* Feature 2 */}
							<div className='text-center space-y-6 backdrop-blur-sm bg-white/5 rounded-2xl p-8'>
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
								<p className='text-white/70 text-sm leading-relaxed'>
									Вы регулярно проходите короткие опросы и отмечаете настроение.
									Система визуализирует эти данные в понятные графики. Это
									помогает вам и вашему специалисту объективно оценить динамику
									терапии.
								</p>
							</div>

							{/* Feature 3 */}
							<div className='text-center space-y-6 backdrop-blur-sm bg-white/5 rounded-2xl p-8'>
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
								<p className='text-white/70 text-sm leading-relaxed'>
									Наш ИИ-ассистент анализирует ваши записи между сессиями. Он
									поможет выявить скрытые триггеры стресса и предложит
									персонализированные техники самопомощи именно в тот момент,
									когда психолог недоступен.
								</p>
							</div>
						</div>
					</div>
				</BackgroundGradientAnimation>
			</section>

			{/* Contact Section */}
			<section
				id='contacts'
				className='relative py-24 px-8 lg:px-16 min-h-screen flex items-center'
			>
				{/* Background Elements */}
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div className='absolute left-[-300px] top-[-200px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#6d28d9]/20 via-[#4338ca]/10 to-transparent blur-[150px]'></div>
					<div className='absolute right-[-400px] bottom-[-300px] w-[900px] h-[900px] rounded-full bg-gradient-to-tl from-[#1e40af]/15 via-[#8b5cf6]/10 to-transparent blur-[200px]'></div>

					{/* Map Background Pattern */}
					<div className='absolute inset-0 opacity-[0.03]'>
						<svg width='100%' height='100%' className='text-white'>
							<defs>
								<pattern
									id='map-pattern'
									x='0'
									y='0'
									width='100'
									height='100'
									patternUnits='userSpaceOnUse'
								>
									<circle cx='50' cy='50' r='1' fill='currentColor' />
									<circle cx='25' cy='25' r='0.5' fill='currentColor' />
									<circle cx='75' cy='75' r='0.5' fill='currentColor' />
									<path
										d='M20,30 Q50,10 80,30'
										stroke='currentColor'
										strokeWidth='0.2'
										fill='none'
									/>
									<path
										d='M30,70 Q50,90 70,70'
										stroke='currentColor'
										strokeWidth='0.2'
										fill='none'
									/>
								</pattern>
							</defs>
							<rect width='100%' height='100%' fill='url(#map-pattern)' />
						</svg>
					</div>
				</div>

				<div className='relative z-10 w-full max-w-7xl mx-auto'>
					{/* Main Title */}
					<div className='text-left mb-16'>
						<h2 className='text-[64px] lg:text-[80px] font-bold text-white tracking-tight leading-none'>
							Связаться с нами<span className='text-[#22c55e]'>.</span>
						</h2>
					</div>

					{/* Content Grid */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
						{/* Left Side - Contact Info */}
						<div className='space-y-12 lg:pr-12'>
							{/* Store Hours */}
							<div className='space-y-4'>
								<h3 className='text-white/60 text-sm uppercase tracking-wider font-medium'>
									Часы работы
								</h3>
								<div className='pl-6 border-l-2 border-[#22c55e] space-y-2'>
									<div className='text-white text-lg font-medium'>
										ул. Флэтбуш 507-495
									</div>
									<div className='text-white/70'>Москва, Россия</div>
									<div className='text-white/70'>109012</div>
								</div>
							</div>

							{/* Contacts */}
							<div className='space-y-4'>
								<h3 className='text-white/60 text-sm uppercase tracking-wider font-medium'>
									Контакты
								</h3>
								<div className='space-y-3'>
									<div className='text-white hover:text-[#22c55e] transition-colors cursor-pointer'>
										support@emotrack.ru
									</div>
									<div className='text-white hover:text-[#22c55e] transition-colors cursor-pointer'>
										+7 800 123 4567
									</div>
								</div>
							</div>

							{/* Social Links */}
							<div className='flex gap-4 pt-8'>
								<a
									href='#'
									className='w-10 h-10 bg-white/5 hover:bg-[#22c55e]/20 rounded-lg flex items-center justify-center transition-colors group'
								>
									<svg
										className='w-5 h-5 text-white/60 group-hover:text-[#22c55e] transition-colors'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
									</svg>
								</a>
								<a
									href='#'
									className='w-10 h-10 bg-white/5 hover:bg-[#22c55e]/20 rounded-lg flex items-center justify-center transition-colors group'
								>
									<svg
										className='w-5 h-5 text-white/60 group-hover:text-[#22c55e] transition-colors'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
									</svg>
								</a>
								<a
									href='#'
									className='w-10 h-10 bg-white/5 hover:bg-[#22c55e]/20 rounded-lg flex items-center justify-center transition-colors group'
								>
									<svg
										className='w-5 h-5 text-white/60 group-hover:text-[#22c55e] transition-colors'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z' />
									</svg>
								</a>
							</div>
						</div>

						{/* Right Side - Contact Form */}
						<div className='lg:pl-8 lg:-mt-32'>
							<div className='bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 border border-[#22c55e]/30 shadow-2xl'>
								<div className='flex items-center justify-between mb-6 pb-4 border-b border-white/10'>
									<h3 className='text-white text-xl font-medium'>
										Форма обратной связи
									</h3>
									<div className='flex gap-2'>
										<div className='w-3 h-3 rounded-full bg-red-500'></div>
										<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
										<div className='w-3 h-3 rounded-full bg-[#22c55e]'></div>
									</div>
								</div>

								<form className='space-y-4'>
									{/* Name Field */}
									<div className='space-y-2'>
										<label className='text-white/60 text-sm uppercase tracking-wider'>
											ИМЯ
										</label>
										<input
											type='text'
											placeholder='Иван'
											className='w-full bg-transparent border-b border-white/20 focus:border-[#22c55e] py-3 text-white placeholder-white/40 transition-colors outline-none'
										/>
									</div>

									{/* Email Field */}
									<div className='space-y-2'>
										<label className='text-white/60 text-sm uppercase tracking-wider'>
											EMAIL
										</label>
										<input
											type='email'
											placeholder='ivan@example.com'
											className='w-full bg-transparent border-b border-white/20 focus:border-[#22c55e] py-3 text-white placeholder-white/40 transition-colors outline-none'
										/>
									</div>

									{/* Message Field */}
									<div className='space-y-2'>
										<label className='text-white/60 text-sm uppercase tracking-wider'>
											СООБЩЕНИЕ
										</label>
										<textarea
											placeholder='Ваше сообщение...'
											rows={4}
											className='w-full bg-transparent border border-white/20 focus:border-[#22c55e] rounded-xl p-4 text-white placeholder-white/40 transition-colors outline-none resize-none'
										></textarea>
									</div>

									{/* Submit Button */}
									<button
										type='submit'
										className='w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-4 rounded-xl font-medium uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#22c55e]/20'
									>
										ОТПРАВИТЬ СООБЩЕНИЕ
									</button>
								</form>
							</div>
						</div>
					</div>

					{/* Copyright */}
					<div className='mt-20 text-center'>
						<p className='text-white/30 text-sm'>© 2026 EmoTrack</p>
					</div>
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
