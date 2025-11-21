import React, { useEffect, useState } from 'react'
import './styles.css'

const api = {
  async listTasks() {
    const res = await fetch('/api/tasks')
    return res.json()
  },
  async addTask(task) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (!res.ok) throw new Error('Failed to add task')
    return res.json()
  },
  async updateTask(id, updates) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error('Failed to update task')
    return res.json()
  }
}

function notify(title, body) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'granted') {
    new Notification(title, { body })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => {
      if (p === 'granted') new Notification(title, { body })
    })
  }
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '', assignedTo: 'intern', dueAt: '' })
  const [alerts, setAlerts] = useState([])
  const [view, setView] = useState('cards') // 'cards' | 'list'

  useEffect(() => {
    api.listTasks().then(setTasks)
    const es = new EventSource('/api/events')
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data?.type === 'reminder' && data.task) {
          const t = data.task
          const msg = `Task due: ${t.title} (Assigned: ${t.assignedTo})`
          setAlerts(a => [...a, msg])
          notify('Task Reminder', msg)
          setTimeout(() => setAlerts(a => a.slice(1)), 5000)
        }
      } catch {}
    }
    return () => es.close()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.dueAt) return
    const dueAtISO = new Date(form.dueAt).toISOString()
    const created = await api.addTask({ ...form, dueAt: dueAtISO })
    setTasks(t => [...t, created].sort((a,b) => new Date(a.dueAt) - new Date(b.dueAt)))
    setForm({ title: '', description: '', assignedTo: 'intern', dueAt: '' })
  }

  const toggleDone = async (task) => {
    const updated = await api.updateTask(task.id, { status: task.status === 'done' ? 'open' : 'done' })
    setTasks(ts => ts.map(t => t.id === task.id ? updated : t))
  }

  const TaskRow = ({ task }) => (
    <div className="task-row">
      <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleDone(task)} />
      <div className="task-row__body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc small muted">{task.description}</div>}
        <div className="task-meta small">assigned to {task.assignedTo} • due {new Date(task.dueAt).toLocaleString()}</div>
      </div>
    </div>
  )

  const TaskCard = ({ task }) => (
    <div className={`task-card ${task.status === 'done' ? 'done' : ''}`}> 
      <div className="task-card__header">
        <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleDone(task)} />
        <h3 className="task-title">{task.title}</h3>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">Assigned: {task.assignedTo}</div>
      <div className="task-meta">Due: {new Date(task.dueAt).toLocaleString()}</div>
    </div>
  )

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Task Automation System</h1>
        <div className="view-toggle">
          <button type="button" className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>Cards</button>
          <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List</button>
        </div>
      </header>

      <form onSubmit={onSubmit} className="task-form">
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
          <option value="intern">intern</option>
          <option value="mentor">mentor</option>
        </select>
        <input type="datetime-local" value={form.dueAt} onChange={e => setForm({ ...form, dueAt: e.target.value })} />
        <button type="submit" className="primary" style={{ gridColumn: 'span 4' }}>Add Task</button>
      </form>

      {view === 'list' && (
        <div className="task-list">
          {tasks.map(t => <TaskRow key={t.id} task={t} />)}
        </div>
      )}
      {view === 'cards' && (
        <div className="task-grid">
          {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      )}

      <div className="toast-stack">
        {alerts.map((a, i) => (
          <div key={i} className="toast">{a}</div>
        ))}
      </div>
    </div>
  )
}
