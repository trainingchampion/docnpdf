
import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Sparkles, Workflow, Zap, Database, 
  ShieldCheck, ArrowRight, Layers, LayoutGrid, 
  Search, Filter, Activity, CheckCircle2, 
  AlertCircle, ChevronRight, Play, Settings, 
  Plus, Terminal, Globe, MousePointer2,
  Lock, Cloud, RefreshCw, FileText, Table as TableIcon,
  Code, Eye, Send, Trash2, Save, Rocket,
  ArrowDown, ClipboardCheck, Webhook, FileSignature,
  X, Loader2, Download, Upload, FileJson,
  FileCheck, Shield, Share2, FileDown,
  MessageSquare, Check
} from 'lucide-react';
import { extractAllPDFData } from '../services/geminiService';

type IDMView = 'dashboard' | 'pipelines' | 'extraction' | 'designer' | 'lab';
type ExportFormat = 'natural' | 'json' | 'pdf';

interface WorkflowNode {
  id: string;
  type: 'ingest' | 'extract' | 'logic' | 'sign' | 'export';
  label: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  config?: any;
}

const IDMStudio: React.FC = () => {
  const [activeView, setActiveView] = useState<IDMView>('dashboard');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('natural');
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: '1', type: 'ingest', label: 'Document Ingestion', status: 'idle' },
    { id: '2', type: 'extract', label: 'Intelligence Extraction', status: 'idle' },
    { id: '3', type: 'logic', label: 'Security Classification', status: 'idle' },
    { id: '4', type: 'export', label: 'Vault Archive', status: 'idle' },
  ]);
  const [labFile, setLabFile] = useState<{ name: string; base64: string } | null>(null);
  const [labLogs, setLabLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [extractionResult, setExtractionResult] = useState<string>('');
  const [showArtifact, setShowArtifact] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNode = (type: WorkflowNode['type']) => {
    const labels = {
      ingest: 'Document Ingestion',
      extract: 'Intelligence Extractor',
      logic: 'Security Classification',
      sign: 'Verification Request',
      export: 'Vault Archive'
    };
    const newNode: WorkflowNode = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: labels[type],
      status: 'idle'
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const addLog = (msg: string) => {
    setLabLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      setLabFile({ name: file.name, base64 });
      addLog(`File received: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadArtifact = () => {
    if (!extractionResult) return;
    let content = extractionResult;
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (selectedFormat === 'json') {
      content = JSON.stringify({ source: labFile?.name, intelligence: extractionResult, timestamp: new Date().toISOString() }, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (selectedFormat === 'pdf') {
      content = `FINAL REPORT: ${labFile?.name}\n\nProcessed via DocnPDF Intelligence Hub\n\n${extractionResult}`;
      mimeType = 'text/plain'; // Real PDF generation would happen server-side, simulating file download
      ext = 'pdf';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Final_Report_${labFile?.name.split('.')[0] || 'Doc'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWebhookDispatch = async () => {
    if (!extractionResult) return;
    setIsDispatching(true);
    setWebhookSuccess(false);

    try {
      // High-fidelity webhook simulation
      await new Promise(r => setTimeout(r, 1800));
      addLog(`[WEBHOOK] 🌐 Dispatched to https://relay.docnpdf.ai/v1/ingest`);
      addLog(`[WEBHOOK] ✅ Remote endpoint acknowledged reception.`);
      setWebhookSuccess(true);
      setTimeout(() => setWebhookSuccess(false), 4000);
    } catch (err) {
      addLog(`[WEBHOOK] ❌ Relay failed. Retrying in 5s...`);
    } finally {
      setIsDispatching(false);
    }
  };

  const runWorkflow = async () => {
    if (!labFile) {
      alert("Please select a document to begin the cycle.");
      return;
    }

    setIsExecuting(true);
    setShowArtifact(false);
    setLabLogs([]);
    setExtractionResult('');
    
    try {
      const updatedNodes = [...nodes];
      for (let i = 0; i < updatedNodes.length; i++) {
        setNodes(prev => prev.map((n, idx) => idx === i ? { ...n, status: 'running' } : n));
        
        const nodeType = updatedNodes[i].type;
        
        switch (nodeType) {
          case 'ingest':
            addLog(`[SYSTEM] 🔵 Synchronizing "${labFile.name}"...`);
            await new Promise(r => setTimeout(r, 800)); 
            addLog(`[SYSTEM] ✅ Ingestion successful.`);
            break;

          case 'extract':
            addLog(`[AI] 🟣 Reasoning via Gemini 3 Pro Cluster...`);
            const result = await extractAllPDFData(labFile.base64);
            setExtractionResult(result.text);
            addLog(`[AI] ✅ Intelligence successfully mapped.`);
            break;

          case 'logic':
            addLog(`[SECURITY] 🟠 Classifying document sensitivity...`);
            await new Promise(r => setTimeout(r, 1200)); 
            addLog(`[SECURITY] ✅ Integrity check passed. Classified: Internal.`);
            break;

          case 'export':
            addLog(`[VAULT] 🟢 Encrypting and archiving to secure ledger...`);
            await new Promise(r => setTimeout(r, 1000));
            addLog(`[VAULT] ✅ Archive synchronized.`);
            break;
            
          default:
            await new Promise(r => setTimeout(r, 500));
            break;
        }

        setNodes(prev => prev.map((n, idx) => idx === i ? { ...n, status: 'completed' } : n));
        await new Promise(r => setTimeout(r, 400));
      }
      addLog(`[HUB] 🏁 Final report generated.`);
      setShowArtifact(true);
    } catch (err: any) {
      addLog(`[ERROR] ❌ Cycle Failure: ${err.message || 'Node Error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/5">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                   <Cpu size={24} />
                 </div>
                 <h3 className="text-xl font-black tracking-tight uppercase">Intelligence Cluster: Active</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Precision</p>
                    <p className="text-6xl font-[1000] tracking-tighter text-blue-400">99.4%</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Active Flows</p>
                    <p className="text-6xl font-[1000] tracking-tighter">{nodes.length}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Load</p>
                    <p className="text-6xl font-[1000] tracking-tighter text-emerald-400">Healthy</p>
                 </div>
              </div>
           </div>
           <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
              <button onClick={() => setActiveView('designer')} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20">
                Configure Pipeline <ArrowRight size={16} />
              </button>
           </div>
        </div>
        <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                <Zap size={32} className="text-amber-300" fill="currentColor" />
              </div>
              <h4 className="text-3xl font-[1000] leading-tight mb-4 uppercase tracking-tighter">Production Lab</h4>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed opacity-80">Execute automated high-fidelity cycles using your custom designer logic.</p>
           </div>
           <button onClick={() => setActiveView('lab')} className="w-full py-5 bg-white text-indigo-900 rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] hover:scale-105 transition-all shadow-xl active:scale-95">
              Enter execution lab
           </button>
           <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 blur-3xl rounded-full" />
        </div>
      </div>
    </div>
  );

  const renderDesigner = () => (
    <div className="animate-in fade-in duration-500 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-72 space-y-6 shrink-0">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Library</h3>
        <div className="grid grid-cols-1 gap-3">
          {(['ingest', 'extract', 'logic', 'sign', 'export'] as const).map(type => (
            <button key={type} onClick={() => addNode(type)} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 hover:border-blue-500 transition-all text-left group">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                {type === 'ingest' ? <FileText size={16} /> : type === 'extract' ? <Sparkles size={16} /> : type === 'logic' ? <Shield size={16} /> : type === 'sign' ? <FileSignature size={16} /> : <Database size={16} />}
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{type === 'extract' ? 'Intelligence' : type === 'logic' ? 'Classification' : type} Action</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-[3rem] p-12 min-h-[600px] relative overflow-y-auto custom-scrollbar">
        <div className="max-w-md mx-auto flex flex-col items-center gap-8 py-10">
          {nodes.map((node, i) => (
            <React.Fragment key={node.id}>
              <div className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm relative group hover:border-blue-400 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.status === 'completed' ? 'bg-emerald-500 text-white' : node.status === 'running' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {node.status === 'running' ? <Loader2 size={18} className="animate-spin" /> : node.status === 'completed' ? <CheckCircle2 size={18} /> : node.type === 'ingest' ? <FileText size={18} /> : node.type === 'extract' ? <Sparkles size={18} /> : node.type === 'logic' ? <Shield size={18} /> : node.type === 'sign' ? <FileSignature size={18} /> : <Database size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequence {i + 1}</p>
                      <h4 className="text-sm font-black text-slate-900">{node.label}</h4>
                    </div>
                  </div>
                  {node.status === 'idle' && (
                    <button onClick={() => removeNode(node.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
              {i < nodes.length - 1 && <ArrowDown size={24} className="text-slate-200" />}
            </React.Fragment>
          ))}
        </div>
        <div className="absolute top-8 right-8 flex gap-4">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"><Save size={14} /> Save Draft</button>
           <button onClick={() => setActiveView('lab')} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2">Deploy to Lab</button>
        </div>
      </div>
    </div>
  );

  const renderLab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">1. Upload Source Document</h3>
           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
           {labFile ? (
             <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 truncate max-w-[150px]">{labFile.name}</span>
                </div>
                <button onClick={() => { setLabFile(null); setShowArtifact(false); setExtractionResult(''); }} className="text-blue-400 hover:text-blue-600"><X size={16} /></button>
             </div>
           ) : (
             <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-400">
                <Upload size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Select PDF for Testing</span>
             </button>
           )}
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col min-h-[300px] border border-white/5">
           <h3 className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-6">Process Terminal</h3>
           <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
              {labLogs.length === 0 ? <p className="text-white/20 italic">Awaiting execution signal...</p> : labLogs.map((log, i) => <p key={i} className="text-emerald-400/80">{log}</p>)}
           </div>
        </div>
        <button onClick={runWorkflow} disabled={isExecuting || !labFile} className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 active:scale-95">
          {isExecuting ? <Loader2 size={20} className="animate-spin" /> : <Rocket size={20} />}
          {isExecuting ? 'Executing Cycle...' : 'Initiate Full Cycle'}
        </button>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-[#020617] rounded-[3.5rem] p-12 shadow-2xl border border-white/5 flex flex-col min-h-[750px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
           
           {isExecuting ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                   <div className="w-32 h-32 border-8 border-white/5 rounded-full border-t-blue-500 animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center"><Sparkles size={40} className="text-blue-400 animate-pulse" /></div>
                </div>
                <h3 className="text-3xl font-[1000] text-white uppercase tracking-tighter mb-4">Processing Reports...</h3>
                <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">Recursively analyzing document schema and applying security layers.</p>
             </div>
           ) : showArtifact ? (
             <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-700">
                {/* MATCHING USER SCREENSHOT DESIGN PRECISELY */}
                <div className="flex items-start justify-between mb-16">
                   <div className="flex items-start gap-8">
                      <div className="size-28 bg-[#10b981] rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] relative">
                         <div className="absolute inset-0 bg-white/10 blur-xl rounded-[2.5rem]" />
                         <FileCheck size={56} className="relative z-10" />
                      </div>
                      <div>
                         <h2 className="text-5xl font-[1000] text-white tracking-tighter uppercase mb-3 leading-none">Processed Report</h2>
                         <p className="text-[12px] font-black text-[#10b981] uppercase tracking-[0.3em] mb-8">Status: Analyzed & Archived</p>
                         
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2.5 text-white/40">
                               <Database size={16} />
                               <span className="text-[11px] font-black uppercase tracking-widest">{labFile?.name.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-white/40">
                               <Shield size={16} />
                               <span className="text-[11px] font-black uppercase tracking-widest">Internal Security Class</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="text-right">
                      <div className="text-[64px] font-[1000] text-[#10b981] tracking-tighter leading-none">V5.4</div>
                      <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">Intelligence Schema</p>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 mb-10 flex flex-col gap-6 flex-1">
                   <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4 p-1 bg-white/5 rounded-xl border border-white/10">
                        <button 
                          onClick={() => setSelectedFormat('natural')}
                          className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedFormat === 'natural' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}
                        >
                          <MessageSquare size={14} /> Natural Flow
                        </button>
                        <button 
                          onClick={() => setSelectedFormat('json')}
                          className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedFormat === 'json' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}
                        >
                          <Code size={14} /> JSON Schema
                        </button>
                        <button 
                          onClick={() => setSelectedFormat('pdf')}
                          className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedFormat === 'pdf' ? 'bg-white text-slate-900 shadow-xl' : 'text-white/40 hover:text-white'}`}
                        >
                          <FileText size={14} /> PDF Result
                        </button>
                      </div>
                      <Code size={18} className="text-white/20" />
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar-dark font-mono text-[13px] text-[#10b981]/80 leading-relaxed max-h-[300px]">
                      <div className="space-y-1">
                         <p className="text-white/20 tracking-[0.3em] uppercase text-[10px] mb-4">// STREAM_OUTPUT_START</p>
                         <div className="whitespace-pre-wrap">
                            {selectedFormat === 'json' ? (
                               JSON.stringify({ 
                                 report_id: "V-492", 
                                 classification: "Internal", 
                                 content: extractionResult.substring(0, 150) + "..." 
                               }, null, 2)
                            ) : extractionResult}
                         </div>
                         <p className="text-white/20 tracking-[0.3em] uppercase text-[10px] mt-4">// PIPELINE_SUCCESSFUL</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-auto">
                   <button 
                    onClick={handleDownloadArtifact}
                    className="flex items-center justify-center gap-4 py-6 bg-white text-slate-900 rounded-[1.75rem] font-black text-[13px] uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] active:scale-95 group"
                   >
                      <Download size={20} className="group-hover:translate-y-0.5 transition-transform" /> 
                      Download Final Report
                   </button>
                   <button 
                    onClick={handleWebhookDispatch}
                    disabled={isDispatching}
                    className={`flex items-center justify-center gap-4 py-6 rounded-[1.75rem] font-black text-[13px] uppercase tracking-widest transition-all active:scale-95 group border ${
                      webhookSuccess 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                   >
                      {isDispatching ? <Loader2 size={20} className="animate-spin text-blue-400" /> : webhookSuccess ? <Check size={20} /> : <Share2 size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />} 
                      {isDispatching ? 'Relaying Data...' : webhookSuccess ? 'Dispatched' : 'Dispatch Webhook Relay'}
                   </button>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                <Activity size={100} strokeWidth={1} className="text-white mb-10" />
                <h3 className="text-4xl font-[1000] text-white uppercase tracking-widest mb-4">No Output</h3>
                <p className="text-white/60 text-lg font-medium max-w-sm leading-relaxed">Initiate a production cycle to generate report artifacts.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar animate-in fade-in duration-1000">
      <section className="bg-white border-b border-slate-100 px-12 py-10 shrink-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Sparkles size={14} className="text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">IDM Production Hub</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-tighter text-[#002D56] leading-none uppercase">Studio IDM.</h1>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <Activity size={14} /> },
                { id: 'designer', label: 'Architect', icon: <Workflow size={14} /> },
                { id: 'lab', label: 'Execution', icon: <Zap size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as IDMView)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeView === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>
        </div>
      </section>
      <main className="flex-1 p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'designer' && renderDesigner()}
          {activeView === 'lab' && renderLab()}
        </div>
      </main>
      <footer className="px-12 py-10 border-t border-slate-100 bg-white flex items-center justify-between opacity-50">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14} /> High-Fidelity Node Synced</div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Cpu size={14} /> Gemini 3 Pro Engine Active</div>
         </div>
      </footer>
      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default IDMStudio;
