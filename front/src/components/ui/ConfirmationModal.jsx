import { X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Подтвердить', cancelText = 'Отмена', type = 'danger' }) => {
  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div 
        className="relative glass-card p-6 w-full max-w-sm animate-fade-in border-red-500/20"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
            <AlertTriangle size={32} />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button 
              onClick={onClose}
              className="glass-button flex-1 py-2 text-sm"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                type === 'danger' 
                  ? 'bg-red-500/80 hover:bg-red-600/80 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-primary-500/80 hover:bg-primary-600/80 text-white'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
