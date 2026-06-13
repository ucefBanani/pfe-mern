class Workspace {
  constructor({ id, name, description = '', owner, createdAt = new Date() } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.owner = owner; // User ID
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Workspace name is required.');
    }
    if (!this.owner) {
      throw new Error('Workspace owner is required.');
    }
  }
}

module.exports = Workspace;
