import React, { useState, useRef } from 'react';
import { 
  Search, 
  Lock, 
  Unlock, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Clock,
  Filter,
  ArrowRight,
  Inbox,
  Zap,
  Activity,
  Workflow,
  BarChart3,
  Settings,
  ShieldAlert,
  Fingerprint,
  Home
} from 'lucide-react';
import { TOOLS } from '../constants';
import { PDFTool } from '../types';
import SectionIllustration from './SectionIllustration';

interface SecurityDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
  onToolSelect?: (tool: PDFTool) => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ onNavigate, onToolSelect }) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'activity' | 'settings'>('vault');
  const [searchQuery, setSearchQuery] = useState('');

  const securityTools = TOOLS.filter(t => t.category === 'Security Hub');

  const handleToolAction = (toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool && onToolSelect) {
      onToolSelect(tool);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50/30 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">Security Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Secure your documents with encryption. Unlock restricted files, add passwords, or flatten layers for safe sharing.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => handleToolAction('unlock-pdf')}
              className="flex items-center gap-3 px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                Add Document
             </button>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'vault', label: 'Active Tasks', icon: <Inbox size={16} /> },
                { id: 'activity', label: 'Security Log', icon: <Activity size={16} /> },
                { id: 'settings', label: 'Workspace Policies', icon: <Settings size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-rose-600 shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-600'
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
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Cloud Active</span>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {activeTab === 'vault' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {securityTools.map(tool => (
                  <button 
                    key={tool.id}
                    onClick={() => handleToolAction(tool.id)}
                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-rose-300 hover:shadow-xl transition-all duration-500 text-left group flex flex-col items-start"
                  >
                     <div className={`w-16 h-16 rounded-2xl ${tool.iconBgColor} flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(tool.icon as React.ReactElement, { size: 24 })}
                     </div>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">{tool.name}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{tool.description}</p>
                     <ArrowRight size={20} className="mt-10 text-slate-200 group-hover:text-rose-600 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
                <div className="flex-1 text-center lg:text-left">
                   <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Vault Encryption Node</h3>
                   <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Every document in your node is cryptographically sealed using bank-level AES-256 protocols. Your workspace is currently healthy.</p>
                </div>
                <div className="shrink-0">
                   <SectionIllustration type="security" themeColor="#e11d48" />
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center opacity-40">
                 <ShieldAlert size={64} className="text-slate-300 mb-6" />
                 <h3 className="text-2xl font-black uppercase tracking-widest">No Active Security Tasks</h3>
                 <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Upload a document to start protecting your files or unlock restricted assets.</p>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <Fingerprint size={80} className="text-slate-300 mb-8" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Audit Trail</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Security logs are syncing with your account history.</p>
            </div>
          )}

          {activeTab === 'settings' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <Lock size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Shared Policies</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Security rules and password requirements are managed by the workspace owner.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;