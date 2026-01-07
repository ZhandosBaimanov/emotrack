import { Loader2 } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user, loading, isAuthenticated } = useAuth()
	const location = useLocation()

	// Показываем загрузку пока проверяем авторизацию
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='glass-card p-8 flex flex-col items-center gap-4'>
					<Loader2 className='w-10 h-10 text-primary-400 animate-spin' />
					<p className='text-white/70'>Загрузка...</p>
				</div>
			</div>
		)
	}

	// Если не авторизован, редирект на логин
	if (!isAuthenticated()) {
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	// Проверяем роль пользователя
	if (allowedRoles && !allowedRoles.includes(user?.role)) {
		// Перенаправляем на соответствующий дашборд
		if (user?.role === 'psychologist') {
			return <Navigate to='/psychologist' replace />
		}
		return <Navigate to='/dashboard' replace />
	}

	return children
}

export default ProtectedRoute
