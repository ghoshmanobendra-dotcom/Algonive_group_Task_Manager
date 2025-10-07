export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface Task {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdBy: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
