import { supabase } from './supabaseClient.js';

const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');

let currentUser = null;

// Initialize & check user state
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = session.user;
  fetchTasks();
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

// Fetch all tasks for current user
async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error.message);
    return;
  }

  renderTasks(data);
}

// Render tasks to DOM
function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <span>${task.title}</span>
      <button class="delete-btn" data-id="${task.id}">🗑️</button>
    `;

    // Toggle completion on text click
    li.querySelector('span').addEventListener('click', () => toggleTask(task.id, !task.completed));

    // Delete task on button click
    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });
}

// Add task
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  const { error } = await supabase
    .from('tasks')
    .insert([{ title, user_id: currentUser.id }]);

  if (error) {
    console.error('Error adding task:', error.message);
  } else {
    taskInput.value = '';
    fetchTasks();
  }
});

// Toggle task status
async function toggleTask(id, completed) {
  const { error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id);

  if (!error) fetchTasks();
}

// Delete task
async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (!error) fetchTasks();
}