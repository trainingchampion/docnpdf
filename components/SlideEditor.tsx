
import React, { useState } from 'react';
import { 
  X, ChevronLeft, Save, FileDown, Plus, 
  Presentation, LayoutGrid, MonitorPlay, 
  MousePointer2, Type, Image as ImageIcon, 
  Square, Circle, Minus, Play, Palette, 
  ChevronRight, Sparkles, Loader2, Home, Trash2,
  ZoomIn, ZoomOut, BookOpen, Download
} from 'lucide-react';

interface SlideNode {
  id: string;
  title: string;
  content: string;
}

interface SlideEditorProps {
  fileName: string;
  fileData?: string;
  onClose: () => void;
  onSave: () => void;
  onExport?: (title: string, content?: string, base64?: string) => void;
  onOpenExport?: () => void;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ fileName, fileData, onClose, onSave, onExport, onOpenExport }) => {
  const [slides, setSlides] = useState<SlideNode[]>([
    { id: '1', title: 'Strategic Roadmap 2025', content: 'DocnPDF High-Fidelity Intelligence' },
    { id: '2', title: 'Market Positioning', content: 'Revolutionizing the agreement lifecycle.' }
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [zoom, setZoom] = useState(80);
  const [isSaving, setIsSaving] = useState(false);

  const activeSlide = slides[activeSlideIdx];

  const handleManualSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 1000);
  };

  const handleExportInternal = () => {
    // Convert slide deck to a textual outline for the reader
    let deckText = `Presentation: ${fileName}\n\n`;
    slides.forEach((s, i) => {
      deckText += `Slide ${i + 1}: ${s.title}\n${s.content}\n\n`;
    });
    onExport?.(fileName, deckText);
  };

  const addSlide = () => {
    const newSlide = { id: Math.random().toString(36).substr(2, 9), title: 'New Slide', content: 'Double click to edit content' };
    setSlides([...slides, newSlide]);
    setActiveSlideIdx(slides.length);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#f3f3f3] flex flex-col animate-in fade-in duration-300 overflow-hidden text-slate-900 font-['Inter',_sans-serif]">
      {/* PowerPoint-style Orange Header */}
      <header className="h-16 bg-[#d24726] flex items-center justify-between px-6 shrink-0 shadow-lg text-white">
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2 hover:bg-white/10 rounded-lg transition-all flex items-center justify-center min-w-[40px] min-h-[40px]"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center text-[#d24726] shadow-sm">
               <Presentation size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <input type="text" defaultValue={fileName || "New Deck"} className="bg-transparent border-none outline-none font-bold text-[15px] text-white w-64 truncate leading-none" />
               <p className="text-[9px] font-black uppercase text-orange-100/50 tracking-widest mt-0.5">Presentation Studio • v5.0</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportInternal}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white border border-orange-400 rounded-md font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <BookOpen size={14} /> Open in Reader
          </button>
          <button 
            onClick={onOpenExport}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Download size={14} /> Export
          </button>
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2">
            <MonitorPlay size={14} /> Present
          </button>
          <button onClick={handleManualSave} disabled={isSaving} className="px-8 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md font-black text-[11px] uppercase tracking-widest shadow-xl transition-all disabled:opacity-50">
            {isSaving ? <Loader2 size={14} className="animate-spin mr-2 inline" /> : <Save size={14} className="mr-2 inline" />} Save
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2 hover:bg-rose-500/20 rounded-lg transition-all text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Interface Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Slide Rail */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deck Index</h3>
             <button onClick={addSlide} className="p-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-all"><Plus size={14} strokeWidth={3} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id} 
                onClick={() => setActiveSlideIdx(idx)}
                className={`relative group cursor-pointer transition-all ${activeSlideIdx === idx ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className={`aspect-video rounded-lg border-2 shadow-sm flex items-center justify-center p-2 text-center overflow-hidden bg-white ${activeSlideIdx === idx ? 'border-orange-500' : 'border-slate-100'}`}>
                   <p className="text-[6px] font-bold text-slate-900 leading-tight uppercase truncate">{slide.title}</p>
                </div>
                <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">{idx + 1}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
           {/* Dynamic Designer Toolbar */}
           <div className="h-12 bg-white border-b border-slate-200 flex items-center px-6 gap-6 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg">
                <button className="p-1.5 bg-white text-[#d24726] rounded shadow-sm"><MousePointer2 size={16} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600"><Type size={16} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600"><ImageIcon size={16} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600"><Square size={16} /></button>
              </div>
              <div className="h-6 w-px bg-slate-100" />
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-[#d24726]"><Sparkles size={14} /> AI Design Assistant</button>
           </div>

           <main className="flex-1 overflow-auto p-12 lg:p-24 flex justify-center custom-scrollbar">
              <div 
                className="bg-white shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] aspect-video w-full max-w-[1000px] rounded-lg relative overflow-hidden flex flex-col items-center justify-center p-20 origin-top transition-transform duration-500 border border-slate-100"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <h2 className="text-5xl font-[1000] tracking-tighter text-slate-900 text-center mb-8 uppercase leading-none">{activeSlide.title}</h2>
                <div className="h-1 w-24 bg-orange-500 mb-10" />
                <p className="text-xl text-slate-400 font-medium text-center">{activeSlide.content}</p>
                
                {/* Visual Guides */}
                <div className="absolute inset-0 border-2 border-dashed border-slate-100 pointer-events-none m-8" />
              </div>
           </main>

           <div className="absolute bottom-8 right-8 flex items-center bg-white/80 backdrop-blur rounded-full p-1 border shadow-xl">
             <button onClick={() => setZoom(Math.max(20, zoom - 10))} className="p-2 text-slate-400 hover:text-orange-600"><ZoomOut size={16} /></button>
             <span className="text-[10px] font-black text-slate-400 w-12 text-center">{zoom}%</span>
             <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 text-slate-400 hover:text-orange-600"><ZoomIn size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;
