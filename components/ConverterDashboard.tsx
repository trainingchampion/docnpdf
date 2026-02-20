import React, { useState, useRef } from 'react';
import { 
  Search, 
  FileText, 
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
  RefreshCw,
  FileType,
  Table as TableIcon,
  Presentation,
  Image as ImageIcon,
  Activity,
  ArrowRightLeft,
  Settings
} from 'lucide-react';
import ConverterStudio from './ConverterStudio';
import SectionIllustration from './SectionIllustration';

interface ConverterDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

const ConverterDashboard: React.FC<ConverterDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'my-tasks' | 'usage' | 'settings'>('my-tasks');
  const [showStudio, setShowStudio] = useState(false);
  const [studioFileName, setStudioFileName] = useState('Source_Asset.pdf');
  const [studioFileData, setStudioFileData] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewTask = () => {
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

  const renderTasks = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <RefreshCw size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Total Tasks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Fidelity Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">--</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Time Saved</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">0m</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Cluster Load</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="shrink-0">
           <SectionIllustration type="convert" themeColor="#2563eb" />
        </div>
        <div className="flex-1 text-center lg:text-left">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Neural Formatting Cluster</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Transform any industrial format with bit-perfect layout retention. Every conversion node is cryptographically verified for schema integrity.</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
         <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.25em]">Popular Conversions</h3>
         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Pairs</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'PDF to Word', icon: <FileText size={20} />, sub: 'Preserve Layouts', color: 'blue' },
          { label: 'Excel to PDF', icon: <TableIcon size={20} />, sub: 'Grid Mapping', color: 'emerald' },
          { label: 'Image to PDF', icon: <ImageIcon size={20} />, sub: 'High DPI Engine', color: 'rose' },
          { label: 'PDF to PPTX', icon: <Presentation size={20} />, sub: 'Slide Generation', color: 'orange' },
          { label: 'OCR Engine', icon: <RefreshCw size={20} />, sub: 'Text Extraction', color: 'purple' },
          { label: 'HTML to PDF', icon: <Globe size={20} />, sub: 'Web-Fidelity', color: 'indigo' },
        ].map((pair, idx) => (
          <button 
            key={idx}
            onClick={handleNewTask}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500 text-left group"
          >
             <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-blue-50 transition-colors shadow-inner`}>
                   <div className="group-hover:scale-110 transition-transform">{pair.icon}</div>
                </div>
                <ArrowRightLeft size={16} className="text-slate-200 group-hover:text-blue-300" />
             </div>
             <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">{pair.label}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pair.sub}</p>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2 bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-16 flex flex-col items-center justify-center text-center group hover:border-blue-300 hover:bg-blue-50/10 transition-all duration-500">
         <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <RefreshCw size={48} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
         </div>
         <h4 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-3">No Active Conversions</h4>
         <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed mb-10">Upload any document to initiate high-fidelity transformation across 50+ supported formats.</p>
         <button 
          onClick={handleNewTask}
          className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center gap-3"
         >
           <Plus size={18} strokeWidth={3} />
           Initiate Global Task
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] p-10 text-slate-900 shadow-xl relative overflow-hidden flex flex-col justify-between group border border-slate-100">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
                  <Workflow size={24} className="text-blue-600" />
               </div>
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase text-slate-900">Automation <br/><span className="text-blue-600 italic">Pipelines.</span></h4>
               <p className="text-[13px] text-slate-500 mb-10 leading-relaxed font-medium">Configure rules to auto-convert incoming documents from Slack, Email, or API into standardized PDF/A formats.</p>
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

         <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
               <ShieldCheck size={32} className="text-white opacity-40 mb-8" />
               <h4 className="text-2xl font-black mb-3 leading-[0.9] tracking-tighter uppercase">High-Fidelity <br/><span className="text-blue-200 italic">Assurance.</span></h4>
               <p className="text-[13px] text-blue-50 mb-10 leading-relaxed font-medium">Verify pixel-perfect accuracy for large-scale enterprise conversions using our neural audit cluster.</p>
            </div>
            <button 
               onClick={() => onNavigate?.('enterprise-admin')}
               className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl active:scale-95"
            >
               Admin Controls
            </button>
         </div>
      </div>
    </div>
  );

  if (showStudio) {
    return <ConverterStudio fileName={studioFileName} fileData={studioFileData} onClose={() => setShowStudio(false)} onFinish={() => setShowStudio(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">Converter Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Transform document assets with neural-grade precision. Support for 50+ industrial formats with 100% layout retention.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleNewTask}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                Upload Asset
             </button>
             <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept=".pdf,.docx,.xlsx,.pptx,.jpg,.png" />
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'my-tasks', label: 'Transformation Queue', icon: <Inbox size={16} /> },
                { id: 'usage', label: 'Cluster Metrics', icon: <Activity size={16} /> },
                { id: 'settings', label: 'Engine Profiles', icon: <Settings size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Engine Node: NYC-V4</span>
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
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Detailed conversion metrics and cluster performance logs will be available here.</p>
            </div>
          )}
          {activeTab === 'settings' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <Lock size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Restricted Profiles</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Engine performance profiles are locked to your enterprise organizational policy.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConverterDashboard;