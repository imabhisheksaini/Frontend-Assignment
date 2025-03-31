import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Task } from '../types/task';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export function TaskList({ onEditTask }: TaskListProps) {
  const { tasks, moveTask } = useTaskContext();
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [sort, setSort] = useState<'date' | 'priority'>('date');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.status !== 'completed';
    return task.status === 'completed';
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex(task => task.id === active.id);
      const newIndex = sortedTasks.findIndex(task => task.id === over.id);
      moveTask(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'todo' | 'completed')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value="todo">Active Tasks</option>
          <option value="completed">Completed Tasks</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'date' | 'priority')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedTasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sortedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}