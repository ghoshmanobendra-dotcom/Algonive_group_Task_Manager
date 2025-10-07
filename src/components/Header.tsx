import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { LogOut, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { teams, currentTeam, setCurrentTeam } = useTask();
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/50">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Task Manager
              </span>
            </div>

            {teams.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all border border-slate-700"
                >
                  <span className="font-medium">{currentTeam?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showTeamDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowTeamDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-20">
                      {teams.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => {
                            setCurrentTeam(team);
                            setShowTeamDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 transition-colors ${
                            currentTeam?.id === team.id
                              ? 'bg-blue-600/20 text-blue-400'
                              : 'text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="font-medium">{team.name}</div>
                          {team.description && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {team.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">{user?.fullName}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
