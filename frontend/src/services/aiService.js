import api from './api';

const aiService = {
  suggestPriority: async (title, description) => {
    const response = await api.post('/tasks/suggest-priority', { title, description });
    return response.data; // returns { priority, reason }
  },

  suggestDescription: async (title) => {
    const response = await api.post('/tasks/suggest-description', { title });
    return response.data; // returns { description }
  },

  estimateComplexity: async (title, description) => {
    const response = await api.post('/tasks/estimate-complexity', { title, description });
    return response.data; // returns { points, explanation }
  },

  getProjectSummary: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/ai-summary`);
    return response.data; // returns { totalTasks, completedTasks, activeTasks, summary }
  },

  getWeeklyReport: async (workspaceId) => {
    const response = await api.get(`/tasks/weekly-report/${workspaceId}`);
    return response.data; // returns { completionRate, reportText }
  }
};

export default aiService;
