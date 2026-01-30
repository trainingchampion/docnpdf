import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, RefreshCw, Check, 
  Loader2, ArrowRight, Save, 
  Home, Target, Zap, Activity, 
  Maximize, Wand2, Smartphone, 
  ScanEye, ShieldCheck, Download,
  RotateCcw, Trash2, Layers,
  FileSearch, Type, ImageIcon,
  Crop, Sun, Moon, Sparkles,
  Contrast, Sliders,
  // Added missing Scan and Globe icon imports
  Scan, Globe
} from 'lucide-react';

interface ScannerStudioProps {
  onClose: () => void;
  onFinish: () => void;
}

const ScannerStudio: React.FC<ScannerStudioProps> = ({ onClose, onFinish }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState(0);
  const [autoCrop, setAutoCrop] = useState(true);
  const [enhanceAi, setEnhanceAi] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
        setQualityScore(Math.floor(Math.random() * 20) + 75); // Simulated quality
      }
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOcrText("SIMULATED OCR OUTPUT:\nThis is a high-fidelity reconstruction of the scanned text node. The engine has identified 100% of characters with neural precision. Ready for workspace integration.");
    }, 2500);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setOcrText(null);
    setQualityScore(0);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden font-['Inter',_sans-serif]">
      {/* Precision Header */}
      <header className="h-16 bg-[#0f172a] text-white flex items-center justify-between px-10 shrink-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white">
            <Home size={22} />
          </button>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Scan size={22} />
             </div>
             <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Scanner Studio</h1>
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1.5">Asset Ingestion Node</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {ocrText && (
             <button 
              onClick={onFinish}
              className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3"
             >
                Commit to Vault <ArrowRight size={14} />
             </button>
           )}
           <button onClick={onClose} className="p-2 text-white/40 hover:text-rose-500 transition-colors">
             <X size={32} strokeWidth={2.5} />
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Viewport */}
        <main className="flex-1 bg-slate-950 overflow-hidden relative flex flex-col items-center justify-center">
           {!capturedImage ? (
             <div className="relative w-full h-full flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" />
                
                {/* Scanner Guides */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                   <div className="w-full max-xl aspect-[3/4] border-2 border-dashed border-blue-500/50 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                      
                      {/* Scanning Light Simulation */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan-y" />
                   </div>
                </div>

                {/* Shutter Button Container */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50">
                   <button 
                    onClick={captureFrame}
                    className="w-20 h-20 rounded-full bg-white p-1 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
                   >
                      <div className="w-full h-full rounded-full border-4 border-slate-900 flex items-center justify-center">
                         <div className="w-12 h-12 bg-rose-500 rounded-full group-hover:bg-rose-600 transition-colors" />
                      </div>
                   </button>
                </div>
             </div>
           ) : (
             <div className="w-full h-full flex flex-col lg:flex-row animate-in fade-in duration-700">
                {/* Image Workspace */}
                <div className="flex-1 bg-[#020617] flex items-center justify-center p-12 overflow-hidden border-r border-white/5 relative">
                   <img src={capturedImage} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Scanned Asset" />
                   
                   {isProcessing && (
                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Loader2 size={48} className="animate-spin text-blue-500 mb-6" />
                        <h3 className="text-2xl font-[1000] tracking-tighter uppercase mb-2">Analyzing Node...</h3>
                        <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">Neural OCR Mapping • Style Extraction</p>
                     </div>
                   )}

                   <div className="absolute top-8 left-8 flex gap-3">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-emerald-400" />
                         <span className="text-[9px] font-black uppercase text-white/80">Quality: {qualityScore}%</span>
                      </div>
                   </div>
                </div>

                {/* Result Inspector */}
                <div className="w-full lg:w-[480px] bg-white flex flex-col shrink-0">
                   <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Transcription</h3>
                      <button onClick={handleReset} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><RotateCcw size={20} /></button>
                   </div>
                   
                   <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                      {ocrText ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 font-medium text-slate-700 leading-relaxed text-sm">
                              {ocrText}
                           </div>
                           <div className="mt-8 grid grid-cols-2 gap-4">
                              <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                                 Copy Text
                              </button>
                              <button className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                                 Download .TXT
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                           <Type size={64} className="mb-6" />
                           <h4 className="text-xl font-black uppercase tracking-widest">Transcription Node Idle</h4>
                           <p className="text-sm font-medium mt-2">Initialize processing to map the asset's text schema.</p>
                        </div>
                      )}
                   </div>

                   <div className="p-8 bg-slate-50 border-t border-slate-100">
                      <button 
                        onClick={handleProcess}
                        disabled={isProcessing || !!ocrText}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
                      >
                         <Zap size={20} fill="currentColor" className="text-amber-300" />
                         {isProcessing ? 'Processing...' : 'Run Neural OCR'}
                      </button>
                   </div>
                </div>
             </div>
           )}
        </main>

        {/* Engine Controls (Left) */}
        {!capturedImage && (
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-40 shrink-0 p-8 shadow-sm overflow-y-auto custom-scrollbar order-first">
             <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Scanner Logic</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Node Config v5</p>
                </div>
             </div>

             <div className="space-y-8">
                <section className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Auto-Crop Node</span>
                         <span className="text-[9px] text-slate-400 font-medium">Auto detect document edges</span>
                      </div>
                      <button 
                        onClick={() => setAutoCrop(!autoCrop)}
                        className={`w-10 h-5 rounded-full relative p-1 transition-all ${autoCrop ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                         <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoCrop ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">AI Enhancement</span>
                         <span className="text-[9px] text-slate-400 font-medium">Remove noise and correct contrast</span>
                      </div>
                      <button 
                        onClick={() => setEnhanceAi(!enhanceAi)}
                        className={`w-10 h-5 rounded-full relative p-1 transition-all ${enhanceAi ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                         <div className={`w-3 h-3 bg-white rounded-full transition-transform ${enhanceAi ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </section>

                <div className="p-6 bg-[#0f172a] rounded-[2rem] text-white shadow-2xl relative overflow-hidden mt-auto">
                   <Sparkles size={28} className="text-blue-400 mb-4" />
                   <h4 className="text-sm font-black uppercase tracking-tight mb-2 leading-none">High-Fidelity Input</h4>
                   <p className="text-[10px] opacity-60 leading-relaxed font-medium">The ingestion node uses hardware acceleration to map the physical document into a high-resolution workspace asset.</p>
                </div>
             </div>
          </aside>
        )}
      </div>

      <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 opacity-40">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-widest">Hardware Link Encrypted</span></div>
            <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-widest">Central Region: US-1</span></div>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Studio v5.4.1-Scanner</p>
      </footer>

      <canvas ref={canvasRef} className="hidden" />

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
      `}</style>
    </div>
  );
};

export default ScannerStudio;