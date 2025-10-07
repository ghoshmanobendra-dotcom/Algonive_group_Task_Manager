import { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import { Calendar, Clock, Trash2, AlertCircle, User } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { updateTask, deleteTask } = useTask();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusColors = {
    pending: 'bg-slate-700 text-slate-300',
    in_progress: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    completed: 'bg-green-600/20 text-green-400 border border-green-500/30',
  };

  const priorityColors = {
    low: 'bg-slate-600 text-slate-300',
    medium: 'bg-amber-600/20 text-amber-400',
    high: 'bg-red-600/20 text-red-400',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-slate-400 text-sm line-clamp-2">{task.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-600/20 rounded-lg text-slate-400 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-2 text-sm ${
            isOverdue ? 'text-red-400' : 'text-slate-400'
          }`}>
            {isOverdue ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            <span>
              Due {formatDistanceToNow(new Date(task.dueDate))}
            </span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="w-4 h-4" />
            <span>Assigned</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Created {formatDistanceToNow(new Date(task.createdAt))}</span>
        </div>

        <div className="pt-3 border-t border-slate-700">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-3">Delete Task?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
