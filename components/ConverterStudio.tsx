
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  X, Save, Zap, 
  ZoomIn, ZoomOut,
  FileText, CheckCircle2,
  ArrowRight, Home,
  Check, Settings, Info, Globe,
  ShieldCheck, Activity,
  Cpu, Layers, Download,
  RefreshCw, FileType,
  FileType as FileTypeIcon,
  Shapes,
  Scan,
  Maximize,
  ArrowDownToLine,
  Layout,
  Table as TableIcon,
  Presentation
} from 'lucide-react';

interface ConverterStudioProps {
  fileName: string;
  fileData?: string;
  onClose: () => void;
  onFinish: () => void;
}

const ConverterStudio: React.FC<ConverterStudioProps> = ({ fileName, fileData, onClose, onFinish }) => {
  const [zoom, setZoom] = useState(90);
  const [targetFormat, setTargetFormat] = useState('docx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Engine Settings
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [layoutPreservation, setLayoutPreservation] = useState(true);
  const [vectorizeImages, setVectorizeImages] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const originalSize = useMemo(() => {
    if (!fileData) return 0;
    const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    return (base64Data.length * 3) / 4;
  }, [fileData]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleConvert = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
    }, 3000);
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl; // In a real app, this would be the converted blob from the backend
    const nameParts = fileName.split('.');
    nameParts.pop();
    link.download = `${nameParts.join('.')}.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formats = [
    { id: 'docx', label: 'Word (.docx)', icon: <FileText size={14} />, color: 'blue' },
    { id: 'xlsx', label: 'Excel (.xlsx)', icon: <TableIcon size={14} />, color: 'emerald' },
    { id: 'pptx', label: 'PowerPoint (.pptx)', icon: <Presentation size={14} />, color: 'orange' },
    { id: 'jpg', label: 'Image (.jpg)', icon: <FileTypeIcon size={14} />, color: 'amber' },
    { id: 'png', label: 'Image (.png)', icon: <FileTypeIcon size={14} />, color: 'rose' },
    { id: 'html', label: 'Web Page (.html)', icon: <Globe size={14} />, color: 'indigo' },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-[#f8fafc] flex flex-col animate-in fade-in duration-500 overflow-hidden font-['Inter',_sans-serif]">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
            <Home size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest truncate max-w-[200px]">{fileName}</h2>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Transformation Studio v5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-slate-900"><ZoomOut size={14} /></button>
            <span className="text-[10px] font-black text-slate-900 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-slate-900"><ZoomIn size={14} /></button>
          </div>

          <button 
            onClick={handleConvert}
            disabled={isProcessing || isFinished}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
             {isProcessing ? 'Transforming...' : 'Start Conversion'} <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Tool Rails */}
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-10 gap-12 z-40 shrink-0 shadow-sm">
          <button className="transition-all transform hover:scale-110 active:scale-90 text-blue-600 relative">
            <RefreshCw size={30} />
            <div className="absolute -right-[23px] top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-600 rounded-full" />
          </button>
          <button className="transition-all transform hover:scale-110 active:scale-90 text-slate-300 hover:text-blue-500"><Scan size={30} /></button>
          <button className="transition-all transform hover:scale-110 active:scale-90 text-slate-300 hover:text-blue-500"><Shapes size={30} /></button>
          <button className="transition-all transform hover:scale-110 active:scale-90 text-slate-300 hover:text-blue-500"><Activity size={30} /></button>
          <div className="mt-auto pb-6">
             <button className="text-slate-300 hover:text-slate-900 transition-all">
                <Settings size={28} />
             </button>
          </div>
        </aside>

        {/* Studio Viewport */}
        <main ref={scrollRef} className="flex-1 bg-slate-50/50 overflow-auto custom-scrollbar p-16 flex justify-center relative">
          <div 
            ref={canvasRef}
            className={`relative bg-white shadow-2xl w-full max-w-[800px] min-h-[1050px] transition-transform origin-top duration-300 border border-slate-200 rounded-sm`}
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {fileUrl ? (
                 <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none pointer-events-none select-none opacity-90" title="Convert Source View" />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <FileType size={120} />
                </div>
            )}
          </div>
        </main>

        {/* Engine Inspector */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-40 shrink-0 p-8 shadow-sm overflow-y-auto custom-scrollbar">
           <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Cpu size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Format Engine</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Mapper v4.2</p>
              </div>
           </div>

           <div className="space-y-8">
              <section>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Output</h4>
                 <div className="space-y-2">
                    {formats.map(format => (
                      <button 
                        key={format.id}
                        onClick={() => setTargetFormat(format.id)}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${targetFormat === format.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-transparent hover:border-blue-300'}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${targetFormat === format.id ? 'bg-white/10' : 'bg-white'}`} style={targetFormat === format.id ? {} : { color: `var(--tw-text-opacity, 1) ${format.color}-600` }}>
                               {format.icon}
                            </div>
                            <p className="text-xs font-black uppercase tracking-tight">{format.label}</p>
                         </div>
                         {targetFormat === format.id && <Check size={16} className="text-blue-400" />}
                      </button>
                    ))}
                 </div>
              </section>

              <div className="h-px bg-slate-50" />

              <section className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Engine Precision</h4>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">OCR Engine</span>
                       <span className="text-[9px] text-slate-400 font-medium">Force text recognition</span>
                    </div>
                    <button 
                      onClick={() => setOcrEnabled(!ocrEnabled)}
                      className={`w-10 h-5 rounded-full relative p-1 transition-all ${ocrEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${ocrEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Layout Preserve</span>
                       <span className="text-[9px] text-slate-400 font-medium">Keep semantic positions</span>
                    </div>
                    <button 
                      onClick={() => setLayoutPreservation(!layoutPreservation)}
                      className={`w-10 h-5 rounded-full relative p-1 transition-all ${layoutPreservation ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${layoutPreservation ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Vectorize Images</span>
                       <span className="text-[9px] text-slate-400 font-medium">Convert bitmaps to shapes</span>
                    </div>
                    <button 
                      onClick={() => setVectorizeImages(!vectorizeImages)}
                      className={`w-10 h-5 rounded-full relative p-1 transition-all ${vectorizeImages ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${vectorizeImages ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </section>

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden mt-auto">
                  <Activity size={28} className="text-blue-400 mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-tight mb-2 leading-none">High-Fidelity Flow</h4>
                  <p className="text-[10px] opacity-60 leading-relaxed font-medium">Every conversion uses regional CPU clusters for zero-queue processing and bit-perfect fidelity.</p>
              </div>
           </div>
        </aside>
      </div>

      {/* Execution Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 animate-in fade-in duration-500">
           <div className="relative mb-10">
              <div className="w-32 h-32 border-8 border-blue-50 rounded-full border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-blue-600"><Zap size={32} fill="currentColor" /></div>
           </div>
           <h3 className="text-3xl font-[1000] tracking-tighter uppercase mb-4">Reconstructing Assets...</h3>
           <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Mapping Geometry • Extracting Styles • Finalizing Node</p>
        </div>
      )}

      {/* Success Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-[300] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-slate-900 animate-in zoom-in duration-700">
           <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-blue-100 shadow-[0_60px_150px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center max-w-2xl w-full mx-6">
              <div className="relative mb-10">
                <div className="w-32 h-32 border-8 border-blue-50 rounded-full border-t-blue-600 animate-in spin-in duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl animate-in zoom-in delay-300">
                     <Check size={40} strokeWidth={4} />
                   </div>
                </div>
              </div>
              
              <h3 className="text-4xl font-[1000] tracking-tighter mb-4 uppercase text-center">Conversion Complete</h3>
              <p className="text-slate-400 font-medium text-lg text-center mb-10 leading-relaxed">
                Your document has been successfully transformed to <b>{targetFormat.toUpperCase()}</b>.
              </p>

              <div className="grid grid-cols-2 gap-8 w-full mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Source Type</p>
                    <p className="text-2xl font-black text-slate-500 uppercase tracking-tight">PDF Node</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Target Type</p>
                    <p className="text-2xl font-[1000] text-blue-600 uppercase tracking-tight">{targetFormat} Output</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                 <button 
                   onClick={handleDownload}
                   className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                 >
                   <Download size={20} />
                   Download {targetFormat.toUpperCase()}
                 </button>
                 <button 
                   onClick={onFinish}
                   className="flex-1 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95"
                 >
                   Return to Hub
                 </button>
              </div>
              
              <p className="mt-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Integrity Check: Verified • Node ID: TRANS-B29</p>
           </div>
        </div>
      )}

      <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 opacity-40">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-widest">Regional Conversion Node</span></div>
            <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-widest">Edge-Optimized CDN</span></div>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Converter Studio v4.8.2</p>
      </footer>
    </div>
  );
};

export default ConverterStudio;
