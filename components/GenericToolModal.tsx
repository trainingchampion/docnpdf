
import React, { useState, useEffect } from 'react';
import { X, FileUp, Loader2, ArrowRight, CheckCircle2, Clock, Trash2, Home } from 'lucide-react';
import { PDFTool, ProcessingFile } from '../types';

interface GenericToolModalProps {
  tool: PDFTool;
  isOpen: boolean;
  onClose: () => void;
  onAction: (message: string) => void;
  initialFile?: { file: File; base64: string } | null;
}

const GenericToolModal: React.FC<GenericToolModalProps> = ({ tool, isOpen, onClose, onAction, initialFile }) => {
  const [queue, setQueue] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen && initialFile && queue.length === 0) {
      const newItem: ProcessingFile = {
        id: Math.random().toString(36).substr(2, 9),
        file: initialFile.file,
        base64: initialFile.base64,
        status: 'queued',
        progress: 0
      };
      setQueue([newItem]);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []) as File[];
    const newItems: ProcessingFile[] = selected.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      base64: '',
      status: 'queued',
      progress: 0
    }));
    setQueue(prev => [...prev, ...newItems]);
  };

  const removeFile = (id: string) => {
    setQueue(prev => prev.filter(f => f.id !== id));
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setQueue(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' } : f));
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 100));
        setQueue(prev => prev.map(f => f.id === item.id ? { ...f, progress: p } : f));
      }
      setQueue(prev => prev.map(f => f.id === item.id ? { ...f, status: 'completed' } : f));
    }
    setIsProcessing(false);
    setIsDone(true);
  };

  const getOutputFileName = (originalName: string) => {
    const dotIndex = originalName.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
    const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';

    switch (tool.id) {
      case 'pdf-to-word': return `${baseName}.docx`;
      case 'pdf-to-excel': return `${baseName}.xlsx`;
      case 'pdf-to-ppt': return `${baseName}.pptx`;
      case 'pdf-to-jpg': return `${baseName}.jpg`;
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'ppt-to-pdf':
      case 'jpg-to-pdf':
      case 'pdf-ocr':
        return `${baseName}.pdf`;
      case 'compress-pdf': return `${baseName}_compressed${ext}`;
      case 'merge-pdf': return `merged_${baseName}.pdf`;
      default: return `processed_${originalName}`;
    }
  };

  const handleDownloadResults = () => {
    let count = 0;
    queue.forEach(item => {
      if (item.status === 'completed' && item.file) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(item.file);
        link.download = getOutputFileName(item.file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        count++;
      }
    });
    onAction(count > 0 ? `${count} file(s) downloaded successfully` : 'No files to download');
  };

  const handleClose = () => {
    setQueue([]);
    setIsDone(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <button onClick={handleClose} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900 group">
              <Home size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:inline">Back to Home</span>
            </button>
            <div className={`w-14 h-14 rounded-2xl ${tool.iconBgColor} flex items-center justify-center text-white shadow-xl shadow-blue-500/10`}>
              {tool.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tool.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Workspace Assistant</span>
                {queue.length > 0 && (
                  <span className="bg-slate-100 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200">{queue.length} {queue.length === 1 ? 'file' : 'files'} selected</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="p-3 hover:bg-slate-50 rounded-full transition-all active:scale-90 text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 bg-slate-50">
          {!isDone ? (
            <div className="space-y-8">
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-5 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group relative shadow-sm">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-20 h-20 bg-blue-100 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/5">
                  <FileUp size={40} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900 tracking-tight">Add more documents</p>
                  <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">You can upload up to 50 files at once</p>
                </div>
              </div>

              {queue.length > 0 && (
                <div className="max-h-64 overflow-y-auto space-y-3 px-2 custom-scrollbar">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Files to process</p>
                  {queue.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 group shadow-sm hover:border-blue-100 transition-all">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                        {item.status === 'completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Clock size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-black text-slate-900 truncate pr-4">{item.file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase shrink-0">{item.status}</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full transition-all duration-300 ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                      </div>
                      {!isProcessing && (
                        <button onClick={() => removeFile(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button 
                disabled={queue.length === 0 || isProcessing}
                onClick={handleProcess}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-slate-900/10"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Working on your files...
                  </>
                ) : (
                  <>
                    Start working on these files
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 size={56} className="shadow-2xl" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">All done!</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                I've finished processing <b>{queue.length} {queue.length === 1 ? 'file' : 'files'}</b> for you.
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={handleClose}
                  className="flex-1 py-4 px-8 border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-100 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-sm"
                >
                  Go back Home
                </button>
                <button 
                  onClick={handleDownloadResults}
                  className="flex-1 py-4 px-8 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-500/20 text-sm uppercase tracking-widest"
                >
                  Download results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericToolModal;
