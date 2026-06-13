const Notification = require('../../../domain/entities/Notification');

class UpdateTask {
  constructor({ taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
    this.notificationRepository = notificationRepository;
    this.socketHandler = socketHandler;
  }

  async execute({ taskId, title, description, priority, status, assigneeId, dueDate, label, requesterId }) {
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

    const previousAssignee = task.assigneeId;

    // Apply updates
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (assigneeId !== undefined) task.assigneeId = assigneeId;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (label !== undefined) task.label = label;

    task.validate();

    const savedTask = await this.taskRepository.save(task);

    // If assignee changed, send notification
    if (assigneeId && assigneeId.toString() !== requesterId.toString() && (!previousAssignee || previousAssignee.toString() !== assigneeId.toString())) {
      const notif = new Notification({
        userId: assigneeId,
        message: `You have been assigned to task: "${task.title}" in project "${project.name}"`,
        type: 'task'
      });
      await this.notificationRepository.save(notif);

      if (this.socketHandler) {
        this.socketHandler.sendToUser(assigneeId, 'notification', notif);
      }
    }

    // Emit socket event to project
    if (this.socketHandler) {
      this.socketHandler.sendToProject(project.id, 'task_updated', savedTask);
    }

    return savedTask;
  }
}

module.exports = UpdateTask;
