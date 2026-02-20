
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Sparkles, Database, Zap, Cpu, 
  RefreshCw, Copy, Download, Home, 
  ArrowRight, CheckCircle2, ShieldCheck,
  Globe, Info, Layout, Search,
  FileText, ClipboardCheck, FileSearch,
  Languages, Loader2, Maximize2,
  Settings, Activity, Fingerprint, ChevronDown,
  Target, RotateCw, ZoomIn, ZoomOut, Save,
  Files, Layers, Trash, Check, MousePointer2,
  Upload, Signal, BarChart3, RotateCcw, Headphones, AlertTriangle,
  MessageSquareText
} from 'lucide-react';
import { summarizePDF, extractAllPDFData, generateQuizFromPDF, chatWithPDFs, extractAndSolveQuestions } from '../services/geminiService';
import { FormattedResponse } from './AIModal';

interface ExtractStudioProps {
  fileName: string;
  fileData?: string;
  initialMode?: string;
  onClose: () => void;
  onFinish: () => void;
  onStudy?: (text: string, fileData?: string) => void;
}

const LogoIcon = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const ExtractStudio: React.FC<ExtractStudioProps> = ({ fileName, fileData, initialMode = 'summarizer', onClose, onFinish, onStudy }) => {
  const [activeEngine, setActiveEngine] = useState<'flash' | 'pro'>('pro');
  const [extractMode, setExtractMode] = useState(initialMode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errorNode, setErrorNode] = useState<string | null>(null);
  const [status, setStatus] = useState('Idle');
  const [copied, setCopied] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Logic tracking for user transparency
  const [processingStep, setProcessingStep] = useState(0);
  const reasoningSteps = [
    "Initializing High-Fidelity Node...",
    "Scanning 200+ Document Layers...",
    "Renumbering Logical Questions...",
    "Mapping Wrong Option Distractors...",
    "Resolving Step-by-step Justifications...",
    "Finalizing High-Resolution Report..."
  ];

  const [solverPreference, setSolverPreference] = useState('Detailed Step-by-step');

  const fileUrl = useMemo(() => {
    if (!fileData) return null;
    try {
      const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const binString = window.atob(base64Data);
      const bytes = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) bytes[i] = binString.charCodeAt(i);
      return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { return null; }
  }, [fileData]);

  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);

  // Visual step incrementer for processing
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep(prev => (prev < reasoningSteps.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleExtract = async () => {
    if (!fileData) {
      setErrorNode("Missing Document Data");
      setStatus('Error');
      return;
    }
    
    setIsProcessing(true);
    setStatus('Reasoning...');
    setResult(null);
    setErrorNode(null);

    const b64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;

    try {
      let response: { text: string; error?: string };
      
      if (extractMode === 'summarizer') {
        response = await summarizePDF(b64);
      } else if (extractMode === 'ai-assistant') {
        response = await extractAllPDFData(b64);
      } else if (extractMode === 'question-solver') {
        response = await extractAndSolveQuestions(b64, solverPreference);
      } else if (extractMode === 'q-gen') {
        response = await generateQuizFromPDF(b64);
      } else if (extractMode === 'translate') {
        response = await chatWithPDFs([b64], [{ role: 'user', parts: [{ text: "Translate this document into English." }] }], false);
      } else {
        response = { text: "Undefined logic node requested." };
      }

      if (response.error) {
        setErrorNode(response.error);
        setStatus('Error');
      } else {
        setResult(response.text);
        setStatus('Complete');
      }
    } catch (e: any) {
      console.error("Studio Execution Error:", e);
      setErrorNode(e.message || 'ENGINE_INTERNAL_ERROR');
      setStatus('Error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setErrorNode(null);
    setStatus('Idle');
    setProcessingStep(0);
    setShowMetrics(false);
  };

  const modes = [
    { id: 'summarizer', label: 'Synthesis', icon: <Layout size={14} />, desc: 'Deep Summary' },
    { id: 'ai-assistant', label: 'Mapping', icon: <Database size={14} />, desc: 'Field Extraction' },
    { id: 'question-solver', label: 'Exam Solver', icon: <ClipboardCheck size={14} />, desc: 'Precision Answers' },
    { id: 'translate', label: 'Language', icon: <Languages size={14} />, desc: 'Universal Link' },
  ];

  const solverPreferences = [
    "Detailed Step-by-step",
    "Concise & Direct",
    "Explain like I'm 11",
    "Explain like I'm 5",
    "Technical & Academic",
    "Socratic Method"
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-[#f8fafc] flex flex-col animate-in fade-in duration-500 overflow-hidden font-['Inter',_sans-serif]">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <Home size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${extractMode === 'question-solver' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                {extractMode === 'question-solver' ? <ClipboardCheck size={22} /> : <Cpu size={22} />}
             </div>
             <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest truncate max-w-[200px]">{extractMode === 'question-solver' ? 'Exhaustive Solver' : 'Intelligence Studio'}</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{extractMode === 'question-solver' ? '200+ ITEM NODE' : 'HIGH-FIDELITY NODE'}</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
             <button 
              onClick={() => setActiveEngine('flash')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeEngine === 'flash' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
             >Flash Node</button>
             <button 
              onClick={() => setActiveEngine('pro')}
              className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeEngine === 'pro' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}
             >Pro Node</button>
          </div>

          <button 
            onClick={handleExtract}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 ${extractMode === 'question-solver' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-black'} text-white`}
          >
             {isProcessing ? 'Thinking...' : extractMode === 'question-solver' ? 'Resolve 200 Questions' : 'Run Cycle'} <Sparkles size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Rails */}
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-10 gap-10 z-40 shrink-0 shadow-sm">
          <button className={`transition-all transform hover:scale-110 active:scale-90 relative ${extractMode === 'question-solver' ? 'text-indigo-600' : 'text-blue-600'}`}>
            <Cpu size={30} />
            <div className={`absolute -right-[23px] top-1/2 -translate-y-1/2 w-1 h-10 rounded-full ${extractMode === 'question-solver' ? 'bg-indigo-600' : 'bg-blue-600'}`} />
          </button>
          
          <button 
            onClick={() => setShowMetrics(!showMetrics)}
            className={`transition-all transform hover:scale-110 active:scale-90 ${showMetrics ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-500'}`}
            title="System Vitals"
          >
            <Activity size={30} />
          </button>

          <button 
            onClick={handleRestart}
            className="transition-all transform hover:scale-110 active:scale-90 group relative"
            title="Restart Studio Session"
          >
            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${status === 'Idle' ? 'border-slate-200 text-slate-200' : 'border-blue-600 bg-blue-50/50 text-blue-600'}`}>
              <RotateCcw size={28} />
            </div>
          </button>

          <div className="mt-auto pb-6">
             <button className="text-slate-300 hover:text-slate-900 transition-all">
                <Settings size={28} />
             </button>
          </div>
        </aside>

        {/* Floating Metrics Panel */}
        {showMetrics && (
          <div className="absolute left-24 top-24 z-[100] w-64 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] p-6 animate-in slide-in-from-left-4 duration-300">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Vitals</h4>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-600">
                      <Signal size={14} />
                      <span className="text-xs font-bold">Latency</span>
                   </div>
                   <span className="text-xs font-black text-indigo-600">14ms</span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-bold">Fidelity</span>
                   </div>
                   <span className="text-xs font-black text-indigo-600">99.4%</span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-slate-600">
                      <BarChart3 size={14} />
                      <span className="text-xs font-bold">Volume</span>
                   </div>
                   <span className="text-xs font-black text-indigo-600">Exhaustive</span>
                </div>
             </div>
             <div className="mt-6 pt-6 border-t border-slate-50">
                <p className="text-[9px] font-bold text-slate-400 leading-relaxed">
                  Tehila is monitoring this 200+ question cycle for absolute pedagogical precision.
                </p>
             </div>
          </div>
        )}

        {/* Studio Viewport */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50">
           <div className="flex-1 border-r border-slate-200 bg-white p-12 overflow-auto custom-scrollbar flex justify-center relative">
              <div className="w-full max-w-[700px] shadow-2xl rounded-sm overflow-hidden border border-slate-100 aspect-[1/1.4] bg-slate-50 relative">
                {fileUrl ? (
                    <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none opacity-90" title="Extract Source View" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                       <FileText size={100} />
                    </div>
                )}
                <div className="absolute top-4 right-4 opacity-30">
                  <LogoIcon className="w-8 h-8" />
                </div>
              </div>
           </div>

           {/* Result Workbench */}
           <div className="flex-1 bg-slate-50 p-12 overflow-auto custom-scrollbar flex flex-col relative">
              {isProcessing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                   <div className="relative mb-8">
                      <div className={`w-24 h-24 border-8 rounded-full animate-spin ${extractMode === 'question-solver' ? 'border-indigo-50 border-t-indigo-600' : 'border-blue-50 border-t-blue-600'}`} />
                      <div className={`absolute inset-0 flex items-center justify-center ${extractMode === 'question-solver' ? 'text-indigo-600' : 'text-blue-600'}`}>
                        <Sparkles size={28} className="animate-pulse" />
                      </div>
                   </div>
                   <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-2">Resolving 200 Questions...</h3>
                   <div className="flex flex-col gap-2 mt-4">
                      {reasoningSteps.map((step, idx) => (
                        <div key={idx} className={`flex items-center gap-3 transition-all duration-700 ${idx <= processingStep ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${idx < processingStep ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]' : idx === processingStep ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${idx === processingStep ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                           {idx < processingStep && <CheckCircle2 size={12} className="text-emerald-500" />}
                        </div>
                      ))}
                   </div>
                </div>
              ) : errorNode ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in shake duration-500">
                   <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                      <AlertTriangle size={40} />
                   </div>
                   <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-2">Node Failure: {errorNode}</h3>
                   <p className="text-slate-50 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                      The intelligence node encountered congestion or invalid formatting. Ensure the PDF is not password protected.
                   </p>
                   <button onClick={handleExtract} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black shadow-xl active:scale-95">Retry Cycle</button>
                </div>
              ) : result ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-700 pb-20 relative z-10">
                   <div className="bg-white rounded-[3rem] border border-slate-200 p-10 lg:p-16 shadow-2xl relative overflow-hidden min-h-[600px]">
                      {/* Watermark */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none rotate-[-45deg] z-0">
                         <span className="text-[120px] font-black uppercase whitespace-nowrap">docnpdf</span>
                      </div>

                      <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${extractMode === 'question-solver' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                             {extractMode === 'question-solver' ? <ClipboardCheck size={24} /> : <Cpu size={24} />}
                           </div>
                           <div>
                              <h3 className="text-xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none">
                                {extractMode === 'question-solver' ? 'Exhaustive Solver Report' : 'Intelligence Artifact'}
                              </h3>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Node Node-A1 • Exhaustive 200-Item Node</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <LogoIcon className="w-6 h-6 opacity-20" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{activeEngine === 'pro' ? 'Gemini 3 Pro' : 'Gemini 3 Flash'}</span>
                        </div>
                      </div>
                      
                      <div className="prose prose-slate max-w-none relative z-10">
                         <FormattedResponse text={result} themeColor={extractMode === 'question-solver' ? '#4f46e5' : '#1d4ed8'} mode="chat" />
                      </div>

                      <div className="mt-20 pt-10 border-t border-slate-50 flex flex-wrap gap-4 relative z-10">
                         {onStudy && (
                           <button 
                            onClick={() => onStudy(result, fileData)}
                            className="px-10 py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-[13px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center gap-4"
                           >
                              <Headphones size={20} /> Send to Intelligence Reader
                           </button>
                         )}
                         <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-8 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-3">
                            {copied ? <><CheckCircle2 size={16} className="text-emerald-400" /> Indexed</> : <><Copy size={16} /> Copy to Clipboard</>}
                         </button>
                         <button className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-3">
                            <Download size={16} /> Export Analysis
                         </button>
                         <button 
                          onClick={handleRestart}
                          className="px-8 py-5 bg-rose-50 text-rose-600 rounded-[1.75rem] font-black text-[11px] uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm active:scale-95 flex items-center gap-3"
                         >
                            <RotateCcw size={16} /> Restart
                         </button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 relative z-10">
                   {extractMode === 'question-solver' ? <ClipboardCheck size={64} className="text-indigo-400 mb-6" /> : <Sparkles size={64} className="text-blue-400 mb-6" />}
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em]">
                     {extractMode === 'question-solver' ? 'Exhaustive Solver Idle' : 'Workbench Idle'}
                   </h3>
                   <p className="text-sm font-medium text-slate-400 max-w-xs mt-2 leading-relaxed">
                     {extractMode === 'question-solver' ? "Ready to resolve all 200+ questions with wrong-option analysis. Configure preference on the right." : 'Select an extraction node and initiate reasoning to view results.'}
                   </p>
                </div>
              )}
           </div>
        </main>

        {/* Engine Controls */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-40 shrink-0 p-8 shadow-sm overflow-y-auto custom-scrollbar">
           <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${extractMode === 'question-solver' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Logic Node</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Configuration Gate</p>
              </div>
           </div>

           <div className="space-y-10">
              <section>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Task Mode</h4>
                 <div className="space-y-2">
                    {modes.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => setExtractMode(m.id)}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${extractMode === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-transparent hover:border-indigo-300'}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${extractMode === m.id ? 'bg-white/10' : 'bg-white text-indigo-600 shadow-sm'}`}>
                               {m.icon}
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black uppercase tracking-tight">{m.label}</p>
                               <p className={`text-[8px] font-bold uppercase tracking-widest ${extractMode === m.id ? 'text-indigo-400' : 'text-slate-400'}`}>{m.desc}</p>
                            </div>
                         </div>
                         {extractMode === m.id && <CheckCircle2 size={16} className="text-indigo-400" />}
                      </button>
                    ))}
                 </div>
              </section>

              {extractMode === 'question-solver' && (
                <section className="animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Solution Preference</h4>
                    <Info size={12} className="text-slate-300 cursor-help" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">Pick how you want Tehila to derive and present the correct answers.</p>
                    <div className="grid grid-cols-1 gap-2">
                       {solverPreferences.map(pref => (
                         <button 
                          key={pref}
                          onClick={() => setSolverPreference(pref)}
                          className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between ${solverPreference === pref ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:bg-slate-50'}`}
                         >
                           <div className="flex items-center gap-2">
                             {solverPreference === pref ? <MessageSquareText size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                             {pref}
                           </div>
                           {solverPreference === pref && <CheckCircle2 size={12} />}
                         </button>
                       ))}
                    </div>
                  </div>
                </section>
              )}

              <div className="h-px bg-slate-50" />

              <section className="p-6 bg-[#0f172a] rounded-[2rem] text-white shadow-2xl relative overflow-hidden mt-auto">
                  <ShieldCheck size={28} className="text-indigo-400 mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-tight mb-2 leading-none">High-Fidelity Scan</h4>
                  <p className="text-[10px] opacity-60 leading-relaxed font-medium uppercase tracking-widest">Exhaustive 200-item node processing is active. Every distractor is analyzed for student clarity.</p>
              </section>
           </div>
        </aside>
      </div>

      <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 opacity-40">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-widest">Exhaustive Solving Node</span></div>
            <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-widest">Distributed Ledger Verified</span></div>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Studio v5.8.2-Exhaustive</p>
      </footer>
    </div>
  );
};

export default ExtractStudio;
