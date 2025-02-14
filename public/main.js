// User management
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Task management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

// DOM Elements
const welcomePage = document.getElementById('welcomePage');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authTabs = document.querySelectorAll('.auth-tab');
const modal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const addTaskBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const modalTitle = document.getElementById('modalTitle');

// Event Listeners
authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
});

loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
addTaskBtn?.addEventListener('click', () => openModal());
cancelBtn?.addEventListener('click', closeModal);
taskForm?.addEventListener('submit', handleTaskSubmit);
logoutBtn?.addEventListener('click', handleLogout);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        showApp();
        renderTasks();
    } else {
        showWelcome();
    }
});

function switchAuthTab(tabName) {
    // Update tab styles
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Show/hide forms
    document.getElementById('loginForm').classList.toggle('active', tabName === 'login');
    document.getElementById('registerForm').classList.toggle('active', tabName === 'register');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple user validation (in production, use proper authentication)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showApp();
        renderTasks();
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Simple user storage (in production, use proper authentication)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showApp();
}

function showWelcome() {
    welcomePage.style.display = 'block';
    appContainer.style.display = 'none';
}

function showApp() {
    welcomePage.style.display = 'none';
    appContainer.style.display = 'block';
}

function openModal(taskId = null) {
    modal.style.display = 'block';
    editingTaskId = taskId;
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        modalTitle.textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDueDate').value = task.dueDate;
    } else {
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
        // Set default due date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59);
        document.getElementById('taskDueDate').value = tomorrow.toISOString().slice(0, 16);
    }
}

function closeModal() {
    modal.style.display = 'none';
    editingTaskId = null;
    taskForm.reset();
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        dueDate: document.getElementById('taskDueDate').value,
        userId: currentUser.id
    };

    if (editingTaskId) {
        // Update existing task
        tasks = tasks.map(task => 
            task.id === editingTaskId 
                ? { ...task, ...taskData }
                : task
        );
    } else {
        // Add new task
        tasks.push({
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        });
    }

    saveTasks();
    renderTasks();
    closeModal();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getStatusLabel(status) {
    switch (status) {
        case 'not-started':
            return 'Not Started';
        case 'in-progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        default:
            return status;
    }
}

function formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = date < now && !task.completed;
    
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    return { formattedDate, isOverdue };
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        showWelcome();
    }
}

function renderTasks() {
    const tasksContainer = document.getElementById('allTasks');
    tasksContainer.innerHTML = '';

    // Filter tasks for current user and sort by due date
    const userTasks = tasks
        .filter(task => task.userId === currentUser.id)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (userTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet. Click "Add New Task" to get started!</p>
            </div>
        `;
        return;
    }

    userTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const { formattedDate, isOverdue } = formatDueDate(task.dueDate);
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
        <div class="task-content">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-due-date ${isOverdue ? 'overdue' : ''}">
                📅 Due: ${formattedDate}
                ${isOverdue ? ' (Overdue)' : ''}
            </div>
        </div>
        <span class="task-status status-${task.status}">${getStatusLabel(task.status)}</span>
        <div class="task-actions">
            <button onclick="openModal(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    return div;
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};