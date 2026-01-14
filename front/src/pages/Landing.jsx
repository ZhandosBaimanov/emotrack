import { Link } from 'react-router-dom'
import { HoverBorderGradient } from '../components/ui/hover-border-gradient'
import { WavyBackground } from '../components/ui/wavy-background'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation'

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
                                                                        Пользователь получает код приглашения от психолога если он есть.
                                                                        Это нужно для дальнейшего отслеживания состояния. Если у вас
                                                                        нету кода, то не беспокойтесь. Вы можете выбрать себе психолога
                                                                        прямо на нашем сайте.
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
                        <section id='contacts' className='relative py-24 px-8 lg:px-16'>
                                <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                                        <div className='absolute right-[-200px] top-[-100px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6d28d9] via-[#4338ca] to-[#1e40af] blur-[150px] opacity-30'></div>
                                </div>
                                
                                <div className='relative z-10 max-w-6xl mx-auto'>
                                        <h2 className='text-[48px] lg:text-[64px] font-bold text-white text-center mb-16 tracking-tight'>
                                                КОНТАКТЫ
                                        </h2>
                                        
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                                {/* Email Card */}
                                                <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] p-8 border border-white/10 hover:border-[#8b5cf6]/50 transition-all duration-300'>
                                                        <div className='absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                                        <div className='relative z-10'>
                                                                <div className='w-14 h-14 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center mb-6'>
                                                                        <svg className='w-7 h-7 text-[#c4a7e7]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                                                        </svg>
                                                                </div>
                                                                <h3 className='text-white text-xl font-semibold mb-2'>Email</h3>
                                                                <p className='text-white/50 text-sm mb-4'>Напишите нам</p>
                                                                <a href='mailto:support@emotrack.ru' className='text-[#c4a7e7] hover:text-white transition-colors font-medium'>
                                                                        support@emotrack.ru
                                                                </a>
                                                        </div>
                                                </div>

                                                {/* Telegram Card */}
                                                <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] p-8 border border-white/10 hover:border-[#8b5cf6]/50 transition-all duration-300'>
                                                        <div className='absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                                        <div className='relative z-10'>
                                                                <div className='w-14 h-14 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center mb-6'>
                                                                        <svg className='w-7 h-7 text-[#c4a7e7]' fill='currentColor' viewBox='0 0 24 24'>
                                                                                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z'/>
                                                                        </svg>
                                                                </div>
                                                                <h3 className='text-white text-xl font-semibold mb-2'>Telegram</h3>
                                                                <p className='text-white/50 text-sm mb-4'>Быстрая связь</p>
                                                                <a href='https://t.me/emotrack_support' target='_blank' rel='noopener noreferrer' className='text-[#c4a7e7] hover:text-white transition-colors font-medium'>
                                                                        @emotrack_support
                                                                </a>
                                                        </div>
                                                </div>

                                                {/* Location Card */}
                                                <div className='group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] p-8 border border-white/10 hover:border-[#8b5cf6]/50 transition-all duration-300'>
                                                        <div className='absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                                        <div className='relative z-10'>
                                                                <div className='w-14 h-14 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center mb-6'>
                                                                        <svg className='w-7 h-7 text-[#c4a7e7]' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                                                        </svg>
                                                                </div>
                                                                <h3 className='text-white text-xl font-semibold mb-2'>Офис</h3>
                                                                <p className='text-white/50 text-sm mb-4'>Наш адрес</p>
                                                                <span className='text-[#c4a7e7] font-medium'>
                                                                        Москва, Россия
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Bottom CTA */}
                                        <div className='mt-16 text-center'>
                                                <p className='text-white/60 text-lg mb-6'>
                                                        Готовы начать путь к ментальному благополучию?
                                                </p>
                                                <Link to='/register'>
                                                        <HoverBorderGradient
                                                                containerClassName='rounded-full'
                                                                as='div'
                                                                className='bg-[#1a1a2e] text-white flex items-center space-x-2'
                                                        >
                                                                <span>Начать бесплатно</span>
                                                        </HoverBorderGradient>
                                                </Link>
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
