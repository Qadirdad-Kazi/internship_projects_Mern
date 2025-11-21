const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

let tasks = [];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, '[]');
}

function loadTasks() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
    tasks = JSON.parse(raw);
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  ensureDataFile();
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function getTasks() {
  return tasks.slice().sort((a,b) => new Date(a.dueAt) - new Date(b.dueAt));
}

function addTask({ title, description = '', assignedTo = 'intern', dueAt }) {
  if (!title || !dueAt) throw new Error('title and dueAt required');
  const task = {
    id: uuid(),
    title,
    description,
    assignedTo,
    dueAt,
    status: 'open',
    createdAt: new Date().toISOString(),
    lastRemindedAt: null
  };
  tasks.push(task);
  saveTasks();
  return task;
}

function updateTask(id, updates) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Task not found');
  tasks[idx] = { ...tasks[idx], ...updates };
  saveTasks();
  return tasks[idx];
}

module.exports = { loadTasks, saveTasks, getTasks, addTask, updateTask };
