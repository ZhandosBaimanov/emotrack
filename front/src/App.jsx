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
import Resources from './pages/Resources'
import SettingsPage from './pages/Settings'

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

                                                {/* Общие защищенные маршруты */}
                                                <Route
                                                        path='/settings'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['user', 'psychologist']}>
                                                                        <SettingsPage />
                                                                </ProtectedRoute>
                                                        }
                                                />

                                                {/* Защищенные маршруты для пациентов */}
                                                <Route
                                                        path='/dashboard'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['user']}>
                                                                        <PatientDashboard />
                                                                </ProtectedRoute>
                                                        }
                                                />
                                                <Route
                                                        path='/dashboard/resources'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['user']}>
                                                                        <Resources />
                                                                </ProtectedRoute>
                                                        }
                                                />
                                                <Route
                                                        path='/dashboard/chats'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['user']}>
                                                                        <Chats />
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
                                                <Route
                                                        path='/psychologist/resources'
                                                        element={
                                                                <ProtectedRoute allowedRoles={['psychologist']}>
                                                                        <Resources />
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
