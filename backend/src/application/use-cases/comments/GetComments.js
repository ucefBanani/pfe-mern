class GetComments {
  constructor({ commentRepository, taskRepository, projectRepository, workspaceRepository }) {
    this.commentRepository = commentRepository;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ taskId, requesterId }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found.');
    }

    const project = await this.projectRepository.findById(task.projectId);
    if (!project) {
      throw new Error('Project not found.');
    }

    const member = await this.workspaceRepository.findMember(project.workspaceId, requesterId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    return await this.commentRepository.findByTaskId(taskId);
  }
}

module.exports = GetComments;
