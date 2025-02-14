// main.js

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
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.getElementById('loginForm').classList.toggle('active', tabName === 'login');
    document.getElementById('registerForm').classList.toggle('active', tabName === 'register');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
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
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
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
        // NEW: Set the time field value
        if(document.getElementById('taskTime')){
            document.getElementById('taskTime').value = task.time || '';
        }
    } else {
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
        // Set default due date to tomorrow at 23:59
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
    
    // Include the new time field
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value, // should be "not‑started", "incomplete", or "finished"
        dueDate: document.getElementById('taskDueDate').value,
        time: document.getElementById('taskTime') ? document.getElementById('taskTime').value : '',
        userId: currentUser.id
    };

    if (editingTaskId) {
        tasks = tasks.map(task => 
            task.id === editingTaskId 
                ? { ...task, ...taskData }
                : task
        );
    } else {
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

// Updated status labels to match backend allowed values
function getStatusLabel(status) {
    switch (status) {
        case 'not-started':
            return 'Not Started';
        case 'incomplete':
            return 'Incomplete';
        case 'finished':
            return 'Finished';
        default:
            return status;
    }
}

// Updated: Removed undefined reference to task.completed
function formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const now = new Date();
    const isOverdue = date < now; 
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
            <div class="task-time">
                ⏰ Time: ${task.time || 'N/A'}
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
