class GetTasks {
  constructor({ taskRepository, projectRepository, workspaceRepository }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ projectId, status, priority, search, assigneeId, requesterId }) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found.');
    }

    const member = await this.workspaceRepository.findMember(project.workspaceId, requesterId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    return await this.taskRepository.findByProjectId(projectId, { status, priority, search, assigneeId });
  }
}

module.exports = GetTasks;
