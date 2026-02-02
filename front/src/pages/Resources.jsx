import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
    Check,
    Download,
    FileText,
    Filter,
    Loader2,
    Search,
    Trash2,
    Upload,
    File,
    Music,
    Video,
    Image as ImageIcon,
    X
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { resourcesAPI } from '../api/api'
import { DashboardHeader } from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

const Resources = () => {
    const { user } = useAuth()
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    // Filters
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('all')

    // Upload Form State
    const [selectedFile, setSelectedFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [tags, setTags] = useState('')

    useEffect(() => {
        fetchResources()
    }, [])

    const fetchResources = async () => {
        try {
            setLoading(true)
            const response = user?.role === 'psychologist' 
                ? await resourcesAPI.getMyResources() 
                : await resourcesAPI.getPatientResources()
            setResources(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error(error)
            toast.error('Ошибка загрузки ресурсов')
        } finally {
            setLoading(false)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (file) => {
        if (file.size > 50 * 1024 * 1024) {
            toast.error('Файл слишком большой (макс 50MB)')
            return
        }
        setSelectedFile(file)
        if (!title) setTitle(file.name)
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!selectedFile || !title) return

        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('is_public', isPublic)
        formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)))

        setUploading(true)
        setUploadProgress(0)

        try {
            await resourcesAPI.uploadResource(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percentCompleted)
            })
            toast.success('Файл успешно загружен')
            setSelectedFile(null)
            setTitle('')
            setDescription('')
            setTags('')
            setIsPublic(false)
            fetchResources()
        } catch (error) {
            toast.error('Ошибка загрузки файла')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены?')) return
        try {
            await resourcesAPI.deleteResource(id)
            toast.success('Ресурс удален')
            setResources(prev => prev.filter(r => r.id !== id))
        } catch (error) {
            toast.error('Ошибка удаления')
        }
    }

    const handleDownload = async (resource) => {
        try {
            const response = await resourcesAPI.downloadResource(resource.id)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            // Try to use title + extension or standard name
            link.setAttribute('download', resource.title + (resource.file_type || '')) 
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error(error)
            toast.error('Ошибка скачивания')
        }
    }

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                              (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
        if (filterType === 'all') return matchesSearch
        
        const ext = r.file_type || ''
        if (filterType === 'document') return matchesSearch && ['.pdf', '.doc', '.docx', '.txt'].includes(ext)
        if (filterType === 'media') return matchesSearch && ['.mp3', '.mp4', '.jpg', '.png'].includes(ext)
        return matchesSearch
    })

    const getFileIcon = (type) => {
        if (!type) return <File className="w-6 h-6 text-gray-400" />
        if (['.jpg', '.png', '.jpeg'].includes(type)) return <ImageIcon className="w-6 h-6 text-blue-400" />
        if (['.mp3', '.wav'].includes(type)) return <Music className="w-6 h-6 text-purple-400" />
        if (['.mp4', '.avi'].includes(type)) return <Video className="w-6 h-6 text-red-400" />
        if (['.pdf', '.doc', '.docx'].includes(type)) return <FileText className="w-6 h-6 text-orange-400" />
        return <File className="w-6 h-6 text-gray-400" />
    }

    return (
        <div className='min-h-screen p-4 md:p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
                <DashboardHeader activeTab='resources' />

                {user?.role === 'psychologist' && (
                    <div className="glass-card p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#8b5cf6]" />
                            Загрузить новый ресурс
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div 
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer h-full min-h-[200px]
                                    ${dragActive ? 'border-[#8b5cf6] bg-[#8b5cf6]/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                    ${selectedFile ? 'border-[#22c55e]/50 bg-[#22c55e]/5' : ''}
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                />
                                
                                {selectedFile ? (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-3">
                                            <Check className="w-6 h-6 text-[#22c55e]" />
                                        </div>
                                        <p className="text-white font-medium break-all">{selectedFile.name}</p>
                                        <p className="text-white/40 text-sm mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                            className="mt-4 text-sm text-[#ef4444] hover:underline"
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center mx-auto mb-3">
                                            <Upload className="w-6 h-6 text-[#c4a7e7]" />
                                        </div>
                                        <p className="text-white font-medium">Перетащите файл сюда</p>
                                        <p className="text-white/40 text-sm mt-1">или кликните для выбора</p>
                                        <p className="text-white/20 text-xs mt-4">PDF, DOC, MP4, MP3, ZIP до 50MB</p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Название</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                                        placeholder="Например: Дневник эмоций.pdf"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Описание (опционально)</label>
                                    <textarea 
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none h-24"
                                        placeholder="Краткое описание ресурса..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Теги (через запятую)</label>
                                    <input 
                                        type="text" 
                                        value={tags}
                                        onChange={e => setTags(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                                        placeholder="психология, упражнение, медитация"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="public"
                                        checked={isPublic}
                                        onChange={e => setIsPublic(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#8b5cf6] focus:ring-[#8b5cf6]"
                                    />
                                    <label htmlFor="public" className="text-white text-sm cursor-pointer select-none">
                                        Доступно всем моим пациентам
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={!selectedFile || !title || uploading}
                                    className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Загрузка {uploadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Загрузить ресурс
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="glass-card p-6 min-h-[400px]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#8b5cf6]" />
                            Библиотека ресурсов
                        </h2>
                        
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input 
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Поиск ресурсов..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                                />
                            </div>
                            <select 
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors"
                            >
                                <option value="all" className="bg-[#1a1a1a]">Все типы</option>
                                <option value="document" className="bg-[#1a1a1a]">Документы</option>
                                <option value="media" className="bg-[#1a1a1a]">Медиа</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin" />
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="text-center py-20">
                            <FileText className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <p className="text-white/50">Ресурсы не найдены</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredResources.map(resource => (
                                <div key={resource.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#8b5cf6]/50 transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-3 rounded-lg bg-white/5">
                                            {getFileIcon(resource.file_type)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleDownload(resource)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                title="Скачать"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {user?.role === 'psychologist' && (
                                                <button 
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2 rounded-lg hover:bg-[#ef4444]/20 text-white/60 hover:text-[#ef4444] transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-white font-medium mb-1 truncate" title={resource.title}>
                                        {resource.title}
                                    </h3>
                                    <p className="text-white/40 text-xs mb-3 line-clamp-2 min-h-[2.5em]">
                                        {resource.description || 'Нет описания'}
                                    </p>
                                    
                                    <div className="flex items-center gap-2 flex-wrap mb-3">
                                        {resource.tags && resource.tags.map((tag, i) => (
                                            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-[#8b5cf6]/20 text-[#c4a7e7]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-white/30 pt-3 border-t border-white/5">
                                        <span>{(resource.file_size / (1024 * 1024)).toFixed(1)} MB</span>
                                        <span>{format(new Date(resource.created_at), 'd MMM yyyy', { locale: ru })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Resources
