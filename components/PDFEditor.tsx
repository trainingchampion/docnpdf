
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, Save, Type, Pencil, Highlighter, 
  ChevronLeft, ZoomIn, ZoomOut, ChevronRight,
  Navigation, FileText, CheckCircle2,
  Trash2, Layers, Download, Eye, Sparkles,
  ShieldCheck, ArrowRight, User, Home,
  LayoutGrid, SpellCheck, Image, Link, MessageCircle,
  AlignJustify, ListChecks, ListOrdered as ListO,
  Indent, Outdent, FileSearch, Trash, Lightbulb, Presentation,
  MonitorPlay, MousePointer2, Square, Circle, Minus, MessageSquarePlus,
  Play, Paintbrush, ChevronUp, ChevronDown, Plus, Search,
  Bold, Italic, Palette, AlignCenter, AlignLeft, AlignRight,
  Video, MessageSquare, Printer, Undo2, Redo2, Maximize2,
  Settings2, Underline, Lock, Clock, MoreHorizontal, RotateCcw,
  Wand2, FileDown, Globe, FileJson,
  Loader2, History, Settings, StickyNote
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { TextBlock } from '../types';

// Fix: AnnotationBlock now correctly extends TextBlock as 'highlight' and related fields were added to the base type
interface AnnotationBlock extends TextBlock {
}

interface PageNode {
  id: string;
  blocks: AnnotationBlock[];
  notes: string;
  background: string;
  layout: 'title' | 'content' | 'blank';
  deletedAt?: number;
}

interface PDFEditorProps {
  fileName: string;
  fileData?: string; 
  initialBlocks?: TextBlock[];
  onClose: () => void;
  onSave: () => void;
}

