const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');

// Загружаем переменные окружения
dotenv.config();

// Подключаем базу данных
connectDB();

// Создаем Express-приложение
const app = express();

// Позволяет парсить JSON в запросах
app.use(express.json());

// Подключаем маршруты API
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// Отдаем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));  // Убедитесь, что папка 'public' существует

// Запускаем сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
