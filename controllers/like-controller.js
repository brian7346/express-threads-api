const { prisma } = require('../prisma/prisma-client');

// LikeController.js
const LikeController = {
  likePost: async (req, res) => {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if(existingLike) {
        return res.status(400).json({ error: 'Like already exists' });
      }

      const like = await prisma.like.create({ 
        data: { postId, userId },
      });

      res.json(like);
    } catch (error) {
      console.error("Error in likePost:", error);

      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  unlikePost: async (req, res) => {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if(!existingLike) {
        return res.status(400).json({ error: 'Like does not exist' });
      }

      const like = await prisma.like.deleteMany({
        where: { postId, userId },
      });

      res.json(like);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  },
};

module.exports = LikeController