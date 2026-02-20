import React, { useState, useRef } from 'react';
import { 
  Search, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  Users, 
  CheckCircle,
  Calendar as CalendarIcon,
  Mail,
  Clock,
  ChevronRight,
  Filter,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Inbox,
  CheckCircle2,
  FileSignature,
  Target,
  Zap,
  ShieldAlert,
  User,
  History,
  FileSearch,
  Layout,
  Building2,
  Globe,
  Database,
  Lock,
  Workflow
} from 'lucide-react';
import ESignStudio from './ESignStudio';
import SectionIllustration from './SectionIllustration';

interface SignDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

type StudioTab = 'requests' | 'calendar' | 'enterprise' | 'emails';

interface SigningRequest {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'waiting' | 'pending' | 'completed';
  expiresIn?: string;
  dueDate?: string;
  signer: {
    name: string;
    initials: string;
  };
  signedCount: number;
  totalSigners: number;
}

const SignDashboard: React.FC<SignDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('requests');
  const [showStudio, setShowStudio] = useState(false);
  const [studioFileName, setStudioFileName] = useState('New_Agreement.pdf');
  const [remindersSent, setRemindersSent] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewRequest = () => {
    fileInputRef.current?.click();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudioFileName(file.name);
      setShowStudio(true);
    }
  };

  const requests: SigningRequest[] = [];

  const handleRemind = (id: string) => {
    setRemindersSent(prev => [...prev, id]);
    console.log(`Cryptographic nudge dispatched to node ${id}`);
  };

  const renderRequests = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => setActiveTab('requests')}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all text-left outline-none"
        >
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <span className="material-symbols-outlined text-3xl">speed</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Progress</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0%</span>
              <span className="text-[11px] font-black text-slate-300">No Change</span>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md hover:border-amber-200 transition-all text-left outline-none"
        >
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all">
            <span className="material-symbols-outlined text-3xl">event_busy</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Deadlines</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
              <span className="text-[11px] font-black text-slate-300">Standing By</span>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('emails')}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md hover:border-emerald-200 transition-all text-left outline-none"
        >
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
            <ShieldCheck size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Verified</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all text-left outline-none"
        >
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Clock size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Pending</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="flex-1 text-center lg:text-left">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Cryptographic Agreement Lifecycle</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Every signing node is verified and tracked across our global ledger. Invite collaborators and finalize in seconds.</p>
        </div>
        <div className="shrink-0">
           <SectionIllustration type="esign" themeColor="#1d4ed8" />
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
         <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.25em]">Action Required</h3>
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search agreements..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all w-64 shadow-sm"
               />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Filter size={18} /></button>
         </div>
      </div>

      <div className="lg:col-span-2 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group hover:border-blue-300 hover:bg-blue-50/10 transition-all duration-500">
         <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Inbox size={40} className="text-slate-300" />
         </div>
         <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Active Requests</h4>
         <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed mb-8">All personal signature nodes are synchronized. No pending actions required.</p>
         <button 
          onClick={handleNewRequest}
          className="px-8 py-3.5 bg-[#135bec] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
         >
           Create New Request
         </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-slate-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
             <ShieldAlert size={24} className="text-blue-600" />
          </div>
          <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase text-slate-900">Automation <br/><span className="text-blue-600 italic">Workflows.</span></h4>
          <p className="text-[13px] text-slate-500 mb-10 leading-relaxed font-medium">Automate your signature sequence to ensure documents are signed in the correct order automatically.</p>
        </div>
        <button 
          onClick={() => onNavigate?.('idm-studio')}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          <Workflow size={14} className="text-blue-400" />
          Setup Workflow
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );

  // Added renderEnterprise to handle organizational view
  const renderEnterprise = () => (
    <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
       <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
          <Building2 size={40} className="text-slate-300" />
       </div>
       <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Enterprise Node</h3>
       <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Organizational oversight for all signature nodes is currently aggregating from regional endpoints.</p>
    </div>
  );

  // Added renderCalendar to handle deadline monitoring
  const renderCalendar = () => (
    <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
       <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
          <CalendarIcon size={40} className="text-slate-300" />
       </div>
       <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Temporal Monitor</h3>
       <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Upcoming deadlines and expiration nodes are being mapped to the central timeline.</p>
    </div>
  );

  if (showStudio) {
    return <ESignStudio fileName={studioFileName} onClose={() => setShowStudio(false)} onFinish={() => setShowStudio(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">e-Sign Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Manage personal requests and organizational oversight in a unified high-fidelity environment.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleNewRequest}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                New Request
             </button>
             <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept=".pdf" />
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'requests', label: 'My Requests', icon: <Inbox size={16} /> },
                { id: 'enterprise', label: 'Enterprise Node', icon: <Building2 size={16} /> },
                { id: 'calendar', label: 'Calendar Monitor', icon: <CalendarIcon size={16} /> },
                { id: 'emails', label: 'Audit History', icon: <History size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as StudioTab)}
                  className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-blue-600 shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>
           
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Synchronized</span>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'enterprise' && renderEnterprise()}
          {activeTab === 'calendar' && renderCalendar()}
          {activeTab === 'emails' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                  <History size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Audit Node</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Historical logs for completed agreements are currently synchronizing with the central vault.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SignDashboard;