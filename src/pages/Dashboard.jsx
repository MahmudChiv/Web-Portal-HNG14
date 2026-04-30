import { useQuery } from "@tanstack/react-query";
import { fetchDashboardMetrics } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
    refetchInterval: 30000,
  });
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Welcome back, {user?.username || 'Analyst'}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening in your system today.</p>
        </div>
        <div className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
          Status: All systems operational
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 glass-card rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20">
          {error?.status === 429 ? 'Too many requests. Please try again later.' : 'Failed to load dashboard metrics. Please check your connection.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            title="Total Profiles"
            value={data?.total || 0}
            change="+12% from last month"
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            color="indigo"
          />
          <MetricCard
            title="System Health"
            value="100%"
            change="All systems go"
            icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            color="purple"
          />
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, change, icon, color }) {
  const colors = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/20 text-purple-400',
  }
  
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${colors[color]} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-100 tracking-tight">{value}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-300 bg-slate-800/50 inline-block px-2 py-0.5 rounded-md border border-white/5">{change}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}
