class Task {
  constructor({
    id,
    projectId,
    title,
    description = '',
    status = 'Todo',
    priority = 'Medium',
    assigneeId = null,
    dueDate = null,
    label = '',
    createdAt = new Date()
  } = {}) {
    this.id = id;
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.status = status; // 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done'
    this.priority = priority; // 'Low' | 'Medium' | 'High'
    this.assigneeId = assigneeId; // User ID
    this.dueDate = dueDate;
    this.label = label;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Task title is required.');
    }
    if (!this.projectId) {
      throw new Error('Project association is required.');
    }
    const validStatuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Invalid status: ${this.status}. Must be one of ${validStatuses.join(', ')}`);
    }
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(this.priority)) {
      throw new Error(`Invalid priority: ${this.priority}. Must be one of ${validPriorities.join(', ')}`);
    }
  }
}

module.exports = Task;
