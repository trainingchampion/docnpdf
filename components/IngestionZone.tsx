
import React, { useState, useEffect, useRef } from 'react';
import { Upload, ChevronRight, FileText, FileCode, FileSpreadsheet, Presentation, Image as ImageIcon, Sparkles, ShieldCheck, Loader2, Home, Camera } from 'lucide-react';
import CameraCapture from './CameraCapture';

interface IngestionZoneProps {
  onSelect: (file: File, base64: string) => void;
  onBack: () => void;
  toolName?: string;
  toolColor?: string;
}

const IngestionZone: React.FC<IngestionZoneProps> = ({ onSelect, onBack, toolName, toolColor = 'bg-[#1A73E8]' }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReading, setIsReading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      let base64 = result;
      if (result.includes(',')) {
        base64 = result.split(',')[1];
      }
      
      onSelect(file, base64);
      setIsReading(false);
    };
    reader.onerror = () => {
      setIsReading(false);
      alert('Failed to read file. Please ensure it is a valid document.');
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const formats = [
    { label: 'PDF', icon: <FileText size={14} /> },
    { label: 'DOC', icon: <FileCode size={14} /> },
    { label: 'XLS', icon: <FileSpreadsheet size={14} /> },
    { label: 'PPT', icon: <Presentation size={14} /> },
    { label: 'IMG', icon: <ImageIcon size={14} /> },
  ];

  if (showCamera) {
    return <CameraCapture onCapture={(file, base64) => onSelect(file, base64)} onClose={() => setShowCamera(false)} />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-white relative overflow-hidden animate-in fade-in duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
      />

      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#002D56] shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Home size={14} /> Dashboard
        </button>
      </div>
      
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/[0.05] blur-[120px] rounded-full transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-400/[0.05] blur-[140px] rounded-full transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
      />

      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center">
        <div 
          className="relative mb-14 cursor-pointer group"
          onClick={triggerUpload}
          style={{ transform: `perspective(1000px) rotateX(${-mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)` }}
        >
          <div className={`absolute inset-0 blur-[60px] opacity-10 scale-150 rounded-full transition-all duration-700 group-hover:opacity-20 ${toolColor}`} />
          <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
            {isReading ? (
              <Loader2 size={56} className="text-[#1A73E8] animate-spin" strokeWidth={1.5} />
            ) : (
              <Upload size={56} className="text-[#1A73E8] transition-all duration-500 group-hover:scale-110" strokeWidth={1.5} />
            )}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#006D41] rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-xl">
              <Sparkles size={16} fill="white" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-16">
          <h2 className="text-7xl font-[1000] text-[#002D56] tracking-tight leading-none">
            Upload <span className="text-[#1A73E8]">Document.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Select your files or use the camera to begin high-fidelity processing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl">
          <button 
            onClick={triggerUpload}
            disabled={isReading}
            className="flex-1 w-full sm:w-auto group relative flex items-center justify-center gap-5 px-12 py-7 bg-[#1A73E8] text-white rounded-[2.2rem] font-black text-xl tracking-tight hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_40px_80px_-20px_rgba(26,115,232,0.2)] disabled:opacity-50"
          >
            <span>{isReading ? 'Processing...' : 'Upload Assets'}</span>
            {!isReading && <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />}
          </button>
          
          <button 
            onClick={() => setShowCamera(true)}
            className="flex-1 w-full sm:w-auto flex items-center justify-center gap-5 px-12 py-7 bg-slate-900 text-white rounded-[2.2rem] font-black text-xl tracking-tight hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-900/10"
          >
            <Camera size={24} />
            <span>Scan with Camera</span>
          </button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[#006D41]/60 font-black text-[10px] uppercase tracking-widest">
          <ShieldCheck size={14} />
          High-fidelity AES-256 secure transfer active
        </div>

        <div className="mt-20 w-full max-w-xl">
          <div className="flex items-center gap-8 mb-8">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] whitespace-nowrap">Accepted formats</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {formats.map((f, i) => (
              <div 
                key={f.label} 
                style={{ animationDelay: `${i * 100}ms` }}
                className="stagger-item flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-500 hover:text-[#1A73E8] hover:border-[#1A73E8]/20 hover:bg-white hover:shadow-lg transition-all cursor-default"
              >
                <span className="text-slate-300 transition-colors group-hover:text-[#1A73E8]">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngestionZone;
