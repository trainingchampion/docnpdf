import React from 'react';
import { 
  FileMinus, 
  Repeat, 
  Merge, 
  FileEdit, 
  Signature, 
  Handshake, 
  BookOpen, 
  Search,
  Bell,
  Users,
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { TOOLS } from '../constants';
import { PDFTool, ViewType } from '../types';
import { BrandingConfig, AccountTier } from '../App';

interface HeaderProps {
  onAction: (message: string) => void;
  onSearch: (term: string) => void;
  onToolSelect: (tool: PDFTool) => void;
  onNavigate?: (view: ViewType, config?: any) => void;
  onCollaborate?: () => void;
  currentView: string;
  themeColor: string;
  isAuthenticated?: boolean;
  branding?: BrandingConfig;
  accountTier?: AccountTier;
}

const LogoIcon = ({ className = "w-4 h-4" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ 
  onAction, 
  onSearch, 
  onToolSelect, 
  onNavigate, 
  onCollaborate,
  currentView,
  themeColor,
  isAuthenticated,
  branding,
  accountTier
}) => {
  const utilityTools = [
    { id: 'compress-pdf', icon: <FileMinus size={16} />, label: 'Compress' },
    { id: 'pdf-converter', icon: <Repeat size={16} />, label: 'Convert' },
    { id: 'merge-pdf', icon: <Merge size={16} />, label: 'Merge' },
    { id: 'edit-pdf', icon: <FileEdit size={16} />, label: 'Edit' },
    { id: 'esign', icon: <Signature size={16} />, label: 'Sign' },
    { id: 'request-sigs', icon: <Handshake size={16} />, label: 'Request' },
  ];

  return (
    <header className="h-14 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[100] flex items-center px-6 transition-colors">
      <div className="max-w-[1700px] mx-auto w-full flex items-center justify-between">
        
        {/* Left: Utility Bar */}
        <nav className="flex items-center gap-0.5 xl:gap-2">
          {/* Always show core brand logo */}
          <div className="flex items-center gap-2 mr-6 border-r border-slate-100 dark:border-slate-800 pr-6">
             <LogoIcon className="w-6 h-6" />
             <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter pt-1">
               doc<span className="opacity-60">npdf</span>
             </span>
             {branding?.isCustom && (
               <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest whitespace-nowrap opacity-60">
                    {branding.companyName}
                  </span>
               </div>
             )}
          </div>

          {utilityTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === 'esign' || tool.id === 'request-sigs') {
                  onNavigate?.('esign' as any);
                } else {
                  const actualTool = TOOLS.find(t => t.id === tool.id);
                  if (actualTool) onToolSelect(actualTool);
                }
              }}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
            >
              <span className="text-[#94a3b8] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {tool.icon}
              </span>
              <span className="text-[11px] font-[800] text-[#94a3b8] uppercase tracking-[0.08em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                {tool.label}
              </span>
            </button>
          ))}
          
          <div className="h-4 w-px bg-slate-100 dark:bg-slate-800 mx-2" />

          {/* Core Navigation Shortcuts */}
          <button
            onClick={() => onNavigate?.('library')}
            style={currentView === 'library' ? { backgroundColor: `${themeColor}10`, color: themeColor } : {}}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${currentView === 'library' ? '' : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-[#94a3b8] hover:text-slate-900 dark:hover:text-white'}`}
          >
            <BookOpen size={16} />
            <span className="text-[11px] font-[800] uppercase tracking-[0.08em]">Templates</span>
          </button>
        </nav>

        {/* Right: Collaborate, Search & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Collaborate Button */}
          <button 
            onClick={onCollaborate}
            style={{ backgroundColor: themeColor }}
            className="flex items-center gap-3 px-4 py-1.5 text-white rounded-full transition-all shadow-lg active:scale-95 group"
          >
            <div className="flex -space-x-2">
              <img className="w-5 h-5 rounded-full border-2 transition-colors" style={{ borderColor: themeColor }} src="https://picsum.photos/seed/a/40/40" alt="Avatar" />
              <img className="w-5 h-5 rounded-full border-2 transition-colors" style={{ borderColor: themeColor }} src="https://picsum.photos/seed/b/40/40" alt="Avatar" />
              <div className="w-5 h-5 rounded-full border-2 bg-white/20 flex items-center justify-center text-[8px] font-black transition-colors" style={{ borderColor: themeColor }}>+2</div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Collaborate
            </span>
          </button>

          <div className="h-4 w-px bg-slate-100 dark:bg-slate-800" />

          <div className="relative group hidden 2xl:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-900 border-transparent border focus:bg-white dark:focus:bg-slate-800 focus:border-slate-200 dark:focus:border-slate-700 rounded-lg text-[11px] font-bold outline-none w-40 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">
                  {accountTier === 'enterprise' ? 'Global Admin' : accountTier === 'pro' ? 'Pro Member' : 'Free User'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  {accountTier === 'free' ? (
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">Free Plan</span>
                  ) : accountTier === 'pro' ? (
                    <>
                      <Zap size={10} className="text-blue-500 fill-blue-500" />
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Professional</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Enterprise</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <button 
              onClick={() => onNavigate?.('settings', { tab: 'appearance' })}
              style={currentView === 'settings' ? { color: themeColor, backgroundColor: `${themeColor}10` } : {}}
              className={`p-2 rounded-lg transition-all ${currentView === 'settings' ? '' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => onNavigate?.('settings', { tab: 'notifications' })}
              className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-800" />
            </button>
            <div 
              className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform overflow-hidden ml-1 relative"
              onClick={() => onNavigate?.('settings', { tab: 'profile' })}
            >
              <img src="https://picsum.photos/seed/doc-user/100/100" alt="Avatar" className="w-full h-full object-cover" />
              {isAuthenticated && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${accountTier === 'free' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;