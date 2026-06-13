class GetProjects {
  constructor({ projectRepository, workspaceRepository }) {
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ workspaceId, requesterId }) {
    const member = await this.workspaceRepository.findMember(workspaceId, requesterId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    return await this.projectRepository.findByWorkspaceId(workspaceId);
  }
}

module.exports = GetProjects;
