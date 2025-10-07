import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { Header } from './Header';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';
import { CreateTeamModal } from './CreateTeamModal';
import { Plus, Users } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { teams, currentTeam } = useTask();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  if (!user) return null;

  const hasNoTeam = teams.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasNoTeam ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-2xl mb-6 border border-slate-700">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Welcome to Task Manager
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Create your first team to start managing tasks with your colleagues
              </p>
              <button
                onClick={() => setShowTeamModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
              >
                <Plus className="w-5 h-5" />
                Create Your First Team
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentTeam?.name || 'Tasks'}
                </h1>
                {currentTeam?.description && (
                  <p className="text-slate-400">{currentTeam.description}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all border border-slate-700 hover:border-slate-600"
                >
                  <Users className="w-4 h-4" />
                  New Team
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-600/50"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
              </div>
            </div>

            <TaskList />
          </>
        )}
      </main>

      {showTaskModal && <CreateTaskModal onClose={() => setShowTaskModal(false)} />}
      {showTeamModal && <CreateTeamModal onClose={() => setShowTeamModal(false)} />}
    </div>
  );
};
