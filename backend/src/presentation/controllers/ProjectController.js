class ProjectController {
  constructor({ createProject, getProjects, getAIProjectSummary }) {
    this.createProject = createProject;
    this.getProjects = getProjects;
    this.getAIProjectSummary = getAIProjectSummary;
  }

  async create(req, res, next) {
    try {
      const { name, description, workspaceId } = req.body;
      const requesterId = req.user.id;
      const project = await this.createProject.execute({ name, description, workspaceId, requesterId });
      res.status(201).json(project);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { workspaceId } = req.query;
      const requesterId = req.user.id;

      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId query parameter is required.' });
      }

      const projects = await this.getProjects.execute({ workspaceId, requesterId });
      res.status(200).json(projects);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async getAISummary(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getAIProjectSummary.execute({ projectId: id });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = ProjectController;
