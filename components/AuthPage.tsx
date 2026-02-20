import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Mail, Lock, 
  User, ChevronLeft, CheckCircle2, 
  GraduationCap, Sparkles, Key, Check,
  Briefcase, Building2, Globe, Shield,
  BookOpen
} from 'lucide-react';

export type AuthPersona = 'personal' | 'student' | 'teacher' | 'professional' | 'enterprise';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onAuthComplete: (email: string, persona: AuthPersona, hasValidPass?: boolean) => void;
  onReturnHome: () => void;
}

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onAuthComplete, onReturnHome }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<AuthPersona>('personal');
  const categories: AuthPersona[] = ['personal', 'student', 'teacher', 'professional', 'enterprise'];
  const [passCode, setPassCode] = useState('');
  const [orgId, setOrgId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const isPassValid = passCode.trim().toUpperCase() === 'NEWYME2026';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation of enterprise/academic/personal authentication
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete(formData.email, persona, isPassValid);
    }, 1500);
  };

  const getPersonaColor = () => {
    switch (persona) {
      case 'student': return '#4f46e5';
      case 'teacher': return '#10b981';
      case 'professional': return '#002D56';
      case 'enterprise': return '#135bec';
      default: return '#0f172a';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-14 h-14 mb-4" />
          <span className="text-black font-extrabold text-3xl tracking-tighter mb-2">doc<span className="font-bold opacity-85">npdf</span></span>
          <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-2">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h1>
          <p className="text-center text-slate-500 dark:text-slate-300 text-sm mb-2">{mode === 'login' ? 'Sign in to your account to access the document studio.' : 'Create your account to get started.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900 capitalize"
                  value={persona}
                  onChange={e => setPersona(e.target.value as AuthPersona)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 dark:bg-slate-900"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-bold rounded-lg hover:from-blue-700 hover:to-yellow-500 transition-colors shadow-lg mt-2 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-white font-bold hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
            onClick={onReturnHome}
          >
            Return Home
          </button>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline focus:outline-none mt-2"
            type="button"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;