class GetAIProductivityReport {
  constructor({ aiService, taskRepository, projectRepository }) {
    this.aiService = aiService;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
  }

  async execute({ workspaceId }) {
    // Collect all tasks under projects belonging to this workspace
    // First find projects in this workspace
    const projects = await this.projectRepository.findByWorkspaceId(workspaceId);
    const projectIds = projects.map(p => p.id);

    let allTasks = [];
    for (const projectId of projectIds) {
      const tasks = await this.taskRepository.findByProjectId(projectId);
      allTasks = allTasks.concat(tasks);
    }

    return await this.aiService.generateWeeklyProductivityReport(allTasks);
  }
}

module.exports = GetAIProductivityReport;
