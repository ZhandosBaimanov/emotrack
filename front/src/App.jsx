import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import PsychologistDashboard from './pages/PsychologistDashboard'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className='min-h-screen'>
					<Routes>
						{/* Публичные маршруты */}
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />

						{/* Защищенные маршруты для пациентов */}
						<Route
							path='/dashboard'
							element={
								<ProtectedRoute allowedRoles={['user']}>
									<UserDashboard />
								</ProtectedRoute>
							}
						/>

						{/* Защищенные маршруты для психологов */}
						<Route
							path='/psychologist'
							element={
								<ProtectedRoute allowedRoles={['psychologist']}>
									<PsychologistDashboard />
								</ProtectedRoute>
							}
						/>

						{/* Редирект на логин по умолчанию */}
						<Route path='/' element={<Navigate to='/login' replace />} />
						<Route path='*' element={<Navigate to='/login' replace />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App
