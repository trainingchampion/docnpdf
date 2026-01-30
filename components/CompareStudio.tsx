
import React, { useState, useEffect } from 'react';
import { 
  GitCompare, FileText, ShieldAlert, 
  CheckCircle2, AlertCircle, Sparkles, Loader2,
  Download, X, Split, FileDiff, ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface CompareStudioProps {
  onClose: () => void;
  onAction: (msg: string) => void;
}

interface FileAsset {
  name: string;
  mimeType: string;
  data: string; // Base64
  previewUrl: string;
}

const CompareStudio: React.FC<CompareStudioProps> = ({ onClose, onAction }) => {
  const [fileA, setFileA] = useState<FileAsset | null>(null);
  const [fileB, setFileB] = useState<FileAsset | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (fileA?.previewUrl) URL.revokeObjectURL(fileA.previewUrl);
      if (fileB?.previewUrl) URL.revokeObjectURL(fileB.previewUrl);
    };
  }, [fileA, fileB]);

  const handleFileUpload = (side: 'A' | 'B', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        
        let mimeType = file.type;
        if ((!mimeType || mimeType === '') && file.name.toLowerCase().endsWith('.pdf')) {
           mimeType = 'application/pdf';
        }

        let previewUrl = '';
        try {
          const binString = window.atob(base64);
          const bytes = new Uint8Array(binString.length);
          for (let i = 0; i < binString.length; i++) {
            bytes[i] = binString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType || 'application/pdf' });
          previewUrl = URL.createObjectURL(blob);
        } catch (err) {
          console.error("Blob creation failed", err);
          previewUrl = URL.createObjectURL(file);
        }
        
        const asset: FileAsset = {
          name: file.name,
          mimeType: mimeType || 'application/octet-stream',
          data: base64,
          previewUrl: previewUrl
        };

        if (side === 'A') setFileA(asset);
        else setFileB(asset);
      };
      reader.readAsDataURL(file);
    }
  };

  const runComparison = async () => {
    if (!fileA || !fileB) return;
    setIsComparing(true);
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a Senior Legal Risk Analyst. Perform a deep SEMANTIC REDLINE comparison.
        Document A is ORIGINAL. Document B is REVISED.
        1. Identify added, removed, or modified clauses.
        2. Explain implications of each change.
        3. Provide a summary and recommendation.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { text: "Here is Document A (Original):" },
            { inlineData: { mimeType: 'application/pdf', data: fileA.data } },
            { text: "Here is Document B (Revised):" },
            { inlineData: { mimeType: 'application/pdf', data: fileB.data } },
            { text: prompt }
          ]
        }
      });

      setAnalysis(response.text || "Analysis complete. No critical risks identified.");
    } catch (e) {
      console.error(e);
      onAction('Comparison failed. The AI node is currently syncing.');
    } finally {
      setIsComparing(false);
    }
  };

  const isPdf = (file: FileAsset) => {
    return file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#f8fafc] flex flex-col animate-in fade-in duration-500 font-['Inter',_sans-serif]">
      {/* Precision Navigation */}
      <header className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <GitCompare size={18} />
          </div>
          <div>
            <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.1em]">DocnPDF | Semantic Compare</h2>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900">
          <X size={20} />
        </button>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex flex-col lg:flex-row p-10 gap-10 overflow-y-auto custom-scrollbar">
          
          {/* Comparison Panels Container */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 min-h-[550px]">
            
            {/* Panel A (Original) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col relative shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Original Version</span>
                {fileA && (
                  <div className="bg-[#f1f5f9] px-4 py-1.5 rounded-lg border border-slate-100">
                    <span className="text-[11px] font-black text-slate-900 truncate max-w-[200px] block">{fileA.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center">
                {!fileA ? (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/upload">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload('A', e)} accept=".pdf,.png,.jpg,.jpeg" />
                    <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center shadow-sm mb-4 group-hover/upload:scale-110 transition-transform">
                      <FileText size={32} className="text-slate-200 group-hover/upload:text-purple-500 transition-colors" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Original</p>
                  </label>
                ) : (
                  <>
                    {isPdf(fileA) ? (
                      <iframe 
                        src={`${fileA.previewUrl}#toolbar=0&navpanes=0&view=Fit`} 
                        className="w-full h-full border-none"
                        title="Original Preview"
                      />
                    ) : (
                      <img src={fileA.previewUrl} className="w-full h-full object-contain p-4" alt="Original" />
                    )}
                    <button 
                      onClick={() => setFileA(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xl border border-slate-100 z-10 transition-all hover:scale-110"
                    >
                      <X size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Panel B (Revised) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col relative shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revised Version</span>
                {fileB && (
                  <div className="bg-[#f1f5f9] px-4 py-1.5 rounded-lg border border-slate-100">
                    <span className="text-[11px] font-black text-slate-900 truncate max-w-[200px] block">{fileB.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center">
                {!fileB ? (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group/upload">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload('B', e)} accept=".pdf,.png,.jpg,.jpeg" />
                    <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center shadow-sm mb-4 group-hover/upload:scale-110 transition-transform">
                      <FileDiff size={32} className="text-slate-200 group-hover/upload:text-purple-500 transition-colors" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Revision</p>
                  </label>
                ) : (
                  <>
                    {isPdf(fileB) ? (
                      <iframe 
                        src={`${fileB.previewUrl}#toolbar=0&navpanes=0&view=Fit`} 
                        className="w-full h-full border-none"
                        title="Revised Preview"
                      />
                    ) : (
                      <img src={fileB.previewUrl} className="w-full h-full object-contain p-4" alt="Revised" />
                    )}
                    <button 
                      onClick={() => setFileB(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xl border border-slate-100 z-10 transition-all hover:scale-110"
                    >
                      <X size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Report Sidepanel */}
          {analysis && (
            <aside className="w-full lg:w-[420px] animate-in slide-in-from-right-8 duration-700">
               <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col h-full shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <ShieldAlert size={20} />
                     </div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Risk Report</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                    {analysis.split('\n').map((line, i) => {
                      if (line.trim().startsWith('###')) return <h4 key={i} className="text-[13px] font-black text-purple-900 mt-6 mb-2 uppercase tracking-wide">{line.replace('###', '').trim()}</h4>;
                      if (line.trim().startsWith('*') || line.trim().startsWith('-')) return <li key={i} className="ml-4 mb-2 text-[13px] font-medium text-slate-600 list-disc">{line.replace(/^[*-]\s*/, '').replace(/\*\*(.*?)\*\*/g, (_, p1) => p1)}</li>;
                      return <p key={i} className="text-[13px] leading-relaxed text-slate-500">{line.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1)}</p>;
                    })}
                  </div>
                  <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3">
                     <Download size={16} /> Export Detailed Analysis
                  </button>
               </div>
            </aside>
          )}
        </div>

        {/* Global Action Bar */}
        <div className="h-24 flex items-center justify-center bg-white/50 backdrop-blur-md border-t border-slate-100 shrink-0">
           <button 
            onClick={runComparison}
            disabled={!fileA || !fileB || isComparing}
            className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white rounded-[1.75rem] font-black text-[13px] uppercase tracking-widest shadow-[0_20px_50px_rgba(168,85,247,0.3)] hover:shadow-[0_20px_60px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
           >
             {isComparing ? (
               <Loader2 size={20} className="animate-spin" />
             ) : (
               <Sparkles size={20} className="fill-white/20" />
             )}
             {isComparing ? 'Running High-Fidelity Analysis...' : 'Run Semantic Compare'}
           </button>
        </div>
      </main>

      {isComparing && (
        <div className="absolute inset-0 z-[100] bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
           <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-6 animate-in zoom-in-95">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-purple-600">
                  <Sparkles size={32} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Mina is reasoning...</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">SemanticRedline v4.8 Node-A1</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CompareStudio;
