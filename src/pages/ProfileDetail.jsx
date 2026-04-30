import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProfileDetail } from "../services/api";

export default function ProfileDetail() {
  const { id } = useParams();
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchProfileDetail(id),
  });

  if (isLoading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-10 w-32 bg-slate-800/50 rounded animate-pulse"></div>
      <div className="h-64 glass-card rounded-2xl animate-pulse"></div>
    </div>
  );

  if (isError) return (
    <div className="max-w-3xl mx-auto bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20">
      Error loading profile details. Please try again.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <header className="mb-8">
        <Link
          to="/profiles"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors mb-4 group"
        >
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profiles
        </Link>
      </header>

      <div className="glass-panel rounded-3xl overflow-hidden relative">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-slate-900 p-1.5 shadow-2xl border border-white/10">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold uppercase shadow-inner">
                {profile.name[0]}
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">{profile.name}</h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              ID: <span className="font-mono text-xs text-slate-500">{profile.id}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="space-y-6">
              <div className="bg-slate-800/30 rounded-2xl p-5 border border-white/5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Demographics</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Gender</p>
                    <p className="text-lg font-medium text-slate-100 capitalize">{profile.gender}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Prob: {(profile.gender_probability * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Age</p>
                    <p className="text-lg font-medium text-slate-100">{profile.age} yrs</p>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{profile.age_group}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/30 rounded-2xl p-5 border border-white/5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Origin</h3>
                <div className="mt-4">
                  <p className="text-sm text-slate-400">Nationality</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-xl font-medium text-slate-100">{profile.country_name || profile.country_id}</p>
                    <span className="text-sm text-slate-500 font-mono">({profile.country_id})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Prob: {(profile.country_probability * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-sm text-slate-400">
            <span>Created at: {new Date(profile.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
