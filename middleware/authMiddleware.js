const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ msg: 'Нет авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ msg: 'Пользователь не найден' });
    }

    req.user = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Неверный или просроченный токен' });
  }
};

module.exports = authMiddleware;
