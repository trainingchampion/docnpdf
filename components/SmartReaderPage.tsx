
import React from 'react';
import { 
  Headphones, Play, BookOpen, Clock, 
  Sparkles, Zap, ShieldCheck, ChevronRight,
  Plus, Search, Volume2, Moon, Sun, 
  MessageSquare, Layout, Star
} from 'lucide-react';

interface RecentReaderFile {
  id: string;
  name: string;
  progress: number;
  lastRead: string;
}

interface SmartReaderPageProps {
  recentFiles: any[];
  onOpenFile: (file: any) => void;
  onUpload: () => void;
}

const SmartReaderPage: React.FC<SmartReaderPageProps> = ({ recentFiles, onOpenFile, onUpload }) => {
  const readerFiles: RecentReaderFile[] = recentFiles.slice(0, 3).map(f => ({
    id: f.id,
    name: f.name,
    progress: Math.floor(Math.random() * 100),
    lastRead: '2 hours ago'
  }));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#020617] text-white overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      {/* Hero Atmosphere */}
      <div className="relative h-[450px] shrink-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-transparent to-[#020617] z-0" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 text-center max-w-5xl px-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 shadow-2xl">
             <Headphones size={14} className="text-blue-400" />
             <span className="text-[10px] font-[1000] uppercase tracking-[0.25em] text-blue-100">Immersive Audio Reader</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-[1000] tracking-tighter mb-6 leading-none whitespace-nowrap">
            Listen to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">Intelligence.</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            Turn any complex PDF into a professional audio narration. Experience documents in a whole new dimension.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={onUpload}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-[1.5rem] font-black text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
            >
              <Plus size={18} /> New Reading Session
            </button>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
              <BookOpen size={18} /> Focus Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Content */}
      <div className="max-w-7xl mx-auto w-full px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Continue Reading Shelf */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[12px] font-[1000] uppercase tracking-[0.3em] text-white/40">Continue Reading</h3>
               <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">View Shelf</button>
            </div>
            
            <div className="space-y-4">
              {readerFiles.length === 0 ? (
                <div className="p-12 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center text-center opacity-30">
                   <BookOpen size={48} className="mb-4" />
                   <p className="text-sm font-bold uppercase tracking-widest">No active sessions</p>
                </div>
              ) : (
                readerFiles.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => onOpenFile(file)}
                    className="group bg-white/5 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-16 h-20 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 shadow-lg border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform">
                         <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                         <FileTextIcon className="text-white/20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white truncate mb-2">{file.name}</h4>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2">
                             <Clock size={12} className="text-blue-400" />
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{file.lastRead}</span>
                           </div>
                           <div className="flex-1 max-w-[150px] h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600" style={{ width: `${file.progress}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-blue-400">{file.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl -translate-x-4 group-hover:translate-x-0">
                       <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Immersive Controls / Stats */}
          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-white/10 rounded-[2.5rem] shadow-2xl">
               <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                   <Sparkles size={20} />
                 </div>
                 <h4 className="text-[12px] font-black uppercase tracking-[0.2em]">Reader Insights</h4>
               </div>
               
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Time Read</span>
                   <span className="text-sm font-black">12.4 Hours</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Voice Mode</span>
                   <span className="text-sm font-black text-blue-400">Natural Flow</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Avg. Velocity</span>
                   <span className="text-sm font-black">240 WPM</span>
                 </div>
               </div>

               <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="flex items-center gap-3 text-emerald-400 mb-2">
                   <ShieldCheck size={14} />
                   <span className="text-[9px] font-[1000] uppercase tracking-widest">Offline Cache Active</span>
                 </div>
                 <p className="text-[10px] text-white/40 leading-relaxed font-medium">Your reading progress is synchronized across all secure nodes.</p>
               </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6">
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Reader Profiles</h3>
              <div className="space-y-3">
                 {[
                   { name: 'Professional', icon: <Sun size={14} />, active: true },
                   { name: 'Warm/Narration', icon: <Moon size={14} /> },
                   { name: 'High-Speed Scan', icon: <Zap size={14} /> }
                 ].map(profile => (
                   <button key={profile.name} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${profile.active ? 'bg-white/10 border-white/10 text-white' : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'}`}>
                      <div className="flex items-center gap-3">
                        {profile.icon}
                        <span className="text-xs font-bold">{profile.name}</span>
                      </div>
                      {profile.active && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]" />}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileTextIcon = (props: any) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

export default SmartReaderPage;
