import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Shield, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="w-full max-w-xl mx-auto mt-4 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mb-2">My Profile</h2>
        <p className="text-sm text-slate-400 mb-8">Review your account settings and credentials</p>

        <div className="rounded-2xl glass-panel border border-white/5 bg-slate-900/40 p-8 shadow-xl flex flex-col gap-6">
          {/* Avatar & Header */}
          <div className="flex items-center gap-5 pb-6 border-b border-white/5">
            <div className="w-16 h-16 rounded-full bg-accentPurple/25 flex items-center justify-center font-bold text-accentPurple text-2xl border border-accentPurple/45">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-200">{user?.name}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">{user?.role} Profile</span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <User size={14} />
                <span>Full Name</span>
              </div>
              <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Mail size={14} />
                <span>Email Address</span>
              </div>
              <span className="text-sm text-slate-300 font-medium truncate">{user?.email}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Shield size={14} />
                <span>User Role</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-accentPurple bg-accentPurple/10 px-2.5 py-1 rounded-full border border-accentPurple/20 self-start">
                {user?.role}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Calendar size={14} />
                <span>Account Status</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start">
                Active & Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
