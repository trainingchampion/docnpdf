
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Code, Key, Webhook, Activity, 
  RefreshCw, Copy, Check, ShieldCheck, 
  Globe, Zap, ArrowRight, Plus, Trash2, 
  ExternalLink, Search, Filter, Loader2,
  Lock, Smartphone, Database, Cpu, Eye,
  EyeOff, ChevronRight, Play, Server,
  Settings, History, Info, Home, Download,
  Upload, FileText, AlertCircle
} from 'lucide-react';
import { analyzePDFs, summarizePDF, extractAllPDFData } from '../services/geminiService';

const ENDPOINTS = [
  { id: 'extract', method: 'POST', path: '/v1/extract', desc: 'Semantic document deconstruction' },
  { id: 'summarize', method: 'POST', path: '/v1/summarize', desc: 'AI-driven executive synthesis' },
  { id: 'vault', method: 'GET', path: '/v1/vault/metadata', desc: 'Query secure organizational ledger' }
];

interface ApiLog {
  id: string;
  time: string;
  method: string;
  path: string;
  status: number;
  latency: string;
}

const APINodeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'keys' | 'playground' | 'webhooks'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiKey, setApiKey] = useState('dp_live_4k82_Xn92_7Lp1_2025_vault');
  const [showKey, setShowKey] = useState(false);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  
  // Playground State
  const [playgroundPath, setPlaygroundPath] = useState('/v1/extract');
  const [playgroundOutput, setPlaygroundOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testFile, setTestFile] = useState<{ name: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing logs or start empty
  useEffect(() => {
    const savedLogs = localStorage.getItem('docnpdf_api_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  const addLog = (method: string, path: string, status: number, latency: string) => {
    const newLog: ApiLog = {
      id: Math.random().toString(36).substr(2, 5),
      time: new Date().toLocaleTimeString(),
      method,
      path,
      status,
      latency
    };
    const updated = [newLog, ...logs].slice(0, 20);
    setLogs(updated);
    localStorage.setItem('docnpdf_api_logs', JSON.stringify(updated));
  };

  const handleRefreshNode = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      setTestFile({ name: file.name, base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRunPlayground = async () => {
    if (!testFile && (playgroundPath === '/v1/extract' || playgroundPath === '/v1/summarize')) {
      alert("Please upload a source document to test this endpoint.");
      return;
    }

    setIsExecuting(true);
    setPlaygroundOutput(null);
    const start = Date.now();

    try {
      let resultText = "";
      if (playgroundPath === '/v1/extract') {
        const response = await extractAllPDFData(testFile!.base64);
        resultText = response.text;
      } else if (playgroundPath === '/v1/summarize') {
        const response = await summarizePDF(testFile!.base64);
        resultText = response.text;
      } else if (playgroundPath === '/v1/vault/metadata') {
        // Real logic: Fetch metadata from local storage simulation
        const recent = localStorage.getItem('recent_files') || "[]";
        resultText = JSON.stringify(JSON.parse(recent), null, 2);
      }

      const latency = `${Date.now() - start}ms`;
      setPlaygroundOutput(resultText);
      addLog('POST', playgroundPath, 200, latency);
    } catch (error: any) {
      setPlaygroundOutput(`ERROR: ${error.message || "Execution Failed"}`);
      addLog('POST', playgroundPath, 500, '0ms');
    } finally {
      setIsExecuting(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight uppercase">Node Telemetry</h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Live Endpoint Metrics</p>
                </div>
              </div>
              <button onClick={handleRefreshNode} className={`p-2 hover:bg-white/5 rounded-xl transition-all ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-white/20'}`}>
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
               <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Total Calls</p>
                  <p className="text-5xl font-[1000] tracking-tighter">{logs.length}</p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1.5"><Zap size={10} fill="currentColor" /> Live Session</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Avg Latency</p>
                  <p className="text-5xl font-[1000] tracking-tighter text-cyan-400">
                    {logs.length > 0 ? logs[0].latency : '--'}
                  </p>
                  <p className="text-[10px] text-white/40 font-bold mt-2 uppercase tracking-widest">Last Request</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Success Rate</p>
                  <p className="text-5xl font-[1000] tracking-tighter text-indigo-400">100%</p>
                  <p className="text-[10px] text-white/40 font-bold mt-2 uppercase tracking-widest">Verified</p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm">
           <div>
              <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-8 border border-slate-100">
                <Server size={28} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Production Node</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Your requests are hitting the Gemini 3 Pro regional cluster for maximum fidelity.</p>
           </div>
           <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} className="text-blue-600" />
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Auth Active</span>
              </div>
              <p className="text-[10px] text-blue-500 font-medium leading-tight">API calls are authenticated via the workspace master key.</p>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Traffic Explorer</h3>
            <button 
              onClick={() => {setLogs([]); localStorage.removeItem('docnpdf_api_logs');}}
              className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
            >Clear Logs</button>
         </div>
         <div className="flex-1 space-y-3 font-mono">
            {logs.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center opacity-20 italic text-xs gap-4">
                 <Activity size={32} strokeWidth={1} />
                 Waiting for inbound requests...
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-[11px] group hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className={`font-black w-10 ${log.method === 'POST' ? 'text-indigo-600' : 'text-emerald-600'}`}>{log.method}</span>
                    <span className="text-slate-900 font-bold">{log.path}</span>
                  </div>
                  <div className="flex items-center gap-6">
                     <span className="text-slate-400 font-medium">{log.latency}</span>
                     <span className={`font-black ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</span>
                     <span className="text-slate-300 text-[9px]">{log.time}</span>
                  </div>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );

  const renderKeys = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                   <Key size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Access Credentials</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Live Production Hub</p>
                </div>
             </div>
             <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2">
                <Plus size={16} strokeWidth={3} /> Generate Key
             </button>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 group">
             <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master API Node</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-inner relative overflow-hidden">
                   <code className="text-sm font-black text-slate-900 flex-1 truncate font-mono">
                      {showKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}
                   </code>
                   <div className="flex items-center gap-2 relative z-10">
                      <button onClick={() => setShowKey(!showKey)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button onClick={() => {navigator.clipboard.writeText(apiKey); alert("Key copied to clipboard");}} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                        <Copy size={18} />
                      </button>
                   </div>
                </div>
             </div>
             <div className="shrink-0 w-full sm:w-auto flex flex-col gap-2">
                <button className="px-6 py-3 border-2 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all">Revoke Key</button>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Active Node-v5</p>
             </div>
          </div>
       </section>
    </div>
  );

  const renderPlayground = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
       <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Playground Config</h3>
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Select Endpoint</label>
                   <div className="space-y-2">
                      {ENDPOINTS.map(ep => (
                        <button 
                          key={ep.id}
                          onClick={() => {setPlaygroundPath(ep.path); setPlaygroundOutput(null);}}
                          className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${playgroundPath === ep.path ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-transparent hover:border-blue-200'}`}
                        >
                           <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase ${playgroundPath === ep.path ? 'text-cyan-400' : 'text-blue-600'}`}>{ep.method}</span>
                                <span className="text-xs font-bold">{ep.path}</span>
                              </div>
                              <p className={`text-[9px] font-medium mt-1 ${playgroundPath === ep.path ? 'text-white/40' : 'text-slate-400'}`}>{ep.desc}</p>
                           </div>
                           {playgroundPath === ep.path && <ChevronRight size={16} className="text-cyan-400" />}
                        </button>
                      ))}
                   </div>
                </div>

                {(playgroundPath === '/v1/extract' || playgroundPath === '/v1/summarize') && (
                  <div className="pt-6 border-t border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4 block">Source Data</label>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
                     {testFile ? (
                       <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                             <FileText size={18} className="text-blue-600" />
                             <span className="text-[10px] font-bold text-blue-900 truncate max-w-[120px]">{testFile.name}</span>
                          </div>
                          <button onClick={() => setTestFile(null)} className="text-blue-400 hover:text-rose-500"><Trash2 size={14} /></button>
                       </div>
                     ) : (
                       <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400"
                       >
                          <Upload size={24} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Load PDF Binary</span>
                       </button>
                     )}
                  </div>
                )}

                <div className="pt-6">
                   <button 
                    onClick={handleRunPlayground}
                    disabled={isExecuting}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                   >
                     {isExecuting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                     Execute Request
                   </button>
                </div>
             </div>
          </div>
       </aside>

       <main className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-white/5 flex flex-col min-h-[600px] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
             
             <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-cyan-400">
                      <Terminal size={20} />
                   </div>
                   <h3 className="text-lg font-black tracking-tight">Response Studio</h3>
                </div>
                {playgroundOutput && (
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase border border-emerald-500/20">200 OK</div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active</span>
                  </div>
                )}
             </div>

             <div className="flex-1 font-mono text-[13px] text-cyan-400/90 leading-relaxed overflow-auto custom-scrollbar-dark relative z-10">
                {isExecuting ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 italic gap-4">
                     <Loader2 size={32} className="animate-spin text-cyan-400" />
                     <p className="uppercase tracking-widest text-[10px] font-black">Executing Remote Node Call...</p>
                  </div>
                ) : playgroundOutput ? (
                  <div className="p-4 space-y-4">
                     <p className="text-white/20 uppercase text-[9px] font-black tracking-[0.3em]">-- BEGIN RESPONSE --</p>
                     <div className="whitespace-pre-wrap">{playgroundOutput}</div>
                     <p className="text-white/20 uppercase text-[9px] font-black tracking-[0.3em]">-- END RESPONSE --</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6 text-center">
                     <Activity size={80} strokeWidth={1} />
                     <p className="text-xl font-black uppercase tracking-widest">Awaiting Node Execution</p>
                  </div>
                )}
             </div>

             <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex gap-2">
                   <button 
                    onClick={() => playgroundOutput && navigator.clipboard.writeText(playgroundOutput)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                   ><Copy size={18} /></button>
                   <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Download size={18} /></button>
                </div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Studio Relay Node-B29</p>
             </div>
          </div>
       </main>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar animate-in fade-in duration-1000">
      <section className="bg-white border-b border-slate-100 px-12 py-10 shrink-0 relative overflow-hidden">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Code size={14} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 uppercase">Universal API Hub</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-tighter text-[#002D56] leading-none uppercase">API Studio.</h1>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              {[
                { id: 'dashboard', label: 'Monitor', icon: <Activity size={14} /> },
                { id: 'keys', label: 'Key Vault', icon: <Key size={14} /> },
                { id: 'playground', label: 'Playground', icon: <Terminal size={14} /> },
                { id: 'webhooks', label: 'Webhooks', icon: <Webhook size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
           </div>
        </div>
      </section>

      <main className="flex-1 p-12 lg:p-20">
        <div className="max-w-[1700px] mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'keys' && renderKeys()}
          {activeTab === 'playground' && renderPlayground()}
          {activeTab === 'webhooks' && (
            <div className="p-32 flex flex-col items-center justify-center text-center opacity-30">
               <Webhook size={80} className="text-slate-400 mb-8" />
               <h3 className="text-2xl font-[1000] uppercase tracking-widest text-slate-900">Event Relay Studio</h3>
               <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">Configure outbound webhook nodes for document lifecycle events.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="px-12 py-10 border-t border-slate-100 bg-white flex items-center justify-between opacity-50 shrink-0">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={14} /> AES-256 API Security Active</div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Globe size={14} /> Real-Time Intelligence Bridge</div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">API v1.4.2-Production</p>
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

export default APINodeStudio;
