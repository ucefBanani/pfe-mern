class AdminController {
  constructor({ userRepository, projectRepository, taskRepository }) {
    this.userRepository = userRepository;
    this.projectRepository = projectRepository;
    this.taskRepository = taskRepository;
  }

  async getMetrics(req, res, next) {
    try {
      const totalUsers = await this.userRepository.countAll();
      const activeProjects = await this.projectRepository.countAll();
      const totalTasks = await this.taskRepository.countAll();
      const completedTasks = await this.taskRepository.countCompleted();

      // Productivity rate: % of tasks completed
      const productivityRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      res.status(200).json({
        totalUsers,
        activeProjects,
        totalTasks,
        completedTasks,
        productivityRate
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = AdminController;
