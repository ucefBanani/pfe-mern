class WorkspaceController {
  constructor({ createWorkspace, addWorkspaceMember, getWorkspaces, workspaceRepository }) {
    this.createWorkspace = createWorkspace;
    this.addWorkspaceMember = addWorkspaceMember;
    this.getWorkspaces = getWorkspaces;
    this.workspaceRepository = workspaceRepository;
  }

  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const ownerId = req.user.id;
      const workspace = await this.createWorkspace.execute({ name, description, ownerId });
      res.status(201).json(workspace);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.id;
      const workspaces = await this.getWorkspaces.execute({ userId });
      res.status(200).json(workspaces);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      const { workspaceId } = req.params;
      const { email, role } = req.body;
      const requesterId = req.user.id;
      const result = await this.addWorkspaceMember.execute({ workspaceId, email, role, requesterId });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const { workspaceId } = req.params;
      const requesterId = req.user.id;

      // Ensure requester is a member of the workspace
      const member = await this.workspaceRepository.findMember(workspaceId, requesterId);
      if (!member) {
        return res.status(403).json({ error: 'Unauthorized. You are not a member of this workspace.' });
      }

      const members = await this.workspaceRepository.getMembers(workspaceId);
      res.status(200).json(members);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = WorkspaceController;
