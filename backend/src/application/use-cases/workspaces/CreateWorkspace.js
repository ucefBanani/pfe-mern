const Workspace = require('../../../domain/entities/Workspace');

class CreateWorkspace {
  constructor({ workspaceRepository }) {
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ name, description, ownerId }) {
    const workspace = new Workspace({
      name,
      description,
      owner: ownerId
    });

    workspace.validate();

    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // Automatically add the owner as an Admin member of the workspace
    await this.workspaceRepository.addMember(savedWorkspace.id, ownerId, 'Admin');

    return savedWorkspace;
  }
}

module.exports = CreateWorkspace;
