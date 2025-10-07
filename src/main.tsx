import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </AuthProvider>
  </StrictMode>
);
