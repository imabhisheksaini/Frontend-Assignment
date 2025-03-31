import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Task } from './types/task';
import { PlusCircle, CheckSquare } from 'lucide-react';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckSquare size={24} className="text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle size={20} className="mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaskList onEditTask={setEditingTask} />
        </main>

        {(isFormOpen || editingTask) && (
          <TaskForm
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </TaskProvider>
  );
}

export default App;