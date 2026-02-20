
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FileText, Search, Plus, MoreVertical, 
  Eye, Edit3, Trash2, Download, 
  Filter, ArrowUpDown, ChevronRight,
  Clock, HardDrive, ShieldCheck,
  LayoutGrid, List, Star, Share2, MoreHorizontal,
  FileSpreadsheet, Presentation, Upload, Sparkles, ChevronDown,
  X, MousePointer2, Zap
} from 'lucide-react';

interface FileRecord {
  id: string;
  name: string;
  size: number;
  timestamp: Date;
  base64: string;
}

interface DocumentsPageProps {
  files: FileRecord[];
  onDelete: (id: string) => void;
  onView: (file: FileRecord) => void;
  onEdit: (file: FileRecord) => void;
  onUpload: () => void;
  onCreateBlank: (type: 'doc' | 'sheet' | 'slide', name?: string) => void;
  onOpenTemplates: () => void;
}

const Logo = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const DocumentsPage: React.FC<DocumentsPageProps> = ({ files, onDelete, onView, onEdit, onUpload, onCreateBlank, onOpenTemplates }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'starred'>('all');
  const [isCreationHubOpen, setIsCreationHubOpen] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {filteredFiles.map((file, idx) => (
        <div 
          key={file.id} 
          style={{ animationDelay: `${idx * 50}ms` }}
          className="stagger-item group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-blue-400 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all cursor-default"
        >
          <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center p-8 group-hover:bg-blue-50/30 transition-colors">
            <div className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col p-4 gap-2 transform group-hover:-translate-y-2 group-hover:rotate-1 transition-transform duration-500">
               <div className="h-2 w-full bg-slate-100 rounded-full" />
               <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
               <div className="h-2 w-full bg-slate-100 rounded-full" />
               <div className="mt-auto flex justify-between items-center">
                 <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center">
                   <FileText size={16} />
                 </div>
                 <div className="flex gap-1">
                   <div className="w-4 h-1 bg-slate-100 rounded-full" />
                   <div className="w-4 h-1 bg-slate-100 rounded-full" />
                 </div>
               </div>
            </div>
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
               <button onClick={() => onView(file)} className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90"><Eye size={18} /></button>
               <button onClick={() => onEdit(file)} className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90"><Edit3 size={18} /></button>
               <button onClick={() => onDelete(file.id)} className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110 active:scale-90"><Trash2 size={18} /></button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-[13px] font-bold text-slate-900 truncate pr-4">{file.name}</h4>
              <button className="text-slate-300 hover:text-amber-400 transition-colors"><Star size={14} /></button>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>{formatSize(file.size)}</span>
              <span>{new Date(file.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Name</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modified</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredFiles.map((file) => (
            <tr key={file.id} className="group hover:bg-slate-50/80 transition-all cursor-default">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900 truncate max-w-[300px]">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">PDF • Private Vault</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="text-[13px] font-bold text-slate-600">{formatSize(file.size)}</span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                   <Clock size={14} className="text-slate-300" />
                   <span className="text-[13px] font-bold text-slate-600">{new Date(file.timestamp).toLocaleDateString()}</span>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full" /> Ready
                </span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                  <button onClick={() => onView(file)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View"><Eye size={18} /></button>
                  <button onClick={() => onEdit(file)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit3 size={18} /></button>
                  <button onClick={() => onDelete(file.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition-all"><MoreHorizontal size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-500 relative">
      {/* Creation Hub Modal Overlay */}
      {isCreationHubOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setIsCreationHubOpen(false)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-[3rem] shadow-[0_60px_120px_-24px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 ease-out flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-900">Initiate Build</h3>
               </div>
               <button 
                onClick={() => setIsCreationHubOpen(false)}
                className="p-2.5 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-900"
               >
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4 bg-white">
              <button 
                onClick={() => { onCreateBlank('doc'); setIsCreationHubOpen(false); }}
                className="flex flex-col items-start p-6 bg-blue-50/40 hover:bg-blue-600 group transition-all rounded-[2rem] border border-blue-100/50 hover:border-blue-500 active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-blue-600 transition-colors shadow-xl shadow-blue-600/10">
                  <FileText size={22} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-[1000] text-slate-900 group-hover:text-white transition-colors mb-1 uppercase tracking-tight">Intelligent Doc</p>
                <p className="text-[10px] text-slate-500 group-hover:text-white/60 transition-colors font-bold uppercase tracking-widest leading-none">Smart Workspace</p>
              </button>

              <button 
                onClick={() => { onCreateBlank('sheet'); setIsCreationHubOpen(false); }}
                className="flex flex-col items-start p-6 bg-emerald-50/40 hover:bg-emerald-600 group transition-all rounded-[2rem] border border-blue-100/50 hover:border-blue-500 active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-emerald-600 transition-colors shadow-xl shadow-emerald-600/10">
                  <FileSpreadsheet size={22} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-[1000] text-slate-900 group-hover:text-white transition-colors mb-1 uppercase tracking-tight">Analysis Sheet</p>
                <p className="text-[10px] text-slate-500 group-hover:text-white/60 transition-colors font-bold uppercase tracking-widest leading-none">Data Intelligence</p>
              </button>

              <button 
                onClick={() => { onCreateBlank('slide'); setIsCreationHubOpen(false); }}
                className="flex flex-col items-start p-6 bg-orange-50/40 hover:bg-orange-600 group transition-all rounded-[2rem] border border-orange-100/50 hover:border-orange-500 active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-orange-600 transition-colors shadow-xl shadow-orange-600/10">
                  <Presentation size={22} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-[1000] text-slate-900 group-hover:text-white transition-colors mb-1 uppercase tracking-tight">Presentation</p>
                <p className="text-[10px] text-slate-500 group-hover:text-white/60 transition-colors font-bold uppercase tracking-widest leading-none">Creative Studio</p>
              </button>

              <button 
                onClick={() => { onUpload(); setIsCreationHubOpen(false); }}
                className="flex flex-col items-start p-6 bg-slate-100/50 hover:bg-slate-900 group transition-all rounded-[2rem] border border-slate-200/50 hover:border-slate-950 active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-slate-900 transition-colors shadow-xl">
                  <Upload size={22} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-[1000] text-slate-900 group-hover:text-white transition-colors mb-1 uppercase tracking-tight">Upload Asset</p>
                <p className="text-[10px] text-slate-500 group-hover:text-white/60 transition-colors font-bold uppercase tracking-widest leading-none">From Local Device</p>
              </button>
            </div>

            <button 
              onClick={() => { onOpenTemplates(); setIsCreationHubOpen(false); }}
              className="w-full px-10 py-6 bg-blue-600 flex items-center justify-between group cursor-pointer hover:bg-blue-700 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                   <Zap size={16} fill="white" />
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Templates Gallery</span>
              </div>
              <ChevronRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0f172a] text-white px-12 py-12 shrink-0 relative z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Logo className="w-12 h-12" />
              <h1 className="text-5xl font-[1000] tracking-tighter leading-none pt-2">Document Vault</h1>
            </div>
            <p className="text-slate-400 font-medium text-lg max-w-xl">Managed repository for your high-fidelity documents and AI intelligence assets.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-8 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem]">
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Consumption</span>
                 <div className="flex items-center gap-3">
                   <HardDrive size={14} className="text-blue-400" />
                   <span className="text-[13px] font-[1000]">{formatSize(files.reduce((a, b) => a + b.size, 0))}</span>
                 </div>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Security</span>
                 <div className="flex items-center gap-2 text-emerald-400">
                   <ShieldCheck size={14} />
                   <span className="text-[13px] font-[1000]">Active</span>
                 </div>
               </div>
            </div>

            <button 
              onClick={() => setIsCreationHubOpen(true)}
              className="flex items-center gap-3 px-10 py-5 rounded-[1.75rem] font-black text-[14px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 group bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700"
            >
              <Plus size={20} strokeWidth={3} />
              New Document
              <ChevronDown size={16} className="ml-2 opacity-50 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100 px-12 py-6 shrink-0 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative flex-1 max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Find in vault..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent border focus:bg-white focus:border-blue-400 rounded-2xl text-base font-bold outline-none transition-all shadow-inner"
              />
            </div>
            <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
               {['All', 'Starred', 'Shared'].map(tab => (
                 <button 
                  key={tab}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filterType === tab.toLowerCase() ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  onClick={() => setFilterType(tab.toLowerCase() as any)}
                 >
                   {tab}
                 </button>
               ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
               <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <LayoutGrid size={20} />
               </button>
               <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List size={20} />
               </button>
             </div>
             <button className="flex items-center gap-2 px-5 py-3.5 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-200">
               <ArrowUpDown size={16} /> Sort
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-12 relative z-0">
        <div className="max-w-7xl mx-auto">
          {filteredFiles.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-40 bg-white border-2 border-dashed border-slate-200 rounded-[4rem] group hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-500">
               <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                 <FileText size={56} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
               </div>
               <h3 className="text-2xl font-[1000] text-slate-900 uppercase tracking-[0.2em] mb-4">Vault is Empty</h3>
               <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-10">Your enterprise documents, AI extractions, and shared assets will be secured here.</p>
               <button 
                onClick={() => setIsCreationHubOpen(true)}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
               >
                 Initiate Studio Session
               </button>
            </div>
          ) : (
            viewMode === 'list' ? renderListView() : renderGridView()
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
