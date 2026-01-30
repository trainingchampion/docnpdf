import React, { useState } from 'react';
import { 
  X, Sparkles, FileText, FileSpreadsheet, 
  Presentation, ArrowRight, Wand2, Command,
  CheckCircle2, Info, Lightbulb, Zap, Home
} from 'lucide-react';

interface DraftingHubProps {
  onClose: () => void;
  onGenerate: (type: 'doc' | 'sheet' | 'slide', prompt: string) => void;
}

const DraftingHub: React.FC<DraftingHubProps> = ({ onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<'doc' | 'sheet' | 'slide'>('doc');

  const starters = [
    { type: 'doc', label: 'Strategy Document', prompt: 'A comprehensive 2025 growth strategy for a SaaS startup...' },
    { type: 'sheet', label: 'Financial Tracker', prompt: 'A budget tracking sheet for a product launch campaign...' },
    { type: 'slide', label: 'Pitch Deck', prompt: 'An investor pitch deck outline for a new AI platform...' },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(selectedType, prompt);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden text-[#0f172a]">
      {/* Precision Header */}
      <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="flex items-center gap-2 p-2 text-slate-400 hover:text-slate-900 transition-all group">
            <Home size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:inline">Dashboard</span>
          </button>
          <div className="h-6 w-px bg-slate-100" />
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
               <Sparkles size={16} fill="white" />
             </div>
             <div>
               <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Drafting Hub</h2>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Tehila Intelligence v4.5</p>
             </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900">
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-8">
        {/* Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl w-full flex flex-col items-center relative z-10">
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-[1000] tracking-tighter mb-4 leading-none">What are we <span className="text-blue-600">drafting?</span></h1>
            <p className="text-slate-400 text-xl font-medium">Describe your project and let Tehila build the architecture.</p>
          </div>

          {/* Prompt Engine */}
          <div className="w-full bg-white border border-slate-200 rounded-[3rem] p-4 shadow-[0_32px_128px_-24px_rgba(0,0,0,0.1)] mb-12 group focus-within:border-blue-500 transition-all">
            <div className="flex flex-col gap-4 p-4">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Generate a hiring plan for a senior engineering role including interview rubrics..."
                className="w-full h-40 resize-none text-2xl font-medium outline-none placeholder:text-slate-200 bg-transparent custom-scrollbar px-2"
              />
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <button 
                      onClick={() => setSelectedType('doc')}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedType === 'doc' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <FileText size={14} /> Document
                    </button>
                    <button 
                      onClick={() => setSelectedType('sheet')}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedType === 'sheet' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <FileSpreadsheet size={14} /> Analysis
                    </button>
                    <button 
                      onClick={() => setSelectedType('slide')}
                      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedType === 'slide' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Presentation size={14} /> Deck
                    </button>
                 </div>
                 <button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-20"
                 >
                   <Wand2 size={18} fill="white" /> Initiate Build
                 </button>
              </div>
            </div>
          </div>

          {/* Quick Starters */}
          <div className="w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Suggested Sessions</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {starters.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => onGenerate(item.type as any, item.prompt)}
                  className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 p-8 rounded-[2.5rem] transition-all text-left group hover:shadow-xl hover:shadow-blue-500/[0.03] active:scale-[0.98]"
                >
                  <div className={`w-12 h-12 mb-6 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
                    item.type === 'doc' ? 'bg-blue-50 text-blue-600' : 
                    item.type === 'sheet' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {item.type === 'doc' ? <FileText size={20} /> : item.type === 'sheet' ? <FileSpreadsheet size={20} /> : <Presentation size={20} />}
                  </div>
                  <h4 className="text-[14px] font-[900] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{item.label}</h4>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic line-clamp-2">"{item.prompt}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="p-8 border-t border-slate-50 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SOC2 Type II Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zero-Latency Drafting</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <Command size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">CMD + ENTER TO DRAFT</span>
        </div>
      </footer>
    </div>
  );
};

export default DraftingHub;