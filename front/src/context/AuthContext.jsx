import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../api/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Проверяем авторизацию при загрузке
	useEffect(() => {
		const initAuth = async () => {
			const token = localStorage.getItem('token')
			const savedUser = localStorage.getItem('user')

			if (token && savedUser) {
				try {
					// Проверяем валидность токена
					const userData = await authAPI.getCurrentUser()
					setUser(userData)
					localStorage.setItem('user', JSON.stringify(userData))
				} catch (err) {
					// Токен невалидный, очищаем
					localStorage.removeItem('token')
					localStorage.removeItem('user')
					setUser(null)
				}
			}
			setLoading(false)
		}

		initAuth()
	}, [])

	// Регистрация
	const register = async userData => {
		try {
			setError(null)
			// Сначала регистрируемся
			await authAPI.register(userData)

			// Затем логинимся для получения токена
			const tokenData = await authAPI.login(userData.email, userData.password)
			localStorage.setItem('token', tokenData.access_token)

			// Получаем данные пользователя
			const currentUser = await authAPI.getCurrentUser()
			setUser(currentUser)
			localStorage.setItem('user', JSON.stringify(currentUser))

			return currentUser
		} catch (err) {
			const errorMessage = err.response?.data?.detail || 'Ошибка регистрации'
			setError(errorMessage)
			throw new Error(errorMessage)
		}
	}

	// Вход
	const login = async (email, password) => {
		try {
			setError(null)
			const tokenData = await authAPI.login(email, password)
			localStorage.setItem('token', tokenData.access_token)

			// Получаем данные пользователя
			const currentUser = await authAPI.getCurrentUser()
			setUser(currentUser)
			localStorage.setItem('user', JSON.stringify(currentUser))

			return currentUser
		} catch (err) {
			const errorMessage =
				err.response?.data?.detail || 'Неверный email или пароль'
			setError(errorMessage)
			throw new Error(errorMessage)
		}
	}

	// Выход
	const logout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setUser(null)
	}

	// Проверка авторизации
	const isAuthenticated = () => {
		return !!localStorage.getItem('token') && !!user
	}

	const value = {
		user,
		loading,
		error,
		register,
		login,
		logout,
		isAuthenticated,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export default AuthContext
