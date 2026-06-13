import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { 
  FolderKanban, Plus, Settings, User, LayoutDashboard, Shield, 
  ChevronRight, LogOut, Briefcase, PlusCircle, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import workspaceService from '../../services/workspaceService';
import Modal from './Modal';
import { useForm } from 'react-hook-form';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId, projectId } = useParams();

  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Modals state
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Forms
  const { register: registerWS, handleSubmit: handleSubmitWS, reset: resetWS, formState: { errors: errorsWS } } = useForm();
  const { register: registerProj, handleSubmit: handleSubmitProj, reset: resetProj, formState: { errors: errorsProj } } = useForm();

  const loadWorkspaces = async () => {
    try {
      const list = await workspaceService.list();
      setWorkspaces(list);
      // Auto-navigate to first workspace if none selected
      if (list.length > 0 && !workspaceId) {
        navigate(`/workspace/${list[0].id}`);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const loadProjects = async () => {
    if (!workspaceId) return;
    try {
      const list = await workspaceService.listProjects(workspaceId);
      setProjects(list);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [workspaceId]);

  const onCreateWorkspace = async (data) => {
    try {
      const newWs = await workspaceService.create(data.name, data.description);
      setIsWorkspaceModalOpen(false);
      resetWS();
      await loadWorkspaces();
      navigate(`/workspace/${newWs.id}`);
      onClose && onClose();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const onCreateProject = async (data) => {
    if (!workspaceId) return;
    try {
      const newProj = await workspaceService.createProject(workspaceId, data.name, data.description);
      setIsProjectModalOpen(false);
      resetProj();
      await loadProjects();
      navigate(`/workspace/${workspaceId}/project/${newProj.id}`);
      onClose && onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose && onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 border-r border-white/5 bg-[#0d1321] flex flex-col h-screen overflow-y-auto shrink-0 select-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accentPurple to-accentIndigo flex items-center justify-center font-bold text-white shadow-md shrink-0">TF</div>
            <span className="font-bold tracking-tight text-slate-100">TaskFlow AI</span>
          </div>
          {/* Close button visible only on mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex flex-col gap-1">
          <Link 
            to={workspaceId ? `/workspace/${workspaceId}` : '/'}
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname.endsWith(workspaceId) || location.pathname === '/'
                ? 'bg-accentPurple/15 text-accentPurple border border-accentPurple/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link 
            to="/profile"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              location.pathname.includes('/profile')
                ? 'bg-accentPurple/15 text-accentPurple border border-accentPurple/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <User size={18} />
            My Profile
          </Link>
          {user?.role === 'Admin' && (
            <Link 
              to="/admin"
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname.includes('/admin')
                  ? 'bg-accentPurple/15 text-accentPurple border border-accentPurple/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Shield size={18} />
              Admin Metrics
            </Link>
          )}
        </div>

        <hr className="border-white/5 my-2 mx-4" />

        {/* Workspaces Section */}
        <div className="px-4 py-2 flex flex-col grow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3 px-2">
            <span>Workspaces</span>
            <button 
              onClick={() => setIsWorkspaceModalOpen(true)}
              className="p-1 rounded text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
              title="Create Workspace"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Workspace Dropdown/List */}
          <div className="flex flex-col gap-1.5 mb-6">
            {workspaces.map(ws => (
              <div key={ws.id} className="flex flex-col">
                <button
                  onClick={() => { navigate(`/workspace/${ws.id}`); handleNavClick(); }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    workspaceId === ws.id
                      ? 'bg-slate-800 text-slate-100 font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Briefcase size={16} className="text-slate-500 shrink-0" />
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {workspaceId === ws.id && <ChevronRight size={14} className="text-slate-500" />}
                </button>

                {/* Projects list under active workspace */}
                {workspaceId === ws.id && (
                  <div className="flex flex-col pl-6 pr-2 py-2 gap-1 border-l border-white/5 ml-4 mt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      <span>Projects</span>
                      <button 
                        onClick={() => setIsProjectModalOpen(true)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    {projects.map(proj => (
                      <Link
                        key={proj.id}
                        to={`/workspace/${workspaceId}/project/${proj.id}`}
                        onClick={handleNavClick}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          projectId === proj.id
                            ? 'bg-accentPurple/20 text-accentPurple font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        <FolderKanban size={13} className="shrink-0" />
                        <span className="truncate">{proj.name}</span>
                      </Link>
                    ))}

                    {projects.length === 0 && (
                      <span className="text-[10px] text-slate-500 italic mt-1">No projects found.</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {workspaces.length === 0 && (
              <span className="text-xs text-slate-500 italic px-2">No workspaces found.</span>
            )}
          </div>
        </div>

        {/* User Footer info */}
        <div className="p-4 border-t border-white/5 mt-auto bg-[#090e18]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accentIndigo/30 flex items-center justify-center font-bold text-accentIndigo text-sm border border-accentIndigo/45 shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">{user?.name}</span>
              <span className="text-[10px] text-slate-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-rose-500/15 transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Create Workspace Modal */}
        <Modal isOpen={isWorkspaceModalOpen} onClose={() => setIsWorkspaceModalOpen(false)} title="Create Workspace">
          <form onSubmit={handleSubmitWS(onCreateWorkspace)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Workspace Name</label>
              <input 
                {...registerWS('name', { required: 'Workspace name is required' })}
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                placeholder="e.g., Development Team"
              />
              {errorsWS.name && <span className="text-xs text-rose-400 mt-1">{errorsWS.name.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description (Optional)</label>
              <textarea 
                {...registerWS('description')}
                rows={3} 
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none resize-none"
                placeholder="Explain the goals of this workspace..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-medium text-sm hover:opacity-90 glow-btn"
            >
              Create Workspace
            </button>
          </form>
        </Modal>

        {/* Create Project Modal */}
        <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Create Project">
          <form onSubmit={handleSubmitProj(onCreateProject)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Project Name</label>
              <input 
                {...registerProj('name', { required: 'Project name is required' })}
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                placeholder="e.g., Backend Redesign"
              />
              {errorsProj.name && <span className="text-xs text-rose-400 mt-1">{errorsProj.name.message}</span>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description (Optional)</label>
              <textarea 
                {...registerProj('description')}
                rows={3} 
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none resize-none"
                placeholder="Provide context for this project..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-medium text-sm hover:opacity-90 glow-btn"
            >
              Create Project
            </button>
          </form>
        </Modal>
      </aside>
    </>
  );
};

export default Sidebar;
