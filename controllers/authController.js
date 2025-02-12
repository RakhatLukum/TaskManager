const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Регистрация пользователя
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Проверка на существующего пользователя
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
    }

    // Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    
    // Сохраняем нового пользователя в базу
    await newUser.save();
    
    // Генерация JWT токена
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Отправляем токен
    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

// Вход пользователя
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Пользователь не найден' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверный пароль' });
    }

    // Генерация токена
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Отправка токена
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};
