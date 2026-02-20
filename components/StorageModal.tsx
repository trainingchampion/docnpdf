
import React, { useMemo } from 'react';
import { X, HardDrive, ShieldCheck, Zap, Trash2, FileText, ImageIcon, Database, Info, Loader2, BarChart3 } from 'lucide-react';

interface StorageFile {
  id: string;
  name: string;
  size: number;
  timestamp: Date;
}

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: StorageFile[];
  onDelete: (id: string) => void;
}

const CAPACITY = 10 * 1024 * 1024 * 1024; // 10GB

const StorageModal: React.FC<StorageModalProps> = ({ isOpen, onClose, files, onDelete }) => {
  if (!isOpen) return null;

  const totalUsed = useMemo(() => files.reduce((acc, f) => acc + f.size, 0), [files]);
  
  const stats = useMemo(() => {
    const pdfs = files.filter(f => f.name.toLowerCase().endsWith('.pdf')).reduce((acc, f) => acc + f.size, 0);
    const images = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f.name)).reduce((acc, f) => acc + f.size, 0);
    const others = totalUsed - pdfs - images;
    
    return [
      { label: 'PDF Documents', bytes: pdfs, color: 'bg-blue-600', icon: <FileText size={12} /> },
      { label: 'Media Assets', bytes: images, color: 'bg-emerald-500', icon: <ImageIcon size={12} /> },
      { label: 'System Data', bytes: others, color: 'bg-indigo-400', icon: <Database size={12} /> },
    ];
  }, [files, totalUsed]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const percentage = Math.min(100, (totalUsed / CAPACITY) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] text-white w-full max-w-4xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/10 relative">
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Header */}
        <div className="px-12 py-10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <HardDrive size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-[1000] tracking-tighter">Vault Intelligence</h2>
              <div className="flex items-center gap-2 mt-1 opacity-40 uppercase text-[10px] font-black tracking-widest">
                <ShieldCheck size={12} /> Cloud Secure End-to-End Encryption
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-12 pb-12 overflow-hidden relative z-10">
          
          {/* Main Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] block mb-2">CURRENT CONSUMPTION</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-[1000] tracking-tighter">{formatSize(totalUsed)}</h3>
                    <span className="text-xl font-bold opacity-20">/ 10 GB</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-blue-500">{percentage.toFixed(1)}%</span>
                  <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">CAPACITY USED</p>
                </div>
              </div>
              
              <div className="h-4 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                {stats.map((s, idx) => (
                  <div 
                    key={idx}
                    className={`${s.color} h-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]`}
                    style={{ width: `${(s.bytes / CAPACITY) * 100}%` }}
                  />
                ))}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {stats.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                      <p className="text-xs font-bold truncate">{formatSize(s.bytes)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl">
               <div className="flex items-center gap-3">
                 <Zap size={20} fill="white" className="text-amber-300" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">STORAGE PRO</span>
               </div>
               <p className="text-sm font-medium leading-relaxed mt-4">Running out of space? Upgrade to Enterprise for unlimited secure vault storage.</p>
               <button className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all mt-6">
                 Expand Vault
               </button>
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6 px-4">
               <div className="flex items-center gap-3">
                 <BarChart3 size={16} className="text-blue-500" />
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40">Vault Inventory</h4>
               </div>
               <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Clean Cache</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-3">
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                   <div className="w-20 h-20 border-2 border-dashed border-white rounded-[2rem] flex items-center justify-center mb-4">
                     <HardDrive size={32} />
                   </div>
                   <p className="text-sm font-black uppercase tracking-widest">Vault Empty</p>
                </div>
              ) : (
                files.sort((a, b) => b.size - a.size).map(file => (
                  <div key={file.id} className="group bg-white/5 border border-white/5 rounded-3xl p-5 flex items-center justify-between hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[300px]">{file.name}</p>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mt-0.5">
                          {formatSize(file.size)} • {file.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(file.id)}
                      className="p-3 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-12 py-6 bg-black/20 border-t border-white/5 flex items-center gap-4">
           <Info size={14} className="text-blue-500" />
           <p className="text-[10px] font-medium opacity-30">All data in your vault is strictly confidential and cleared upon session logout unless exported.</p>
        </div>
      </div>
    </div>
  );
};

export default StorageModal;
