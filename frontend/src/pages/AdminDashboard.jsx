import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { Users, FolderKanban, ClipboardCheck, Percent, Loader2, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/metrics');
        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch admin metrics. You must be an authorized administrator.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">Platform Administration</h2>
        <p className="text-sm text-slate-400 mb-8">Review system-wide productivity metrics and platform velocity</p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-accentPurple animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Fetching dashboard aggregates...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="p-6 rounded-2xl glass-card flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Users</span>
                <span className="text-3xl font-extrabold text-slate-100">{metrics.totalUsers}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-accentPurple/10 text-accentPurple border border-accentPurple/15">
                <Users size={24} />
              </div>
            </div>

            {/* Active Projects */}
            <div className="p-6 rounded-2xl glass-card flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Projects</span>
                <span className="text-3xl font-extrabold text-slate-100">{metrics.activeProjects}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-accentIndigo/10 text-accentIndigo border border-accentIndigo/15">
                <FolderKanban size={24} />
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="p-6 rounded-2xl glass-card flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Completed Tasks</span>
                <span className="text-3xl font-extrabold text-slate-100">{metrics.completedTasks}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                <ClipboardCheck size={24} />
              </div>
            </div>

            {/* Productivity Rate */}
            <div className="p-6 rounded-2xl glass-card flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Productivity Index</span>
                <span className="text-3xl font-extrabold text-slate-100">{metrics.productivityRate}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/15">
                <Percent size={24} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
