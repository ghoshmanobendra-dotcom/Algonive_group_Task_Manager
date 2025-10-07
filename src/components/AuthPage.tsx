import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, CheckCircle2 } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          return;
        }
        await signup(email, password, fullName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/50">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-slate-400 text-lg">for Small Teams</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="flex gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/50"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
