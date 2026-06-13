const Project = require('../../../domain/entities/Project');

class CreateProject {
  constructor({ projectRepository, workspaceRepository }) {
    this.projectRepository = projectRepository;
    this.workspaceRepository = workspaceRepository;
  }

  async execute({ name, description, workspaceId, requesterId }) {
    const member = await this.workspaceRepository.findMember(workspaceId, requesterId);
    if (!member) {
      throw new Error('Unauthorized. You are not a member of this workspace.');
    }

    const project = new Project({
      name,
      description,
      workspaceId
    });

    project.validate();

    return await this.projectRepository.save(project);
  }
}

module.exports = CreateProject;
