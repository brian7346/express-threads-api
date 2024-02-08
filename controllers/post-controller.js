const { prisma } = require('../prisma/prisma-client');

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body;

    const authorId = req.user.userId;

    if (!content) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId
        },
      });

      res.json(post);
    } catch (error) {
      console.error("Error in createPost:", error);

      res.status(500).json({ error: 'There was an error creating the post' });
    }
  },

  getAllPosts: async (req, res) => {
    const userId = req.user.userId;

    try {
      const posts = await prisma.post.findMany({
        include: {
          likes: true,
          author: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc' // 'desc' означает сортировку по убыванию, т.е. новые посты будут первыми
        }
      });

      const postsWithLikeInfo = posts.map(post => ({
        ...post,
        likedByUser: post.likes.some(like => like.userId === userId)
      }));

      res.json(postsWithLikeInfo);
    } catch (err) {
      res.status(500).json({ error: 'Произошла ошибка при получении постов' });
    }
  },

  getPostById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          comments: {
            include: {
              user: true,
            }
          },
          likes: true,
          author: true
        }, // Include related posts
      });

      if (!post) {
        return res.status(404).json({ error: 'Пост не найден' });
      }

      const postWithLikeInfo = {
        ...post,
        likedByUser: post.likes.some(like => like.userId === userId)
      };

      res.json(postWithLikeInfo);
    } catch (error) {
      res.status(500).json({ error: 'Произошла ошибка при получении поста' });
    }
 },


  deletePost: async (req, res) => {
    const { id } = req.params;

    // Проверка, что пользователь удаляет свой пост
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({ error: "Нет доступа" });
    }

    try {
      const transaction = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } }),
      ]);

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  }
};

module.exports = PostController