const Comment = require('../../../domain/entities/Comment');
const Notification = require('../../../domain/entities/Notification');

class AddComment {
  constructor({ commentRepository, taskRepository, projectRepository, workspaceRepository, notificationRepository, socketHandler }) {
    this.commentRepository = commentRepository;
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
    this.notificationRepository = notificationRepository;
    this.socketHandler = socketHandler;
  }

  async execute({ taskId, userId, userName, content }) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found.');
    }

    const project = await this.projectRepository.findById(task.projectId);
    if (!project) {
      throw new Error('Project not found.');
    }

    const member = await this.workspaceRepository.findMember(project.workspaceId, userId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    const comment = new Comment({
      taskId,
      userId,
      content
    });

    comment.validate();

    const savedComment = await this.commentRepository.save(comment);
    // Attach userName for presentation layer
    savedComment.userName = userName;

    // Send notification to assignee if assignee is not the commenter
    if (task.assigneeId && task.assigneeId.toString() !== userId.toString()) {
      const notif = new Notification({
        userId: task.assigneeId,
        message: `${userName} commented on task "${task.title}": "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
        type: 'info'
      });
      await this.notificationRepository.save(notif);

      if (this.socketHandler) {
        this.socketHandler.sendToUser(task.assigneeId, 'notification', notif);
      }
    }

    // Emit comment to project room for real-time update in comments thread
    if (this.socketHandler) {
      this.socketHandler.sendToProject(project.id, 'comment_created', savedComment);
    }

    return savedComment;
  }
}

module.exports = AddComment;
