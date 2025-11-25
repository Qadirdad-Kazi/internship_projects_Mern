import React, { useEffect, useState } from 'react'
import './styles.css'
import Layout from './components/Layout'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskCard from './components/TaskCard'
import TaskRow from './components/TaskRow'
import Toast from './components/Toast'

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
      } catch { }
    }
    return () => es.close()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.dueAt) return
    const dueAtISO = new Date(form.dueAt).toISOString()
    const created = await api.addTask({ ...form, dueAt: dueAtISO })
    setTasks(t => [...t, created].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)))
    setForm({ title: '', description: '', assignedTo: 'intern', dueAt: '' })
  }

  const toggleDone = async (task) => {
    const updated = await api.updateTask(task.id, { status: task.status === 'done' ? 'open' : 'done' })
    setTasks(ts => ts.map(t => t.id === task.id ? updated : t))
  }

  return (
    <Layout>
      <Header view={view} setView={setView} />

      <TaskForm form={form} setForm={setForm} onSubmit={onSubmit} />

      {view === 'list' && (
        <div className="task-list">
          {tasks.map(t => (
            <TaskRow key={t.id} task={t} toggleDone={toggleDone} />
          ))}
        </div>
      )}

      {view === 'cards' && (
        <div className="task-grid">
          {tasks.map(t => (
            <TaskCard key={t.id} task={t} toggleDone={toggleDone} />
          ))}
        </div>
      )}

      <Toast alerts={alerts} />
    </Layout>
  )
}
