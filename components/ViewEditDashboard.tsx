import React, { useState, useRef } from 'react';
import { 
  Search, Edit3, Eye, StickyNote, GitCompare,
  Trash2, Plus, Clock, ChevronRight, 
  Filter, ArrowRight, Inbox, Zap, 
  Building2, Globe, Database, Lock, 
  Workflow, BarChart3, LayoutGrid, 
  FileUp, Activity, HardDrive, Settings,
  ShieldCheck, Palette, Wand2, Type,
  ListOrdered, Crop, Eraser, Droplets,
  FormInput, ExternalLink, Share2,
  FileText
} from 'lucide-react';
import SectionIllustration from './SectionIllustration';

interface ViewEditDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

const ViewEditDashboard: React.FC<ViewEditDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'annotations' | 'settings'>('sessions');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewSession = (mode: string = 'edit') => {
    if (mode === 'read') {
      onNavigate?.('smart-reader');
      return;
    }
    if (mode === 'compare') {
      onNavigate?.('compare');
      return;
    }
    // For general edit/markup, open vault to pick a file
    onNavigate?.('vault');
  };

  const renderSessions = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Edit3 size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Edits Committed</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Hours Read</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0.0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <StickyNote size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Markups</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <GitCompare size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Compares</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="shrink-0">
           <SectionIllustration type="edit" themeColor="#14b8a6" />
        </div>
        <div className="flex-1 text-center lg:text-left">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Immersive Manipulation Studio</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Every annotation, text edit, and layer flattening operation is cryptographically tracked in your node history. Experience bit-perfect document mastery.</p>
        </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Studio Modules</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'edit', label: 'Edit PDF', icon: <Edit3 size={20} />, sub: 'Native Text Markup', color: 'teal' },
              { id: 'read', label: 'Smart Reader', icon: <Eye size={20} />, sub: 'Immersive Focus', color: 'blue' },
              { id: 'markup', label: 'Annotator', icon: <StickyNote size={20} />, sub: 'Collaboration Nodes', color: 'amber' },
              { id: 'compare', label: 'Smart Compare', icon: <GitCompare size={20} />, sub: 'Semantic Redlining', color: 'purple' },
              { id: 'redact', label: 'Redaction Node', icon: <Eraser size={20} />, sub: 'Privacy Masking', color: 'rose' },
              { id: 'filler', label: 'Form Filler', icon: <FormInput size={20} />, sub: 'Field Ingestion', color: 'indigo' }
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={() => handleNewSession(tool.id)}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-teal-300 hover:shadow-xl transition-all duration-500 text-left group flex flex-col"
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-teal-50 transition-colors shadow-inner mb-8`}>
                    <div className="group-hover:scale-110 transition-transform text-teal-600">{tool.icon}</div>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">{tool.label}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.sub}</p>
                 <ArrowRight size={20} className="mt-8 text-slate-200 group-hover:text-teal-600 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <Wand2 size={24} className="text-teal-400" />
               </div>
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase">AI Drafting <br/><span className="text-teal-400 italic">Studio.</span></h4>
               <p className="text-[13px] text-slate-400 mb-10 leading-relaxed font-medium">Re-draft entire document sections with Mina while maintaining legal fidelity and brand voice.</p>
            </div>
            <button 
               onClick={() => handleNewSession('edit')}
               className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
               <Zap size={14} className="text-amber-500" />
               Open Drafting Hub
            </button>
         </div>

         <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-slate-100">
            <div className="relative z-10">
               <Palette size={32} className="text-teal-600 mb-8" />
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase text-slate-900">Annotation <br/><span className="text-teal-600 italic">Rulesets.</span></h4>
               <p className="text-[13px] text-slate-500 mb-10 leading-relaxed font-medium">Standardize markup colors, note styles, and review protocols across your workspace node.</p>
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">View & Edit Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Immersive document manipulation. Read with focus, markup with intent, and edit with neural-grade fidelity.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => handleNewSession()}
              className="flex items-center gap-3 px-10 py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                New Session
             </button>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'sessions', label: 'Active Sessions', icon: <Inbox size={16} /> },
                { id: 'annotations', label: 'Global Markups', icon: <Activity size={16} /> },
                { id: 'settings', label: 'Studio Config', icon: <Settings size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-teal-600 shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-600'
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
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linguistic Node: Synced</span>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'sessions' && renderSessions()}
          {activeTab === 'annotations' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                  <BarChart3 size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Markup Analytics</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Historical analytics for annotations and edits are currently synchronizing.</p>
            </div>
          )}
          {activeTab === 'settings' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <Lock size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Studio Profiles</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Global studio performance profiles are managed by your enterprise node.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewEditDashboard;