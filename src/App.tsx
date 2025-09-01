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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-600 text-lg">Manage your tasks efficiently</p>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg">No tasks yet. Add your first task above!</p>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${task.completed ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          task.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleComplete(task._id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
                              task.completed
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {task.completed ? 'Mark Pending' : 'Mark Complete'}
                          </button>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React, Vite, Tailwind CSS & MongoDB</p>
        </div>
      </div>
    </div>
  )
}

export default App