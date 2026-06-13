class CommentController {
  constructor({ addComment, getComments }) {
    this.addComment = addComment;
    this.getComments = getComments;
  }

  async create(req, res, next) {
    try {
      const { taskId, content } = req.body;
      const userId = req.user.id;
      const userName = req.user.name || req.user.email; // Resolved in auth payload or loaded later

      const comment = await this.addComment.execute({
        taskId,
        userId,
        userName,
        content
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { taskId } = req.query;
      const requesterId = req.user.id;

      if (!taskId) {
        return res.status(400).json({ error: 'taskId is required.' });
      }

      const comments = await this.getComments.execute({ taskId, requesterId });
      res.status(200).json(comments);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = CommentController;
