import React, { useState, useRef } from 'react';
import { 
  Search, Merge, Scissors, RotateCcw, 
  Trash2, Plus, Clock, ChevronRight, 
  Filter, ArrowRight, Inbox, Zap, 
  Building2, Globe, Database, Lock, 
  Workflow, BarChart3, LayoutGrid, 
  FileUp, Activity, HardDrive, Settings,
  ShieldCheck
} from 'lucide-react';
import OrganizeStudio from './OrganizeStudio';
import SectionIllustration from './SectionIllustration';

interface OrganizeDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

const OrganizeDashboard: React.FC<OrganizeDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'my-tasks' | 'usage' | 'settings'>('my-tasks');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewTask = (mode: string = 'organize') => {
    onNavigate?.('organize-studio');
  };

  const renderTasks = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <LayoutGrid size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Pages Processed</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Merge size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Merge Cycles</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scissors size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Split Tasks</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <HardDrive size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Vault Space</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0 MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="shrink-0 order-last lg:order-first">
           <SectionIllustration type="organize" themeColor="#4f46e5" />
        </div>
        <div className="flex-1 text-center lg:text-right">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Structural Architect Node</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl lg:ml-auto">Reorder, merge, and split with drag-and-drop precision. Every page operation is tracked for organizational hygiene.</p>
        </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Popular Operations</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'merge', label: 'Merge PDF', icon: <Merge size={20} />, sub: 'Combine Assets', color: 'indigo' },
              { id: 'split', label: 'Split PDF', icon: <Scissors size={20} />, sub: 'Extract Pages', color: 'emerald' },
              { id: 'rotate', label: 'Rotate Pages', icon: <RotateCcw size={20} />, sub: 'Correct Orientation', color: 'rose' },
              { id: 'organize', label: 'Page Manager', icon: <LayoutGrid size={20} />, sub: 'Drag & Drop Reorder', color: 'blue' },
              { id: 'delete', label: 'Delete Pages', icon: <Trash2 size={20} />, sub: 'Remove Bloat', color: 'slate' },
              { id: 'extract', label: 'Page Extraction', icon: <FileUp size={20} />, sub: 'Subset Recovery', color: 'amber' }
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={() => handleNewTask(tool.id)}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-500 text-left group flex flex-col"
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-indigo-50 transition-colors shadow-inner mb-8`}>
                    <div className="group-hover:scale-110 transition-transform text-indigo-600">{tool.icon}</div>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">{tool.label}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.sub}</p>
                 <ArrowRight size={20} className="mt-8 text-slate-200 group-hover:text-indigo-600 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <Workflow size={24} className="text-indigo-400" />
               </div>
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase">Automation <br/><span className="text-indigo-400 italic">Workstreams.</span></h4>
               <p className="text-[13px] text-slate-400 mb-10 leading-relaxed font-medium">Auto-organize incoming documents into standardized page templates and vault locations.</p>
            </div>
            <button 
               onClick={() => onNavigate?.('idm-studio')}
               className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
               <Zap size={14} className="text-amber-500" />
               Setup Pipeline
               <ArrowRight size={14} />
            </button>
         </div>

         <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-slate-100">
            <div className="relative z-10">
               <ShieldCheck size={32} className="text-indigo-600 mb-8" />
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase text-slate-900">Workspace <br/><span className="text-indigo-600 italic">Rulesets.</span></h4>
               <p className="text-[13px] text-slate-500 mb-10 leading-relaxed font-medium">Standardize PDF page layouts, numbering, and orientation across your organizational node.</p>
            </div>
            <button 
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
            >
               Manage Rules
            </button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">Organize Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Architect document structure with visual precision. Reorder, merge, and split complex assets with neural-grade fidelity.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => handleNewTask()}
              className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                New Workspace
             </button>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'my-tasks', label: 'Active Projects', icon: <Inbox size={16} /> },
                { id: 'usage', label: 'Page Analytics', icon: <Activity size={16} /> },
                { id: 'settings', label: 'Node Profiles', icon: <Settings size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-indigo-600 shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-600'
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
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Compute Cluster: Sync</span>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'my-tasks' && renderTasks()}
          {activeTab === 'usage' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                  <BarChart3 size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Usage Analytics</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Historical analytics for document reorganization are currently aggregating.</p>
            </div>
          )}
          {activeTab === 'settings' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <Lock size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Enterprise Profiles</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Organize engine profiles are globally managed by your organizational node.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrganizeDashboard;