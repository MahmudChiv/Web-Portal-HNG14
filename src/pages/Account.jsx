import { useAuth } from '../hooks/useAuth'

export default function Account() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your personal information, security, and preferences.</p>
      </header>

      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Profile Summary */}
        <div className="w-full md:w-1/3 bg-slate-900/50 border-r border-white/5 p-8 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-slate-900 p-1.5 shadow-2xl border border-white/10 mb-4 relative group">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold uppercase overflow-hidden shadow-inner">
              {user?.username?.[0] || 'U'}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">{user?.username || 'User Name'}</h2>
          <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {user?.role || 'Analyst'}
          </span>
          <p className="mt-6 text-sm text-slate-500">
            Member since {new Date().getFullYear()}
          </p>
        </div>

        {/* Right Side: Settings Form */}
        <div className="w-full md:w-2/3 p-8">
          <section className="mb-10">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  readOnly 
                  defaultValue={user?.username || ''} 
                  className="input-glass" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  readOnly 
                  defaultValue={user?.email || 'user@example.com'} 
                  className="input-glass" 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="btn-primary opacity-50 cursor-not-allowed">
                Save Changes
              </button>
            </div>
          </section>

          <section className="pt-8 border-t border-white/5">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </h3>
            <div className="flex items-center justify-between p-4 glass-card rounded-xl group cursor-pointer">
              <div>
                <p className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">Change Password</p>
                <p className="text-sm text-slate-400 mt-0.5">Update your password to keep your account secure.</p>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
