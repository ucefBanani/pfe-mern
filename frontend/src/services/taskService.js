import api from './api';

const taskService = {
  list: async (projectId, filters = {}) => {
    const params = new URLSearchParams({ projectId, ...filters });
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  update: async (taskId, updateData) => {
    const response = await api.put(`/tasks/${taskId}`, updateData);
    return response.data;
  },

  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getComments: async (taskId) => {
    const response = await api.get(`/comments?taskId=${taskId}`);
    return response.data;
  },

  addComment: async (taskId, content) => {
    const response = await api.post('/comments', { taskId, content });
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markNotificationRead: async (notifId) => {
    const response = await api.put(`/notifications/${notifId}/read`);
    return response.data;
  }
};

export default taskService;
