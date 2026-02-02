import { AlertCircle, Eye, EyeOff, Heart, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const [rememberMe, setRememberMe] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
		setError('')
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const user = await login(formData.email, formData.password)

			// Перенаправляем на соответствующий дашборд
			if (user.role === 'psychologist') {
				navigate('/psychologist')
			} else {
				navigate('/dashboard')
			}
		} catch (err) {
			setError(err.message || 'Неверный email или пароль')
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className='min-h-screen relative flex items-center justify-center'>
			{/* Background Circles */}
			<div className='pointer-events-none absolute inset-0 right-0 overflow-hidden hidden md:block'>
				{/* Outer big circle */}
				<div className='absolute left-1/1 top-0 h-[2600px] w-[2600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10' />
				{/* Inner circle */}
				<div className='absolute left-1/1 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0f]' />
			</div>

			<div className='py-4 md:py-8 max-w-lg px-4 sm:px-0 mx-auto w-full'>
				{/* Card */}
				<div className='glass-card max-w-lg px-6 py-6 sm:px-8 sm:py-8 relative'>
					{/* Header */}
					<div className='text-center gap-4 p-0 mb-6'>
						<div className='mx-auto mb-4'>
							<div className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500/20'>
								<Heart className='w-6 h-6 text-primary-400' />
							</div>
						</div>
						<div className='flex flex-col gap-1'>
							<h1 className='text-xl font-medium text-white'>
								Добро пожаловать в Emotrack
							</h1>
							<p className='text-sm text-white/50 font-normal'>
								Войдите в свой аккаунт
							</p>
						</div>
					</div>

					{/* Content */}
					<div className='p-0'>
						<form onSubmit={handleSubmit}>
							<div className='flex flex-col gap-4'>
								{/* Google Sign In Button */}
								<button
									type='button'
									className='glass-button w-full text-sm font-medium text-white gap-2 rounded-lg flex items-center justify-center py-2.5'
								>
									<svg className='h-4 w-4' viewBox='0 0 24 24'>
										<path
											fill='#4285F4'
											d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
										/>
										<path
											fill='#34A853'
											d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
										/>
										<path
											fill='#FBBC05'
											d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
										/>
										<path
											fill='#EA4335'
											d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
										/>
									</svg>
									Войти через Google
								</button>

								{/* Separator */}
								<div className='relative'>
									<div className='absolute inset-0 flex items-center'>
										<div className='w-full border-t border-white/10'></div>
									</div>
									<div className='relative flex justify-center text-sm'>
										<span className='px-4 bg-[#1a1a2e] text-white/50'>
											или войдите с помощью
										</span>
									</div>
								</div>

								{/* Error Message */}
								{error && (
									<div className='p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2'>
										<AlertCircle className='w-5 h-5 text-red-400' />
										<span className='text-red-200 text-sm'>{error}</span>
									</div>
								)}

								{/* Email & Password Fields */}
								<div className='flex flex-col gap-3'>
									{/* Email */}
									<div className='flex flex-col gap-1.5'>
										<label
											htmlFor='email'
											className='text-sm text-white/50 font-normal'
										>
											Email*
										</label>
										<input
											id='email'
											type='email'
											name='email'
											value={formData.email}
											onChange={handleChange}
											placeholder='example@emotrack.ru'
											autoComplete='email'
											required
											className='glass-input w-full'
										/>
									</div>

									{/* Password */}
									<div className='flex flex-col gap-1.5'>
										<label
											htmlFor='password'
											className='text-sm text-white/50 font-normal'
										>
											Пароль*
										</label>
										<div className='relative'>
											<input
												id='password'
												type={showPassword ? 'text' : 'password'}
												name='password'
												value={formData.password}
												onChange={handleChange}
												placeholder='Введите ваш пароль'
												autoComplete='current-password'
												required
												className='glass-input w-full pr-12'
											/>
											<button
												type='button'
												onClick={() => setShowPassword(!showPassword)}
												className='absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80'
											>
												{showPassword ? (
													<EyeOff className='w-5 h-5' />
												) : (
													<Eye className='w-5 h-5' />
												)}
											</button>
										</div>
									</div>
								</div>

								{/* Remember & Forgot */}
								<div className='flex flex-row items-center justify-between w-full'>
									<div className='flex items-center gap-3'>
										<input
											type='checkbox'
											id='remember'
											checked={rememberMe}
											onChange={e => setRememberMe(e.target.checked)}
											className='w-4 h-4 rounded border-white/20 bg-transparent cursor-pointer'
										/>
										<label
											htmlFor='remember'
											className='text-sm text-white font-normal cursor-pointer'
										>
											Запомнить устройство
										</label>
									</div>
									<a
										href='#'
										className='text-sm text-white font-medium text-end hover:text-primary-400 transition-colors'
									>
										Забыли пароль?
									</a>
								</div>

								{/* Submit Button */}
								<div className='flex flex-col gap-3'>
									<button
										type='submit'
										disabled={loading}
										className='glass-button-primary w-full py-2.5 rounded-lg flex items-center justify-center gap-2'
									>
										{loading ? (
											<>
												<Loader2 className='w-5 h-5 animate-spin' />
												Вход...
											</>
										) : (
											'Войти'
										)}
									</button>
									<p className='text-center text-sm font-normal text-white/50'>
										Нет аккаунта?{' '}
										<Link
											to='/register'
											className='font-medium text-white hover:text-primary-400 transition-colors'
										>
											Создать аккаунт
										</Link>
									</p>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Login
