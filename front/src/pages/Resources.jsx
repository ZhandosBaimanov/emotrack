import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Upload, 
  FileText, 
  Video, 
  Headphones, 
  Image, 
  X, 
  Search,
  Filter,
  Check,
  FolderOpen
} from 'lucide-react';
import { resourcesAPI } from '../api/api';
import { DashboardHeader } from '../components/dashboard';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'article',
    assignedTo: 'all'
  });
  const [patients, setPatients] = useState([]);

  // Available categories
  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'article', name: 'Статья' },
    { id: 'exercise', name: 'Упражнение' },
    { id: 'video', name: 'Видео' },
    { id: 'audio', name: 'Аудио' }
  ];

  // File type icons mapping
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('video/')) return <Video className="w-4 h-4" />;
    if (fileType.includes('audio/')) return <Headphones className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Load resources based on user role
  const loadResources = async () => {
    try {
      setLoading(true);
      if (user.role === 'psychologist') {
        // Load resources created by the psychologist
        const data = await resourcesAPI.getMyResources();
        setResources(data);
        setFilteredResources(data);

        // Also load patients to assign resources to
        const patientsData = await resourcesAPI.getMyPatients();
        setPatients(patientsData);
      } else {
        // Load resources assigned to the patient
        const data = await resourcesAPI.getPatientResources();
        setResources(data);
        setFilteredResources(data);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search and category
  const filterResources = () => {
    let filtered = resources;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  // Handle search and category changes
  const handleFilterChange = () => {
    filterResources();
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('category', uploadForm.category);

    if (uploadForm.assignedTo !== 'all') {
      formData.append('assigned_to', uploadForm.assignedTo);
    }

    try {
      setUploading(true);
      const resource = await resourcesAPI.uploadResource(formData);
      setResources(prev => [resource, ...prev]);
      setFilteredResources(prev => [resource, ...prev]);

      // Reset form
      setUploadForm({
        title: '',
        description: '',
        category: 'article',
        assignedTo: 'all'
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (resourceId) => {
    try {
      await resourcesAPI.markAsRead(resourceId);
      setResources(prev => 
        prev.map(res => 
          res.id === resourceId ? {...res, is_read: true} : res
        )
      );
      setFilteredResources(prev => 
        prev.map(res => 
          res.id === resourceId ? {...res, is_read: true} : res
        )
      );
    } catch (error) {
      console.error('Error marking resource as read:', error);
    }
  };

  // Handle resource deletion (psychologist only)
  const handleDeleteResource = async (resourceId) => {
    try {
      await resourcesAPI.deleteResource(resourceId);
      setResources(prev => prev.filter(res => res.id !== resourceId));
      setFilteredResources(prev => prev.filter(res => res.id !== resourceId));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  // Initialize component
  useState(() => {
    loadResources();
  });

  // Update filters when search term or category changes
  useState(() => {
    handleFilterChange();
  }, [searchTerm, selectedCategory, resources]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader activeTab="resources" />

        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FolderOpen className="w-8 h-8 text-[#8b5cf6]" />
            <h1 className="text-2xl font-semibold text-white">
              {user.role === 'psychologist' ? 'Мои ресурсы' : 'Образовательные ресурсы'}
            </h1>
          </div>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                className="glass-input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <select
                className="glass-input pl-10 w-full appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {user.role === 'psychologist' && (
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="glass-button px-4 flex items-center gap-2 justify-center"
              >
                <Upload className="w-4 h-4" />
                Загрузить ресурс
              </button>
            )}
          </div>

          {/* Upload Form for Psychologists */}
          {user.role === 'psychologist' && (
            <div className="glass-card p-4 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Загрузить новый ресурс</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Название</label>
                  <input
                    type="text"
                    className="glass-input w-full"
                    placeholder="Введите название ресурса"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Категория</label>
                  <select
                    className="glass-input w-full"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">Описание</label>
                  <textarea
                    className="glass-input w-full min-h-[100px]"
                    placeholder="Введите описание ресурса"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Назначить пациенту</label>
                  <select
                    className="glass-input w-full"
                    value={uploadForm.assignedTo}
                    onChange={(e) => setUploadForm({...uploadForm, assignedTo: e.target.value})}
                  >
                    <option value="all">Для всех</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.avi,.mov,.mp3,.wav"
                  />
                  <button
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={uploading || !uploadForm.title}
                    className="glass-button px-6 py-2 flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Выбрать файл
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Resources List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Ресурсы не найдены</p>
                </div>
              ) : (
                filteredResources.map((resource) => (
                  <div key={resource.id} className="glass-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.file_type)}
                        <span className="text-xs bg-[#8b5cf6]/20 text-white px-2 py-1 rounded-full">
                          {getCategoryName(resource.category)}
                        </span>
                      </div>
                      
                      {user.role === 'psychologist' && (
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="text-white/40 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <h3 className="text-white font-medium text-lg mb-2">{resource.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        {new Date(resource.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      
                      {user.role === 'user' && !resource.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(resource.id)}
                          className="glass-button px-3 py-1 text-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Прочитано
                        </button>
                      )}
                      
                      {user.role === 'user' && resource.is_read && (
                        <span className="text-xs text-[#22c55e] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Прочитано
                        </span>
                      )}
                    </div>
                    
                    <a
                      href={resource.file_url}
                      download
                      className="mt-3 w-full block glass-button py-2 text-center flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Скачать файл
                    </a>
                    
                    {user.role === 'psychologist' && resource.patient_id && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-white/60">
                          Назначен: {resource.patient?.first_name} {resource.patient?.last_name}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;