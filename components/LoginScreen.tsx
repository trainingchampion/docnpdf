
import React, { useState } from 'react';

const LogoIcon = ({ className = "w-14 h-14 mx-auto mb-4" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);


type UserCategory = 'Starter' | 'Student' | 'Professional' | 'Enterprise';
interface LoginScreenProps {
  onLogin: (username: string, password: string, category: UserCategory) => void;
  onSignUp?: () => void;
  onReturnHome?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, onReturnHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState<UserCategory>('Starter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    onLogin(username, password, category);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <form onSubmit={handleSubmit} className="relative bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-7 border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-500">
        <LogoIcon />
        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-2 tracking-tight">Welcome to <span className='text-blue-700 dark:text-blue-300'>doc<span className='opacity-60'>npdf</span></span></h2>
        <p className="text-center text-slate-500 dark:text-slate-300 text-sm mb-2">Sign in to your account to access the document studio.</p>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">User Category</label>
          <select
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900 mb-3"
            value={category}
            onChange={e => setCategory(e.target.value as UserCategory)}
          >
            <option value="Starter">Starter</option>
            <option value="Student">Student</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-bold rounded-lg hover:from-blue-700 hover:to-yellow-500 transition-colors shadow-lg mt-2"
        >
          Login
        </button>
        <div className="flex flex-col items-center gap-2 mt-2">
          {typeof onSignUp === 'function' && (
            <div className="text-center text-sm text-slate-500 dark:text-slate-300">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline focus:outline-none"
                onClick={onSignUp}
              >
                Sign up
              </button>
            </div>
          )}
          {typeof onReturnHome === 'function' && (
            <button
              type="button"
              className="mt-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-white font-bold hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              onClick={onReturnHome}
            >
              Return Home
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
