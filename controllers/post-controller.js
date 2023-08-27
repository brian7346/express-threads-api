const { prisma } = require('../prisma/prisma-client');

// PostController.js
const PostController = {
  createPost: async (req, res) => {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
      });

      res.json(post);
    } catch(error) {
      console.error("Error in createPost:", error);
  
      res.status(500).json({ error: 'There was an error creating the post' });
    }
  },

  getAllPosts: async (_req, res) => {
    try {
      const posts = await prisma.post.findMany();
      res.json(posts);
    } catch(err) {
      res.status(500).json({ error: 'There was an error retrieving the posts' });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await prisma.post.findUnique({ where: { id } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch(error) {
      console.error("Error in getPostById:", error);

      res.status(500).json({ error: 'There was an error retrieving the post' });
    }
  },

  deletePost: async (req, res) => {
    const { id } = req.params;
  
    // Проверка, что пользователь удаляет свой пост
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }
  
    try {
      const transaction = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);
  
      res.json(transaction);
    } catch (error) {
      console.error("Error in deletePost:", error);
  
      res.status(500).json({ error: 'There was an error deleting the post' });
    }
  }
};

module.exports = PostController