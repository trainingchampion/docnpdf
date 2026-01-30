import React, { useState, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Clock,
  ChevronRight,
  Filter,
  ArrowRight,
  Inbox,
  Zap,
  Building2,
  Globe,
  Database,
  Lock,
  Workflow,
  BarChart3,
  Cpu,
  Layout,
  ClipboardCheck,
  FileSearch,
  Languages,
  Activity,
  ArrowDownToLine,
  Settings,
  HardDrive
} from 'lucide-react';
import ExtractStudio from './ExtractStudio';
import SectionIllustration from './SectionIllustration';

interface ExtractDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

const ExtractDashboard: React.FC<ExtractDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'my-tasks' | 'usage' | 'settings'>('my-tasks');
  const [showStudio, setShowStudio] = useState(false);
  const [studioFileName, setStudioFileName] = useState('Intelligence_Source.pdf');
  const [studioFileData, setStudioFileData] = useState<string | undefined>(undefined);
  const [initialMode, setInitialMode] = useState('summarizer');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewTask = (mode: string = 'summarizer') => {
    if (mode === 'q-gen' || mode === 'quiz-studio') {
      onNavigate?.('quiz-studio');
      return;
    }
    if (mode === 'translate') {
      onNavigate?.('translation-studio');
      return;
    }
    if (mode === 'flavor') {
      onNavigate?.('tone-studio');
      return;
    }
    setInitialMode(mode);
    fileInputRef.current?.click();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        setStudioFileName(file.name);
        setStudioFileData(base64);
        setShowStudio(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    {
      title: 'Data Synthesis',
      tools: [
        { id: 'summarizer', label: 'AI Summarizer', icon: <Layout size={20} />, sub: 'Key Insight Extraction', color: 'blue' },
        { id: 'digest', label: 'Executive Digest', icon: <Activity size={20} />, sub: 'High-Level Synthesis', color: 'indigo' },
      ]
    },
    {
      title: 'Semantic Mapping',
      tools: [
        { id: 'ai-assistant', label: 'Field Extractor', icon: <Database size={20} />, sub: 'Key-Value Mapping', color: 'emerald' },
        { id: 'table-parse', label: 'Table Engine', icon: <BarChart3 size={20} />, sub: 'Grid Reconstruction', color: 'teal' },
      ]
    },
    {
      title: 'Educational Lab',
      tools: [
        { id: 'question-solver', label: 'Exam Solver', icon: <ClipboardCheck size={20} />, sub: 'Precision Answers', color: 'orange' },
        { id: 'quiz-studio', label: 'Quiz Generator', icon: <FileSearch size={20} />, sub: 'Retention Design', color: 'amber' },
      ]
    },
    {
      title: 'Linguistics Node',
      tools: [
        { id: 'translate', label: 'Universal Sync', icon: <Languages size={20} />, sub: 'Cross-Border Node', color: 'rose' },
        { id: 'flavor', label: 'Resonance Node', icon: <Sparkles size={20} />, sub: 'Tone Shift Studio', color: 'pink' },
      ]
    }
  ];

  const renderTasks = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Cycles Used</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Semantic Accuracy</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">99.4%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Node Latency</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">14ms</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <HardDrive size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Volume Indexed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0 MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="flex-1 text-center lg:text-left">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Mina Extraction Engine</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Our semantic deconstruction node maps document schemas with recursive precision. Ready for your first cycle.</p>
        </div>
        <div className="shrink-0">
           <SectionIllustration type="extract" themeColor="#4f46e5" />
        </div>
      </div>

      {categories.map((cat, idx) => (
        <div key={idx} className="space-y-6">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">{cat.title}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cat.tools.map(tool => (
                <button 
                  key={tool.id}
                  onClick={() => handleNewTask(tool.id)}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-500 text-left group flex flex-col"
                >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-indigo-50 transition-colors shadow-inner mb-6`}>
                      <div className="group-hover:scale-110 transition-transform text-indigo-600">{tool.icon}</div>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">{tool.label}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.sub}</p>
                   <ArrowRight size={16} className="mt-6 text-slate-200 group-hover:text-indigo-600 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
           </div>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-slate-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
                  <Workflow size={24} className="text-indigo-600" />
               </div>
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase text-slate-900">Automation <br/><span className="text-indigo-600 italic">Pipelines.</span></h4>
               <p className="text-[13px] text-slate-500 mb-10 leading-relaxed font-medium">Auto-extract data from recurring documents and sync with your organization's internal ledger.</p>
            </div>
            <button 
               onClick={() => onNavigate?.('idm-studio')}
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
               <Zap size={14} className="text-amber-400" />
               Setup Pipeline
               <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
         </div>

         <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
               <ShieldCheck size={32} className="text-white opacity-40 mb-8" />
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase">Industrial <br/><span className="text-indigo-200 italic">Oversight.</span></h4>
               <p className="text-[13px] text-indigo-50 mb-10 leading-relaxed font-medium">Standardize extraction profiles across your entire organization for bit-perfect data hygiene.</p>
            </div>
            <button 
               onClick={() => onNavigate?.('enterprise-admin')}
               className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
            >
               Admin Controls
            </button>
         </div>
      </div>
    </div>
  );

  if (showStudio) {
    return <ExtractStudio fileName={studioFileName} fileData={studioFileData} initialMode={initialMode} onClose={() => setShowStudio(false)} onFinish={() => setShowStudio(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">Extract Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Deconstruct complex assets with neural-grade precision. Transform raw documents into structured workspace intelligence.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => handleNewTask()}
              className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                Upload Asset
             </button>
             <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept=".pdf" />
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'my-tasks', label: 'Intelligence Log', icon: <Inbox size={16} /> },
                { id: 'usage', label: 'Cluster Metrics', icon: <Activity size={16} /> },
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
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Compute History</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Historical analytics for semantic cycles are currently aggregating from edge nodes.</p>
            </div>
          )}
          {activeTab === 'settings' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <Lock size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Enterprise Profiles</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Intelligence engine profiles are globally managed by your organizational node.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExtractDashboard;