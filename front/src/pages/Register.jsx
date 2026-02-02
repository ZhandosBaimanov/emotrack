import {
	AlertCircle,
	Eye,
	EyeOff,
	Heart,
	Loader2,
	Lock,
	Mail,
	Stethoscope,
	User,
	UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation'

const Register = () => {
	const navigate = useNavigate()
	const { register } = useAuth()

	const [formData, setFormData] = useState({
		email: '',
		first_name: '',
		last_name: '',
		password: '',
		role: 'user',
		link_code: '',
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

	const handleRoleChange = role => {
		setFormData(prev => ({
			...prev,
			role,
			link_code: role === 'psychologist' ? '' : prev.link_code,
		}))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const userData = {
				email: formData.email,
				first_name: formData.first_name,
				last_name: formData.last_name,
				password: formData.password,
				role: formData.role,
			}

			// Добавляем код психолога только если он указан и роль - пациент
			if (formData.role === 'user' && formData.link_code.trim()) {
				userData.link_code = formData.link_code.trim()
			}

			const user = await register(userData)

			// Перенаправляем на соответствующий дашборд
			if (user.role === 'psychologist') {
				navigate('/psychologist')
			} else {
				navigate('/dashboard')
			}
		} catch (err) {
			setError(err.message || 'Ошибка регистрации')
		} finally {
			setLoading(false)
		}
	}

	return (
		<BackgroundGradientAnimation
			gradientBackgroundStart='rgb(26, 26, 46)'
			gradientBackgroundEnd='rgb(30, 64, 175)'
			firstColor='109, 40, 217'
			secondColor='139, 92, 246'
			thirdColor='67, 56, 202'
			fourthColor='30, 64, 175'
			fifthColor='196, 167, 231'
			pointerColor='139, 92, 246'
			className='flex items-center justify-center p-4'
		>
			<div className='w-full max-w-md relative z-10'>
				{/* Логотип */}
				<div className='text-center mb-4 animate-fade-in'>
					<div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 mb-3'>
						<Heart className='w-6 h-6 text-primary-400' />
					</div>
					<h1 className='text-2xl font-bold text-white'>Emotrack</h1>
					<p className='text-white/60 mt-1 text-sm'>
						Отслеживание эмоционального состояния
					</p>
				</div>

				{/* Карточка регистрации */}
				<div
					className='glass-card p-6 animate-fade-in'
					style={{ animationDelay: '0.1s' }}
				>
					<h2 className='text-xl font-semibold text-white mb-4 text-center'>
						Создать аккаунт
					</h2>

					{/* Ошибка */}
					{error && (
						<div className='mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2'>
							<AlertCircle className='w-5 h-5 text-red-400' />
							<span className='text-red-200 text-sm'>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-3'>
						{/* Email */}
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Email'
								required
								className='glass-input w-full pl-10 py-2.5'
							/>
						</div>

						{/* First Name */}
						<div className='relative'>
							<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
							<input
								type='text'
								name='first_name'
								value={formData.first_name}
								onChange={handleChange}
								placeholder='Имя'
								required
								className='glass-input w-full pl-10 py-2.5'
							/>
						</div>

						{/* Last Name */}
						<div className='relative'>
							<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
							<input
								type='text'
								name='last_name'
								value={formData.last_name}
								onChange={handleChange}
								placeholder='Фамилия'
								required
								className='glass-input w-full pl-10 py-2.5'
							/>
						</div>

						{/* Password */}
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Пароль'
								required
								minLength={6}
								className='glass-input w-full pl-10 pr-10 py-2.5'
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80'
							>
								{showPassword ? (
									<EyeOff className='w-4 h-4' />
								) : (
									<Eye className='w-4 h-4' />
								)}
							</button>
						</div>

						{/* Role Selector */}
						<div className='space-y-1.5'>
							<label className='text-white/70 text-xs'>Выберите роль:</label>
							<div className='grid grid-cols-2 gap-2'>
								<button
									type='button'
									onClick={() => handleRoleChange('user')}
									className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
										formData.role === 'user'
											? 'bg-primary-500/30 border-primary-400/50 text-white'
											: 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
									}`}
								>
									<Heart className='w-5 h-5' />
									<span className='text-xs font-medium'>Я пациент</span>
								</button>
								<button
									type='button'
									onClick={() => handleRoleChange('psychologist')}
									className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
										formData.role === 'psychologist'
											? 'bg-calm-blue/30 border-calm-blue/50 text-white'
											: 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
									}`}
								>
									<Stethoscope className='w-5 h-5' />
									<span className='text-xs font-medium'>Я психолог</span>
								</button>
							</div>
						</div>

						{/* Conditional Input: Код психолога (только для пациентов) */}
						{formData.role === 'user' && (
							<div className='animate-fade-in'>
								<div className='relative'>
									<UserPlus className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
									<input
										type='text'
										name='link_code'
										value={formData.link_code}
										onChange={handleChange}
										placeholder='Код психолога (необязательно)'
										className='glass-input w-full pl-10 py-2.5'
									/>
								</div>
								<p className='text-white/40 text-[10px] mt-1 ml-1'>
									Введите код, если хотите привязаться к психологу
								</p>
							</div>
						)}

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='glass-button-primary w-full flex items-center justify-center gap-2 mt-4 py-2.5'
						>
							{loading ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									Регистрация...
								</>
							) : (
								<>
									<UserPlus className='w-4 h-4' />
									Зарегистрироваться
								</>
							)}
						</button>
					</form>

					{/* Link to Login */}
					<div className='mt-4 text-center text-sm'>
						<span className='text-white/50'>Уже есть аккаунт? </span>
						<Link
							to='/login'
							className='text-primary-400 hover:text-primary-300 transition-colors'
						>
							Войти
						</Link>
					</div>
				</div>
			</div>
		</BackgroundGradientAnimation>
	)
}

export default Register
