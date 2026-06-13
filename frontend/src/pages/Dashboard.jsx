import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import workspaceService from '../services/workspaceService';
import aiService from '../services/aiService';
import { 
  Users, FolderKanban, Plus, Sparkles, Send, 
  Loader2, ClipboardList, CheckCircle2 
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // AI report states
  const [aiReport, setAiReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadData = async () => {
    if (!workspaceId) return;
    try {
      // Find workspace in list
      const list = await workspaceService.list();
      const currentWs = list.find(w => w.id === workspaceId);
      if (!currentWs) {
        // Fallback or navigate away
        return;
      }
      setWorkspace(currentWs);

      // Load members
      const memberList = await workspaceService.getMembers(workspaceId);
      setMembers(memberList);

      // Load projects
      const projectList = await workspaceService.listProjects(workspaceId);
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load workspace data:', error);
    }
  };

  useEffect(() => {
    loadData();
    setAiReport(null); // Clear report on workspace change
  }, [workspaceId]);

  const triggerAIReport = async () => {
    if (!workspaceId) return;
    setLoadingReport(true);
    try {
      const report = await aiService.getWeeklyReport(workspaceId);
      setAiReport(report);
    } catch (error) {
      console.error('Failed to query AI weekly report:', error);
    } finally {
      setLoadingReport(false);
    }
  };

  const onInviteMember = async (data) => {
    setInviteError(null);
    setInviteSuccess(null);
    try {
      await workspaceService.addMember(workspaceId, data.email, data.role);
      setInviteSuccess(`Invited user ${data.email} successfully.`);
      reset();
      loadData();
    } catch (error) {
      setInviteError(error.response?.data?.error || 'Invitation failed.');
    }
  };

  if (!workspace) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={36} className="text-accentPurple animate-spin" />
          <p className="text-sm text-slate-500">Loading workspace dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">{workspace.name}</h1>
            <p className="text-sm text-slate-400 mt-1">{workspace.description || 'No description provided.'}</p>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-white/5 hover:bg-slate-700 transition-all self-start md:self-auto"
          >
            <Users size={14} />
            Invite Member
          </button>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Workspace Projects</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-100">{projects.length}</span>
              <FolderKanban size={24} className="text-accentPurple/55" />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Team Members</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-slate-100">{members.length}</span>
              <Users size={24} className="text-accentIndigo/55" />
            </div>
          </div>

          {/* AI Report trigger card */}
          <div className="p-6 rounded-2xl glass-card bg-gradient-to-br from-accentPurple/10 to-accentIndigo/5 border-accentPurple/20 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-accentPurple" />
              <span className="text-xs font-bold text-accentPurple uppercase tracking-wider">AI Productivity Report</span>
            </div>
            
            {!aiReport ? (
              <button 
                onClick={triggerAIReport}
                disabled={loadingReport}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-accentPurple text-white font-semibold text-xs hover:opacity-90 transition-all self-start shadow-md glow-btn disabled:opacity-50"
              >
                {loadingReport ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    Generate Report
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl font-extrabold text-slate-100">{aiReport.completionRate}% Done</span>
                <span className="text-xs font-medium text-accentPurple bg-accentPurple/10 border border-accentPurple/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Report Details Panel */}
        {aiReport && (
          <div className="p-6 rounded-2xl glass-panel border border-accentPurple/20 bg-slate-900/20 shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/5">
              <Sparkles size={18} className="text-accentPurple" />
              <h3 className="text-sm font-bold text-slate-200">AI Report: Academic Team Analysis</h3>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
              {aiReport.reportText}
            </div>
          </div>
        )}

        {/* Active Projects List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">Workspace Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => (
              <Link
                key={proj.id}
                to={`/workspace/${workspaceId}/project/${proj.id}`}
                className="p-5 rounded-xl border border-white/5 bg-[#121926]/40 hover:bg-[#121926]/80 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200">{proj.name}</span>
                  <FolderKanban size={16} className="text-slate-500" />
                </div>
                <span className="text-xs text-slate-400 leading-normal line-clamp-2">
                  {proj.description || 'No project description configured.'}
                </span>
              </Link>
            ))}

            {projects.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-xl col-span-2">
                No projects found in this workspace. Create one from the sidebar.
              </div>
            )}
          </div>
        </div>

        {/* Workspace Members list */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 px-1">Team Members</h3>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-950/40 text-xs font-semibold text-slate-400">
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-900/15">
                {members.map(member => (
                  <tr key={member.userId} className="text-xs text-slate-300">
                    <td className="px-6 py-3.5 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-accentIndigo/20 flex items-center justify-center font-bold text-accentIndigo text-[11px] border border-accentIndigo/30">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{member.name}</span>
                        <span className="text-[10px] text-slate-500">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        member.role === 'Admin' 
                          ? 'bg-accentPurple/15 text-accentPurple border border-accentPurple/20' 
                          : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Team Member">
        <form onSubmit={handleSubmit(onInviteMember)} className="flex flex-col gap-4">
          {inviteError && (
            <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs">
              {inviteError}
            </div>
          )}
          {inviteSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{inviteSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">User Email</label>
            <input 
              {...register('email', { required: 'Email address is required' })}
              type="email" 
              className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
              placeholder="e.g., student@university.com"
            />
            {errors.email && <span className="text-xs text-rose-400 mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Workspace Role</label>
            <select
              {...register('role')}
              className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2 glow-btn"
          >
            <Send size={14} />
            Send Invitation
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
