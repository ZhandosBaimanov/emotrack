import axios from 'axios'
import { format } from 'date-fns'

// Базовый URL API
const API_BASE_URL = '/api'

// Создаем экземпляр axios
const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Interceptor для добавления токена авторизации
api.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	},
)

// Interceptor для обработки ответов и ошибок
api.interceptors.response.use(
	response => response,
	error => {
		// Если получили 401, удаляем токен и перенаправляем на логин
		if (error.response?.status === 401) {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			window.location.href = '/login'
		}
		return Promise.reject(error)
	},
)

// API функции для аутентификации
export const authAPI = {
	// Регистрация
	register: async userData => {
		const response = await api.post('/auth/register', userData)
		return response.data
	},

	// Логин
	login: async (email, password) => {
		const formData = new URLSearchParams()
		formData.append('username', email)
		formData.append('password', password)

		const response = await api.post('/auth/login', formData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		return response.data
	},

	// Получить текущего пользователя
	getCurrentUser: async () => {
		const response = await api.get('/users/me')
		return response.data
	},
}

// API функции для пользователей
export const usersAPI = {
	// Получить своего психолога (для пациента)
	getMyPsychologist: async () => {
		const response = await api.get('/users/my-psychologist')
		return response.data
	},

	// Получить рекомендуемых психологов
	getRecommendedPsychologists: async () => {
		const response = await api.get('/users/psychologists')
		return response.data
	},

	// Получить статистику эмоций за неделю
	getEmotionStats: async () => {
		const response = await api.get('/users/emotion-stats')
		return response.data
	},
}

// API функции для эмоций
export const emotionsAPI = {
	// Создать запись об эмоции
	createEmotion: async emotionData => {
		const response = await api.post('/emotions/', emotionData)
		return response.data
	},

	// Получить свои эмоции
	getMyEmotions: async (skip = 0, limit = 100) => {
		const response = await api.get(`/emotions/?skip=${skip}&limit=${limit}`)
		return response.data
	},

	// Получить эмоции пациента (для психолога)
	getPatientEmotions: async (patientId, skip = 0, limit = 100) => {
		const response = await api.get(
			`/emotions/patient/${patientId}?skip=${skip}&limit=${limit}`,
		)
		return response.data
	},

	// Получить список пациентов (для психолога)
	getMyPatients: async () => {
		const response = await api.get('/emotions/patients')
		return response.data
	},
}

// API функции для ресурсов
export const resourcesAPI = {
	// Загрузить ресурс (для психолога)
	uploadResource: formData => api.post('/api/resources', formData),

	// Получить мои ресурсы (для психолога)
	getMyResources: () => api.get('/api/resources/psychologist'),

	// Получить ресурсы для пациента
	getPatientResources: () => api.get('/api/resources/patient'),

	// Удалить ресурс (для психолога)
	deleteResource: id => api.delete(`/api/resources/${id}`),

	// Назначить ресурс пациенту (для психолога)
	assignToPatient: (resourceId, patientId) =>
		api.post(`/api/resources/${resourceId}/assign`, { patientId }),

	// Отметить ресурс как прочитанный (для пациента)
	markAsRead: id => api.patch(`/api/resources/${id}/read`),

	// Получить список пациентов (для назначения ресурсов)
	getMyPatients: () => api.get('/users/my-patients'),
}

// API функции для чатов/сообщений
export const messagesAPI = {
	// Получить список пациентов (для психолога)
	getMyPatients: async () => {
		const response = await api.get('/messages/patients')
		return response.data
	},

	// Получить психолога (для пациента)
	getMyTherapist: async () => {
		const response = await api.get('/messages/therapist')
		return response.data
	},

	// Получить историю чата
	getChatHistory: async recipientId => {
		const response = await api.get(`/messages/history/${recipientId}`)
		return response.data
	},

	// Отправить файл
	sendFile: async (file, recipientId) => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('recipient_id', recipientId)

		const response = await api.post('/messages/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	},

	// Получить непрочитанные сообщения
	getUnreadCount: async () => {
		const response = await api.get('/messages/unread-count')
		return response.data
	},
}

// API функции для сеансов
export const sessionsAPI = {
	// Отправить запрос на сеанс
	requestSession: async (psychologistId, date, time, notes) => {
		const response = await api.post('/sessions/request', {
			psychologist_id: psychologistId,
			scheduled_date: format(date, 'yyyy-MM-dd'),
			scheduled_time: time,
			notes
		})
		return response.data
	},

	// Получить мои сеансы
	getMySessions: async () => {
		const response = await api.get('/sessions/my')
		return response.data
	},

	// Получить доступные слоты психолога
	getSlots: async (psychologistId, date) => {
		const response = await api.get(`/sessions/slots/${psychologistId}?date=${date}`)
		return response.data
	},

	// Обновить статус сеанса (для психолога или отмены пациентом)
	updateStatus: async (sessionId, status, reason) => {
		const response = await api.patch(`/sessions/${sessionId}/status`, {
			status,
			notes: reason
		})
		return response.data
	}
}

export default api