
import React, { useState } from 'react';
import { 
  FileText, Sparkles, ShieldCheck, Database, 
  RefreshCw, LayoutGrid, Edit3, Lock, 
  Camera, Layers, Cpu, Globe, ArrowRight,
  User, CheckCircle2, Zap, Workflow,
  Signature,
  GitGraph,
  Share2,
  Activity,
  FileSpreadsheet,
  Presentation,
  Wand2,
  Terminal,
  Code
} from 'lucide-react';

interface SectionIllustrationProps {
  type: 'extract' | 'convert' | 'organize' | 'edit' | 'security' | 'scanner' | 'esign' | 'compress' | 'workflow' | 'native' | 'api';
  themeColor?: string;
}

const FACE_MAP: Record<string, string> = {
  extract: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&h=120&fit=crop&crop=faces",
  convert: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces",
  workflow: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces",
  edit: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces",
  security: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
  scanner: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
  esign: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces",
  compress: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces",
  organize: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop&crop=faces",
  native: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=120&h=120&fit=crop&crop=faces",
  api: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop&crop=faces"
};

const SectionIllustration: React.FC<SectionIllustrationProps> = ({ type, themeColor }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = FACE_MAP[type] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces";
  const col = themeColor || '#135bec';

  const renderCentralNode = () => {
    switch (type) {
      case 'esign':
        return (
          <div className="relative w-48 h-64 bg-[#0f172a] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col p-8 items-start gap-5 overflow-hidden group">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Signature size={22} /></div>
            <div className="w-full h-2 bg-white/10 rounded-full" />
            <div className="w-3/4 h-2 bg-white/10 rounded-full" />
            <div className="w-full h-2 bg-white/10 rounded-full" />
            <div className="mt-auto flex gap-2">
               <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-pink-400 shadow-xl" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50" />
          </div>
        );
      case 'extract':
        return (
          <div className="relative w-48 h-64 bg-indigo-950 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)] flex flex-col p-8 items-start gap-5 overflow-hidden border border-white/5">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Database size={22} /></div>
            <div className="flex gap-3 w-full">
               <div className="w-5 h-5 bg-indigo-400/20 rounded border border-indigo-400/40 animate-pulse" />
               <div className="flex-1 h-5 bg-white/5 rounded" />
            </div>
            <div className="flex gap-3 w-full">
               <div className="w-5 h-5 bg-indigo-400/20 rounded border border-indigo-400/40 animate-pulse delay-100" />
               <div className="flex-1 h-5 bg-white/5 rounded" />
            </div>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
               <Sparkles size={12} /> Semantic Node Active
            </div>
          </div>
        );
      case 'workflow':
        return (
          <div className="relative w-48 h-64 bg-[#020617] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(19,91,236,0.4)] flex flex-col p-8 items-center gap-6 overflow-hidden border border-blue-500/20">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
               <div className="w-12 h-0.5 bg-blue-500/30" />
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Workflow size={16} /></div>
            </div>
            <div className="w-full flex flex-col gap-3 mt-4">
               <div className="h-2 w-full bg-blue-900/40 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/40 animate-slide-right" />
               </div>
               <div className="h-2 w-2/3 bg-blue-900/40 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/40 animate-slide-right delay-700" />
               </div>
            </div>
            <div className="mt-auto flex flex-col items-center gap-2">
               <Activity size={24} className="text-blue-500/50" />
               <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Pipeline Operational</span>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="relative w-48 h-64 bg-slate-950 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(6,182,212,0.4)] flex flex-col p-8 items-start gap-4 overflow-hidden border border-cyan-500/20">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
              </div>
              <Terminal size={14} className="text-cyan-500/50" />
            </div>
            <div className="font-mono text-[9px] text-cyan-400/80 space-y-1.5">
              <p className="flex gap-2"><span>$</span> <span>POST /v1/sign</span></p>
              <div className="pl-4 space-y-1 opacity-60">
                <p>{"{"}</p>
                <p className="pl-4">"node_id": "X-82",</p>
                <p className="pl-4">"status": "active"</p>
                <p>{"}"}</p>
              </div>
              <p className="text-emerald-400 mt-2 flex gap-2"><span>{'>'}</span> <span>200 OK</span></p>
            </div>
            <div className="mt-auto w-full p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-between">
              <span className="text-[7px] font-black text-cyan-400 uppercase tracking-widest">Sync Relay</span>
              <Activity size={10} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
        );
      case 'convert':
        return (
          <div className="relative w-56 h-72 bg-white rounded-[3rem] shadow-[0_60px_120px_-24px_rgba(0,0,0,0.12)] border border-slate-50 flex flex-col items-center justify-center gap-10 overflow-hidden">
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-[0_12px_24px_-4px_rgba(225,29,72,0.15)] border border-rose-100">
                  <FileText size={32} />
                </div>
                <ArrowRight size={20} className="text-slate-100 animate-pulse" />
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-[0_12px_24px_-4px_rgba(225,29,72,0.15)] border border-rose-100">
                  <FileText size={32} />
                </div>
             </div>
             
             <div className="w-full px-6 relative z-10">
                <div className="bg-[#e11d48] text-white py-3 px-6 rounded-2xl shadow-[0_20px_40px_-10px_rgba(225,29,72,0.4)] text-center">
                   <span className="text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Fidelity Node Active</span>
                </div>
             </div>

             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-[60px] opacity-40 -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-50 rounded-full blur-[40px] opacity-30 translate-y-1/2 -translate-x-1/2" />
          </div>
        );
      case 'native':
        return (
          <div className="relative w-48 h-64 bg-orange-50 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(249,115,22,0.25)] flex flex-col p-6 items-center justify-center gap-4 overflow-hidden border border-orange-100 group">
             <div className="absolute top-2 right-2 p-2 bg-orange-600 text-white rounded-xl shadow-lg animate-bounce-slow">
                <Sparkles size={16} />
             </div>
             <div className="flex -space-x-4 mb-4">
                <div className="w-14 h-18 bg-white border border-blue-200 rounded-lg shadow-xl flex items-center justify-center text-blue-600 transform -rotate-6 group-hover:-translate-y-2 transition-transform duration-500">
                   <FileText size={24} />
                </div>
                <div className="w-14 h-18 bg-white border border-emerald-200 rounded-lg shadow-xl flex items-center justify-center text-emerald-600 z-10 scale-110 group-hover:-translate-y-4 transition-transform duration-500">
                   <FileSpreadsheet size={24} />
                </div>
                <div className="w-14 h-18 bg-white border border-orange-200 rounded-lg shadow-xl flex items-center justify-center text-orange-600 transform rotate-6 group-hover:-translate-y-2 transition-transform duration-500">
                   <Presentation size={24} />
                </div>
             </div>
             <div className="mt-4 p-4 bg-orange-600 text-white rounded-2xl w-full flex items-center justify-between shadow-xl">
                <span className="text-[9px] font-black uppercase tracking-widest">AI Co-pilot</span>
                <Wand2 size={14} className="animate-pulse" />
             </div>
          </div>
        );
      case 'security':
        return (
          <div className="relative w-48 h-64 bg-[#1e293b] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center gap-6 overflow-hidden border border-white/10">
            <div className="w-24 h-24 bg-slate-400/10 rounded-full border-2 border-slate-400/30 flex items-center justify-center relative">
               <Lock size={40} className="text-slate-400" />
               <div className="absolute inset-0 border-t-2 border-slate-300 rounded-full animate-spin-slow opacity-40" />
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ENCRYPTED VAULT</span>
            </div>
          </div>
        );
      case 'organize':
        return (
          <div className="relative w-48 h-64 flex flex-col items-center justify-center gap-2">
             <div className="w-36 h-48 bg-white rounded-2xl shadow-2xl border border-slate-100 -rotate-6 translate-y-6 opacity-40" />
             <div className="absolute w-36 h-48 bg-white rounded-2xl shadow-2xl border border-blue-100 rotate-3 flex flex-col p-6 gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><LayoutGrid size={18} /></div>
                <div className="h-2 w-full bg-slate-100 rounded-full" />
                <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                <div className="mt-auto flex justify-end">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100"><CheckCircle2 size={20} /></div>
                </div>
             </div>
          </div>
        );
      case 'edit':
        return (
          <div className="relative w-48 h-64 bg-white rounded-[2.5rem] border border-teal-100 shadow-[0_40px_100px_-20px_rgba(20,184,166,0.1)] flex flex-col p-8 gap-4 overflow-hidden">
             <div className="w-full h-2.5 bg-slate-50 rounded-full" />
             <div className="w-3/4 h-2.5 bg-teal-50 rounded-full relative">
                <div className="absolute -right-3 -top-1 w-3 h-3 bg-teal-500 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.8)]" />
             </div>
             <div className="w-full h-2.5 bg-slate-50 rounded-full" />
             <div className="mt-auto p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center gap-3">
                <Edit3 size={16} className="text-teal-600" />
                <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest">Resonance Studio</span>
             </div>
          </div>
        );
      case 'scanner':
        return (
          <div className="relative w-48 h-64 bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
             <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-transparent to-transparent opacity-60" />
             <div className="absolute inset-6 border border-blue-500/40 rounded-2xl border-dashed" />
             <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,1)] animate-scan-y" />
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-80">
                <Camera size={40} className="text-white" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Digitizing Node</span>
             </div>
          </div>
        );
      case 'compress':
        return (
          <div className="relative w-56 h-72 bg-[#001a14] rounded-[3rem] shadow-[0_60px_120px_-24px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-10 gap-10 overflow-hidden border border-emerald-900/20 group-hover:scale-105 transition-all duration-700">
             <div className="size-28 bg-emerald-500/5 rounded-full border border-emerald-500/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-1000 relative">
                <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-full" />
                <Layers size={48} className="text-[#10b981] relative z-10" />
             </div>
             <div className="w-full flex flex-col gap-6 items-center">
                <div className="w-3/4 h-2 bg-white/5 rounded-full overflow-hidden relative">
                   <div className="absolute left-0 top-0 h-full w-[35%] bg-[#10b981] shadow-[0_0_15px_#10b981]" />
                </div>
                <div className="text-center">
                   <p className="text-[11px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-1">OPT VOLUME</p>
                   <p className="text-2xl font-black text-[#10b981] tracking-tighter">-82%</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center justify-center py-24 px-10">
      <div className="absolute w-[500px] h-[500px] blur-[140px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: col }} />
      
      {type === 'native' && (
        <div className="absolute left-[-40px] top-4 z-20 w-32 h-32 bg-white backdrop-blur-2xl rounded-[2.25rem] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center border border-white animate-bounce-slow">
           <div className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-inner overflow-hidden mb-3 grayscale transition-all hover:grayscale-0 duration-700 flex items-center justify-center bg-slate-50">
              {imgError ? (
                <User size={32} className="text-slate-300" />
              ) : (
                <img 
                  src={avatarUrl} 
                  className="w-full h-full object-cover scale-110" 
                  alt="Node Authority" 
                  onError={() => setImgError(true)}
                />
              )}
           </div>
           <div className="w-12 h-1.5 bg-slate-100 rounded-full opacity-60" />
        </div>
      )}

      <div className="relative z-10 transition-all duration-1000 hover:scale-105 perspective-1200 group">
        <div className="group-hover:rotate-x-3 group-hover:rotate-y-3 transition-transform duration-1000 ease-out">
           {renderCentralNode()}
        </div>
      </div>

      <style>{`
        @keyframes scan-y {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; }
        }
        .animate-scan-y {
          animation: scan-y 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-12px) scale(1.02) rotate(1deg); }
        }
        .perspective-1200 {
          perspective: 1200px;
        }
        .rotate-x-3 {
          transform: rotateX(3deg);
        }
        .rotate-y-3 {
          transform: rotateY(3deg);
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide-right {
          animation: slide-right 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SectionIllustration;
