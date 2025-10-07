import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Team, TeamMember } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  teams: Team[];
  teamMembers: TeamMember[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  createTeam: (name: string, description?: string) => void;
  addTeamMember: (teamId: string, userId: string, role: 'admin' | 'member') => void;
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedTeams = localStorage.getItem('teams');
    const storedTeamMembers = localStorage.getItem('teamMembers');

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedTeams) {
      const parsedTeams = JSON.parse(storedTeams);
      setTeams(parsedTeams);
      if (parsedTeams.length > 0 && !currentTeam) {
        setCurrentTeam(parsedTeams[0]);
      }
    }
    if (storedTeamMembers) setTeamMembers(JSON.parse(storedTeamMembers));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
  }, [teamMembers]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates, updatedAt: new Date() };
        if (updates.status === 'completed' && task.status !== 'completed') {
          updatedTask.completedAt = new Date();
        } else if (updates.status !== 'completed') {
          updatedTask.completedAt = undefined;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const createTeam = (name: string, description?: string) => {
    if (!user) return;

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      description,
      createdBy: user.id,
      createdAt: new Date(),
    };

    setTeams([...teams, newTeam]);

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      teamId: newTeam.id,
      userId: user.id,
      role: 'admin',
      joinedAt: new Date(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setCurrentTeam(newTeam);
  };

  const addTeamMember = (teamId: string, userId: string, role: 'admin' | 'member') => {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      teamId,
      userId,
      role,
      joinedAt: new Date(),
    };

    setTeamMembers([...teamMembers, newMember]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        teams,
        teamMembers,
        createTask,
        updateTask,
        deleteTask,
        createTeam,
        addTeamMember,
        currentTeam,
        setCurrentTeam,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
