import api from './api';

const workspaceService = {
  list: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  create: async (name, description) => {
    const response = await api.post('/workspaces', { name, description });
    return response.data;
  },

  addMember: async (workspaceId, email, role = 'Member') => {
    const response = await api.post(`/workspaces/${workspaceId}/members`, { email, role });
    return response.data;
  },

  getMembers: async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  listProjects: async (workspaceId) => {
    const response = await api.get(`/projects?workspaceId=${workspaceId}`);
    return response.data;
  },

  createProject: async (workspaceId, name, description) => {
    const response = await api.post('/projects', { workspaceId, name, description });
    return response.data;
  }
};

export default workspaceService;
