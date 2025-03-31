import React from 'react';
import { Edit2, Trash2, CheckCircle, GripVertical } from 'lucide-react';
import { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const { deleteTask, updateTask } = useTaskContext();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleStatusChange = () => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'todo' : 'completed'
    });
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 ${
        task.status === 'completed' ? 'border-green-500 opacity-75' : 'border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} className="text-gray-400" />
            </button>
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          <div className="text-xs text-gray-500 mt-2">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Edit2 size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Trash2 size={18} className="text-gray-600" />
          </button>
          <button
            onClick={handleStatusChange}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <CheckCircle
              size={18}
              className={task.status === 'completed' ? 'text-green-500' : 'text-gray-400'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}