class GetWorkspaces {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ userId }) {
    return await this.workspaceRepository.findByUserMembership(userId);
  }
}

module.exports = GetWorkspaces;
