import {
        Navigate,
        Route,
        BrowserRouter as Router,
        Routes,
} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import PsychologistDashboard from './pages/PsychologistDashboard'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import Analytics from './pages/Analytics'
import Journal from './pages/Journal'
import Chats from './pages/Chats'

function App() {
        return (
                <AuthProvider>
                        <Router>
                                <div className='min-h-screen'>
                                        <Routes>
                                                {/* Лендинг */}
                                                <Route path='/' element={<Landing />} />

                                                {/* Публичные маршруты */}
                                                <Route path='/login' element={<Login />} />
                                                <Route path='/register' element={<Register />} />

                                                {/* Защищенные маршруты для пациентов */}
                                                <Route
                                                        path='/dashboard'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['user']}>
                                                                        <PatientDashboard />
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
                                                <Route
                                                        path='/psychologist/analytics'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['psychologist']}>
                                                                        <Analytics />
                                                                </ProtectedRoute>
                                                        }
                                                />
                                                <Route
                                                        path='/psychologist/journal'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['psychologist']}>
                                                                        <Journal />
                                                                </ProtectedRoute>
                                                        }
                                                />
                                                <Route
                                                        path='/psychologist/chats'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['psychologist']}>
                                                                        <Chats />
                                                                </ProtectedRoute>
                                                        }
                                                />

                                                {/* Редирект на лендинг для неизвестных маршрутов */}
                                                <Route path='*' element={<Navigate to='/' replace />} />
                                        </Routes>
                                </div>
                        </Router>
                </AuthProvider>
        )
}

export default App
