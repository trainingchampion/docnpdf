
import React, { useState, useRef } from 'react';
import { 
  X, Plus, Globe, Sparkles, ChevronLeft, 
  Check, Loader2, ArrowRight, HelpCircle, 
  Save, Wand2, Languages, FileText, 
  RefreshCw, MousePointer2, Settings, 
  ShieldCheck, ArrowDownLeft, FileOutput, 
  Home, Database, Activity, Target, Upload
} from 'lucide-react';
import { chatWithPDFs } from '../services/geminiService';
import { FormattedResponse } from './AIModal';

interface TranslationStudioProps {
  onClose: () => void;
  onConvertToDoc?: (title: string, content: string) => void;
}

const TranslationStudio: React.FC<TranslationStudioProps> = ({ onClose, onConvertToDoc }) => {
  const [view, setView] = useState<'hub' | 'editor'>('hub');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string } | null>(null);
  const [translatedResult, setTranslatedResult] = useState<string | null>(null);
  
  // Translation Controls
  const [targetLang, setTargetLang] = useState('French');
  const [dialect, setDialect] = useState('Standard');
  const [context, setContext] = useState('General');
  const [formalism, setFormalism] = useState(70);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        setUploadedFile({ name: file.name, base64 });
        setView('editor');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() && !uploadedFile) return;
    setIsGenerating(true);
    
    try {
      const prompt = `
        ACT AS A HIGH-FIDELITY LINGUISTIC NODE. 
        TASK: Translate the content ${uploadedFile ? 'of the provided document' : 'below'} to ${targetLang} using ${dialect} dialect.
        CONTEXT: ${context}.
        FORMALISM LEVEL: ${formalism}/100.
        ${sourceText ? `SOURCE TEXT: "${sourceText}"` : ''}
        OUTPUT RULES: Provide ONLY the translated text in high-fidelity plain text. Maintain any structural meaning. Use **bold** for key terms.
      `;

      const filesToProcess = uploadedFile ? [uploadedFile.base64] : [];
      const result = await chatWithPDFs(filesToProcess, [{ role: 'user', parts: [{ text: prompt }] }], false);
      setTranslatedResult(result.text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderHub = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        accept=".pdf,.doc,.docx" 
      />
      
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-2xl font-black text-[#002D56] uppercase tracking-widest mb-2">Universal Translation Node</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Global Linguistic Sync Active</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button 
          onClick={() => { setUploadedFile(null); setView('editor'); }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-blue-600 hover:shadow-2xl transition-all duration-500"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <Languages size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Direct Sync</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Translate raw text with high-fidelity dialect control.</p>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-blue-600 hover:shadow-2xl transition-all duration-500"
        >
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Asset Transformation</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Upload a PDF or Doc to convert the entire schema to a new language.</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-blue-600 hover:shadow-2xl transition-all duration-500 opacity-50 cursor-not-allowed">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
            <Database size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Batch Processing</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Map multiple documents to a single target language node.</p>
        </button>

        <button className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:border-blue-600 hover:shadow-2xl transition-all duration-500 opacity-50 cursor-not-allowed">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">Live Link</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Sync a web URL for real-time semantic localization.</p>
        </button>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex-1 flex overflow-hidden bg-white animate-in slide-in-from-right-4 duration-500">
      {/* Viewport (Left) */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar border-r border-slate-100 bg-slate-50/30">
         <div className="p-12 max-w-4xl mx-auto w-full">
            <nav className="flex items-center gap-2 text-sm font-medium mb-12">
               <button onClick={() => setView('hub')} className="text-blue-600 hover:underline flex items-center gap-1">
                 <ChevronLeft size={16} /> Hub
               </button>
               <span className="text-slate-300">/</span>
               <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Translation Workbench</span>
            </nav>

            {!translatedResult ? (
              <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 relative">
                 {uploadedFile && (
                   <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 animate-in fade-in zoom-in">
                      <FileText size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{uploadedFile.name}</span>
                      <button onClick={() => setUploadedFile(null)} className="ml-2 hover:text-rose-500"><X size={14} /></button>
                   </div>
                 )}
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <Target size={20} className="text-blue-600" /> {uploadedFile ? 'Asset Intelligence Input' : 'Source Input'}
                 </h4>
                 <textarea 
                   value={sourceText}
                   onChange={(e) => setSourceText(e.target.value)}
                   placeholder={uploadedFile ? "Optionally provide instructions or specific terminology to favor during translation..." : "Enter or paste the source content you wish to synchronize..."}
                   className="w-full h-[400px] bg-transparent outline-none text-lg font-medium leading-relaxed resize-none custom-scrollbar"
                 />
                 {uploadedFile && !sourceText && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4">
                         <ShieldCheck size={48} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">Document Loaded & Secured</p>
                   </div>
                 )}
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-700">
                 <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-[50px] rounded-full pointer-events-none" />
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                      <Globe size={14} /> Synchronized Artifact ({targetLang})
                    </h4>
                    <div className="prose prose-slate max-w-none">
                       <FormattedResponse text={translatedResult} themeColor="#135bec" />
                    </div>
                 </div>
                 
                 <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => onConvertToDoc?.(`${targetLang} Sync`, translatedResult)}
                      className="px-10 py-5 bg-emerald-600 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3"
                    >
                       <FileOutput size={20} /> Convert to Document
                    </button>
                    <button 
                      onClick={() => setTranslatedResult(null)}
                      className="px-10 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                       Modify Source
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* Linguistic Command Center (Right) */}
      <aside className="w-[480px] bg-[#fcfdfe] p-12 overflow-y-auto custom-scrollbar flex flex-col shadow-2xl z-20">
         <div className="mb-12">
            <h3 className="text-3xl font-[1000] text-[#002D56] tracking-tighter mb-4 uppercase">Sync Controls</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Define the precision and cultural nuance of the target output node. Mina will adjust the semantic mapping accordingly.
            </p>
         </div>

         <div className="space-y-10">
            {/* Target Language */}
            <div className="space-y-4">
               <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Target Language</label>
               <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer"
               >
                 {['French', 'Spanish', 'German', 'Chinese', 'Portuguese', 'Japanese', 'Arabic', 'Yoruba', 'Igbo', 'Swahili'].map(l => (
                   <option key={l} value={l}>{l}</option>
                 ))}
               </select>
            </div>

            {/* Dialect Nuance */}
            <div className="space-y-4">
               <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Dialect / Nuance</label>
               <div className="grid grid-cols-2 gap-2">
                  {['Standard', 'Colloquial', 'Regional', 'Archaic'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setDialect(d)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${dialect === d ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                    >
                      {d}
                    </button>
                  ))}
               </div>
            </div>

            {/* Sector Context */}
            <div className="space-y-4">
               <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Sector Context</label>
               <select 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer"
               >
                 {['General', 'Legal / Compliance', 'Medical / Science', 'Technical / SaaS', 'Creative / Marketing'].map(c => (
                   <option key={c} value={c}>{c}</option>
                 ))}
               </select>
            </div>

            {/* Formalism Slider */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Formalism Level</label>
                  <span className="text-lg font-black text-blue-600">{formalism}%</span>
               </div>
               <input 
                type="range" min="0" max="100" value={formalism}
                onChange={(e) => setFormalism(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Street / Casual</span>
                  <span>Boardroom / Formal</span>
               </div>
            </div>
         </div>

         <div className="mt-auto pt-12">
            <button 
              onClick={handleTranslate}
              disabled={isGenerating || (!sourceText.trim() && !uploadedFile)}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95"
            >
               {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <RefreshCw size={22} />}
               {isGenerating ? 'Syncing Node...' : 'Initialize Sync'}
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
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Globe size={22} />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Universal Translation Node</h1>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5">Mina Linguistics v5.2</p>
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

export default TranslationStudio;
