import {
	Bell,
	Calendar,
	FolderOpen,
	Home,
	LogOut,
	MessageCircle,
	Settings,
	TrendingUp,
	User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DashboardHeader = ({ activeTab = 'home' }) => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	// Define tabs based on user role
	const tabs =
		user?.role === 'psychologist'
			? [
					{ id: 'home', label: 'Главная', icon: Home },
					{ id: 'analytics', label: 'Аналитика', icon: TrendingUp },
					{ id: 'sessions', label: 'Записи', icon: Calendar },
					{ id: 'resources', label: 'Ресурсы', icon: FolderOpen },
					{ id: 'chat', label: 'Чат', icon: MessageCircle },
				]
			: [
					{ id: 'home', label: 'Главная', icon: Home },
					{ id: 'resources', label: 'Ресурсы', icon: FolderOpen },
					{ id: 'chat', label: 'Чат', icon: MessageCircle },
				]

	return (
		<header className='glass-card px-6 py-4 mb-6 flex items-center justify-between min-h-[80px]'>
			<div className='flex items-center gap-8'>
				{/* Logo */}
				<div className='flex items-center gap-2'>
					<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center'>
						<span className='text-white text-sm font-bold'>E</span>
					</div>
					<h1 className='text-xl font-medium tracking-tight'>
						<span className='text-[#c4a7e7]'>Emo</span>
						<span className='text-white'>AI</span>
					</h1>
				</div>

				{/* Navigation */}
				<nav className='hidden md:flex items-center gap-2'>
					{tabs.map(tab => {
						const Icon = tab.icon
						return (
							<button
								key={tab.id}
								onClick={() => {
									if (user?.role === 'psychologist') {
										if (tab.id === 'home') navigate('/psychologist')
										else if (tab.id === 'analytics')
											navigate('/psychologist/analytics')
										else if (tab.id === 'sessions')
											navigate('/psychologist/sessions')
										else if (tab.id === 'resources')
											navigate('/psychologist/resources')
										else if (tab.id === 'chat') navigate('/psychologist/chats')
									} else {
										if (tab.id === 'home') navigate('/dashboard')
										else if (tab.id === 'resources')
											navigate('/dashboard/resources')
										else if (tab.id === 'chat') navigate('/dashboard/chats')
									}
								}}
								className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
									activeTab === tab.id
										? 'bg-[#8b5cf6]/30 text-white'
										: 'text-white/60 hover:text-white hover:bg-white/10'
								}`}
							>
								<Icon className='w-4 h-4' />
								{tab.label}
							</button>
						)
					})}
				</nav>
			</div>

			{/* User Section */}
			<div className='flex items-center gap-4'>
				<button className='p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all'>
					<Bell className='w-5 h-5' />
				</button>

				<button className='p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all'>
					<Settings className='w-5 h-5' />
				</button>

				<div className='flex items-center gap-3'>
					<div className='text-right hidden sm:block'>
						<p className='text-white text-sm font-medium'>
							{user?.first_name} {user?.last_name}
						</p>
						<p className='text-[#7cb69d] text-xs'>Premium account</p>
					</div>
					<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center ring-2 ring-white/20'>
						<User className='w-5 h-5 text-white' />
					</div>
				</div>

				<button
					onClick={handleLogout}
					className='p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all'
					title='Выйти'
				>
					<LogOut className='w-5 h-5' />
				</button>
			</div>
		</header>
	)
}

export default DashboardHeader
