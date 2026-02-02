import { useState, useRef, useEffect } from 'react'

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const [statusText, setStatusText] = useState('Нажмите для начала записи')
  
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const requestRef = useRef(null)
  const barsRef = useRef([])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current)
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    setStatusText('Ожидание...')
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Ваш браузер не поддерживает запись аудио')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Initialize Audio Context for visualization
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256 // Resolution of the FFT
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
      sourceRef.current.connect(analyserRef.current)
      
      // Initialize MediaRecorder for recording
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // In a real app, we would collect chunks here
          // const blob = new Blob(chunks, { type: 'audio/webm' })
          // TODO: Добавить интеграцию Speech-to-Text API
        }
      }

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        setStatusText('Обработка...')
        // Simulate processing delay
        setTimeout(() => {
             setStatusText('Нажмите для начала записи')
             // TODO: Отправить распознанный текст в ИИ-модель
             // TODO: Отобразить ответ ИИ
        }, 1000)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setStatusText('Идёт запись...')
      animateBars()
      
    } catch (err) {
      console.error('Error accessing microphone:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Ошибка доступа к микрофону')
      } else {
        setError(err.message || 'Произошла ошибка при записи')
      }
      setStatusText('Ошибка')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      cancelAnimationFrame(requestRef.current)
      
      // Reset bars
      if (barsRef.current) {
        barsRef.current.forEach(bar => {
           if (bar) {
             bar.style.height = '5px'
             bar.style.opacity = '0.3'
           }
        })
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const animateBars = () => {
    if (!analyserRef.current || !isRecording) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Map 40 bars to the frequency data
    // We start from index 0 and step to cover the range relevant for voice
    const step = Math.floor(bufferLength / 40)

    barsRef.current.forEach((bar, index) => {
      if (!bar) return
      
      const dataIndex = index * step
      const value = dataArray[dataIndex] || 0
      
      // Calculate height: min 5px, max 60px
      // value is 0-255. 
      // (value / 255) * 55 + 5
      const height = (value / 255) * 55 + 5
      const opacity = Math.max(0.3, value / 255)

      bar.style.height = `${height}px`
      bar.style.opacity = opacity
    })

    requestRef.current = requestAnimationFrame(animateBars)
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visualizer */}
      <div className="flex items-center justify-center gap-1 h-16 mb-3">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            ref={el => barsRef.current[i] = el}
            className="w-1 bg-white/60 rounded-full transition-all duration-75 ease-out"
            style={{ height: '5px', opacity: 0.3 }}
          ></div>
        ))}
      </div>

      {/* Status Text */}
      <div className="mb-4 text-white/60 text-sm font-medium h-5">
         {error ? <span className="text-red-400">{error}</span> : statusText}
      </div>

      {/* Button */}
      <button
        onClick={handleToggleRecording}
        className={`
          relative px-8 py-3 rounded-full font-medium text-white transition-all duration-300
          ${isRecording 
            ? 'bg-red-500/80 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isRecording ? 'Остановить запись' : 'Начать запись'}
      </button>
    </div>
  )
}

export default VoiceRecorder
