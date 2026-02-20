import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Plus, Merge, Scissors, RotateCcw, 
  Trash2, Copy, Download, Home, 
  ArrowRight, CheckCircle2, ShieldCheck,
  Globe, Info, LayoutGrid, Search,
  FileText, Loader2, Maximize2,
  Settings, Activity, Fingerprint, ChevronDown,
  Target, RotateCw, ZoomIn, ZoomOut, Save,
  Files, Layers, Trash, Check, MousePointer2,
  Upload
} from 'lucide-react';

interface OrganizeStudioProps {
  fileData?: string; // base64
  onClose: () => void;
  onFinish: () => void;
}

interface PageAsset {
  id: string;
  originalIndex: number;
  rotation: number;
  selected: boolean;
  sourceFile: string;
}

const OrganizeStudio: React.FC<OrganizeStudioProps> = ({ fileData, onClose, onFinish }) => {
  const [pages, setPages] = useState<PageAsset[]>([]);
  const [zoom, setZoom] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'manage' | 'merge' | 'split'>('manage');
  
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize pages if fileData is provided
  useEffect(() => {
    if (fileData) {
      const initialPages: PageAsset[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `page-${Math.random().toString(36).substr(2, 9)}`,
        originalIndex: i,
        rotation: 0,
        selected: false,
        sourceFile: 'primary_source.pdf'
      }));
      setPages(initialPages);
    }
  }, [fileData]);

  const selectedCount = useMemo(() => pages.filter(p => p.selected).length, [pages]);

  const toggleSelect = (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  const rotateSelected = (dir: 'cw' | 'ccw') => {
    setPages(prev => prev.map(p => {
      if (!p.selected) return p;
      const change = dir === 'cw' ? 90 : -90;
      return { ...p, rotation: (p.rotation + change) % 360 };
    }));
  };

  const deleteSelected = () => {
    setPages(prev => prev.filter(p => !p.selected));
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    
    const newPages = [...pages];
    const item = newPages.splice(draggedIdx, 1)[0];
    newPages.splice(idx, 0, item);
    setPages(newPages);
    setDraggedIdx(idx);
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsFinished(true);
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAppendAssets = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast to File[] to avoid 'unknown' type error when accessing file.name
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    // Simulate appending pages from each selected file
    const newPages: PageAsset[] = [];
    selectedFiles.forEach((file) => {
      // Mocking 2 pages per newly uploaded document for visual variety
      for (let i = 0; i < 2; i++) {
        newPages.push({
          id: `page-${Math.random().toString(36).substr(2, 9)}`,
          originalIndex: i,
          rotation: 0,
          selected: false,
          sourceFile: file.name
        });
      }
    });

    setPages(prev => [...prev, ...newPages]);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderManage = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
       <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleAppendAssets} 
          className="hidden" 
          multiple 
          accept=".pdf" 
       />

       {/* Actions Bar */}
       <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button onClick={selectAll} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">All</button>
                <button onClick={deselectAll} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">None</button>
             </div>
             <div className="h-6 w-px bg-slate-200 mx-2" />
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => rotateSelected('ccw')}
                  disabled={selectedCount === 0}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 transition-all shadow-sm"
                  title="Rotate CCW"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  onClick={() => rotateSelected('cw')}
                  disabled={selectedCount === 0}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 transition-all shadow-sm"
                  title="Rotate CW"
                >
                  <RotateCw size={18} />
                </button>
                <button 
                  onClick={deleteSelected}
                  disabled={selectedCount === 0}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-30 transition-all shadow-sm"
                  title="Delete Selected"
                >
                  <Trash2 size={18} />
                </button>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button onClick={() => setZoom(Math.max(40, zoom - 10))} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ZoomOut size={16} /></button>
                <span className="text-[10px] font-black text-slate-900 w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><ZoomIn size={16} /></button>
             </div>
             <button 
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
             >
                <Plus size={14} strokeWidth={3} /> Add Files
             </button>
          </div>
       </div>

       {/* Grid Canvas */}
       <div className="flex-1 overflow-auto custom-scrollbar p-12 lg:p-20 flex justify-center">
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 max-w-7xl w-full h-fit origin-top transition-transform duration-300"
            style={{ transform: `scale(${zoom / 100})` }}
          >
             {pages.map((page, idx) => (
               <div 
                key={page.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                className={`relative group cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedIdx === idx ? 'opacity-20 scale-95' : 'opacity-100'}`}
               >
                  <div 
                    onClick={() => toggleSelect(page.id)}
                    className={`aspect-[1/1.41] bg-white rounded-xl border-4 transition-all duration-500 shadow-xl flex flex-col p-4 relative overflow-hidden ${page.selected ? 'border-indigo-600 ring-8 ring-indigo-600/5' : 'border-white hover:border-indigo-200'}`}
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                  >
                     {/* Thumbnail Mock */}
                     <div className="w-full h-full bg-slate-50 rounded border border-slate-100 flex flex-col p-3 gap-2">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                        <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
                        <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                        <div className="mt-auto flex justify-between items-center opacity-30">
                           <FileText size={16} />
                           <div className="flex gap-1 flex-col items-end">
                              <span className="text-[6px] font-bold text-slate-400 uppercase truncate max-w-[60px]">{page.sourceFile}</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-0.5 bg-slate-200 rounded-full" />
                                <div className="w-2 h-0.5 bg-slate-200 rounded-full" />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Selection Overlay */}
                     <div className={`absolute inset-0 bg-indigo-600/5 transition-opacity ${page.selected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* Badge & Check */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg border-2 border-white group-hover:scale-110 transition-transform z-10">
                     {idx + 1}
                  </div>
                  {page.selected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300 z-10">
                       <Check size={14} strokeWidth={4} />
                    </div>
                  )}

                  {/* Quick Page Menu */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/5 backdrop-blur-[1px] pointer-events-none">
                     {/* Placeholder for hovering UI if needed */}
                  </div>
               </div>
             ))}

             {/* Add More Dropzone */}
             <div 
                onClick={triggerFileInput}
                className="aspect-[1/1.41] bg-white/50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-indigo-300 hover:bg-white hover:text-indigo-500 transition-all cursor-pointer group"
             >
                <Plus size={32} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Append Asset</span>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden font-['Inter',_sans-serif]">
      {/* Universal Studio Header */}
      <header className="h-16 bg-[#0f172a] text-white flex items-center justify-between px-10 shrink-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white">
            <Home size={22} />
          </button>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutGrid size={22} />
             </div>
             <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Organize Studio</h1>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1.5">Asset Architecture Node</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/5">
              {[
                { id: 'manage', label: 'Structure', icon: <LayoutGrid size={14} /> },
                { id: 'merge', label: 'Merge Node', icon: <Merge size={14} /> },
                { id: 'split', label: 'Split/Extract', icon: <Scissors size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>
           
           <button 
            onClick={handleFinalize}
            disabled={isProcessing || pages.length === 0}
            className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-3"
           >
              Finalize Cluster <ArrowRight size={14} />
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'manage' && renderManage()}
        
        {activeTab !== 'manage' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50 text-center opacity-40">
             <div className="w-20 h-20 bg-white border border-slate-200 rounded-[2.5rem] flex items-center justify-center mb-6">
                {activeTab === 'merge' ? <Merge size={40} /> : <Scissors size={40} />}
             </div>
             <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-widest">Advanced {activeTab} Engine</h3>
             <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Refined algorithmic controls for this node are currently synchronizing with the central workspace.</p>
          </div>
        )}

        {/* Global Progress Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-[200] bg-[#0f172a]/80 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
             <div className="relative mb-10">
                <div className="w-32 h-32 border-8 border-white/5 rounded-full border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                  <Fingerprint size={48} className="animate-pulse" />
                </div>
             </div>
             <h3 className="text-3xl font-[1000] tracking-tighter uppercase mb-4">Reconstructing Assets...</h3>
             <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Optimizing Layout • Correcting Vectors • Finalizing Node</p>
          </div>
        )}

        {/* Finish Success */}
        {isFinished && (
          <div className="fixed inset-0 z-[300] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in duration-700">
             <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-[0_60px_150px_-20px_rgba(0,0,0,0.2)] flex flex-col items-center max-w-2xl w-full mx-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner animate-in zoom-in duration-1000">
                   <CheckCircle2 size={56} strokeWidth={3} />
                </div>
                <h3 className="text-4xl font-[1000] tracking-tighter mb-4 text-slate-900 uppercase">Task Sealed.</h3>
                <p className="text-slate-400 font-medium text-lg text-center mb-12 leading-relaxed">
                   The high-fidelity transformation of your workspace assets is complete. Verified and synced to Vault.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                   <button 
                    onClick={() => { onClose(); onFinish(); }}
                    className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                   >
                     <Download size={20} /> Download Asset
                   </button>
                   <button 
                    onClick={() => { onClose(); onFinish(); }}
                    className="py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95"
                   >
                     Finish Session
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 opacity-40">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-widest">Encrypted Structure node Active</span></div>
            <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-widest">Global Compute Cluster</span></div>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Studio v5.8.2-Organize</p>
      </footer>
    </div>
  );
};

export default OrganizeStudio;