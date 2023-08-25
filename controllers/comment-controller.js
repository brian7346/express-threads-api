const { prisma } = require('../prisma/prisma-client');

// CommentController.js
const CommentController = {
  createComment: async (req, res) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user.id;
  
      // Check for empty fields
      if (!postId || !userId || !content) {
        return res.status(400).json({ error: 'Все поля обязательны' });
      }
  
      // Create the comment
      const comment = await prisma.comment.create({
        data: {
          postId,
          userId,
          content,
        },
      });
  
      res.json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Не удалось создать комментарий' });
    }
  },

  getAllComments: async (req, res) => {
    try {
      const comments = await prisma.comment.findMany();
      res.json(comments);
    } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ error: 'Не удалось получить комментарии' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      // Check if comment exists
      const comment = await prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        return res.status(404).json({ error: 'Комментарий не найден' });
      }
  
      // Check if the user is the owner of the comment
      if (comment.userId !== userId) {
        return res.status(403).json({ error: 'Вы не авторизованы для удаления этого комментария' });
      }
  
      // Delete the comment
      await prisma.comment.delete({ where: { id } });
  
      res.json(comment);
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Не удалось удалить комментарий' });
    }
  }
};


module.exports = CommentController