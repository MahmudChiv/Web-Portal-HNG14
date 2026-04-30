import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchProfiles, addProfile, exportProfilesCSV } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export default function Profiles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState('');
  const [countryId, setCountryId] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profiles", page, gender, countryId, minAge, maxAge],
    queryFn: () => fetchProfiles({ page, gender, country_id: countryId, min_age: minAge, max_age: maxAge }),
    refetchInterval: 30000,
    retry: false,
  });

  const addProfileMutation = useMutation({
    mutationFn: (name) => addProfile(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setIsAddModalOpen(false);
      setNewProfileName('');
    },
    onError: (err) => {
      alert(err.message || "Failed to add profile");
    }
  });

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleAddProfileClick = () => {
    if (user?.role !== 'admin') {
      alert("You are not an admin");
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const filters = {};
      if (gender) filters.gender = gender;
      if (countryId) filters.country_id = countryId;
      if (minAge) filters.min_age = minAge;
      if (maxAge) filters.max_age = maxAge;
      const blob = await exportProfilesCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profiles_${new Date().getTime()}.csv`;
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

  const isNotFoundError = isError && error?.message === "Profile not found";
  const profiles = isNotFoundError ? [] : (data?.data || []);
  const totalPages = isNotFoundError ? 1 : (data?.total_pages || 1);

  if (isError && !isNotFoundError) return (
    <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl border border-red-500/20">
      {error?.status === 429 ? 'Too many requests. Please try again later.' : 'Error loading profiles. Please try again later.'}
    </div>
  );

  return (
    <div className="animate-slide-up">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Profiles</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and access across the system.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2 rounded-xl font-semibold bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700 transition-colors" disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={handleAddProfileClick} className="btn-primary">
            + Add Profile
          </button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <select 
          value={gender} 
          onChange={handleFilterChange(setGender)}
          className="input-glass max-w-[150px] [&>option]:bg-slate-900"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input 
          type="number" 
          placeholder="Min Age" 
          value={minAge} 
          onChange={handleFilterChange(setMinAge)}
          className="input-glass max-w-[120px]"
          min="0"
        />
        <input 
          type="number" 
          placeholder="Max Age" 
          value={maxAge} 
          onChange={handleFilterChange(setMaxAge)}
          className="input-glass max-w-[120px]"
          min="0"
        />
        <input 
          type="text" 
          placeholder="Country ID (e.g. NG, US)" 
          value={countryId} 
          onChange={handleFilterChange(setCountryId)}
          className="input-glass max-w-xs"
        />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-white/5 backdrop-blur-sm">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map((profile, i) => (
                    <tr 
                      key={profile.id} 
                      className="hover:bg-white/5 transition-colors group"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase shadow-lg shadow-indigo-500/30 shrink-0">
                            {profile.name[0]}
                          </div>
                          <div className="font-semibold text-slate-100">{profile.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-medium">{profile.age} yrs</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 capitalize">
                        {profile.gender || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {profile.country_name || profile.country_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/profiles/${profile.id}`}
                          className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-indigo-500/30"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        No profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-white/5 bg-slate-800/30 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Showing page <span className="font-medium text-slate-200">{page}</span> of <span className="font-medium text-slate-200">{totalPages}</span>
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
          </>
        )}
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-8 max-w-md w-full rounded-3xl animate-slide-up shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Add New Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Profile Name</label>
                <input 
                  type="text" 
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter full name" 
                  className="input-glass w-full"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="btn-secondary"
                disabled={addProfileMutation.isPending}
              >
                Cancel
              </button>
              <button 
                onClick={() => addProfileMutation.mutate(newProfileName)}
                disabled={!newProfileName.trim() || addProfileMutation.isPending}
                className="btn-primary"
              >
                {addProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
