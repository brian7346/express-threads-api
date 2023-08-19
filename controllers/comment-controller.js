const { prisma } = require('../prisma/prisma-client');

// CommentController.js
const CommentController = {
  createComment: async (req, res) => {
    try {
      const { postId, userId, content } = req.body;

      // Check for empty fields
      if (!postId || !userId || !content) {
        return res.status(400).json({ error: 'All fields are required' });
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
      res.status(500).json({ error: 'Failed to create comment' });
    }
  },

  getAllComments: async (req, res) => {
    try {
      const comments = await prisma.comment.findMany();
      res.json(comments);
    } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ error: 'Failed to retrieve comments' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if comment exists
      const comment = await prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Delete the comment
      await prisma.comment.delete({ where: { id } });

      res.json(comment);
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  },
};


module.exports = CommentController