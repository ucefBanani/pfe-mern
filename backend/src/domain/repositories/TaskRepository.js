class TaskRepository {
  async save(task) { throw new Error('Method not implemented.'); }
  async findById(id) { throw new Error('Method not implemented.'); }
  async findByProjectId(projectId, { status, priority, search, assigneeId } = {}) { throw new Error('Method not implemented.'); }
  async deleteById(id) { throw new Error('Method not implemented.'); }
  async countAll() { throw new Error('Method not implemented.'); }
  async countCompleted() { throw new Error('Method not implemented.'); }
}

module.exports = TaskRepository;
