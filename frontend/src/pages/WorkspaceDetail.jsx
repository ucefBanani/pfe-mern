import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import taskService from '../services/taskService';
import workspaceService from '../services/workspaceService';
import aiService from '../services/aiService';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, Plus, Search, Filter, Calendar, 
  MessageSquare, User, CheckSquare, ChevronRight, 
  ArrowRightLeft, AlertCircle, Loader2, Info, RefreshCw, Trash2
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useForm } from 'react-hook-form';

const WorkspaceDetail = () => {
  const { workspaceId, projectId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  
  // AI summary states
  const [projectSummary, setProjectSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  // Active modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  // Comments thread state
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  // AI interactive helper states
  const [aiDescriptionLoading, setAiDescriptionLoading] = useState(false);
  const [aiPriorityLoading, setAiPriorityLoading] = useState(false);
  const [aiComplexityLoading, setAiComplexityLoading] = useState(false);
  const [aiPrioritySuggestion, setAiPrioritySuggestion] = useState(null);
  const [aiComplexitySuggestion, setAiComplexitySuggestion] = useState(null);

  // Forms
  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, setValue: setValueCreate } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, setValue: setValueEdit, watch: watchEdit } = useForm();

  // Load project details, members list, and tasks
  const loadProject = async () => {
    if (!projectId || !workspaceId) return;
    try {
      const list = await workspaceService.listProjects(workspaceId);
      const proj = list.find(p => p.id === projectId);
      setProject(proj);

      const memList = await workspaceService.getMembers(workspaceId);
      setMembers(memList);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTasks = async () => {
    if (!projectId) return;
    try {
      const filterData = {};
      if (priority) filterData.priority = priority;
      if (search) filterData.search = search;
      if (assigneeId) filterData.assigneeId = assigneeId;

      const taskList = await taskService.list(projectId, filterData);
      setTasks(taskList);
    } catch (err) {
      console.error(err);
    }
  };

  // Socket room joining and listeners
  useEffect(() => {
    if (!socket || !projectId) return;

    socket.emit('join_project', projectId);

    socket.on('task_created', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      if (activeTask && activeTask.id === updatedTask.id) {
        setActiveTask(updatedTask);
      }
    });

    socket.on('task_deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
      if (activeTask && activeTask.id === id) {
        setIsEditModalOpen(false);
        setActiveTask(null);
      }
    });

    socket.on('comment_created', (newComment) => {
      if (activeTask && activeTask.id === newComment.taskId) {
        setComments(prev => [...prev, newComment]);
      }
    });

    return () => {
      socket.emit('leave_project', projectId);
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
      socket.off('comment_created');
    };
  }, [socket, projectId, activeTask]);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [projectId, search, priority, assigneeId]);

  const handleCreateTask = async (data) => {
    try {
      await taskService.create({
        projectId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        assigneeId: data.assigneeId || null,
        dueDate: data.dueDate || null,
        label: data.label
      });
      setIsCreateModalOpen(false);
      resetCreate();
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (data) => {
    if (!activeTask) return;
    try {
      const updated = await taskService.update(activeTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        assigneeId: data.assigneeId || null,
        dueDate: data.dueDate || null,
        label: data.label
      });
      setIsEditModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(taskId);
      setIsEditModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Move task status inline
  const moveTaskStatus = async (task, newStatus) => {
    try {
      await taskService.update(task.id, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // AI handlers
  const generateProjectSummary = async () => {
    if (!projectId) return;
    setLoadingSummary(true);
    try {
      const summary = await aiService.getProjectSummary(projectId);
      setProjectSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const getAIDescription = async () => {
    const title = watchEdit('title');
    if (!title) return;
    setAiDescriptionLoading(true);
    try {
      const result = await aiService.suggestDescription(title);
      setValueEdit('description', result.description);
    } catch (err) {
      console.error(err);
    } finally {
      setAiDescriptionLoading(false);
    }
  };

  const getAIPriority = async () => {
    const title = watchEdit('title');
    const desc = watchEdit('description');
    if (!title) return;
    setAiPriorityLoading(true);
    setAiPrioritySuggestion(null);
    try {
      const result = await aiService.suggestPriority(title, desc);
      setAiPrioritySuggestion(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiPriorityLoading(false);
    }
  };

  const getAIComplexity = async () => {
    const title = watchEdit('title');
    const desc = watchEdit('description');
    if (!title) return;
    setAiComplexityLoading(true);
    setAiComplexitySuggestion(null);
    try {
      const result = await aiService.estimateComplexity(title, desc);
      setAiComplexitySuggestion(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiComplexityLoading(false);
    }
  };

  // Comments handlers
  const openEditModal = async (task) => {
    setActiveTask(task);
    setComments([]);
    setCommentContent('');
    setAiPrioritySuggestion(null);
    setAiComplexitySuggestion(null);
    
    // Set form fields
    setValueEdit('title', task.title);
    setValueEdit('description', task.description);
    setValueEdit('priority', task.priority);
    setValueEdit('status', task.status);
    setValueEdit('assigneeId', task.assigneeId || '');
    setValueEdit('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setValueEdit('label', task.label);

    setIsEditModalOpen(true);

    try {
      const commentList = await taskService.getComments(task.id);
      setComments(commentList);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !activeTask) return;
    try {
      const newComment = await taskService.addComment(activeTask.id, commentContent);
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    }
  };

  // Kanban Columns
  const columns = [
    { id: 'Backlog', label: 'Backlog', color: 'border-t-slate-500' },
    { id: 'Todo', label: 'Todo', color: 'border-t-sky-500' },
    { id: 'In Progress', label: 'In Progress', color: 'border-t-amber-500' },
    { id: 'Review', label: 'Review', color: 'border-t-indigo-500' },
    { id: 'Done', label: 'Done', color: 'border-t-emerald-500' }
  ];

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={36} className="text-accentPurple animate-spin" />
          <p className="text-sm text-slate-500">Loading project detail...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 select-none">
        
        {/* Project info & AI summary trigger */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to={`/workspace/${workspaceId}`} className="text-xs text-slate-500 hover:text-slate-400 font-semibold uppercase tracking-wider">Project</Link>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{project.name}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">{project.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              onClick={generateProjectSummary}
              disabled={loadingSummary}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-white/5 hover:bg-slate-700 transition-all shadow-md disabled:opacity-50"
            >
              {loadingSummary ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Generating summary...
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-accentPurple" />
                  AI Project Summary
                </>
              )}
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white text-xs font-semibold hover:opacity-90 shadow-lg glow-btn"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>
        </div>

        {/* AI summary result block */}
        {projectSummary && (
          <div className="p-5 rounded-2xl glass-panel border border-accentPurple/25 bg-slate-900/10 shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accentPurple" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Executive Overview</span>
              </div>
              <button 
                onClick={() => setProjectSummary(null)} 
                className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-wider"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{projectSummary.summary}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-slate-900/15">
          <div className="relative grow max-w-sm">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg form-input-premium text-xs text-slate-200 outline-none"
              placeholder="Search tasks by title..."
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Priority filter */}
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-slate-500" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/5 text-xs text-slate-300 outline-none"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Assignee filter */}
            <div className="flex items-center gap-2">
              <User size={12} className="text-slate-500" />
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/5 text-xs text-slate-300 outline-none"
              >
                <option value="">All Assignees</option>
                <option value="unassigned">Unassigned</option>
                {members.map(m => (
                  <option key={m.userId} value={m.userId}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);

            return (
              <div 
                key={col.id} 
                className={`flex flex-col gap-3.5 p-3 rounded-xl border-t-2 ${col.color} bg-slate-900/10 min-h-[500px]`}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between px-1.5 py-1">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.label}</span>
                  <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-white/5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                {/* Card stack */}
                <div className="flex flex-col gap-2.5 overflow-y-auto">
                  {colTasks.map(task => {
                    const assignee = members.find(m => m.userId === task.assigneeId);
                    
                    return (
                      <div 
                        key={task.id}
                        onClick={() => openEditModal(task)}
                        className="p-4 rounded-xl border border-white/5 bg-[#121926]/40 hover:bg-[#121926]/75 hover:border-white/10 transition-all shadow-md cursor-pointer flex flex-col gap-3 relative group"
                      >
                        {/* Label Badge */}
                        {task.label && (
                          <span className="text-[9px] font-bold text-accentPurple bg-accentPurple/10 border border-accentPurple/25 px-2 py-0.5 rounded-md self-start">
                            {task.label}
                          </span>
                        )}

                        <span className="text-xs font-bold text-slate-200 leading-normal line-clamp-2">{task.title}</span>

                        {/* Card metadata row */}
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            {/* Priority Indicator */}
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} title={`Priority: ${task.priority}`}></span>
                            
                            {/* Due date */}
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar size={10} />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Assignee Avatar */}
                          <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[9px] text-slate-400 border border-white/5">
                            {assignee ? assignee.name[0].toUpperCase() : '?'}
                          </div>
                        </div>

                        {/* Inline Move Toolbar (Visible on hover) */}
                        <div 
                          className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-slate-900 border border-white/10 p-0.5 rounded-lg shadow-xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.id !== 'Backlog' && (
                            <button 
                              onClick={() => {
                                const idx = columns.findIndex(c => c.id === col.id);
                                moveTaskStatus(task, columns[idx - 1].id);
                              }}
                              className="p-1 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded"
                              title="Move Left"
                            >
                              &larr;
                            </button>
                          )}
                          {col.id !== 'Done' && (
                            <button 
                              onClick={() => {
                                const idx = columns.findIndex(c => c.id === col.id);
                                moveTaskStatus(task, columns[idx + 1].id);
                              }}
                              className="p-1 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded"
                              title="Move Right"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="py-10 text-center text-[10px] text-slate-600 italic border border-dashed border-white/5 rounded-xl">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Task Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Task">
          <form onSubmit={handleSubmitCreate(handleCreateTask)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Task Title</label>
              <input 
                {...registerCreate('title', { required: true })}
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                placeholder="e.g., Code API routers"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
              <textarea 
                {...registerCreate('description')}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none resize-none"
                placeholder="Details of the implementation task..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                <select
                  {...registerCreate('priority')}
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                <select
                  {...registerCreate('status')}
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                >
                  <option value="Todo">Todo</option>
                  <option value="Backlog">Backlog</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assignee</label>
                <select
                  {...registerCreate('assigneeId')}
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Due Date</label>
                <input 
                  {...registerCreate('dueDate')}
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Label</label>
              <input 
                {...registerCreate('label')}
                type="text"
                className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                placeholder="e.g., Frontend, Database"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-medium text-sm hover:opacity-90 glow-btn"
            >
              Add Task
            </button>
          </form>
        </Modal>

        {/* Edit Task & Collaboration Modal */}
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setActiveTask(null);
          }} 
          title={activeTask ? `Manage: ${activeTask.title}` : 'Edit Task'}
        >
          <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-1">
            {/* AI Assistant Helpers toolbar */}
            <div className="p-3.5 rounded-xl border border-accentPurple/20 bg-accentPurple/5 flex flex-col gap-3.5">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-accentPurple" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Interactive Copilot</span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={getAIDescription}
                  disabled={aiDescriptionLoading}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold border border-white/5 hover:text-slate-200 transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Generate bullet descriptions from Title"
                >
                  {aiDescriptionLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  Suggest Description
                </button>

                <button
                  type="button"
                  onClick={getAIPriority}
                  disabled={aiPriorityLoading}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold border border-white/5 hover:text-slate-200 transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Evaluate appropriate priority status"
                >
                  {aiPriorityLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  Suggest Priority
                </button>

                <button
                  type="button"
                  onClick={getAIComplexity}
                  disabled={aiComplexityLoading}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold border border-white/5 hover:text-slate-200 transition-all flex items-center gap-1 disabled:opacity-50"
                  title="Predict Fibonacci complexity points"
                >
                  {aiComplexityLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  Estimate Complexity
                </button>
              </div>

              {/* AI suggestion outputs */}
              {aiPrioritySuggestion && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/40 text-[11px] border border-white/5 animate-in fade-in duration-200">
                  <Info size={14} className="text-accentPurple shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">Suggested Priority: </span>
                    <span className={`font-extrabold ${
                      aiPrioritySuggestion.priority === 'High' ? 'text-rose-400' : aiPrioritySuggestion.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{aiPrioritySuggestion.priority}</span>
                    <p className="text-slate-400 mt-1 leading-normal">{aiPrioritySuggestion.reason}</p>
                  </div>
                </div>
              )}

              {aiComplexitySuggestion && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/40 text-[11px] border border-white/5 animate-in fade-in duration-200">
                  <Info size={14} className="text-accentPurple shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">Suggested Story Points: </span>
                    <span className="font-extrabold text-accentPurple">{aiComplexitySuggestion.points} Points</span>
                    <p className="text-slate-400 mt-1 leading-normal">{aiComplexitySuggestion.explanation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Task properties form */}
            <form onSubmit={handleSubmitEdit(handleUpdateTask)} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Task Title</label>
                <input 
                  {...registerEdit('title', { required: true })}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea 
                  {...registerEdit('description')}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                  <select
                    {...registerEdit('priority')}
                    className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select
                    {...registerEdit('status')}
                    className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                  >
                    <option value="Todo">Todo</option>
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assignee</label>
                  <select
                    {...registerEdit('assigneeId')}
                    className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map(m => (
                      <option key={m.userId} value={m.userId}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Due Date</label>
                  <input 
                    {...registerEdit('dueDate')}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Label</label>
                <input 
                  {...registerEdit('label')}
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl form-input-premium text-sm text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accentPurple to-accentIndigo text-white font-medium text-sm hover:opacity-90 transition-all glow-btn"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteTask(activeTask.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </form>

            <hr className="border-white/5" />

            {/* Comment Thread Board (Developer 3 collaboration module) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Comments</span>
              </div>

              {/* Form to post a comment */}
              <form onSubmit={submitComment} className="flex gap-2">
                <input 
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="grow px-4 py-2 rounded-xl form-input-premium text-xs text-slate-200 outline-none"
                  placeholder="Ask a question or post progress updates..."
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-white/5 hover:bg-slate-700 text-xs font-semibold transition-all"
                >
                  Send
                </button>
              </form>

              {/* Display existing comments list */}
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto">
                {comments.map(c => (
                  <div key={c.id} className="p-3 rounded-lg border border-white/5 bg-slate-950/15 flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400 font-semibold">
                      <span>{c.userName}</span>
                      <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 leading-normal">{c.content}</p>
                  </div>
                ))}

                {comments.length === 0 && (
                  <span className="text-[10px] text-slate-500 italic text-center py-2">No comments posted yet.</span>
                )}
              </div>
            </div>

          </div>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default WorkspaceDetail;
