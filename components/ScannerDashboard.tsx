import React, { useState } from 'react';
import { 
  Scan, 
  Camera, 
  Maximize, 
  RefreshCw, 
  Plus, 
  Clock, 
  ChevronRight, 
  Filter, 
  ArrowRight, 
  Inbox, 
  Zap, 
  Building2, 
  History, 
  ShieldCheck, 
  Activity,
  Smartphone,
  ScanEye,
  FileSearch,
  Type,
  ImageIcon,
  Wand2,
  HardDrive,
  Settings
} from 'lucide-react';
import SectionIllustration from './SectionIllustration';

interface ScannerDashboardProps {
  onNavigate?: (view: string, config?: any) => void;
}

const ScannerDashboard: React.FC<ScannerDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'presets'>('queue');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartScan = () => {
    onNavigate?.('scanner-studio');
  };

  const renderQueue = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ScanEye size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Daily Captures</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Type size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">OCR Words</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 leading-none">0k</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Sync Status</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-600 leading-none">99.9%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all text-left">
          <div className="size-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">AI Refinement</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 leading-none">Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
        <div className="shrink-0">
           <SectionIllustration type="scanner" themeColor="#2563eb" />
        </div>
        <div className="flex-1 text-center lg:text-left">
           <h3 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter mb-4">Digitization Command Node</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Convert physical documents into searchable, high-fidelity digital assets. Gemini 3 Pro identifies text and structures instantly.</p>
        </div>
      </div>

      <div className="space-y-6">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Scanning Workflows</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'mobile', label: 'Mobile Scan', icon: <Smartphone size={20} />, sub: 'App Link Simulation', color: 'blue' },
              { id: 'ocr', label: 'Smart OCR', icon: <FileSearch size={20} />, sub: 'Text Recognition Engine', color: 'purple' },
              { id: 'enhance', label: 'Clean & Enhance', icon: <Wand2 size={20} />, sub: 'Noise Reduction Node', color: 'emerald' },
              { id: 'batch', label: 'Batch Processing', icon: <RefreshCw size={20} />, sub: 'Multi-Asset Ingestion', color: 'indigo' },
              { id: 'qr', label: 'Document Routing', icon: <Maximize size={20} />, sub: 'QR Code Intelligent Sort', color: 'slate' },
              { id: 'import', label: 'Import from Media', icon: <ImageIcon size={20} />, sub: 'Photo to PDF Sync', color: 'rose' }
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={handleStartScan}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all duration-500 text-left group flex flex-col"
              >
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-blue-50 transition-colors shadow-inner mb-8`}>
                    <div className="group-hover:scale-110 transition-transform text-blue-600">{tool.icon}</div>
                 </div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">{tool.label}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tool.sub}</p>
                 <ArrowRight size={20} className="mt-8 text-slate-200 group-hover:text-blue-600 transition-all translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
         </div>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center group hover:border-blue-300 hover:bg-blue-50/10 transition-all duration-500">
         <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <Camera size={48} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
         </div>
         <h4 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-3">No Active Scan Session</h4>
         <p className="text-sm text-slate-400 font-medium max-sm leading-relaxed mb-10">Capture physical assets or import images to initialize the high-fidelity OCR pipeline.</p>
         <button 
          onClick={handleStartScan}
          className="px-12 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-3"
         >
           <Plus size={18} strokeWidth={3} />
           Initialize New Scan
         </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto custom-scrollbar animate-in fade-in duration-1000 pb-32">
      <section className="bg-white border-b border-slate-50 text-slate-900 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-none mb-6 text-slate-900">Scanner Hub.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Convert physical assets into searchable workspace intelligence. High-fidelity OCR, auto-cropping, and neural enhancement node.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={handleStartScan}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
             >
                <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                Initialize Scan
             </button>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
              {[
                { id: 'queue', label: 'Processing Queue', icon: <Inbox size={16} /> },
                { id: 'history', label: 'Scan History', icon: <History size={16} /> },
                { id: 'presets', label: 'Scanner Profiles', icon: <Settings size={16} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
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
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OCR Engine Active</span>
              </div>
           </div>
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20 bg-white">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'queue' && renderQueue()}
          {activeTab === 'history' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100">
                  <Activity size={40} className="text-slate-300" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">Scan Logs</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Historical captures and OCR processing logs are currently syncing from your devices.</p>
            </div>
          )}
          {activeTab === 'presets' && (
             <div className="p-24 bg-slate-50 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
                <ShieldCheck size={40} className="text-slate-300 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-widest">Workspace Profiles</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">Scanner performance and quality profiles are managed by organizational policy.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScannerDashboard;