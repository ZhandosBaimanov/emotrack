import { LogOut, Settings, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DashboardHeader = ({ activeTab = 'home' }) => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const tabs = [
		{ id: 'home', label: 'Главная' },
		{ id: 'analytics', label: 'Аналитика' },
		{ id: 'journal', label: 'Журнал' },
	]

	return (
		<header className='glass-card px-6 py-4 mb-6 flex items-center justify-between'>
			<div className='flex items-center gap-8'>
				<h1 className='text-2xl font-light tracking-tight'>
					<span className='text-[#c4a7e7] italic'>EMO</span>
					<span className='text-white'>AI</span>
				</h1>

				<nav className='hidden md:flex items-center gap-1'>
					{tabs.map(tab => (
						<button
							key={tab.id}
							className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
								activeTab === tab.id
									? 'bg-[#8b5cf6]/30 text-white'
									: 'text-white/60 hover:text-white hover:bg-white/10'
							}`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			<div className='flex items-center gap-4'>
				<div className='flex items-center gap-3'>
					<div className='text-right hidden sm:block'>
						<p className='text-white text-sm font-medium'>
							{user?.first_name} {user?.last_name}
						</p>
						<p className='text-white/50 text-xs'>
							{user?.role === 'psychologist' ? 'Психолог' : 'Пациент'}
						</p>
					</div>
					<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
						<User className='w-5 h-5 text-white' />
					</div>
				</div>

				<button
					onClick={handleLogout}
					className='p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all'
					title='Выйти'
				>
					<LogOut className='w-5 h-5' />
				</button>
			</div>
		</header>
	)
}

export default DashboardHeader
