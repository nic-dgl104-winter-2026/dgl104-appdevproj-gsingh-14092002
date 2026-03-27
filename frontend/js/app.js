const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let editingTaskId = null;
let chartInstance = null;

window.onload = () => {
  if (token) {
    showApp();
  }
};

// ─── AUTH ─────────────────────────────────────────

function showTab(tab, el) {
  if (tab === 'login') {
    document.getElementById('login-tab').style.display = 'block';
    document.getElementById('register-tab').style.display = 'none';
  } else {
    document.getElementById('login-tab').style.display = 'none';
    document.getElementById('register-tab').style.display = 'block';
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

async function register() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const role = document.getElementById('reg-role').value;
  const errorEl = document.getElementById('reg-error');

  if (!username || !password) {
    errorEl.style.color = '#e74c3c';
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      errorEl.style.color = '#27ae60';
      errorEl.textContent = 'Account created! Please login now.';
      document.getElementById('reg-username').value = '';
      document.getElementById('reg-password').value = '';
    } else {
      errorEl.style.color = '#e74c3c';
      errorEl.textContent = data.error;
    }
  } catch (err) {
    errorEl.style.color = '#e74c3c';
    errorEl.textContent = 'Cannot connect to server';
  }
}

async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');

  if (!username || !password) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('role', data.user.role);
      showApp();
    } else {
      errorEl.textContent = data.error;
    }
  } catch (err) {
    errorEl.textContent = 'Cannot connect to server';
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  document.getElementById('app-page').style.display = 'none';
  document.getElementById('auth-page').style.display = 'flex';
}

function showApp() {
  document.getElementById('auth-page').style.display = 'none';
  document.getElementById('app-page').style.display = 'block';
  const username = localStorage.getItem('username') || '';
  const role = localStorage.getItem('role') || '';
  document.getElementById('nav-username').textContent = `Hello, ${username} (${role})`;

  // Hide Add Task button for developer and tester
  if (role === 'developer' || role === 'tester') {
    document.querySelector('.add-btn').style.display = 'none';
  } else {
    document.querySelector('.add-btn').style.display = 'inline-block';
  }

  loadTasks();
}

// ─── USERS ───────────────────────────────────────

async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`, {
      headers: { 'authorization': token },
    });
    const users = await res.json();
    const select = document.getElementById('task-assign');
    select.innerHTML = '<option value="">Unassigned</option>';
    if (Array.isArray(users)) {
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.username} (${user.role})`;
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Could not load users', err);
  }
}

// ─── TASKS ───────────────────────────────────────

let currentSort = 'priority';

function changeSortStrategy(value) {
  currentSort = value;
  loadTasks();
}

async function loadTasks() {
  try {
    const res = await fetch(`${API}/tasks?sortBy=${currentSort}`, {
      headers: { 'authorization': token },
    });
    const tasks = await res.json();
    if (Array.isArray(tasks)) {
      renderTasks(tasks);
      updateStats(tasks);
    }
  } catch (err) {
    console.error('Could not load tasks', err);
  }
}

function renderTasks(tasks) {
  document.getElementById('col-todo').innerHTML = '';
  document.getElementById('col-inprogress').innerHTML = '';
  document.getElementById('col-completed').innerHTML = '';

  tasks.forEach(task => {
    const card = createTaskCard(task);
    if (task.status === 'todo') {
      document.getElementById('col-todo').appendChild(card);
    } else if (task.status === 'inprogress') {
      document.getElementById('col-inprogress').appendChild(card);
    } else {
      document.getElementById('col-completed').appendChild(card);
    }
  });
}

function createTaskCard(task) {
  const role = localStorage.getItem('role') || '';
  const canDelete = role === 'admin' || role === 'manager';

  const card = document.createElement('div');
  card.className = `task-card ${task.priority}`;
  card.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description || 'No description'}</p>
    <p>Due: ${task.due_date || 'No due date'}</p>
    <p>Assigned to: ${task.assigned_to ? 'User #' + task.assigned_to : 'Unassigned'}</p>
    <span class="badge ${task.priority}">${task.priority}</span>
    <div class="task-actions">
      <button class="edit-btn" onclick="openEditModal(${task.id})">Edit</button>
      ${canDelete ? `<button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>` : ''}
    </div>
  `;
  return card;
}

function updateStats(tasks) {
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inprogress = tasks.filter(t => t.status === 'inprogress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  document.getElementById('count-todo').textContent = todo;
  document.getElementById('count-inprogress').textContent = inprogress;
  document.getElementById('count-completed').textContent = completed;

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (todo + inprogress + completed === 0) return;

  const ctx = document.getElementById('taskChart').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [{
        data: [todo, inprogress, completed],
        backgroundColor: ['#e74c3c', '#f39c12', '#27ae60'],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 11 },
            padding: 8,
          }
        }
      }
    }
  });
}

// ─── MODAL ───────────────────────────────────────

function openModal() {
  editingTaskId = null;
  document.getElementById('modal-title').textContent = 'Add Task';
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-status').value = 'todo';
  document.getElementById('task-due').value = '';
  document.getElementById('task-error').textContent = '';
  loadUsers();
  document.getElementById('modal').style.display = 'flex';
}

async function openEditModal(id) {
  editingTaskId = id;
  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      headers: { 'authorization': token },
    });
    const task = await res.json();
    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-due').value = task.due_date || '';
    document.getElementById('task-error').textContent = '';
    await loadUsers();
    document.getElementById('task-assign').value = task.assigned_to || '';
    document.getElementById('modal').style.display = 'flex';
  } catch (err) {
    console.error('Could not load task', err);
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

async function saveTask() {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const priority = document.getElementById('task-priority').value;
  const status = document.getElementById('task-status').value;
  const due_date = document.getElementById('task-due').value;
  const assigned_to = document.getElementById('task-assign').value;

  if (!title) {
    document.getElementById('task-error').textContent = 'Title is required';
    return;
  }

  const url = editingTaskId
    ? `${API}/tasks/${editingTaskId}`
    : `${API}/tasks`;
  const method = editingTaskId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'authorization': token,
      },
      body: JSON.stringify({
        title, description, priority,
        status, due_date, assigned_to
      }),
    });
    if (res.ok) {
      closeModal();
      loadTasks();
    } else {
      const data = await res.json();
      document.getElementById('task-error').textContent = data.error;
    }
  } catch (err) {
    document.getElementById('task-error').textContent = 'Server error';
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await fetch(`${API}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'authorization': token },
    });
    loadTasks();
  } catch (err) {
    console.error('Could not delete task', err);
  }
}