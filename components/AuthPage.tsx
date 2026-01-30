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
  onCancel: () => void;
}

const Logo = ({ className = "w-10 h-10" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ initialMode, onAuthComplete, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<AuthPersona>('personal');
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
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col items-center justify-center p-6 relative overflow-hidden animate-in fade-in duration-700">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#002D56 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      <button 
        onClick={onCancel}
        className="absolute top-10 left-10 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-[11px] uppercase tracking-widest group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Logo className="w-16 h-16" />
            <div className="flex items-center pt-4">
               <span className="text-black font-extrabold text-3xl tracking-tighter">doc<span className="font-bold opacity-85">npdf</span></span>
            </div>
          </div>
          <h1 className="text-4xl font-[1000] tracking-tighter text-[#002D56] mb-2 leading-none">
            {mode === 'login' ? 'Portal Access.' : 'Workspace Deployment.'}
          </h1>
          <p className="text-slate-400 font-medium text-lg text-center">
            {mode === 'login' 
              ? `Authenticate your secure ${persona} node.` 
              : `Initialize a high-fidelity ${persona} workspace.`}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 lg:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Persona Selection */}
            <div className="grid grid-cols-5 gap-2 mb-8">
               <button 
                type="button"
                onClick={() => setPersona('personal')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${persona === 'personal' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
               >
                 <User size={16} className={persona === 'personal' ? 'text-slate-900' : 'text-slate-400'} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Personal</span>
               </button>
               <button 
                type="button"
                onClick={() => setPersona('student')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${persona === 'student' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
               >
                 <GraduationCap size={16} className={persona === 'student' ? 'text-indigo-600' : 'text-slate-400'} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Student</span>
               </button>
               <button 
                type="button"
                onClick={() => setPersona('teacher')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${persona === 'teacher' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
               >
                 <BookOpen size={16} className={persona === 'teacher' ? 'text-emerald-600' : 'text-slate-400'} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Teacher</span>
               </button>
               <button 
                type="button"
                onClick={() => setPersona('professional')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${persona === 'professional' ? 'border-slate-800 bg-slate-50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
               >
                 <Briefcase size={16} className={persona === 'professional' ? 'text-slate-800' : 'text-slate-400'} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Pro</span>
               </button>
               <button 
                type="button"
                onClick={() => setPersona('enterprise')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${persona === 'enterprise' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
               >
                 <Building2 size={16} className={persona === 'enterprise' ? 'text-blue-600' : 'text-slate-400'} />
                 <span className="text-[8px] font-black uppercase tracking-widest">Enterprise</span>
               </button>
            </div>

            {persona === 'enterprise' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Organization ID</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="e.g. ACME-GLOBAL-01"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-400 rounded-2xl text-sm font-bold uppercase tracking-widest outline-none transition-all shadow-inner"
                    value={orgId}
                    onChange={e => setOrgId(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="Alex Rivera"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-400 rounded-2xl text-base font-bold outline-none transition-all shadow-inner"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  required
                  type="email"
                  placeholder={persona === 'student' || persona === 'teacher' ? "name@school.edu" : "name@company.com"}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-400 rounded-2xl text-base font-bold outline-none transition-all shadow-inner"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-400 rounded-2xl text-base font-bold outline-none transition-all shadow-inner"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Academic Pass Code Field */}
            {(persona === 'student' || persona === 'teacher') && mode === 'signup' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Academic Pass Code (Optional)</label>
                <div className="relative group">
                  <Key className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPassValid ? 'text-emerald-500' : 'text-slate-300'} group-focus-within:text-indigo-600`} size={18} />
                  <input 
                    type="text"
                    placeholder="Enter code (NEWYME2026)"
                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold uppercase tracking-widest outline-none transition-all shadow-inner ${isPassValid ? 'border-emerald-500 bg-emerald-50/20' : 'border-transparent focus:border-indigo-400'}`}
                    value={passCode}
                    onChange={e => setPassCode(e.target.value)}
                  />
                  {isPassValid && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-300">
                      <Check size={20} strokeWidth={4} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <button 
              disabled={isLoading}
              style={{ backgroundColor: getPersonaColor() }}
              className="w-full py-5 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In to Workspace' : `Initialize ${persona.charAt(0).toUpperCase() + persona.slice(1)} Node`}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Contextual Information */}
          <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-start gap-4 transition-colors">
            {persona === 'enterprise' ? (
              <>
                <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-1" />
                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight text-blue-800">
                  Enterprise Node: SSO authentication, global audit logs, and organizational governance will be enabled upon successful login.
                </p>
              </>
            ) : (persona === 'student' || persona === 'teacher') && mode === 'signup' ? (
               <>
                {isPassValid ? (
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
                ) : (
                  <Sparkles size={18} className="text-indigo-600 shrink-0 mt-1" />
                )}
                <p className={`text-[11px] font-bold leading-relaxed uppercase tracking-tight ${isPassValid ? 'text-emerald-700' : 'text-indigo-700'}`}>
                  {isPassValid 
                    ? 'Premium Node Unlocked: 10-day high-fidelity access granted. All intelligence cycles enabled.' 
                    : 'Academic Mode: Access High-Fidelity Exam Solver & Reader nodes automatically.'}
                </p>
               </>
            ) : (
              <>
                <CheckCircle2 size={18} className="text-slate-400 shrink-0 mt-1" />
                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight text-slate-600">
                  Standard Node: Secure AES-256 document processing and vault storage active for current session.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-slate-500 font-bold text-sm"
          >
            {mode === 'login' ? "New to the hub? " : "Existing node? "}
            <span className="text-blue-600 font-black uppercase tracking-widest ml-1 hover:underline">
              {mode === 'login' ? 'Deploy Workspace' : 'Sign In'}
            </span>
          </button>

          <div className="flex items-center gap-10 opacity-40">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" />
               AES-256 Secure
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <Shield size={14} className="text-blue-500" />
               Enterprise Ready
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;