import {
	AlertCircle,
	Eye,
	EyeOff,
	Heart,
	Loader2,
	Lock,
	LogIn,
	Mail,
} from 'lucide-react'
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
		<div className='min-h-screen flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Логотип */}
				<div className='text-center mb-8 animate-fade-in'>
					<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4'>
						<Heart className='w-8 h-8 text-primary-400' />
					</div>
					<h1 className='text-3xl font-bold text-white'>Emotrack</h1>
					<p className='text-white/60 mt-2'>
						Отслеживание эмоционального состояния
					</p>
				</div>

				{/* Карточка входа */}
				<div
					className='glass-card p-8 animate-fade-in'
					style={{ animationDelay: '0.1s' }}
				>
					<h2 className='text-2xl font-semibold text-white mb-6 text-center'>
						Вход в аккаунт
					</h2>

					{/* Ошибка */}
					{error && (
						<div className='mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2'>
							<AlertCircle className='w-5 h-5 text-red-400' />
							<span className='text-red-200 text-sm'>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Email */}
						<div className='relative'>
							<Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Email'
								required
								className='glass-input w-full pl-12'
							/>
						</div>

						{/* Password */}
						<div className='relative'>
							<Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Пароль'
								required
								className='glass-input w-full pl-12 pr-12'
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

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='glass-button-primary w-full flex items-center justify-center gap-2 mt-6'
						>
							{loading ? (
								<>
									<Loader2 className='w-5 h-5 animate-spin' />
									Вход...
								</>
							) : (
								<>
									<LogIn className='w-5 h-5' />
									Войти
								</>
							)}
						</button>
					</form>

					{/* Link to Register */}
					<div className='mt-6 text-center'>
						<span className='text-white/50'>Нет аккаунта? </span>
						<Link
							to='/register'
							className='text-primary-400 hover:text-primary-300 transition-colors'
						>
							Зарегистрироваться
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
