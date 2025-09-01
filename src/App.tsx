import { useState, useEffect } from 'react'

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const res = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTask })
        })
        const task = await res.json()
        setTasks([...tasks, task])
        setNewTask('')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  const toggleComplete = async (id: string) => {
    try {
      const task = tasks.find(t => t._id === id)
      if (task) {
        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !task.completed })
        })
        const updatedTask = await res.json()
        setTasks(tasks.map(t => t._id === id ? updatedTask : t))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(tasks.filter(t => t._id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>TaskFlow</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task..."
        style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        onKeyPress={(e) => e.key === 'Enter' && addTask()}
      />
      <button onClick={addTask} style={{ padding: "8px 16px" }}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.length === 0 ? (
        <li style={{ textAlign: "center", color: "#888", padding: 32 }}>
        No tasks yet.
        </li>
      ) : (
        tasks.map((task) => (
        <li key={task._id} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: "1px solid #eee"
        }}>
          <span
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "#888" : "#222"
          }}
          >
          {task.title}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => toggleComplete(task._id)}
            style={{ fontSize: 12 }}
          >
            {task.completed ? "Mark Pending" : "Mark Complete"}
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            style={{ fontSize: 12, color: "red" }}
          >
            Delete
          </button>
          </div>
        </li>
        ))
      )}
      </ul>
    </div>
  )
}

export default App