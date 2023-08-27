const { prisma } = require("../prisma/prisma-client");

// FollowController.js
const FollowController = {
  followUser: async (req, res) => {
    try {
      // Who to follow
      const { followingId } = req.body;
      // Follower
      const followerId = req.user.userId;
  
      // Check for empty fields
      if (!followerId || !followingId) {
        return res.status(400).json({ error: 'Все поля обязательны' });
      }
  
      // Check if the follow already exists
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });
  
      if (existingFollow) {
        return res.status(400).json({ error: 'Вы уже подписаны на этого пользователя' });
      }
  
      // Check if the user is trying to follow themselves
      if (followerId === followingId) {
        return res.status(400).json({ error: "Вы не можете подписаться на самого себя" });
      }
  
      // Create the follow
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
  
      res.json(follow);
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
  },

  unfollowUser: async (req, res) => {
    try {
      const { followingId } = req.body;
      const followerId = req.user.userId;
  
      // Check for empty fields
      if (!followerId || !followingId) {
        return res.status(400).json({ error: 'Все поля обязательны' });
      }
  
      // Check if the follow does not exist
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });
  
      if (!existingFollow) {
        return res.status(400).json({ error: "Вы не подписаны на этого пользователя" });
      }
  
      // Check if the user is trying to unfollow themselves
      if (followerId === followingId) {
        return res.status(400).json({ error: "Вы не можете отписаться от себя" });
      }
  
      // Delete the follow
      const follow = await prisma.follow.deleteMany({
        where: {
          followerId,
          followingId,
        },
      });
  
      res.json(follow);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Ошибка при попытке отписаться' });
    }
  }
};

module.exports = FollowController;
