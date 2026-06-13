class GetAITaskPriority {
  constructor({ aiService }) {
    this.aiService = aiService;
  }

  async execute({ taskTitle, taskDescription }) {
    return await this.aiService.suggestPriority(taskTitle, taskDescription);
  }
}

module.exports = GetAITaskPriority;
