
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, Save, Type, Pencil, Highlighter, 
  ChevronLeft, ZoomIn, ZoomOut, ChevronRight,
  FileText, CheckCircle2,
  Trash2, Layers, Eye, Sparkles,
  ShieldCheck, User, Home,
  AlignJustify, Bold, Italic, Palette, 
  AlignCenter, AlignLeft, AlignRight,
  Undo2, Redo2, Underline, Lock, Wand2, 
  FileDown, Loader2, History, Settings,
  BookOpen
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TextBlock } from '../types';

interface DocEditorProps {
  fileName: string;
  fileData?: string; 
  initialBlocks?: TextBlock[];
  onClose: () => void;
  onSave: () => void;
  onExport?: (title: string, content?: string, base64?: string) => void;
  onOpenExport?: () => void;
}

const DocEditor: React.FC<DocEditorProps> = ({ fileName, fileData, initialBlocks, onClose, onSave, onExport, onOpenExport }) => {
  const [pages, setPages] = useState<any[]>([{ id: 'p1', blocks: initialBlocks || [] }]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(85);
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const activePage = pages[activePageIndex];

  const fileUrl = useMemo(() => {
    if (!fileData) return null;
    try {
      const base64Clean = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const binString = window.atob(base64Clean.replace(/\s/g, ''));
      const bytes = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) bytes[i] = binString.charCodeAt(i);
      return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { return null; }
  }, [fileData]);

  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-[#f0f2f5] overflow-hidden text-slate-900 h-full font-['Inter',_sans-serif]">
      {/* Word-style Blue Header */}
      <header className="h-16 bg-[#2b579a] border-b border-black/10 flex items-center justify-between px-6 z-[60] shrink-0 shadow-lg text-white">
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all flex items-center justify-center min-w-[40px] min-h-[40px]"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center text-[#2b579a]">
               <FileText size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <input type="text" defaultValue={fileName || "New Document"} className="bg-transparent border-none outline-none font-bold text-[15px] text-white w-64 truncate leading-none placeholder:text-white/40" />
               <p className="text-[9px] font-black uppercase text-blue-100/50 tracking-widest mt-0.5">Doc Studio • Cloud Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onExport?.(fileName, undefined, fileData)}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400 rounded-md font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <BookOpen size={14} /> Open in Reader
          </button>
          <button 
            onClick={onOpenExport}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md font-black text-[11px] uppercase tracking-widest transition-all"
          >
            <FileDown size={14} className="inline mr-2" /> Export
          </button>
          <button onClick={onSave} className="px-8 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-black text-[11px] uppercase tracking-widest shadow-xl transition-all">
            <Save size={14} className="inline mr-2" /> Save
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2 hover:bg-rose-500/20 rounded-lg transition-all ml-4 text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolset Rails */}
        <aside className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0">
           <button className="p-2 bg-blue-50 text-[#2b579a] rounded-lg shadow-sm"><AlignJustify size={20} /></button>
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Bold size={20} /></button>
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Italic size={20} /></button>
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Underline size={20} /></button>
           <div className="h-px w-8 bg-slate-100" />
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"><Palette size={20} /></button>
           <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Wand2 size={20} /></button>
        </aside>

        {/* Viewport */}
        <main className="flex-1 overflow-auto p-20 flex flex-col items-center custom-scrollbar">
           <div 
             className="bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] w-[816px] min-h-[1056px] rounded-sm relative origin-top transition-transform duration-500"
             style={{ transform: `scale(${zoom / 100})` }}
           >
             {fileUrl ? (
                <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full border-none opacity-90" title="Doc View" />
             ) : (
                <div className="p-24 h-full text-center flex flex-col items-center justify-center">
                  <div className="h-10 w-48 bg-slate-50 rounded-lg mb-8 animate-pulse" />
                  <div className="space-y-4 w-full max-w-md">
                    <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
             )}
           </div>
        </main>

        {/* Zoom Controls Overlay */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-2xl flex items-center gap-1 z-50">
           <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 text-slate-400 hover:text-blue-600"><ZoomOut size={16} /></button>
           <span className="text-[10px] font-black text-slate-400 w-12 text-center">{zoom}%</span>
           <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 text-slate-400 hover:text-blue-600"><ZoomIn size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default DocEditor;
