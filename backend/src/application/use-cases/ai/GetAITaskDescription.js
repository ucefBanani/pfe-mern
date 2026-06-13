class GetAITaskDescription {
  constructor({ aiService }) {
    this.aiService = aiService;
  }

  async execute({ taskTitle }) {
    return await this.aiService.suggestDescription(taskTitle);
  }
}

module.exports = GetAITaskDescription;
