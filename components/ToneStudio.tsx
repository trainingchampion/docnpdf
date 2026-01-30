import React, { useState } from 'react';
import { 
  X, Sparkles, ChevronLeft, Check, 
  Loader2, ArrowRight, Save, 
  RefreshCw, FileOutput, Home, 
  Target, Zap, Activity, Palette,
  MessageSquare, User, Briefcase, 
  GraduationCap, Mic, Volume2, Wind
} from 'lucide-react';
import { chatWithPDFs } from '../services/geminiService';
import { FormattedResponse } from './AIModal';

interface ToneStudioProps {
  onClose: () => void;
  onConvertToDoc?: (title: string, content: string) => void;
}

const ToneStudio: React.FC<ToneStudioProps> = ({ onClose, onConvertToDoc }) => {
  const [view, setView] = useState<'hub' | 'editor'>('hub');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [resultText, setResultText] = useState<string | null>(null);
  
  // Flavor Controls
  const [persona, setPersona] = useState('Executive');
  const [intensity, setIntensity] = useState(60);
  const [addEmojis, setAddEmojis] = useState(false);
  const [professionalismBias, setProfessionalismBias] = useState(80);

  const handleShift = async () => {
    if (!sourceText.trim()) return;
    setIsGenerating(true);
    
    try {
      const prompt = `
        ACT AS A SEMANTIC STYLIST. 
        TASK: Shift the tone of the following text to match a ${persona} persona.
        INTENSITY: ${intensity}/100.
        PROFESSIONALISM BIAS: ${professionalismBias}/100.
        ${addEmojis ? 'MANDATORY: Include relevant emojis to enhance the tone.' : 'NO EMOJIS.'}
        SOURCE: "${sourceText}"
        OUTPUT RULES: Provide the refined text in high-fidelity plain text. Use **bolding** for high-impact phrases.
      `;

      const result = await chatWithPDFs([], [{ role: 'user', parts: [{ text: prompt }] }], false);
      setResultText(result.text);
      setView('editor');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderHub = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl font-black text-[#002D56] uppercase tracking-widest mb-2">Linguistic Flavor Node</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Semantic Resonance Active</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button 
          onClick={() => setView('editor')}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-rose-500 hover:shadow-2xl transition-all duration-500"
        >
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <Palette size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Style Refinement</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Instantly adjust the persona and professional weight of your text.</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-rose-500 hover:shadow-2xl transition-all duration-500">
          <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Brand Alignment</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Map external documents to match your corporate voice and style guide.</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-rose-500 hover:shadow-2xl transition-all duration-500">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <Wind size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Cultural Shift</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Translate cultural subtext and local flavor for specific demographics.</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-rose-500 hover:shadow-2xl transition-all duration-500">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <Mic size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Auditory Prep</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Prepare scripts optimized for high-impact professional narration.</p>
        </button>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex-1 flex overflow-hidden bg-white animate-in slide-in-from-right-4 duration-500">
      {/* Workbench (Left) */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar border-r border-slate-100 bg-slate-50/20">
         <div className="p-12 max-w-4xl mx-auto w-full">
            <nav className="flex items-center gap-2 text-sm font-medium mb-12">
               <button onClick={() => setView('hub')} className="text-rose-600 hover:underline flex items-center gap-1">
                 <ChevronLeft size={16} /> Hub
               </button>
               <span className="text-slate-300">/</span>
               <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Flavor Studio</span>
            </nav>

            {!resultText ? (
              <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <Target size={20} className="text-rose-500" /> Source Draft
                 </h4>
                 <textarea 
                   value={sourceText}
                   onChange={(e) => setSourceText(e.target.value)}
                   placeholder="Enter the document content you wish to modulate..."
                   className="w-full h-[400px] bg-transparent outline-none text-lg font-medium leading-relaxed resize-none custom-scrollbar"
                 />
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-700">
                 <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-rose-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 blur-[50px] rounded-full pointer-events-none" />
                    <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                      <Sparkles size={14} /> Modulated Result ({persona})
                    </h4>
                    <div className="prose prose-slate max-w-none">
                       <FormattedResponse text={resultText} themeColor="#e11d48" />
                    </div>
                 </div>
                 
                 <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => onConvertToDoc?.(`${persona} Mod`, resultText)}
                      className="px-10 py-5 bg-emerald-600 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3"
                    >
                       <FileOutput size={20} /> Convert to Document
                    </button>
                    <button 
                      onClick={() => setResultText(null)}
                      className="px-10 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                       Re-modulate
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* Flavor Modulator (Right) */}
      <aside className="w-[480px] bg-[#fcfdfe] p-12 overflow-y-auto custom-scrollbar flex flex-col shadow-2xl z-20">
         <div className="mb-12">
            <h3 className="text-3xl font-[1000] text-rose-900 tracking-tighter mb-4 uppercase">Modulator</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Define the auditory and emotional frequency of your document. Tehila will perform a high-fidelity semantic shift.
            </p>
         </div>

         <div className="space-y-10">
            {/* Persona Select */}
            <div className="space-y-4">
               <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Target Persona</label>
               <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Executive', icon: <Briefcase size={14} /> },
                    { id: 'Academic', icon: <GraduationCap size={14} /> },
                    { id: 'Creative', icon: <Sparkles size={14} /> },
                    { id: 'Minimalist', icon: <Wind size={14} /> },
                    { id: 'Poetic', icon: <Palette size={14} /> },
                    { id: 'Direct', icon: <Zap size={14} /> }
                  ].map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${persona === p.id ? 'bg-rose-600 border-rose-600 text-white shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200'}`}
                    >
                      <div className={persona === p.id ? 'text-white' : 'text-rose-500 opacity-40 group-hover:opacity-100'}>{p.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{p.id}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Modulation Intensity</label>
                  <span className="text-lg font-black text-rose-600">{intensity}%</span>
               </div>
               <input 
                type="range" min="0" max="100" value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
               />
               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Subtle</span>
                  <span>Transformative</span>
               </div>
            </div>

            {/* professionalismBias Slider */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Professional Weight</label>
                  <span className="text-lg font-black text-rose-600">{professionalismBias}%</span>
               </div>
               <input 
                type="range" min="0" max="100" value={professionalismBias}
                onChange={(e) => setProfessionalismBias(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
               />
            </div>

            {/* Emoji Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                     <MessageSquare size={18} />
                  </div>
                  <span className="text-sm font-black uppercase text-slate-900">Inject Emojis</span>
               </div>
               <button 
                onClick={() => setAddEmojis(!addEmojis)}
                className={`w-12 h-6 rounded-full relative p-1 transition-all duration-300 ${addEmojis ? 'bg-rose-600' : 'bg-slate-200'}`}
               >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${addEmojis ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
         </div>

         <div className="mt-auto pt-12">
            <button 
              onClick={handleShift}
              disabled={isGenerating || !sourceText.trim()}
              className="w-full py-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl shadow-rose-500/30 flex items-center justify-center gap-3 active:scale-95"
            >
               {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <Sparkles size={22} />}
               {isGenerating ? 'Modulating...' : 'Shift Resonance'}
            </button>
         </div>
      </aside>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden font-['Inter',_sans-serif]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-100 px-10 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <Home size={24} />
          </button>
          <div className="h-8 w-px bg-slate-100" />
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Palette size={22} />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Linguistic Flavor Node</h1>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] mt-1.5">Style Shifter v4.2</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {view === 'editor' && (
             <button className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl transition-all active:scale-95">
               <Save size={14} /> Commit to Vault
             </button>
           )}
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
             <X size={32} strokeWidth={2.5} />
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {view === 'hub' ? renderHub() : renderEditor()}
      </div>
    </div>
  );
};

export default ToneStudio;
