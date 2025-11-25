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

export default api;
