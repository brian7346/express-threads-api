const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth");
const { prisma } = require("../prisma/prisma-client");

// UserController.js
const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    // Check for empty fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Find the user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Check the password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate a JWT
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAllUsers: [
    authenticateToken,
    async (req, res) => {
      try {
        const users = await prisma.user.findMany();
        res.json(users);
      } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  ],

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
      console.error("Error in updateUser:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = UserController;
