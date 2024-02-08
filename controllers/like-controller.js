const { prisma } = require('../prisma/prisma-client');

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;

    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if(existingLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк этому посту' });
      }

      const like = await prisma.like.create({ 
        data: { postId, userId },
      });

      res.json(like);
    } catch (error) {
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  },

  unlikePost: async (req, res) => {
    const { id } = req.params;

    const userId = req.user.userId;

    if (!id) {
      return res.status(400).json({ error: 'Вы уже поставили дизлайк этому посту' });
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId: id, userId },
      });

      if(!existingLike) {
        return res.status(400).json({ error: 'Лайк уже существует' });
      }

      const like = await prisma.like.deleteMany({
        where: { postId: id, userId },
      });

      res.json(like);
    } catch (error) {
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  }
};

module.exports = LikeController