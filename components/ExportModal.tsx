import React, { useState, useMemo } from 'react';
import { 
  X, FileText, FileSpreadsheet, Presentation, 
  Image as ImageIcon, FileCode, CheckCircle2, 
  ArrowRight, Loader2, Zap, ShieldCheck, 
  Globe, Download, Cpu, Sparkles 
} from 'lucide-react';

export type ExportFormat = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'html' | 'json';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  sourceType: 'doc' | 'sheet' | 'slide' | 'pdf';
  onConfirm: (format: ExportFormat) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, fileName, sourceType, onConfirm }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const formats = [
    { id: 'pdf', label: 'PDF Document', ext: '.pdf', icon: <FileText className="text-red-500" />, categories: ['doc', 'sheet', 'slide', 'pdf'] },
    { id: 'docx', label: 'Word Node', ext: '.docx', icon: <FileCode className="text-blue-500" />, categories: ['doc', 'pdf'] },
    { id: 'xlsx', label: 'Analysis Grid', ext: '.xlsx', icon: <FileSpreadsheet className="text-emerald-500" />, categories: ['sheet', 'pdf'] },
    { id: 'pptx', label: 'Slide Deck', ext: '.pptx', icon: <Presentation className="text-orange-500" />, categories: ['slide', 'pdf'] },
    { id: 'jpg', label: 'High-Res Image', ext: '.jpg', icon: <ImageIcon className="text-amber-500" />, categories: ['doc', 'sheet', 'slide', 'pdf'] },
    { id: 'png', label: 'Lossless Image', ext: '.png', icon: <ImageIcon className="text-rose-500" />, categories: ['doc', 'sheet', 'slide', 'pdf'] },
  ];

  const availableFormats = formats.filter(f => f.categories.includes(sourceType));

  const handleExport = () => {
    if (!selectedFormat) return;
    setIsExporting(true);
    // Accelerated high-fidelity neural conversion steps: Reduced from 2400ms total to 900ms total
    setTimeout(() => setStep(1), 300);
    setTimeout(() => setStep(2), 600);
    setTimeout(() => {
      onConfirm(selectedFormat);
      setIsExporting(false);
      setStep(0);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 bg-[#0f172a] text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                <Download size={24} />
              </div>
              <div>
                <h2 className="text-xl font-[1000] tracking-tighter leading-none uppercase">Export Asset</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                  Transformation Hub: <span className="text-blue-400">"{fileName}"</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 flex-1 flex flex-col min-h-[400px]">
          {isExporting ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              <div className="relative mb-10">
                <div className="w-24 h-24 border-8 border-blue-50 rounded-full border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Cpu size={32} className="animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter mb-2">
                {step === 0 ? 'Initializing Engine...' : step === 1 ? 'Mapping Semantic Layer...' : 'Finalizing Output Node...'}
              </h3>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">Mina Conversion Cluster: Active</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-8 px-2">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Desirable Format</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {availableFormats.map((format) => (
                  <button 
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as ExportFormat)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 group text-left ${
                      selectedFormat === format.id 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' 
                      : 'bg-slate-50 border-transparent hover:border-blue-300 hover:bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform ${selectedFormat === format.id ? 'bg-white/10' : ''}`}>
                      {format.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight ${selectedFormat === format.id ? 'text-white' : 'text-slate-900'}`}>
                        {format.label}
                      </p>
                      <p className={`text-[10px] font-bold ${selectedFormat === format.id ? 'text-white/40' : 'text-slate-400'}`}>
                        {format.ext} Output Node
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <button 
                  onClick={handleExport}
                  disabled={!selectedFormat}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95"
                >
                  Confirm Transformation <ArrowRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-2 opacity-40">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Secure Cryptographic Output</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;