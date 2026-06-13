const Task = require('../../../domain/entities/Task');
const Notification = require('../../../domain/entities/Notification');

class CreateTask {
  constructor({ taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
    this.notificationRepository = notificationRepository;
    this.socketHandler = socketHandler; // injected real-time handler
  }

  async execute({ projectId, title, description, priority, status, assigneeId, dueDate, label, requesterId }) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found.');
    }

    const member = await this.workspaceRepository.findMember(project.workspaceId, requesterId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    const task = new Task({
      projectId,
      title,
      description,
      priority,
      status,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      label
    });

    task.validate();

    const savedTask = await this.taskRepository.save(task);

    // If assigned to another user, send notification
    if (assigneeId && assigneeId.toString() !== requesterId.toString()) {
      const notif = new Notification({
        userId: assigneeId,
        message: `You have been assigned to task: "${title}" in project "${project.name}"`,
        type: 'task'
      });
      await this.notificationRepository.save(notif);

      // Emit real-time notification
      if (this.socketHandler) {
        this.socketHandler.sendToUser(assigneeId, 'notification', notif);
      }
    }

    // Emit real-time task update to project room
    if (this.socketHandler) {
      this.socketHandler.sendToProject(projectId, 'task_created', savedTask);
    }

    return savedTask;
  }
}

module.exports = CreateTask;
