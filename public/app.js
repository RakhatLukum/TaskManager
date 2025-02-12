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
  const taskList = document.getElementById('tasks');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.title} - ${task.status} - Due: ${new Date(task.dueDate).toLocaleDateString()}`;

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

    taskList.appendChild(li);
  });
};

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

  // Изменяем кнопку формы на "Update Task"
  const submitButton = document.getElementById('add-task-button');
  submitButton.textContent = 'Update Task';

  // Добавляем обработчик для обновления задачи
  submitButton.onclick = async () => {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;

    const updateResponse = await fetch(`${apiUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, dueDate })
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
