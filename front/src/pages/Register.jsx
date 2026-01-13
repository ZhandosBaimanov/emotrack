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

				{/* Карточка регистрации */}
				<div
					className='glass-card p-8 animate-fade-in'
					style={{ animationDelay: '0.1s' }}
				>
					<h2 className='text-2xl font-semibold text-white mb-6 text-center'>
						Создать аккаунт
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

						{/* First Name */}
						<div className='relative'>
							<User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
							<input
								type='text'
								name='first_name'
								value={formData.first_name}
								onChange={handleChange}
								placeholder='Имя'
								required
								className='glass-input w-full pl-12'
							/>
						</div>

						{/* Last Name */}
						<div className='relative'>
							<User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
							<input
								type='text'
								name='last_name'
								value={formData.last_name}
								onChange={handleChange}
								placeholder='Фамилия'
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
								minLength={6}
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

						{/* Role Selector */}
						<div className='space-y-2'>
							<label className='text-white/70 text-sm'>Выберите роль:</label>
							<div className='grid grid-cols-2 gap-3'>
								<button
									type='button'
									onClick={() => handleRoleChange('user')}
									className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
										formData.role === 'user'
											? 'bg-primary-500/30 border-primary-400/50 text-white'
											: 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
									}`}
								>
									<Heart className='w-6 h-6' />
									<span className='text-sm font-medium'>Я пациент</span>
								</button>
								<button
									type='button'
									onClick={() => handleRoleChange('psychologist')}
									className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
										formData.role === 'psychologist'
											? 'bg-calm-blue/30 border-calm-blue/50 text-white'
											: 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
									}`}
								>
									<Stethoscope className='w-6 h-6' />
									<span className='text-sm font-medium'>Я психолог</span>
								</button>
							</div>
						</div>

						{/* Conditional Input: Код психолога (только для пациентов) */}
						{formData.role === 'user' && (
							<div className='animate-fade-in'>
								<div className='relative'>
									<UserPlus className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
									<input
										type='text'
										name='link_code'
										value={formData.link_code}
										onChange={handleChange}
										placeholder='Код психолога (необязательно)'
										className='glass-input w-full pl-12'
									/>
								</div>
								<p className='text-white/40 text-xs mt-2 ml-1'>
									Введите код, если хотите привязаться к психологу
								</p>
							</div>
						)}

						{/* Submit Button */}
						<button
							type='submit'
							disabled={loading}
							className='glass-button-primary w-full flex items-center justify-center gap-2 mt-6'
						>
							{loading ? (
								<>
									<Loader2 className='w-5 h-5 animate-spin' />
									Регистрация...
								</>
							) : (
								<>
									<UserPlus className='w-5 h-5' />
									Зарегистрироваться
								</>
							)}
						</button>
					</form>

					{/* Link to Login */}
					<div className='mt-6 text-center'>
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
		</div>
	)
}

export default Register
