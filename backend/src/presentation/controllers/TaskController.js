class TaskController {
  constructor({
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getAITaskPriority,
    getAITaskDescription,
    getAITaskComplexity,
    getAIProductivityReport,
    taskRepository
  }) {
    this.createTask = createTask;
    this.getTasks = getTasks;
    this.updateTask = updateTask;
    this.deleteTask = deleteTask;
    this.getAITaskPriority = getAITaskPriority;
    this.getAITaskDescription = getAITaskDescription;
    this.getAITaskComplexity = getAITaskComplexity;
    this.getAIProductivityReport = getAIProductivityReport;
    this.taskRepository = taskRepository;
  }

  async create(req, res, next) {
    try {
      const { projectId, title, description, priority, status, assigneeId, dueDate, label } = req.body;
      const requesterId = req.user.id;
      const task = await this.createTask.execute({
        projectId, title, description, priority, status, assigneeId, dueDate, label, requesterId
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { projectId } = req.query;
      const { status, priority, search, assigneeId } = req.query;
      const requesterId = req.user.id;

      if (!projectId) {
        return res.status(400).json({ error: 'projectId is required.' });
      }

      const tasks = await this.getTasks.execute({
        projectId, status, priority, search, assigneeId, requesterId
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, priority, status, assigneeId, dueDate, label } = req.body;
      const requesterId = req.user.id;

      const task = await this.updateTask.execute({
        taskId: id, title, description, priority, status, assigneeId, dueDate, label, requesterId
      });
      res.status(200).json(task);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const requesterId = req.user.id;
      const result = await this.deleteTask.execute({ taskId: id, requesterId });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  // AI Priorities suggestions
  async suggestPriority(req, res, next) {
    try {
      const { title, description } = req.body;
      const result = await this.getAITaskPriority.execute({ taskTitle: title, taskDescription: description });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  // AI Description suggestion
  async suggestDescription(req, res, next) {
    try {
      const { title } = req.body;
      const description = await this.getAITaskDescription.execute({ taskTitle: title });
      res.status(200).json({ description });
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  // AI Complexity points estimation
  async estimateComplexity(req, res, next) {
    try {
      const { title, description } = req.body;
      const result = await this.getAITaskComplexity.execute({ taskTitle: title, taskDescription: description });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  // AI Weekly report
  async getWeeklyReport(req, res, next) {
    try {
      const { workspaceId } = req.params;
      const result = await this.getAIProductivityReport.execute({ workspaceId });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = TaskController;
