import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  hours: number;
  percentComplete: number;
}

export function ProjectEstimation() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskHours, setNewTaskHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName || !newTaskHours) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      name: newTaskName,
      hours: parseFloat(newTaskHours),
      percentComplete: 0
    };

    setTasks([...tasks, newTask]);
    setNewTaskName('');
    setNewTaskHours('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, percentComplete: progress } : task
    ));
  };

  const totalTasks = tasks.length;
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const totalCost = hourlyRate ? totalHours * parseFloat(hourlyRate) : 0;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Project Estimation</h2>

        {/* Task Input Form */}
        <form onSubmit={addTask} className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Task name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-3">
            <input
              type="number"
              value={newTaskHours}
              onChange={(e) => setNewTaskHours(e.target.value)}
              placeholder="Hours"
              min="0"
              step="0.5"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Optional Hourly Rate */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate (optional)
          </label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="Enter hourly rate"
            min="0"
            className="w-full md:w-1/3 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Task List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Tasks</h3>
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded">
              <div className="flex-1">
                <p className="font-medium">{task.name}</p>
                <p className="text-sm text-gray-600">{task.hours} hours</p>
              </div>
              <div className="w-32">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.percentComplete}
                  onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-center text-gray-600">{task.percentComplete}% complete</p>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
              {hourlyRate && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 