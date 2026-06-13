class WorkspaceRepository {
  async save(workspace) { throw new Error('Method not implemented.'); }
  async findById(id) { throw new Error('Method not implemented.'); }
  async findByOwner(ownerId) { throw new Error('Method not implemented.'); }
  async findByUserMembership(userId) { throw new Error('Method not implemented.'); }
  async addMember(workspaceId, userId, role) { throw new Error('Method not implemented.'); }
  async getMembers(workspaceId) { throw new Error('Method not implemented.'); }
  async findMember(workspaceId, userId) { throw new Error('Method not implemented.'); }
}

module.exports = WorkspaceRepository;