const PDFEditor: React.FC<PDFEditorProps> = ({ fileName, fileData, initialBlocks, onClose, onSave }) => {
  // Generate Blob URL from Base64 fileData
  const fileUrl = useMemo(() => {
    if (!fileData) return null;
    try {
      let base64Clean = fileData;
      if (base64Clean.includes(',')) {
        base64Clean = base64Clean.split(',')[1];
      }
      base64Clean = base64Clean.replace(/\s/g, '');

      const binString = window.atob(base64Clean);
      const len = binString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("PDF Blob Creation Failed:", e);
      return null;
    }
  }, [fileData]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const initialPages: PageNode[] = [
    {
      id: 'page-1',
      blocks: (initialBlocks as AnnotationBlock[]) || (fileData ? [] : [
        { id: 'h1', type: 'heading', x: 100, y: 180, content: 'Annotation Session', fontSize: 42, fontWeight: '900', fontStyle: 'normal', color: '#0f172a', alignment: 'center' },
      ]),
      notes: 'Active annotation session.',
      background: 'bg-white',
      layout: 'content'
    }
  ];

  const [pages, setPages] = useState<PageNode[]>(initialPages);
  const [history, setHistory] = useState<PageNode[][]>([initialPages]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [deletedPages, setDeletedPages] = useState<PageNode[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'highlight' | 'note'>('select');
  const [activeColor, setActiveColor] = useState('#fde047'); // Default Highlight Yellow
  const [zoom, setZoom] = useState(85);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'design' | 'history'>('design');
  const [isAiRewriting, setIsAiRewriting] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const activePage = pages[activePageIndex] || pages[0];

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushToHistory = (newPages: PageNode[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    const nextHistory = [...newHistory, JSON.parse(JSON.stringify(newPages))].slice(-50);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setPages(newPages);
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setPages(JSON.parse(JSON.stringify(history[newIndex])));
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setPages(JSON.parse(JSON.stringify(history[newIndex])));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    let newBlock: AnnotationBlock;

    if (activeTool === 'text') {
      newBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text', x, y,
        content: 'New Text Annotation...',
        fontSize: 16, fontWeight: '600', fontStyle: 'normal',
        color: '#0f172a', alignment: 'left'
      };
    } else if (activeTool === 'highlight') {
      newBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'highlight', x, y,
        content: '',
        width: 120, height: 24,
        fontSize: 0, fontWeight: 'normal', fontStyle: 'normal',
        color: activeColor, alignment: 'left',
        opacity: 0.4
      };
    } else { // note
      newBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'note', x, y,
        content: 'Type your note here...',
        fontSize: 14, fontWeight: '500', fontStyle: 'normal',
        color: '#475569', alignment: 'left'
      };
    }

    const updatedPages = JSON.parse(JSON.stringify(pages));
    updatedPages[activePageIndex].blocks.push(newBlock);
    pushToHistory(updatedPages);
    setSelectedBlockId(newBlock.id);
    setActiveTool('select');
  };

  const updateBlock = (blockId: string, updates: Partial<AnnotationBlock>, persist = true) => {
    const updatedPages = JSON.parse(JSON.stringify(pages));
    const page = updatedPages[activePageIndex];
    page.blocks = page.blocks.map((b: any) => b.id === blockId ? { ...b, ...updates } : b);
    
    if (persist) {
      pushToHistory(updatedPages);
    } else {
      setPages(updatedPages);
    }
  };

  const rewriteWithAI = async (blockId: string) => {
    const block = activePage.blocks.find(b => b.id === blockId);
    if (!block || !block.content) return;
    setIsAiRewriting(true);
    try {
      // Fix: Create new GoogleGenAI instance right before the call to use the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Refine this document annotation to be concise and professional: "${block.content}".`,
      });
      if (response.text) updateBlock(blockId, { content: response.text.trim() });
    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setIsAiRewriting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden text-white relative select-none h-full font-['Inter',_sans-serif]">
      
      {/* Studio Header */}
      <header className="h-16 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-[60] shrink-0 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
               <button 
                onClick={handleUndo} 
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-all ${canUndo ? 'text-white hover:bg-white/10' : 'text-white/10'}`}
               >
                 <Undo2 size={18} />
               </button>
               <button 
                onClick={handleRedo} 
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-all ${canRedo ? 'text-white hover:bg-white/10' : 'text-white/10'}`}
               >
                 <Redo2 size={18} />
               </button>
            </div>
            <div className="h-6 w-px bg-white/5 mx-1" />
            <div className="flex flex-col">
               <input type="text" defaultValue={fileName || "Annotation Session"} className="bg-transparent border-none outline-none font-black text-[15px] text-white w-64 truncate leading-none" />
               <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest mt-0.5">High-Fidelity Annotator Node</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-black text-[11px] uppercase tracking-widest">
            <FileDown size={14} className="inline mr-2" /> Export
          </button>
          <button onClick={onSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20">
            <Save size={14} className="inline mr-2" /> Finalize
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigator */}
        <aside className="w-64 bg-[#0f172a] border-r border-white/5 flex flex-col shrink-0 z-50">
          <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Index</h3>
            <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-50 transition-all"><Plus size={14} strokeWidth={3} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-dark space-y-4">
            {pages.map((page, index) => (
              <div 
                key={page.id} onClick={() => setActivePageIndex(index)}
                className={`relative group cursor-pointer transition-all duration-300 ${activePageIndex === index ? 'scale-105' : 'opacity-60'}`}
              >
                <div className={`w-full aspect-[3/4] rounded-xl shadow-2xl border-2 transition-all ${activePageIndex === index ? 'border-blue-500' : 'border-white/5 bg-slate-900'}`}>
                  <div className={`w-full h-full bg-white rounded-lg flex items-center justify-center`}>
                     <FileText size={24} className="text-slate-200" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 w-5 h-5 bg-black/40 rounded-lg flex items-center justify-center border border-white/10 text-[10px] font-black">{index + 1}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Stage */}
        <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden relative group/canvas">
          <main className="flex-1 overflow-auto custom-scrollbar-dark flex flex-col items-center p-20">
            <div 
              ref={canvasRef} onClick={handleCanvasClick}
              className={`relative shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] w-[850px] min-h-[1100px] transition-all duration-700 rounded-xl overflow-hidden bg-white`}
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {fileUrl && (
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  className="absolute inset-0 w-full h-full z-0 border-none pointer-events-none opacity-90"
                  title="PDF Source"
                />
              )}

              {/* Annotation Overlay Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                 {activePage.blocks.map(block => (
                    <div 
                      key={block.id}
                      className={`absolute pointer-events-auto transition-all group ${selectedBlockId === block.id ? 'ring-2 ring-blue-500 rounded-lg bg-blue-50/5' : 'hover:ring-2 hover:ring-blue-500/20 rounded-lg'}`}
                      style={{ left: block.x, top: block.y, width: block.width, height: block.height }}
                      onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                    >
                      {block.type === 'highlight' ? (
                        <div 
                          className="w-full h-full rounded shadow-sm"
                          style={{ backgroundColor: block.color, opacity: block.opacity }}
                        />
                      ) : (
                        <div className="p-2 min-w-[200px]">
                           {block.type === 'note' && <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><MessageCircle size={12} /> Sticky Note</div>}
                           <textarea 
                            value={block.content} 
                            onChange={(e) => updateBlock(block.id, { content: e.target.value }, false)}
                            onBlur={(e) => updateBlock(block.id, { content: e.target.value }, true)}
                            className="bg-transparent border-none outline-none resize-none overflow-hidden block w-full leading-relaxed font-bold"
                            style={{ color: block.color, textAlign: block.alignment, fontSize: `${block.fontSize}px` }}
                          />
                        </div>
                      )}

                      {selectedBlockId === block.id && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-2">
                           <div className="bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-100 flex items-center gap-1">
                              {block.type !== 'highlight' && (
                                <>
                                  <button onClick={() => updateBlock(block.id, { fontSize: block.fontSize + 2 })} className="p-2 text-slate-500 hover:text-blue-600 rounded-xl transition-all"><Plus size={16} /></button>
                                  <button onClick={() => updateBlock(block.id, { fontSize: Math.max(10, block.fontSize - 2) })} className="p-2 text-slate-500 hover:text-blue-600 rounded-xl transition-all"><Minus size={16} /></button>
                                  <div className="h-6 w-px bg-slate-100 mx-1" />
                                  <button onClick={() => rewriteWithAI(block.id)} disabled={isAiRewriting} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    {isAiRewriting ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                  </button>
                                </>
                              )}
                              {block.type === 'highlight' && (
                                <div className="flex gap-1.5 px-2">
                                   {['#fde047', '#86efac', '#fda4af', '#93c5fd'].map(c => (
                                     <button key={c} onClick={() => updateBlock(block.id, { color: c })} className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: c }} />
                                   ))}
                                </div>
                              )}
                              <button onClick={() => {
                                 const updated = JSON.parse(JSON.stringify(pages));
                                 updated[activePageIndex].blocks = updated[activePageIndex].blocks.filter((b: any) => b.id !== block.id);
                                 pushToHistory(updated);
                                 setSelectedBlockId(null);
                              }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </main>

          {/* Annotation Control Hub */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100]">
            <div className="flex items-center bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
               <button onClick={() => setActiveTool('select')} className={`p-3 rounded-xl transition-all ${activeTool === 'select' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`} title="Selection Pointer"><MousePointer2 size={18} /></button>
               <button onClick={() => setActiveTool('text')} className={`p-3 rounded-xl transition-all ${activeTool === 'text' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`} title="Text Markup"><Type size={18} /></button>
               <button onClick={() => setActiveTool('highlight')} className={`p-3 rounded-xl transition-all ${activeTool === 'highlight' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`} title="Semantic Highlight"><Highlighter size={18} /></button>
               <button onClick={() => setActiveTool('note')} className={`p-3 rounded-xl transition-all ${activeTool === 'note' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`} title="Sticky Note"><MessageSquarePlus size={18} /></button>
               <div className="w-px h-6 bg-white/5 mx-1" />
               <button onClick={() => setZoom(prev => Math.max(20, prev - 10))} className="p-3 text-slate-400 hover:text-white"><ZoomOut size={18} /></button>
               <span className="text-[10px] font-black text-slate-500 w-10 text-center">{zoom}%</span>
               <button onClick={() => setZoom(prev => Math.min(200, prev + 10))} className="p-3 text-slate-400 hover:text-white"><ZoomIn size={18} /></button>
            </div>
          </div>
        </div>

        {/* Right Inspector */}
        {showRightPanel && (
          <aside className="w-80 bg-[#0f172a] border-l border-white/5 flex flex-col shrink-0 animate-in slide-in-from-right duration-500 z-[100]">
             <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={16} className="text-emerald-400" />
                   <h3 className="text-[12px] font-black text-white uppercase tracking-widest pt-1">Vault Assurance</h3>
                </div>
                <button onClick={() => setShowRightPanel(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-white"><X size={18} /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-dark space-y-10">
                <section>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Intelligence Pass</p>
                   <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl">
                      <Sparkles size={24} className="mb-4 text-indigo-200" />
                      <h4 className="text-sm font-black mb-2 uppercase tracking-tight">AI Audit Shield</h4>
                      <p className="text-[10px] opacity-80 leading-relaxed font-medium">Mina is monitoring this session for PII compliance and high-fidelity extraction integrity.</p>
                   </div>
                </section>

                <section>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Annotations Index ({activePage.blocks.length})</p>
                  <div className="space-y-3">
                    {activePage.blocks.length === 0 ? (
                      <p className="text-[10px] text-slate-600 font-bold uppercase text-center py-10 border border-dashed border-white/5 rounded-2xl">Standing by for markup...</p>
                    ) : (
                      activePage.blocks.map(b => (
                        <div key={b.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-blue-500/20 transition-all cursor-pointer" onClick={() => setSelectedBlockId(b.id)}>
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${b.type === 'highlight' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                             {b.type === 'highlight' ? <Highlighter size={14} /> : <FileText size={14} />}
                           </div>
                           <p className="text-[11px] font-bold truncate flex-1 opacity-70">{b.type === 'highlight' ? 'Area Highlight' : b.content || 'Blank Annotation'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>
             </div>

             <div className="p-6 border-t border-white/5 bg-[#0f172a] flex items-center justify-around">
                <button onClick={() => setActiveInspectorTab('design')} className={`p-3 rounded-xl transition-all ${activeInspectorTab === 'design' ? 'text-white border-2 border-blue-500' : 'text-slate-500'}`}><Layers size={20} /></button>
                <button onClick={() => setActiveInspectorTab('history')} className={`p-3 rounded-xl transition-all ${activeInspectorTab === 'history' ? 'text-white border-2 border-blue-500' : 'text-slate-500'}`}><History size={20} /></button>
             </div>
          </aside>
        )}
      </div>

      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default PDFEditor;
