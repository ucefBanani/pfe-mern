class Project {
  constructor({ id, name, description = '', workspaceId, createdAt = new Date() } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.workspaceId = workspaceId;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Project name is required.');
    }
    if (!this.workspaceId) {
      throw new Error('Workspace association is required.');
    }
  }
}

module.exports = Project;
