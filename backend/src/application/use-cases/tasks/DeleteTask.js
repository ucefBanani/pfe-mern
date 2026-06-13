class DeleteTask {
  constructor({ taskRepository, projectRepository, workspaceRepository, socketHandler }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
    this.socketHandler = socketHandler;
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

    await this.taskRepository.deleteById(taskId);

    if (this.socketHandler) {
      this.socketHandler.sendToProject(project.id, 'task_deleted', { id: taskId });
    }

    return { success: true, message: 'Task deleted successfully.' };
  }
}

module.exports = DeleteTask;
