import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const [error, setError] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setError(null)
    setIsLoggingIn(true)
    try {
      await login()
    } catch (err) {
      setError(err.message)
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/40 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/40 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse-slow animate-delay-200"></div>

      <div className="relative z-10 glass-panel p-10 rounded-2xl max-w-md w-full text-center animate-slide-up">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
          Insigha Labs+
        </h1>
        <p className="text-slate-400 font-medium mb-8">
          Secure access to real-time metrics and profile data.
        </p>

        {error && (
          <div className="mb-6 w-full bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
          ) : (
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          )}
          {isLoggingIn ? 'Connecting...' : 'Continue with GitHub'}
        </button>
      </div>
    </div>
  )
}
