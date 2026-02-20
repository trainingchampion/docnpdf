
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  X, Save, Type, Calendar, 
  ZoomIn, ZoomOut,
  FileText, CheckCircle2,
  Trash2, ArrowRight, Home,
  Plus, Check, Hash, Trash, Mail,
  Signature, Pencil, Upload as UploadIcon,
  Settings, Info, Users, Globe,
  UserPlus, CheckCircle,
  AlertCircle,
  ShieldCheck,
  MousePointer2,
  ChevronRight,
  Target,
  PenTool,
  ArrowDownLeft,
  MousePointer,
  Baseline,
  Clock,
  Lock,
  ListOrdered,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface Signer {
  id: string;
  name: string;
  email: string;
  color: string;
  order: number;
}

interface SignElement {
  id: string;
  type: 'signature' | 'initials' | 'date' | 'text';
  x: number;
  y: number;
  content: string;
  width: number;
  height: number;
  signerId: string;
  isSigned: boolean;
  isMandatory: boolean;
}

interface ESignStudioProps {
  fileName: string;
  fileData?: string;
  onClose: () => void;
  onFinish: () => void;
}

const SIGNER_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const ESignStudio: React.FC<ESignStudioProps> = ({ fileName, fileData, onClose, onFinish }) => {
  const [elements, setElements] = useState<SignElement[]>([]);
  const [signers, setSigners] = useState<Signer[]>([
    { id: 'me', name: 'You (Self)', email: 'me@docnpdf.ai', color: '#2563eb', order: 1 }
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'signature' | 'initials' | 'date' | 'text'>('select');
  const [zoom, setZoom] = useState(90);
  const [mode, setMode] = useState<'prepare' | 'sign'>('prepare');
  const [prepareTab, setPrepareTab] = useState<'signers' | 'rules'>('signers');
  
  // Document Rules State
  const [signingOrder, setSigningOrder] = useState(false);
  const [expiryDays, setExpiryDays] = useState(30);
  const [requireMFA, setRequireMFA] = useState(false);
  const [googleCalendarSync, setGoogleCalendarSync] = useState(true);

  const [isAdopting, setIsAdopting] = useState(false);
  const [signatureType, setSignatureType] = useState<'type' | 'draw' | 'upload'>('type');
  const [adoptedSignature, setAdoptedSignature] = useState<string>('Your Name');
  const [isAddingSigner, setIsAddingSigner] = useState(false);
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerEmail, setNewSignerEmail] = useState('');
  const [highlightedSignerId, setHighlightedSignerId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

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

  const signerStatus = useMemo(() => {
    return signers.map(s => {
      const assigned = elements.filter(el => el.signerId === s.id);
      const signed = assigned.filter(el => el.isSigned);
      return {
        ...s,
        totalFields: assigned.length,
        signedFields: signed.length,
        isComplete: assigned.length > 0 && assigned.length === signed.length
      };
    });
  }, [signers, elements]);

  const myFields = useMemo(() => elements.filter(el => el.signerId === 'me'), [elements]);
  const myUnsignedFields = useMemo(() => myFields.filter(el => !el.isSigned), [myFields]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    const dims = {
      signature: { w: 180, h: 60 },
      initials: { w: 80, h: 50 },
      date: { w: 120, h: 40 },
      text: { w: 150, h: 40 }
    }[activeTool] || { w: 100, h: 40 };

    const newElement: SignElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTool as any,
      x: x - dims.w / 2,
      y: y - dims.h / 2,
      width: dims.w,
      height: dims.h,
      content: (activeTool === 'date' && mode === 'sign') ? new Date().toLocaleDateString() : '',
      signerId: 'me', 
      isSigned: false,
      isMandatory: true
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
    
    if (mode === 'sign') {
      if (newElement.type === 'signature' || newElement.type === 'initials') {
         setIsAdopting(true);
      } else if (newElement.type === 'date') {
         setElements(prev => prev.map(el => el.id === newElement.id ? { ...el, isSigned: true } : el));
      }
    }

    setActiveTool('select');
  };

  const handleDragElement = (id: string, e: React.MouseEvent) => {
    if (mode === 'sign') return;
    const startX = e.clientX;
    const startY = e.clientY;
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    const initialX = element.x;
    const initialY = element.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / (zoom / 100);
      const dy = (moveEvent.clientY - startY) / (zoom / 100);
      setElements(prev => prev.map(el => el.id === id ? { ...el, x: initialX + dx, y: initialY + dy } : el));
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSignElement = (id: string) => {
    if (mode !== 'sign') return;
    const el = elements.find(x => x.id === id);
    if (!el || el.isSigned || el.signerId !== 'me') return;

    if (el.type === 'signature' || el.type === 'initials') {
      setIsAdopting(true);
      setSelectedElementId(id);
    } else if (el.type === 'date') {
      setElements(prev => prev.map(x => x.id === id ? { ...x, isSigned: true, content: new Date().toLocaleDateString() } : x));
    } else {
      setElements(prev => prev.map(x => x.id === id ? { ...x, isSigned: true } : x));
    }
  };

  const navigateToField = (id: string) => {
    const el = elements.find(x => x.id === id);
    if (!el) return;
    setSelectedElementId(id);
    const canvas = canvasRef.current;
    if (canvas && scrollRef.current) {
      const fieldY = el.y * (zoom / 100);
      scrollRef.current.scrollTo({
        top: fieldY - 200,
        behavior: 'smooth'
      });
    }
  };

  const finalizeSignature = () => {
    setElements(prev => prev.map(x => x.id === selectedElementId ? { ...x, isSigned: true, content: adoptedSignature } : x));
    setIsAdopting(false);
    setSelectedElementId(null);
  };

  const handleAddSigner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignerName.trim() || !newSignerEmail.trim()) return;
    const newSigner: Signer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSignerName,
      email: newSignerEmail,
      color: SIGNER_COLORS[signers.length % SIGNER_COLORS.length],
      order: signers.length + 1
    };
    setSigners([...signers, newSigner]);
    setNewSignerName('');
    setNewSignerEmail('');
    setIsAddingSigner(false);
    
    setHighlightedSignerId(newSigner.id);
    setTimeout(() => setHighlightedSignerId(null), 2000);
  };

  const handleFinish = () => {
    const pendingMandatory = elements.filter(el => el.signerId === 'me' && el.isMandatory && !el.isSigned);
    if (pendingMandatory.length > 0) {
      alert(`Please complete ${pendingMandatory.length} mandatory field(s) before finalizing.`);
      return;
    }

    setIsFinished(true);
    const finishDelay = googleCalendarSync ? 3000 : 2000;
    setTimeout(() => onFinish(), finishDelay);
  };

  const selectedElement = useMemo(() => elements.find(el => el.id === selectedElementId), [elements, selectedElementId]);

  const assignSignerToElement = (signerId: string) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, signerId } : el));
  };

  const toggleFieldMandatory = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, isMandatory: !el.isMandatory } : el));
  };

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
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{mode === 'prepare' ? 'Preparation Mode' : 'Signing Mode'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
             <button 
              onClick={() => { setMode('prepare'); setActiveTool('select'); }}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'prepare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
             >Set Rules</button>
             <button 
              onClick={() => { setMode('sign'); setActiveTool('select'); }}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'sign' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
             >Sign Node</button>
          </div>

          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 text-slate-400 hover:text-slate-900"><ZoomOut size={14} /></button>
            <span className="text-[10px] font-black text-slate-900 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 text-slate-400 hover:text-slate-900"><ZoomIn size={14} /></button>
          </div>

          <button 
            onClick={handleFinish}
            disabled={elements.length === 0 || isFinished}
            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
             {isFinished ? 'Verifying...' : 'Finalize Cycle'} <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Functional Toolbox */}
        <aside className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-8 gap-4 z-40 shrink-0 shadow-sm">
          <button 
            onClick={() => setActiveTool('select')}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 relative group ${activeTool === 'select' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500'}`}
            title="Selection Pointer"
          >
            <MousePointer2 size={24} strokeWidth={2} />
          </button>
          <div className="h-px w-10 bg-slate-100 my-2" />
          {[
            { id: 'signature', icon: <PenTool size={22} />, label: 'Sign', color: 'bg-indigo-600', hover: 'hover:bg-indigo-50 hover:text-indigo-600' },
            { id: 'initials', icon: <Hash size={22} />, label: 'Initials', color: 'bg-violet-600', hover: 'hover:bg-violet-50 hover:text-violet-600' },
            { id: 'date', icon: <Calendar size={22} />, label: 'Date', color: 'bg-rose-600', hover: 'hover:bg-rose-50 hover:text-rose-600' },
            { id: 'text', icon: <Baseline size={22} />, label: 'Text', color: 'bg-slate-600', hover: 'hover:bg-slate-100 hover:text-slate-600' },
          ].map(tool => (
            <button 
              key={tool.id}
              onClick={() => setActiveTool(activeTool === tool.id ? 'select' : tool.id as any)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-105 active:scale-95 relative group ${activeTool === tool.id ? `${tool.color} text-white shadow-lg` : `bg-white text-slate-400 border border-slate-100 ${tool.hover}`}`}
              title={tool.label}
            >
              {tool.icon}
              <span className="text-[9px] font-bold uppercase tracking-wide">{tool.label}</span>
            </button>
          ))}
          <div className="mt-auto pb-4">
             <button className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <Settings size={24} />
             </button>
          </div>
        </aside>

        {/* Workspace */}
        <main ref={scrollRef} className="flex-1 bg-slate-100/50 overflow-auto custom-scrollbar p-16 flex justify-center relative" onClick={() => {if(activeTool === 'select') setSelectedElementId(null)}}>
          <div 
            ref={canvasRef}
            onClick={(e) => { e.stopPropagation(); handleCanvasClick(e); }}
            className={`relative bg-white shadow-2xl w-full max-w-[800px] min-h-[1050px] transition-transform origin-top duration-300 border border-slate-200 rounded-sm ${activeTool !== 'select' ? 'cursor-crosshair' : 'cursor-default'}`}
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {fileUrl ? (
                 <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none pointer-events-none select-none opacity-90" title="Sign View" />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <FileText size={120} />
                </div>
            )}

            {/* Elements */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {elements.map(el => {
                const isSelected = selectedElementId === el.id;
                const signer = signers.find(s => s.id === el.signerId);
                const isMe = el.signerId === 'me';
                const isHighlighted = highlightedSignerId === el.signerId;
                const isDate = el.type === 'date';
                
                return (
                  <div 
                    key={el.id}
                    id={`field-${el.id}`}
                    className={`absolute pointer-events-auto cursor-move transition-all group ${isSelected ? 'ring-2 ring-blue-500 shadow-2xl z-20 scale-105' : isHighlighted ? 'ring-4 ring-blue-400/30 z-10' : 'hover:ring-1 hover:ring-blue-300 shadow-sm'}`}
                    style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
                    onMouseDown={(e) => { e.stopPropagation(); setSelectedElementId(el.id); handleDragElement(el.id, e); }}
                    onClick={(e) => { e.stopPropagation(); handleSignElement(el.id); }}
                  >
                    <div 
                      className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed relative overflow-hidden transition-all duration-300 ${el.isSigned ? 'bg-white border-transparent' : (mode === 'sign' && isMe ? 'bg-blue-600/5 border-blue-600 ring-2 ring-blue-500/10' : 'bg-slate-50/80')}`}
                      style={el.isSigned ? {} : { borderColor: signer?.color || '#2563eb' }}
                    >
                       {el.isSigned ? (
                         <div className="w-full h-full flex items-center justify-center p-2">
                           <span className={`${isDate ? 'font-mono text-lg font-bold' : 'font-[\'Dancing_Script\',_cursive] text-2xl'} text-blue-900 animate-in fade-in zoom-in duration-500`}>
                             {el.content}
                           </span>
                           <CheckCircle2 size={12} className="absolute top-1 right-1 text-emerald-500" />
                         </div>
                       ) : (
                         <>
                           {mode === 'sign' && isMe && (
                             <div className="absolute -top-12 -left-12 text-blue-600 animate-bounce pointer-events-none flex flex-col items-center">
                                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase mb-1 shadow-lg">Sign Here</span>
                                <ArrowDownLeft size={24} strokeWidth={3} />
                             </div>
                           )}
                           <div className="flex flex-col items-center justify-center gap-1">
                              <span className={`text-[8px] font-black uppercase tracking-widest ${mode === 'sign' && isMe ? 'text-blue-700 animate-pulse' : 'text-slate-400'}`}>
                                {mode === 'sign' ? (isMe ? 'Tap to fill' : 'Awaiting') : el.type}
                              </span>
                              {el.isMandatory && !el.isSigned && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" title="Mandatory Field" />}
                           </div>
                           <div className="absolute top-0 left-0 px-2 py-0.5 text-[6px] font-black text-white uppercase" style={{ backgroundColor: signer?.color }}>{signer?.name}</div>
                         </>
                       )}
                    </div>
                    {isSelected && mode === 'prepare' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setElements(prev => prev.filter(x => x.id !== el.id)); }}
                        className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-1 shadow-lg hover:scale-110 transition-all border border-slate-100"
                      >
                        <Trash size={12} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Info Rail */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col z-40 shrink-0 p-8 shadow-sm overflow-y-auto custom-scrollbar">
           {mode === 'prepare' && selectedElement ? (
             <div className="animate-in slide-in-from-right duration-300">
               <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Field Rules</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedElement.type} configuration</p>
                  </div>
               </div>
               
               <div className="space-y-6 mb-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assign Recipient</p>
                    <div className="space-y-2">
                      {signers.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => assignSignerToElement(s.id)}
                          className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${selectedElement.signerId === s.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent hover:border-blue-400'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black ${selectedElement.signerId === s.id ? 'bg-white text-slate-900' : 'text-white'}`} style={selectedElement.signerId === s.id ? {} : { backgroundColor: s.color }}>
                              {s.name.charAt(0)}
                            </div>
                            <span className="text-xs font-black truncate">{s.name}</span>
                          </div>
                          {selectedElement.signerId === s.id && <CheckCircle2 size={16} className="text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <AlertCircle size={16} className="text-slate-400" />
                           <span className="text-xs font-bold text-slate-900">Mandatory Field</span>
                        </div>
                        <button 
                          onClick={toggleFieldMandatory}
                          className={`w-10 h-5 rounded-full relative p-1 transition-colors ${selectedElement.isMandatory ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                           <div className={`w-3 h-3 bg-white rounded-full transition-transform ${selectedElement.isMandatory ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                     </div>
                  </div>
               </div>

               <button onClick={() => setSelectedElementId(null)} className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Deselect</button>
             </div>
           ) : (
             <div className="flex-1 flex flex-col">
               {mode === 'sign' && myUnsignedFields.length > 0 && (
                 <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                       <Target size={16} className="text-blue-600" />
                       <h3 className="text-[11px] font-[1000] uppercase tracking-[0.2em] text-blue-600">Pending Actions</h3>
                    </div>
                    <div className="space-y-2">
                       {myUnsignedFields.map(f => (
                         <button 
                          key={f.id}
                          onClick={() => navigateToField(f.id)}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-500 transition-all flex items-center justify-between group text-left"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 uppercase font-black text-[10px]">
                                  {f.type.charAt(0)}
                               </div>
                               <span className="text-[11px] font-black uppercase text-slate-900">{f.type}</span>
                               {f.isMandatory && <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-all" />
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {mode === 'prepare' && (
                  <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-8 shrink-0">
                    <button 
                      onClick={() => setPrepareTab('signers')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${prepareTab === 'signers' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >Signers</button>
                    <button 
                      onClick={() => setPrepareTab('rules')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${prepareTab === 'rules' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >Doc Rules</button>
                  </div>
               )}

               <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                 {prepareTab === 'signers' || mode === 'sign' ? (
                   <>
                      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center border border-slate-100">
                          <Users size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Signatories</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Node Roster</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {signerStatus.map(s => (
                          <div 
                            key={s.id} 
                            onMouseEnter={() => setHighlightedSignerId(s.id)}
                            onMouseLeave={() => setHighlightedSignerId(null)}
                            className={`p-4 bg-slate-50 rounded-2xl border transition-all group cursor-default hover:border-blue-300 ${s.isComplete ? 'border-emerald-100 bg-emerald-50/10' : highlightedSignerId === s.id ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-100'}`}
                          >
                             <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm" style={{ backgroundColor: s.color }}>
                                     {s.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{s.name}</p>
                                      <p className="text-[8px] text-slate-400 font-bold uppercase">{s.id === 'me' ? 'Host' : 'Recipient'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   {s.isComplete ? (
                                     <CheckCircle size={14} className="text-emerald-500" strokeWidth={3} />
                                   ) : (
                                     <div className={`w-1.5 h-1.5 rounded-full ${s.totalFields > 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`} />
                                   )}
                                </div>
                             </div>
                             <div className="flex items-center justify-between">
                                <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden mr-4">
                                   <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: s.totalFields > 0 ? `${(s.signedFields / s.totalFields) * 100}%` : '0%' }} />
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{s.signedFields} / {s.totalFields} Node(s)</span>
                             </div>
                          </div>
                        ))}
                        {isAddingSigner ? (
                          <form onSubmit={handleAddSigner} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-2 duration-300 space-y-4">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                              <input autoFocus type="text" required value={newSignerName} onChange={(e) => setNewSignerName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="Signer Name" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                              <input type="email" required value={newSignerEmail} onChange={(e) => setNewSignerEmail(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="email@address.com" />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Add</button>
                              <button type="button" onClick={() => setIsAddingSigner(false)} className="px-3 py-2 bg-white border border-slate-200 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          mode === 'prepare' && (
                            <button 
                              onClick={() => setIsAddingSigner(true)}
                              className="w-full py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                              <Plus size={14} strokeWidth={3} /> Add Recipient
                            </button>
                          )
                        )}
                      </div>
                   </>
                 ) : (
                   <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                          <Settings size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Rules</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enforcement Engine</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <ListOrdered size={16} className="text-blue-500" />
                                  <span className="text-xs font-black uppercase tracking-tight text-slate-900">Enforce Signing Order</span>
                               </div>
                               <button 
                                onClick={() => setSigningOrder(!signingOrder)}
                                className={`w-10 h-5 rounded-full relative p-1 transition-colors ${signingOrder ? 'bg-blue-600' : 'bg-slate-300'}`}
                               >
                                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${signingOrder ? 'translate-x-5' : 'translate-x-0'}`} />
                               </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">Signatories will be notified in numerical sequence only.</p>
                         </div>

                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <Calendar size={16} className="text-red-500" />
                                  <span className="text-xs font-black uppercase tracking-tight text-slate-900">Google Calendar Sync</span>
                               </div>
                               <button 
                                onClick={() => setGoogleCalendarSync(!googleCalendarSync)}
                                className={`w-10 h-5 rounded-full relative p-1 transition-colors ${googleCalendarSync ? 'bg-red-500' : 'bg-slate-300'}`}
                               >
                                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${googleCalendarSync ? 'translate-x-5' : 'translate-x-0'}`} />
                               </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">Create events for signature deadlines and follow-up loops automatically.</p>
                         </div>

                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                               <Clock size={16} className="text-amber-500" />
                               <span className="text-xs font-black uppercase tracking-tight text-slate-900">Node Expiration</span>
                            </div>
                            <input 
                              type="range" min="1" max="90" value={expiryDays}
                              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                              className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-3"
                            />
                            <div className="flex justify-between items-baseline">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
                               <span className="text-lg font-black text-blue-600">{expiryDays} Days</span>
                            </div>
                         </div>

                         <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                               <div className="flex items-center gap-3">
                                  <ShieldAlert size={16} className="text-emerald-500" />
                                  <span className="text-xs font-black uppercase tracking-tight text-slate-900">Security: MFA Node</span>
                               </div>
                               <button 
                                onClick={() => setRequireMFA(!requireMFA)}
                                className={`w-10 h-5 rounded-full relative p-1 transition-colors ${requireMFA ? 'bg-emerald-500' : 'bg-slate-300'}`}
                               >
                                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${requireMFA ? 'translate-x-5' : 'translate-x-0'}`} />
                               </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">Signers must verify identity via secondary biometric or code node.</p>
                         </div>
                      </div>
                   </div>
                 )}
               </div>

               <div className="p-6 bg-slate-900 rounded-[1.5rem] text-white shadow-2xl relative overflow-hidden mt-auto">
                  <ShieldCheck size={28} className="text-blue-400 mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-tight mb-2 leading-none">High-Fidelity Assurance</h4>
                  <p className="text-[10px] opacity-60 leading-relaxed font-medium">Every signature node is cryptographically verified and recorded in the audit history.</p>
               </div>
             </div>
           )}
        </aside>
      </div>

      {/* Signature UI */}
      {isAdopting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Signature size={20} /></div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Adopt Identity</h3>
                 </div>
                 <button onClick={() => setIsAdopting(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
              </div>
              <div className="p-10 flex-1">
                 <div className="flex gap-4 mb-10 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button onClick={() => setSignatureType('type')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatureType === 'type' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Type size={14} className="inline mr-2" /> Type</button>
                    <button onClick={() => setSignatureType('draw')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatureType === 'draw' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Pencil size={14} className="inline mr-2" /> Draw</button>
                    <button onClick={() => setSignatureType('upload')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signatureType === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><UploadIcon size={14} className="inline mr-2" /> Upload</button>
                 </div>
                 <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 h-64 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                    {signatureType === 'type' && (
                       <input autoFocus type="text" value={adoptedSignature} onChange={(e) => setAdoptedSignature(e.target.value)} className="w-full text-center bg-transparent border-none outline-none font-['Dancing_Script',_cursive] text-6xl text-blue-900 placeholder:text-slate-300" placeholder="Your Full Name" />
                    )}
                    {signatureType !== 'type' && <div className="text-center opacity-30"><Pencil size={48} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">Active Hardware Link Simulation</p></div>}
                 </div>
                 <div className="mt-8 flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-3xl">
                    <Info size={20} className="text-blue-500 shrink-0 mt-1" />
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium uppercase tracking-tight">By finalizing, you agree that this electronic representation of your signature is legally binding and verified on this node.</p>
                 </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                 <button onClick={() => setIsAdopting(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all shadow-sm">Cancel</button>
                 <button onClick={finalizeSignature} className="flex-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95">Adopt and Finalize</button>
              </div>
           </div>
        </div>
      )}

      {isFinished && (
        <div className="fixed inset-0 z-[300] bg-[#0f172a] flex flex-col items-center justify-center text-white animate-in zoom-in duration-700">
           <div className="relative mb-12">
              <div className="w-32 h-32 border-8 border-blue-500/10 rounded-full border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Check size={48} className="text-blue-400" strokeWidth={3} /></div>
           </div>
           <h3 className="text-4xl font-[1000] tracking-tighter mb-4 text-center">Encryption Cycle Complete.</h3>
           <div className="flex flex-col items-center gap-2">
              <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Agreement Finalized • Generating Audit Proof</p>
              {googleCalendarSync && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in slide-in-from-bottom-2 delay-700">
                  <Calendar size={12} className="text-red-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-200">Google Calendar Event Synchronized</span>
                </div>
              )}
           </div>
        </div>
      )}

      <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between shrink-0 opacity-40">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-widest">AES-256 Tunnel Active</span></div>
            <div className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-widest">Global Node Sync</span></div>
         </div>
         <p className="text-[8px] font-black uppercase tracking-[0.3em]">Studio v5.5.2-HighFidelity</p>
      </footer>
    </div>
  );
};

export default ESignStudio;
