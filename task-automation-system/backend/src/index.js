const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { parseISO, isWithinInterval, addMinutes } = require('date-fns');
const { getTasks, addTask, updateTask, loadTasks, saveTasks } = require('./store');
const { sseHandler, broadcast } = require('./sse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN, methods: ['GET','POST','PUT','OPTIONS'], credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/tasks', (req, res) => {
  res.json(getTasks());
});

app.post('/api/tasks', (req, res) => {
  const { title, description = '', assignedTo = 'intern', dueAt } = req.body || {};
  if (!title || !dueAt) {
    return res.status(400).json({ error: 'title and dueAt are required' });
  }
  try {
    const task = addTask({ title, description, assignedTo, dueAt });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body || {};
  try {
    const updated = updateTask(id, updates);
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.get('/api/events', sseHandler);

// Cron: check every minute for tasks due within the next minute
cron.schedule('* * * * *', () => {
  const now = new Date();
  const windowEnd = addMinutes(now, 1);
  const tasks = getTasks();
  tasks.forEach(t => {
    try {
      const due = parseISO(t.dueAt);
      const notDone = t.status !== 'done';
      const notReminded = !t.lastRemindedAt;
      const dueSoon = isWithinInterval(due, { start: now, end: windowEnd });
      if (notDone && dueSoon && notReminded) {
        broadcast({ type: 'reminder', task: t });
        updateTask(t.id, { lastRemindedAt: new Date().toISOString() });
      }
    } catch {}
  });
});

// Cron: create a daily sample task at 09:00 Mon-Fri
cron.schedule('0 9 * * 1-5', () => {
  const today = new Date();
  const dueAt = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0).toISOString();
  addTask({
    title: 'Daily Standup Report',
    description: 'Submit daily standup update',
    assignedTo: 'intern',
    dueAt
  });
});

// Load tasks into memory on startup
loadTasks();

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
