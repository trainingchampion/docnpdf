
import React, { useState } from 'react';
import { 
  X, ChevronDown, Undo2, Redo2, Printer, Bold, Italic, 
  Underline, Search, MoreVertical, Home, Table as TableIcon,
  Sparkles, Hash, FileSpreadsheet, Palette, ShieldAlert,
  Save, Loader2, Cloud, FileText, BookOpen, Download
} from 'lucide-react';

interface CellData {
  [key: string]: string;
}

interface SpreadsheetEditorProps {
  fileName: string;
  onClose: () => void;
  onSave: () => void;
  onExport?: (title: string, content?: string, base64?: string) => void;
  onOpenExport?: () => void;
}

const SpreadsheetEditor: React.FC<SpreadsheetEditorProps> = ({ fileName, onClose, onSave, onExport, onOpenExport }) => {
  const [cells, setCells] = useState<CellData>({ 'A1': 'Analysis Session v5' });
  const [activeCell, setActiveCell] = useState('A1');
  const [formulaValue, setFormulaValue] = useState(cells['A1'] || '');
  const [isSaving, setIsSaving] = useState(false);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const rows = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleManualSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 1000);
  };

  const handleExportInternal = () => {
    // Generate a textual representation of the grid for the reader
    let gridText = `Spreadsheet: ${fileName}\n\n`;
    Object.entries(cells).forEach(([cell, val]) => {
      gridText += `[${cell}]: ${val}\n`;
    });
    onExport?.(fileName, gridText);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-300 overflow-hidden text-[#3c4043] font-['Inter',_sans-serif]">
      
      {/* Excel-style Green Header */}
      <header className="h-16 bg-[#217346] flex items-center justify-between px-4 shrink-0 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2.5 hover:bg-white/10 rounded-full text-white transition-all mr-2 flex items-center justify-center min-w-[44px] min-h-[44px]"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#217346] shadow-sm">
            <FileSpreadsheet size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">{fileName}</h1>
              <span className="px-2 py-0.5 bg-white/10 text-white rounded-md text-[9px] font-black uppercase tracking-widest border border-white/10">Grid Studio</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60 mt-0.5">
               <span className="text-[9px] font-bold uppercase tracking-widest">Distributed Ledger System • 14ms Latency</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportInternal}
            className="flex items-center gap-3 px-6 py-2 bg-emerald-600 text-white rounded-md text-[11px] font-black uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-xl active:scale-95 border border-emerald-400"
          >
            <BookOpen size={14} /> Open in Reader
          </button>
          <button 
            onClick={onOpenExport}
            className="flex items-center gap-3 px-6 py-2 bg-white/10 text-white rounded-md text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/20 shadow-xl active:scale-95 border border-white/20"
          >
            <Download size={14} /> Export
          </button>
          <button 
            onClick={handleManualSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-2 bg-white text-[#217346] rounded-md text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 shadow-xl disabled:opacity-50 active:scale-95"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Commit to Vault
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
            className="p-2.5 hover:bg-rose-500/20 rounded-full text-white transition-all flex items-center justify-center min-w-[44px] min-h-[44px]"
            title="Close Editor"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Toolbar Layer */}
      <div className="h-11 bg-[#f3f3f3] border-b border-slate-200 flex items-center px-4 gap-1 overflow-x-auto no-scrollbar shrink-0">
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600"><Undo2 size={16} /></button>
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600"><Redo2 size={16} /></button>
        <div className="h-5 w-px bg-slate-300 mx-1" />
        <button className="p-1.5 hover:bg-black/5 rounded text-[#217346] font-black text-xs">A</button>
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600 font-bold text-xs">$</button>
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600 font-bold text-xs">%</button>
        <div className="h-5 w-px bg-slate-300 mx-1" />
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600"><Bold size={16} /></button>
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600"><Italic size={16} /></button>
        <button className="p-1.5 hover:bg-black/5 rounded text-slate-600"><Underline size={16} /></button>
        <div className="ml-auto flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Audit: </span>
           <div className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Formula Bar */}
      <div className="h-9 border-b border-slate-200 flex items-center px-2 gap-0 shrink-0 bg-white">
        <div className="min-w-[40px] h-full flex items-center justify-center text-xs font-bold text-slate-500 border-r border-slate-100 bg-slate-50/50">
          {activeCell}
        </div>
        <div className="flex items-center text-slate-400 italic font-serif text-lg px-3">fx</div>
        <input 
          type="text" 
          className="flex-1 h-full outline-none text-sm px-2 font-medium"
          value={formulaValue}
          onChange={(e) => {
             setFormulaValue(e.target.value);
             setCells(prev => ({ ...prev, [activeCell]: e.target.value }));
          }}
        />
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-[#e1e1e1]">
        <table className="border-collapse table-fixed w-full bg-white select-none">
          <thead>
            <tr className="h-6">
              <th className="w-10 bg-[#f8f9fa] border-r border-b border-slate-300 sticky top-0 left-0 z-30"></th>
              {columns.map(col => (
                <th key={col} className="w-28 bg-[#f8f9fa] border-r border-b border-slate-300 text-[11px] font-bold text-slate-500 uppercase sticky top-0 z-20">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row} className="h-6">
                <td className="bg-[#f8f9fa] border-r border-b border-slate-300 text-[10px] text-center font-bold text-slate-500 sticky left-0 z-20">{row}</td>
                {columns.map(col => {
                  const cellId = `${col}${row}`;
                  const isActive = activeCell === cellId;
                  return (
                    <td 
                      key={cellId}
                      onClick={() => {
                        setActiveCell(cellId);
                        setFormulaValue(cells[cellId] || '');
                      }}
                      className={`border-r border-b border-slate-200 p-0 relative h-6 cursor-cell`}
                    >
                      <div className={`w-full h-full px-2 text-[13px] flex items-center truncate ${isActive ? 'ring-2 ring-[#217346] ring-inset z-10 bg-emerald-50' : ''}`}>
                        {cells[cellId]}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
