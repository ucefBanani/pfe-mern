class GetAITaskComplexity {
  constructor({ aiService }) {
    this.aiService = aiService;
  }

  async execute({ taskTitle, taskDescription }) {
    return await this.aiService.estimateComplexity(taskTitle, taskDescription);
  }
}

module.exports = GetAITaskComplexity;
