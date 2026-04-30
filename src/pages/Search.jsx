import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchProfiles, exportProfilesCSV } from '../services/api'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', debouncedTerm, page],
    queryFn: () => fetchProfiles({ filter: debouncedTerm, page }),
    enabled: debouncedTerm.length > 2,
    retry: false,
  })

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const filters = {};
      if (debouncedTerm) filters.q = debouncedTerm;
      const blob = await exportProfilesCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `search_results_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Export failed: " + (err.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  };

  const results = data?.data || [];
  const totalPages = data?.total_pages || 1;

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <header className="mb-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
          Global Search
        </h1>
        <p className="text-slate-400 font-medium mb-6">Find profiles, roles, and demographics instantly.</p>
        <button onClick={handleExport} className="px-4 py-2 rounded-xl font-semibold bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 transition-colors" disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export Results to CSV'}
        </button>
        {isError && (
          <div className="mt-6 w-full bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-center">
            {error?.status === 429 ? 'Too many requests. Please try again later.' : 'Error loading search results.'}
          </div>
        )}
      </header>

      <div className="relative z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className={`h-6 w-6 transition-colors duration-300 ${searchTerm ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start typing to search (min 3 characters)..."
          className="input-glass block pl-12 pr-4 py-5 text-lg shadow-2xl font-medium"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3 relative z-10">
        {!isLoading && debouncedTerm.length > 2 && results.length === 0 && (
          <div className="text-center py-12 px-4 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
            <div className="w-16 h-16 mx-auto bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No results found for "{debouncedTerm}"</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search query.</p>
          </div>
        )}

        {results.map((profile, i) => (
          <Link
            key={profile.id}
            to={`/profiles/${profile.id}`}
            className="glass-card block p-5 rounded-2xl group animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center text-slate-500 font-bold uppercase group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                  {profile.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg group-hover:text-indigo-400 transition-colors">{profile.name}</h3>
                  <p className="text-sm text-slate-400 font-medium">{profile.age} yrs</p>
                </div>
              </div>
              <div className="text-slate-500 group-hover:text-indigo-400 transition-colors transform group-hover:translate-x-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}

        {/* Pagination Controls */}
        {results.length > 0 && (
          <div className="mt-8 px-6 py-4 border border-white/5 bg-slate-800/30 flex items-center justify-between rounded-2xl">
            <p className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-200">{results.length}</span> of <span className="font-medium text-slate-200">{data?.total || results.length}</span> results 
              (Page <span className="font-medium text-slate-200">{page}</span> of <span className="font-medium text-slate-200">{totalPages}</span>)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800/50 text-slate-300 font-medium text-sm hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800/50 text-slate-300 font-medium text-sm hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
