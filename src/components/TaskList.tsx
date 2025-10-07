import { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Task } from '../types';
import { Filter, Search } from 'lucide-react';

export const TaskList = () => {
  const { tasks, currentTeam } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');

  const teamTasks = tasks.filter((task) => task.teamId === currentTeam?.id);

  const filteredTasks = teamTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
                className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
              className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4 border border-slate-700">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
          <p className="text-slate-400">
            {teamTasks.length === 0
              ? 'Create your first task to get started'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Pending</h2>
              <span className="px-2.5 py-1 bg-slate-700 text-slate-300 text-sm font-medium rounded-full">
                {pendingTasks.length}
              </span>
            </div>
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">In Progress</h2>
              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Completed</h2>
              <span className="px-2.5 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded-full">
                {completedTasks.length}
              </span>
            </div>
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
