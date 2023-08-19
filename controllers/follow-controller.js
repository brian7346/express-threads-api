const { prisma } = require("../prisma/prisma-client");

// FollowController.js
const FollowController = {
  followUser: async (req, res) => {
    try {
      // Who to follow
      const { followerId } = req.body;
      // Followers
      const { followingId } = req.body;

      // Check for empty fields
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if the follow already exists
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });

      if (existingFollow) {
        return res.status(400).json({ error: "Follow already exists" });
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
      res.status(500).json({ error: 'Failed to follow user' });
    }
  },

  unfollowUser: async (req, res) => {
    try {
      const { followerId, followingId } = req.body;

      // Check for empty fields
      if (!followerId || !followingId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if the follow does not exist
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });

      if (!existingFollow) {
        return res.status(400).json({ error: "Follow does not exist" });
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
      res.status(500).json({ error: 'Failed to unfollow user' });
    }
  },
};

module.exports = FollowController;
