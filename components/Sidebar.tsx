
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, Files, History, Settings as GearIcon, Zap, 
  Briefcase, ChevronRight, Headphones, LogOut, 
  Sparkles, BookOpen, CreditCard, HelpCircle, Shield, CheckCircle2,
  HardDrive, Workflow, ChevronDown, ChevronUp, Maximize2, Minimize2,
  Lock, Users, ShieldCheck, GraduationCap, Compass, Layers,
  Terminal, Bookmark, Activity, ArrowRight,
  PanelLeftClose, PanelLeftOpen,
  Scan, Code
} from 'lucide-react';
import { BrandingConfig, AccountTier } from '../App';

interface SidebarProps {
  onAction: (message: string) => void;
  currentView: string;
  isAuthenticated?: boolean;
  themeColor?: string;
  branding?: BrandingConfig;
  accountTier?: AccountTier;
  studentPassActive?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const LogoIcon = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  onAction, 
  currentView, 
  isAuthenticated, 
  themeColor = '#2F00FF', 
  branding, 
  accountTier = 'free',
  studentPassActive = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [isTierCardCollapsed, setIsTierCardCollapsed] = useState(true);

  const isAcademic = branding?.companyName === 'Academic Workspace';

  const menuSpaces = isAcademic ? [
    {
      id: 'intelligence',
      title: 'Tools & AI',
      icon: <Sparkles size={14} className="text-indigo-500" />,
      items: [
        { id: 'dashboard', label: 'All Tools', icon: <LayoutGrid size={18} />, pro: false },
        { id: 'smart-reader', label: 'Smart Reader', icon: <Headphones size={18} />, pro: false },
        { id: 'scanner-hub', label: 'Scanner Hub', icon: <Scan size={18} />, pro: false },
      ]
    },
    {
      id: 'assets',
      title: 'My Files',
      icon: <Layers size={14} className="text-blue-500" />,
      items: [
        { id: 'vault', label: 'Student Vault', icon: <Files size={18} />, pro: false },
        { id: 'library', label: 'Templates', icon: <BookOpen size={18} />, pro: false },
      ]
    },
    {
      id: 'collab',
      title: 'Teamwork',
      icon: <Activity size={14} className="text-emerald-500" />,
      items: [
        { id: 'history', label: 'History', icon: <History size={18} />, pro: false },
        { id: 'team', label: 'Teammates', icon: <Users size={18} />, pro: true },
      ]
    }
  ] : [
    {
      id: 'main',
      title: 'Navigation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} />, pro: false },
        { id: 'vault', label: 'Document Vault', icon: <Files size={18} />, pro: false },
        { id: 'library', label: 'Templates', icon: <BookOpen size={18} />, pro: false },
        { id: 'smart-reader', label: 'Smart Reader', icon: <Headphones size={18} />, pro: false },
        { id: 'scanner-hub', label: 'Scanner Hub', icon: <Scan size={18} />, pro: false },
        { id: 'history', label: 'History', icon: <History size={18} />, pro: false },
        { id: 'team', label: 'Collaboration', icon: <Briefcase size={18} />, pro: true },
        { id: 'idm-studio', label: 'Workflows', icon: <Workflow size={18} />, pro: true },
        { id: 'api-node', label: 'API Management', icon: <Terminal size={18} />, pro: true },
        { id: 'compare', label: 'Compare Files', icon: <ShieldCheck size={18} />, pro: true },
        { id: 'enterprise-admin', label: 'Admin Panel', icon: <Shield size={18} />, pro: 'enterprise' },
      ]
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : (isAcademic ? 'w-[290px]' : 'w-64')} bg-slate-50/50 border-r border-slate-100 flex flex-col hidden lg:flex relative z-40 transition-all duration-300 overflow-hidden`}>
      <div className={`p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        
        <div className={`flex items-center justify-between mb-12 ${isCollapsed ? 'flex-col gap-6' : 'pl-2'}`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onAction('Navigated to dashboard')}>
            <LogoIcon className={isCollapsed ? "w-8 h-8" : "w-10 h-10"} />
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="font-extrabold text-2xl tracking-tighter leading-none text-black">
                  doc<span className="font-bold opacity-85">npdf</span>
                </span>
                {isAcademic ? (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: themeColor }}>Student Hub</span>
                  </div>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] mt-2 opacity-50" style={{ color: themeColor }}>Personal Workspace</span>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={onToggleCollapse}
            className={`p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-all active:scale-90 ${isCollapsed ? '' : 'ml-auto'}`}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className="space-y-12 flex-1">
          {menuSpaces.map((space, sIdx) => (
            <div key={space.id} className="space-y-5">
              {!isCollapsed && isAcademic && (
                <div className="flex items-center justify-between px-2 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                      {space.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{space.title}</span>
                  </div>
                </div>
              )}
              
              <nav className={`space-y-2 ${!isCollapsed && isAcademic ? 'p-3 bg-white/40 rounded-[2rem] border border-slate-200/50 shadow-inner shadow-slate-100' : ''}`}>
                {space.items.map(item => {
                  const isActive = currentView === item.id;
                  const isLocked = item.pro && (
                    (item.pro === true && accountTier === 'free' && !studentPassActive) || 
                    (item.pro === 'enterprise' && accountTier !== 'enterprise')
                  );

                  return (
                    <button
                      key={item.id}
                      onClick={() => onAction(`Navigated to ${item.id}`)}
                      style={isActive ? { borderColor: `${themeColor}30`, boxShadow: `0 12px 24px -12px ${themeColor}40` } : {}}
                      className={`w-full flex items-center justify-between transition-all duration-500 group ${
                        isCollapsed ? 'justify-center p-3 rounded-xl hover:bg-white' : 
                        (isAcademic ? (isActive ? 'px-6 py-4 rounded-[1.5rem] bg-white border-2 border-slate-100 shadow-xl scale-[1.02]' : 'px-6 py-4 rounded-[1.5rem] hover:bg-white/80 hover:translate-x-1') :
                        (isActive ? 'px-4 py-3 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100' : 'px-4 py-3 rounded-2xl hover:bg-white/50'))
                      } ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} style={isActive ? { color: themeColor } : {}}>
                          {item.icon}
                        </div>
                        {!isCollapsed && (
                          <span className={`text-[13px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-70'} ${isLocked ? 'opacity-30' : ''}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && isLocked && (
                        <Lock size={12} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 space-y-6 bg-gradient-to-t from-slate-100/50 to-transparent shrink-0 ${isCollapsed ? 'items-center' : ''}`}>
        
        <div className="space-y-1">
          <button 
            onClick={() => onAction('Navigated to settings')}
            style={currentView === 'settings' ? { color: themeColor, borderColor: `${themeColor}20` } : {}}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-4 px-6 py-4'} rounded-[1.5rem] text-[13px] font-black uppercase tracking-tight transition-all active:scale-95 group ${
              currentView === 'settings' 
              ? 'bg-white shadow-xl border-2' 
              : 'text-slate-400 hover:text-slate-900 hover:bg-white/60'
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <GearIcon size={18} className={currentView === 'settings' ? '' : 'text-slate-400 group-hover:text-slate-900 group-hover:rotate-90 transition-transform duration-500'} style={currentView === 'settings' ? { color: themeColor } : {}} />
            {!isCollapsed && 'My Settings'}
          </button>

          {isAuthenticated && (
            <button 
              onClick={() => onAction('Sign Out')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-4 px-6 py-4'} rounded-[1.5rem] text-[13px] font-black uppercase tracking-tight text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group`}
              title={isCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1 duration-300" />
              {!isCollapsed && 'Sign Out'}
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {isAuthenticated && (accountTier !== 'free' || studentPassActive) ? (
              <div className={`${isTierCardCollapsed ? 'p-4' : 'p-8'} bg-[#0f172a] rounded-[2.5rem] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] cursor-default border border-slate-800 transition-all duration-700`}>
                <div className="absolute top-6 right-6 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsTierCardCollapsed(!isTierCardCollapsed); }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all bg-white/5 border border-white/5"
                  >
                    {isTierCardCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
                
                <div className="relative z-10">
                  {isTierCardCollapsed ? (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-white/5">
                        {studentPassActive ? <GraduationCap size={18} className="text-indigo-400" /> : accountTier === 'enterprise' ? <ShieldCheck size={18} className="text-emerald-400" /> : <Zap size={18} className="text-blue-400" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                          {studentPassActive ? 'Student' : accountTier === 'enterprise' ? 'Enterprise' : 'Pro Member'}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Active</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            {studentPassActive ? <GraduationCap size={20} className="text-indigo-400" /> : accountTier === 'enterprise' ? <ShieldCheck size={20} className="text-emerald-400" /> : <Shield size={20} className="text-blue-400" />}
                         </div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">SECURE ACCOUNT</p>
                      </div>
                      <h4 className="text-2xl font-[1000] leading-none text-white mb-3">
                        {studentPassActive ? 'Student Lab' : accountTier === 'enterprise' ? 'Admin Access' : 'Pro Member'}
                      </h4>
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">AI Enabled</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-8">
                         <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2 opacity-50">USAGE</span>
                            <span className="text-xl font-[1000] text-white leading-none">{studentPassActive ? '∞' : accountTier === 'enterprise' ? '∞' : '500'}</span>
                         </div>
                         <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2 opacity-50">SPACE</span>
                            <span className="text-xl font-[1000] text-white leading-none">{studentPassActive ? '10G' : '20G'}</span>
                         </div>
                      </div>

                      <button onClick={() => onAction('Manage Subscription')} className="w-full py-5 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-xl active:scale-[0.98]">
                        Manage Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${isTierCardCollapsed ? 'p-4' : 'p-10'} bg-[#0f172a] rounded-[3rem] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] cursor-pointer border border-slate-800 transition-all duration-700`} onClick={() => onAction('Upgrade plan')}>
                <div className="absolute top-6 right-6 z-20">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setIsTierCardCollapsed(!isTierCardCollapsed); }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all bg-white/5 border border-white/5"
                  >
                    {isTierCardCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                <div className="relative z-10 text-center">
                  {isTierCardCollapsed ? (
                    <div className="flex items-center justify-center gap-3">
                      <Zap size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Free Plan</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-6">
                        <Sparkles size={24} className="text-indigo-400" />
                      </div>
                      <h4 className="text-xl font-1000 leading-tight text-white mb-8">
                        Unlock <br/><span className="text-indigo-400 italic">Smart Features</span>
                      </h4>
                      <button className="flex items-center gap-3 text-[11px] font-black uppercase transition-all tracking-[0.25em] text-white hover:opacity-80 bg-blue-600 px-8 py-4 rounded-xl w-full justify-center shadow-2xl shadow-blue-500/20">
                        GET STARTED <ArrowRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
