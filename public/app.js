const apiUrl = 'http://localhost:5000/api';

// Получаем JWT токен из localStorage
const getToken = () => localStorage.getItem('token');

// Функция для отображения задач
const displayTasks = async () => {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html'; // Если нет токена, перенаправляем на логин
    return;
  }

  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const tasks = await response.json();
  const taskListNotStarted = document.getElementById('not-started');
  const taskListInProgress = document.getElementById('in-progress');
  const taskListCompleted = document.getElementById('completed');

  // Очищаем все списки перед отображением
  taskListNotStarted.innerHTML = '';
  taskListInProgress.innerHTML = '';
  taskListCompleted.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.title} - Status: ${task.status} - Due: ${new Date(task.dueDate).toLocaleDateString()}`;

    // Создаем кнопку редактирования
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editTask(task._id);
    li.appendChild(editButton);

    // Создаем кнопку удаления
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task._id);
    li.appendChild(deleteButton);

    // Добавляем задачу в соответствующий список
    if (task.status === 'incomplete') {
      taskListNotStarted.appendChild(li);
    } else if (task.status === 'in-progress') {
      taskListInProgress.appendChild(li);
    } else if (task.status === 'completed') {
      taskListCompleted.appendChild(li);
    }
  });
};

// Логиним пользователя
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
    window.location.href = 'tasks.html'; // Перенаправление на страницу задач
  } else {
    document.getElementById('error-message').textContent = data.msg || 'Ошибка входа';
  }
});

// Регистрация пользователя
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token); // Сохраняем токен в localStorage
    window.location.href = 'tasks.html'; // Перенаправление на страницу задач
  } else {
    document.getElementById('error-message').textContent = data.msg || 'Ошибка регистрации';
  }
});

// Добавление новой задачи
document.getElementById('add-task-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = getToken();
  if (!token) {
    window.location.href = 'login.html'; // Если нет токена, перенаправляем на логин
    return;
  }

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDate = document.getElementById('task-due-date').value;
  const status = document.getElementById('task-status').value;

  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, dueDate, status })
  });

  if (response.ok) {
    displayTasks();  // Обновляем список задач
    document.getElementById('add-task-form').reset(); // Очищаем форму
  } else {
    alert('Error creating task');
  }
});

// Функция для редактирования задачи
const editTask = async (taskId) => {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html'; // Если нет токена, перенаправляем на логин
    return;
  }

  // Получаем задачу для редактирования
  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const task = await response.json();

  // Заполняем форму редактирования
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-description').value = task.description;
  document.getElementById('task-due-date').value = new Date(task.dueDate).toISOString().split('T')[0];
  document.getElementById('task-status').value = task.status;

  // Изменяем кнопку формы на "Update Task"
  const submitButton = document.getElementById('add-task-button');
  submitButton.textContent = 'Update Task';

  // Добавляем обработчик для обновления задачи
  submitButton.onclick = async () => {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const status = document.getElementById('task-status').value;

    const updateResponse = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, dueDate, status })
    });

    if (updateResponse.ok) {
      displayTasks();  // Обновляем список задач
      document.getElementById('add-task-form').reset(); // Очищаем форму
      submitButton.textContent = 'Add Task'; // Восстанавливаем текст кнопки
    } else {
      alert('Error updating task');
    }
  };
};

// Функция для удаления задачи
const deleteTask = async (taskId) => {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html'; // Если нет токена, перенаправляем на логин
    return;
  }

  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    displayTasks();  // Перезагружаем список задач после удаления
  } else {
    alert('Error deleting task');
  }
};

// Вызываем displayTasks на странице задач
if (window.location.pathname === '/tasks.html') {
  displayTasks();
}
