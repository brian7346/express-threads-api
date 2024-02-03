const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Полчуить токен из заголовка Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Проверям, есть ли токен
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Проверяем токен
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;

    next();
  });
};

module.exports = { authenticateToken };
