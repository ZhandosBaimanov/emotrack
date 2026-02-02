import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Error Boundary для перехвата и обработки ошибок в React компонентах
 */
class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		}
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error }
	}

	componentDidCatch(error, errorInfo) {
		// Логируем ошибку
		console.error('Error Boundary caught an error:', error)
		console.error('Error info:', errorInfo)

		this.setState({
			error: error,
			errorInfo: errorInfo,
		})

		// Отправляем ошибку на сервер (опционально)
		this.reportError(error, errorInfo)
	}

	reportError = async (error, errorInfo) => {
		try {
			const errorData = {
				message: error.message,
				stack: error.stack,
				componentStack: errorInfo.componentStack,
				url: window.location.href,
				userAgent: navigator.userAgent,
				timestamp: new Date().toISOString(),
			}

			// Отправляем на сервер для мониторинга
			// await fetch('/api/logs/error', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(errorData),
			// })
		} catch (e) {
			console.error('Failed to report error:', e)
		}
	}

	handleReload = () => {
		window.location.reload()
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		})
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen flex items-center justify-center bg-[#1a1a2e] p-4'>
					<div className='max-w-md w-full glass-card p-8 text-center'>
						<div className='w-16 h-16 bg-[#ef4444]/20 rounded-full flex items-center justify-center mx-auto mb-4'>
							<AlertCircle className='w-8 h-8 text-[#ef4444]' />
						</div>

						<h1 className='text-xl font-semibold text-white mb-2'>
							Что-то пошло не так
						</h1>

						<p className='text-white/60 mb-6'>
							Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу
							или вернуться на главную.
						</p>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<div className='mb-6 p-4 bg-white/5 rounded-lg text-left'>
								<p className='text-[#ef4444] text-sm font-medium mb-2'>
									{this.state.error.toString()}
								</p>
								{this.state.errorInfo && (
									<details className='text-white/40 text-xs'>
										<summary className='cursor-pointer hover:text-white/60'>
											Stack trace
										</summary>
										<pre className='mt-2 overflow-auto max-h-40 whitespace-pre-wrap'>
											{this.state.errorInfo.componentStack}
										</pre>
									</details>
								)}
							</div>
						)}

						<div className='flex gap-3 justify-center'>
							<button
								onClick={this.handleReload}
								className='flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors'
							>
								<RefreshCw className='w-4 h-4' />
								Перезагрузить
							</button>

							<Link
								to='/'
								className='flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors'
							>
								<Home className='w-4 h-4' />
								На главную
							</Link>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
