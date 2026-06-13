class GetAIProjectSummary {
  constructor({ aiService, projectRepository, taskRepository }) {
    this.aiService = aiService;
    this.projectRepository = projectRepository;
    this.taskRepository = taskRepository;
  }

  async execute({ projectId }) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found.');
    }

    const tasks = await this.taskRepository.findByProjectId(projectId);

    return await this.aiService.generateProjectSummary(project, tasks);
  }
}

module.exports = GetAIProjectSummary;
