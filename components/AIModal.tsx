import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, FileUp, Globe, ExternalLink, Files, Trash2, FileText, 
  Cpu, ShieldCheck, Database, Copy, Check, Terminal, Home, 
  Sparkles, ClipboardCheck, Lock, ArrowRight, BookOpen, 
  FileDown, GraduationCap, Star, ListOrdered, Languages,
  Lightbulb, Book, HelpCircle, ChevronRight, MessageSquare,
  Activity, Zap, ShieldAlert, Fingerprint, Loader2, Plus,
  Table as TableIcon, Layout, Eye, Hash, Info, User
} from 'lucide-react';
import { PDFTool, ChatMessage } from '../types';
import { extractAllPDFData, chatWithPDFs, generateQuizFromPDF, summarizePDF, extractAndSolveQuestions } from '../services/geminiService';
import { AccountTier, StudentPassData } from '../App';

interface AIModalProps {
  tool: PDFTool;
  isOpen: boolean;
  onClose: () => void;
  onStudy?: (text: string) => void;
  initialFile?: { file: File; base64: string } | null;
  themeColor?: string;
  accountTier?: AccountTier;
  studentPass?: StudentPassData;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  base64: string;
}

export const FormattedResponse: React.FC<{ text: string; themeColor: string; mode?: 'chat' | 'digest' | 'terminal' | 'study' }> = ({ text, themeColor, mode = 'chat' }) => {
  if (!text) return null;

  const cleanText = text
    .replace(/#{1,6}\s?/g, '') 
    .replace(/`{1,3}/g, '');

  const parts = cleanText.split(/(\*\*.*?\*\*|==.*?==|!!.*?!!)/g);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${mode === 'terminal' ? 'font-mono' : ''}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="font-[1000] text-slate-900 dark:text-white uppercase tracking-tight" style={{ color: mode === 'terminal' ? '#10b981' : undefined }}>
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith('==') && part.endsWith('==')) {
          return (
            <mark key={i} className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md font-bold text-amber-900 dark:text-amber-100 border border-amber-200/50 dark:border-amber-800/50">
              {part.slice(2, -2)}
            </mark>
          );
        }
        if (part.startsWith('!!') && part.endsWith('!!')) {
          return (
            <mark key={i} className="bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 rounded-md font-black text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 uppercase text-[0.9em] tracking-wider">
              {part.slice(2, -2)}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

const AIModal: React.FC<AIModalProps> = ({ tool, isOpen, onClose, onStudy, initialFile, themeColor = '#2F00FF', accountTier = 'free', studentPass }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('Standing by');
  const [useSearch, setUseSearch] = useState(tool.id === 'ai-research');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [targetLang, setTargetLang] = useState('English');
  const [activeViewMode, setActiveViewMode] = useState<'formatted' | 'raw'>('formatted');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const checkUsageLimit = () => {
    const isUnlockedByPass = studentPass?.isActive && (tool.id === 'question-solver' || tool.id === 'q-gen');
    if (accountTier !== 'free' || isUnlockedByPass) return true;
    
    const usage = localStorage.getItem('docnpdf_ai_usage_count') || '0';
    if (parseInt(usage) >= 5) { 
      setIsLimitReached(true);
      return false;
    }
    return true;
  };

  const incrementUsage = () => {
    if (accountTier !== 'free' || studentPass?.isActive) return;
    const usage = parseInt(localStorage.getItem('docnpdf_ai_usage_count') || '0');
    localStorage.setItem('docnpdf_ai_usage_count', (usage + 1).toString());
  };

  useEffect(() => {
    if (isOpen && initialFile && files.length === 0) {
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: initialFile.file.name,
        size: initialFile.file.size,
        base64: initialFile.base64
      };
      setFiles([newFile]);
      
      if (!checkUsageLimit()) return;

      if (tool.id === 'summarizer') handleSummarize(initialFile.base64, initialFile.file.name);
      if (tool.id === 'question-solver' || tool.id === 'q-gen') handleQuestionGen(initialFile.base64, initialFile.file.name);
      if (tool.id === 'translate') handleTranslate(initialFile.base64, initialFile.file.name, targetLang);
      if (tool.id === 'ai-assistant') handleAutoExtract(initialFile.base64, initialFile.file.name);
    }
  }, [isOpen, initialFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLimitReached) return;
    const selectedFiles = Array.from(e.target.files || []) as File[];
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const newFile = { id: Math.random().toString(36).substr(2, 9), name: file.name, size: file.size, base64 };
        setFiles(prev => [...prev, newFile]);
        if (!checkUsageLimit()) return;
        if (tool.id === 'summarizer') handleSummarize(base64, file.name);
        else if (tool.id === 'translate') handleTranslate(base64, file.name, targetLang);
        else if (tool.id === 'ai-assistant') handleAutoExtract(base64, file.name);
        else if (tool.id === 'q-gen' || tool.id === 'question-solver') handleQuestionGen(base64, file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAutoExtract = async (base64: string, name: string) => {
    setIsLoading(true); setStatus('Reading document...');
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: `**READING**: Looking for data in **${name}**...` }] }]);
    const result = await extractAllPDFData(base64);
    setMessages([{ role: 'model', parts: [{ text: result.text }] }]);
    setIsLoading(false); setStatus('File Ready');
    incrementUsage();
  };

  const handleSummarize = async (base64: string, name: string) => {
    setIsLoading(true); setStatus('Creating summary...');
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: `**DRAFTING**: Picking out key points for **${name}**...` }] }]);
    const result = await summarizePDF(base64);
    setMessages([{ role: 'model', parts: [{ text: result.text }] }]);
    setIsLoading(false); setStatus('Summary Ready');
    incrementUsage();
  };

  const handleQuestionGen = async (base64: string, name: string) => {
    setIsLoading(true); setStatus('Creating study session...');
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: `**BUILDING**: Designing study questions for **${name}**...` }] }]);
    const result = await generateQuizFromPDF(base64);
    setMessages([{ role: 'model', parts: [{ text: result.text }] }]);
    setIsLoading(false); setStatus('Quiz Ready');
    incrementUsage();
  };

  const handleTranslate = async (base64: string, name: string, lang: string) => {
    setIsLoading(true); setStatus(`Translating to ${lang}...`);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: `**TRANSLATING**: Converting **${name}** into **${lang}**...` }] }]);
    const response = await chatWithPDFs([base64], [{ role: 'user', parts: [{ text: `Translate the document into ${lang}.` }] }], false);
    setMessages([{ role: 'model', parts: [{ text: response.text }] }]);
    setIsLoading(false); setStatus('Done');
    incrementUsage();
  };

  const handleSend = async () => {
    if (!input.trim() || files.length === 0 || isLimitReached) return;
    if (messages.length === 0 && !checkUsageLimit()) return;
    const userMsg: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setStatus('Asking Tehila...');
    const response = await chatWithPDFs(files.map(f => f.base64), [...messages, userMsg], useSearch);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text }], groundingChunks: response.groundingChunks }]);
    setIsLoading(false);
    setStatus('Ready');
    if (messages.length === 0) incrementUsage();
  };

  const renderSummarizer = () => (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar max-w-5xl mx-auto w-full">
        {messages.filter(m => m.role === 'model').map((msg, i) => (
          <div key={i} className="space-y-12">
            <div className="flex items-center gap-6 pb-10 border-b border-slate-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                <Layout size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 leading-none">Smart Summary</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Personal Assistant Report</p>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <FormattedResponse text={msg.parts[0].text} themeColor="#2563eb" mode="digest" />
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check size={20} strokeWidth={3} />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">Analysis Complete</span>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(msg.parts[0].text); setCopiedIndex(i); setTimeout(()=>setCopiedIndex(null),2000); }} className="px-8 py-4 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-blue-500 transition-all shadow-sm">
                {copiedIndex === i ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExtractor = () => (
    <div className="flex-1 flex flex-col bg-[#fafbfc] overflow-hidden animate-in fade-in duration-700">
      <div className="h-14 bg-white border-b border-slate-100 px-10 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
               <button onClick={() => setActiveViewMode('formatted')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeViewMode === 'formatted' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Workbench</button>
               <button onClick={() => setActiveViewMode('raw')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeViewMode === 'raw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Raw Data</button>
            </div>
         </div>
         <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
           <FileDown size={14} /> Export Results
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12 lg:p-20 custom-scrollbar">
        {messages.filter(m => m.role === 'model').map((msg, i) => (
          <div key={i} className={`p-12 lg:p-16 rounded-[3.5rem] border shadow-2xl transition-all ${activeViewMode === 'raw' ? 'bg-slate-950 border-white/10 text-emerald-400 font-mono text-sm' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center gap-4 mb-12 opacity-40">
               <Hash size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{activeViewMode === 'raw' ? 'RAW_SYSTEM_OUTPUT' : 'STRUCTURED WORKSPACE'}</span>
               <div className="h-px flex-1 bg-current opacity-10" />
            </div>
            <FormattedResponse text={msg.parts[0].text} themeColor="#3b82f6" mode={activeViewMode === 'raw' ? 'terminal' : 'chat'} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizStudio = () => (
    <div className="flex-1 flex flex-col bg-[#f0f4f8] overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar space-y-12">
        {messages.filter(m => m.role === 'model').map((msg, i) => (
          <div key={i} className="max-w-5xl mx-auto w-full space-y-8">
             <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl border border-slate-100">
                <FormattedResponse text={msg.parts[0].text} themeColor="#4f46e5" mode="study" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTranslator = () => (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-in fade-in duration-700">
      <div className="h-16 bg-slate-50 border-b border-slate-100 px-10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Languages size={20} className="text-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Translation Tools</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Language:</span>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-6 py-2 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-blue-500/5 cursor-pointer shadow-sm"
            >
              {['French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Hindi', 'Japanese'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar">
        {messages.filter(m => m.role === 'model').map((msg, i) => (
          <div key={i} className="max-w-5xl mx-auto">
             <div className="p-12 lg:p-20 bg-[#f8faff] border border-blue-100 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[100px] rounded-full" />
                <div className="relative z-10">
                   <FormattedResponse text={msg.parts[0].text} themeColor="#2563eb" />
                </div>
             </div>
             <div className="mt-12 flex justify-center">
                <button onClick={() => { navigator.clipboard.writeText(msg.parts[0].text); }} className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                   <Copy size={18} /> Copy Text
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
         {messages.length === 0 && !isLoading && (
           <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <div className="w-24 h-24 bg-white border border-slate-200 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl">
                <MessageSquare size={48} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-[1000] uppercase tracking-widest text-slate-900">AI Chat Active</h3>
              <p className="text-sm font-medium text-slate-400 mt-2">Ask Tehila anything about your files.</p>
           </div>
         )}
         {messages.map((msg, i) => (
           <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-xl ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                 {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                 <div className={`px-10 py-8 rounded-[2.5rem] shadow-lg text-[15px] leading-relaxed transition-all ${msg.role === 'user' ? 'bg-white border border-slate-100 rounded-tr-none text-slate-800 font-bold' : 'bg-white border border-slate-100 rounded-tl-none text-slate-800 font-medium'}`}>
                    <FormattedResponse text={msg.parts[0].text} themeColor={themeColor} />
                 </div>
                 {msg.groundingChunks && (
                    <div className="mt-3 flex flex-wrap gap-2 px-4">
                      {msg.groundingChunks.map((c, j) => c.web && (
                        <a key={j} href={c.web.uri} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black text-blue-600 hover:bg-slate-50 transition-all shadow-sm">
                          <Globe size={12} /> {c.web.title}
                        </a>
                      ))}
                    </div>
                 )}
              </div>
           </div>
         ))}
         <div ref={chatEndRef} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[1400px] h-[94vh] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-500">
        
        <header className="px-10 py-6 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 z-50 relative">
          <div className="flex items-center gap-6">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 group min-w-[50px] min-h-[50px] relative z-[60]"
            >
              <Home size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest hidden lg:inline">Back to Hub</span>
            </button>
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${tool.iconBgColor}`}>
              {tool.icon}
            </div>

            <div>
               <h2 className="text-2xl font-[1000] tracking-tighter uppercase leading-none">{tool.name}</h2>
               <div className="flex items-center gap-2 mt-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'animate-pulse bg-blue-500' : 'bg-emerald-500'}`} />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{status}</p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {tool.functional && (
                <div className="flex items-center gap-4 px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <Globe size={16} className={useSearch ? 'text-blue-500' : 'text-slate-400'} />
                  <button onClick={() => setUseSearch(!useSearch)} className={`relative w-10 h-5 rounded-full transition-colors ${useSearch ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${useSearch ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Web Search</span>
                </div>
             )}
             <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
              className="p-3 text-slate-300 hover:text-rose-500 transition-colors relative z-[60] min-w-[50px] min-h-[50px] flex items-center justify-center"
             >
               <X size={32} strokeWidth={2.5} />
             </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-slate-100 bg-slate-50/50 p-10 flex flex-col gap-8 shrink-0">
             <div>
               <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[10px] font-[1000] uppercase tracking-[0.3em] text-slate-400">My Files</h4>
                 {!isLimitReached && (
                    <label className="cursor-pointer group">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 group-hover:opacity-70 transition-colors">
                        <Plus size={14} strokeWidth={3} /> Add
                      </div>
                      <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                 )}
               </div>
               
               <div className="space-y-3">
                 {files.length === 0 ? (
                   <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-300">
                      <Files size={32} strokeWidth={1} />
                      <span className="text-[9px] font-black uppercase tracking-widest">No files loaded</span>
                   </div>
                 ) : (
                   files.map(f => (
                     <div key={f.id} className="group rounded-2xl p-4 bg-white border border-slate-100 hover:border-blue-400/50 transition-all shadow-sm flex items-center gap-4">
                       <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm"><FileText size={18} /></div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[11px] font-bold truncate text-slate-900">{f.name}</p>
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{(f.size/1024/1024).toFixed(2)} MB</p>
                       </div>
                       {!isLimitReached && (
                         <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                       )}
                     </div>
                   ))
                 )}
               </div>
             </div>

             <div className="mt-auto p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group" style={{ backgroundColor: themeColor }}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
               <div className="relative z-10 flex items-center gap-3 mb-4">
                 <Cpu size={16} className="text-white/60 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Assistant Active</span>
               </div>
               <p className="relative z-10 text-[11px] text-white/80 leading-relaxed font-bold uppercase tracking-tight">
                 Tehila is looking through your files to give you the best answers.
               </p>
             </div>
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden">
             {isLimitReached ? (
               <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50">
                  <div className="max-w-lg w-full bg-white border border-slate-100 rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
                     <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
                       <Lock size={48} />
                     </div>
                     <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 mb-6 leading-none">Free limit reached.</h2>
                     <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                       Free accounts are limited to **5 sessions**. Upgrade your workspace to keep chatting with Tehila.
                     </p>
                     <button onClick={() => window.dispatchEvent(new CustomEvent('openUpgrade'))} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95">
                       Upgrade Account <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
             ) : (
               <>
                 {tool.id === 'summarizer' && renderSummarizer()}
                 {tool.id === 'ai-assistant' && renderExtractor()}
                 {(tool.id === 'q-gen' || tool.id === 'question-solver') && renderQuizStudio()}
                 {tool.id === 'translate' && renderTranslator()}
                 {tool.id === 'chat-pdf' && renderChat()}
                 
                 {(tool.id === 'chat-pdf' || (messages.length > 0 && !isLoading)) && (
                    <div className="p-10 border-t border-slate-100 bg-white">
                      <div className="relative max-w-4xl mx-auto">
                        <input 
                          type="text"
                          value={input}
                          disabled={files.length === 0 || isLoading}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder={files.length > 0 ? "Type your question here..." : "Load files to start chatting"}
                          className="w-full border border-slate-200 rounded-[2rem] pl-8 pr-24 py-6 text-base font-bold outline-none transition-all shadow-inner bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5"
                        />
                        <button 
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          style={{ backgroundColor: themeColor }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-4 text-white rounded-2xl hover:brightness-110 transition-all active:scale-90 disabled:opacity-50 shadow-2xl"
                        >
                          {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                        </button>
                      </div>
                    </div>
                 )}
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;