import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { authAPI } from '../api/api'
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Palette, 
  Settings, 
  LogOut, 
  Upload, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Loader2,
  CheckCircle,
  Bell,
  CreditCard,
  Shield,
  Users,
  UserCog
} from 'lucide-react'

import ConfirmationModal from '../components/ui/ConfirmationModal'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)

  // Tab State
  const [activeTab, setActiveTab] = useState('general')
  
  // UI States
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // User Profile States
  const [avatar, setAvatar] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')

  // Contacts States
  const [editingContacts, setEditingContacts] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Social States
  const [editingSocial, setEditingSocial] = useState(false)
  const [linkedin, setLinkedin] = useState('')
  const [dribbble, setDribbble] = useState('')

  // Language & Currency States
  const [language, setLanguage] = useState('Русский')
  const [currency, setCurrency] = useState('RUB')
  const [editingLocale, setEditingLocale] = useState(false)

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  // Integration State
  const [connected, setConnected] = useState(false)

  // Initialize data from user object
  useEffect(() => {
    if (user) {
      setAvatar(user.avatar_url || null)
      setName(user.username || '')
      setPhone(user.phone || '')
      setEmail(user.email || '')
      setLinkedin(user.social_links?.linkedin || '')
      setDribbble(user.social_links?.dribbble || '')
      setLanguage(user.language || 'Русский')
      setCurrency(user.currency || 'RUB')
      setConnected(user.integrations_connected || false)
    }
  }, [user])

  // Toast notification helper
  const showSuccess = (msg) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const showError = (msg) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(''), 3000)
  }

  // Handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Assuming existing API structure, or adding a new endpoint usage as requested
      // Since the requirement is specific: DELETE /api/users/me/avatar
      // For upload, usually POST/PATCH to same or similar endpoint
      // Using generic api call pattern as requested
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setAvatar(response.data.avatar_url)
      showSuccess('Аватар обновлен')
    } catch (err) {
      console.error(err)
      showError('Ошибка загрузки аватара')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAvatar = () => {
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteAvatar = async () => {
    try {
      await api.delete('/users/me/avatar')
      setAvatar(null)
      showSuccess('Аватар удален')
    } catch (err) {
      console.error(err)
      showError('Ошибка удаления аватара')
    }
  }

  const handleSaveName = async () => {
    if (!name.trim()) {
      showError('Имя не может быть пустым')
      return
    }

    try {
      await api.patch('/users/me', { username: name })
      setEditingName(false)
      showSuccess('Имя обновлено')
    } catch (err) {
      console.error(err)
      showError('Ошибка обновления имени')
    }
  }

  const handleSaveContacts = async () => {
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showError('Некорректный Email')
      return
    }

    try {
      await api.patch('/users/me', { phone, email })
      setEditingContacts(false)
      showSuccess('Контакты обновлены')
    } catch (err) {
      console.error(err)
      showError('Ошибка обновления контактов')
    }
  }

  const handleSaveSocial = async () => {
    try {
      await api.patch('/users/me', { 
        social_links: { linkedin, dribbble } 
      })
      setEditingSocial(false)
      showSuccess('Социальные сети обновлены')
    } catch (err) {
      console.error(err)
      showError('Ошибка обновления соцсетей')
    }
  }

  const handleSaveLocale = async () => {
    try {
      await api.patch('/users/me', { language, currency })
      setEditingLocale(false)
      showSuccess('Настройки языка сохранены')
    } catch (err) {
      console.error(err)
      showError('Ошибка сохранения настроек')
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleIntegrationToggle = async () => {
    try {
      const response = await api.post('/integrations/toggle')
      setConnected(response.data.connected) // Assuming API returns new state
      // If API doesn't return state, toggle locally:
      // setConnected(!connected)
      showSuccess(connected ? 'Интеграция отключена' : 'Интеграция подключена')
    } catch (err) {
      console.error(err)
      showError('Ошибка переключения интеграции')
    }
  }

  const handleLogout = async () => {
    try {
      logout() // AuthContext logout
      navigate('/login')
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  // Sidebar Items
  const menuItems = [
    { id: 'general', label: 'Общие', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'billing', label: 'Тарифные планы', icon: CreditCard },
    { id: 'security', label: 'Вход и безопасность', icon: Shield },
    { id: 'members', label: 'Участники', icon: Users },
    { id: 'roles', label: 'Роли пользователей', icon: UserCog },
  ]

  return (
    <div className="min-h-screen bg-gray-900/50 p-4 md:p-8 text-white font-sans">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAvatar}
        title="Удалить аватар?"
        message="Вы уверены, что хотите удалить фото профиля? Это действие нельзя отменить."
        confirmText="Удалить"
        type="danger"
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-[240px,1fr] gap-6">
        
        {/* Sidebar */}
        <div className="glass-card p-4 h-fit animate-fade-in" style={{ animationDelay: '0s' }}>
          <h2 className="text-xl font-bold mb-6 px-2">Настройки</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          
          {/* Notifications */}
          {successMessage && (
             <div className="glass-card p-4 bg-green-500/20 border-green-500/30 flex items-center gap-3 animate-fade-in">
                <CheckCircle className="text-green-400" />
                <span>{successMessage}</span>
             </div>
          )}
          {errorMessage && (
             <div className="glass-card p-4 bg-red-500/20 border-red-500/30 flex items-center gap-3 animate-fade-in">
                <X className="text-red-400" />
                <span>{errorMessage}</span>
             </div>
          )}

          {activeTab === 'general' && (
            <>
              {/* Profile Section */}
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold mb-6">Профиль пользователя</h3>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 relative group border-2 border-white/10">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={48} />
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        hidden 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                      />
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="glass-button p-2 px-3 text-sm flex items-center gap-2"
                        disabled={uploading}
                      >
                        <Upload size={16} /> Загрузить
                      </button>
                      <button 
                        onClick={handleDeleteAvatar}
                        className="glass-button p-2 px-3 text-sm hover:bg-red-500/20 hover:border-red-500/30 text-red-300"
                        disabled={uploading || !avatar}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Name Info */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Имя пользователя</label>
                      <div className="flex items-center gap-3">
                        {editingName ? (
                          <>
                            <input 
                              type="text" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)}
                              className="glass-input flex-1"
                              placeholder="Ваше имя"
                              autoFocus
                            />
                            <button onClick={handleSaveName} className="p-2 bg-green-500/20 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors">
                              <Check size={20} />
                            </button>
                            <button onClick={() => setEditingName(false)} className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                              <X size={20} />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 text-xl font-medium">{name || 'Не указано'}</div>
                            <button 
                              onClick={() => setEditingName(true)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Section */}
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Контакты</h3>
                  {!editingContacts ? (
                    <button 
                      onClick={() => setEditingContacts(true)}
                      className="text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} /> Изменить
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveContacts} className="text-green-400 hover:text-green-300 text-sm">Сохранить</button>
                      <button onClick={() => setEditingContacts(false)} className="text-gray-400 hover:text-gray-300 text-sm">Отмена</button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Phone size={14} /> Номер телефона
                    </label>
                    {editingContacts ? (
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="glass-input"
                        placeholder="+7 (999) 000-00-00"
                      />
                    ) : (
                      <div className="p-3 text-gray-200">{phone || 'Не указан'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Mail size={14} /> Email адрес
                    </label>
                    {editingContacts ? (
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input"
                        placeholder="example@mail.com"
                      />
                    ) : (
                      <div className="p-3 text-gray-200">{email || 'Не указан'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Socials Section */}
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Социальные сети</h3>
                  {!editingSocial ? (
                    <button 
                      onClick={() => setEditingSocial(true)}
                      className="text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} /> Изменить
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveSocial} className="text-green-400 hover:text-green-300 text-sm">Сохранить</button>
                      <button onClick={() => setEditingSocial(false)} className="text-gray-400 hover:text-gray-300 text-sm">Отмена</button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Globe size={14} /> LinkedIn
                    </label>
                    {editingSocial ? (
                      <input 
                        type="text" 
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="glass-input"
                        placeholder="https://linkedin.com/in/..."
                      />
                    ) : (
                      <div className="p-3 text-gray-200 truncate">{linkedin || 'Не привязано'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Globe size={14} /> Dribbble
                    </label>
                    {editingSocial ? (
                      <input 
                        type="text" 
                        value={dribbble}
                        onChange={(e) => setDribbble(e.target.value)}
                        className="glass-input"
                        placeholder="https://dribbble.com/..."
                      />
                    ) : (
                      <div className="p-3 text-gray-200 truncate">{dribbble || 'Не привязано'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Language & Currency */}
              <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Язык и Регион</h3>
                  {!editingLocale ? (
                    <button 
                      onClick={() => setEditingLocale(true)}
                      className="text-primary-300 text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} /> Изменить
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveLocale} className="text-green-400 hover:text-green-300 text-sm">Сохранить</button>
                      <button onClick={() => setEditingLocale(false)} className="text-gray-400 hover:text-gray-300 text-sm">Отмена</button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Язык интерфейса</label>
                    {editingLocale ? (
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="glass-input w-full [&>option]:bg-gray-800"
                      >
                        <option value="Русский">Русский</option>
                        <option value="English">English</option>
                        <option value="Қазақша">Қазақша</option>
                      </select>
                    ) : (
                      <div className="p-3 text-gray-200">{language}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Валюта</label>
                    {editingLocale ? (
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="glass-input w-full [&>option]:bg-gray-800"
                      >
                        <option value="RUB">RUB (₽)</option>
                        <option value="USD">USD ($)</option>
                        <option value="KZT">KZT (₸)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    ) : (
                      <div className="p-3 text-gray-200">{currency}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Theme & Integrations */}
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="glass-card p-6">
                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette size={20} /> Тема оформления
                   </h3>
                   <select 
                      value={theme}
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="glass-input w-full [&>option]:bg-gray-800"
                   >
                      <option value="light">Светлая тема</option>
                      <option value="dark">Тёмная тема</option>
                      <option value="auto">Системная</option>
                   </select>
                </div>

                <div className="glass-card p-6">
                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Settings size={20} /> Интеграции
                   </h3>
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
                         <span>Сторонние сервисы</span>
                      </div>
                      <button 
                        onClick={handleIntegrationToggle}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          connected 
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                            : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                        }`}
                      >
                        {connected ? 'Отключить' : 'Подключить'}
                      </button>
                   </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="flex justify-end pt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                 <button 
                    onClick={handleLogout}
                    className="glass-button bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-200 flex items-center gap-2"
                 >
                    <LogOut size={20} /> Выйти из аккаунта
                 </button>
              </div>
            </>
          )}

          {activeTab !== 'general' && (
            <div className="glass-card p-12 text-center text-gray-400 animate-fade-in">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Раздел в разработке</h3>
              <p>Функционал для раздела "{menuItems.find(i => i.id === activeTab)?.label}" будет доступен в ближайшее время.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SettingsPage
