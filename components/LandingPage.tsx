import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, Sparkles, ChevronDown, ChevronRight, ChevronLeft,
  ArrowRight, ShieldCheck, 
  Globe2, LayoutGrid,
  RefreshCw, SquarePen,
  GitMerge, Headphones,
  FileBox, Files, Database, Globe, FileSearch,
  Merge, Scissors, RotateCcw, Trash2, FileUp,
  Pen, StickyNote, Eye, ListOrdered, Crop,
  Eraser, Droplets, FormInput, ExternalLink,
  FileText, FileSpreadsheet, Presentation, Image as ImageIcon,
  Scan, FileSignature, PenTool, CheckCircle2,
  Phone, X, Rocket, Database as DatabaseIcon,
  Lock, Check, MessageCircle, BookOpen, Cpu, Users, Briefcase, ShieldAlert, Code,
  Building2, Play, Terminal, Activity,
  Clock,
  FileMinus, Repeat, FileEdit, Plus, Search, Star, MoreHorizontal, Key, MessageSquare, HelpCircle,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ShieldCheck as ShieldIcon,
  Mail,
  Palette,
  Wand2,
  GitCompare,
  Workflow,
  Edit3,
  Signature,
  Handshake,
  ClipboardCheck,
  Cloud,
  Underline,
  Layout,
  Layers
} from 'lucide-react';
import DemoVideoModal from './DemoVideoModal';
import PricingPage from './PricingPage';
import ResourcesHub from './ResourcesHub';
import SectionIllustration from './SectionIllustration';

interface LandingPageProps {
  onSignIn: (mode: 'login' | 'signup') => void;
  onAction: (msg: string) => void;
  onNavigate: (view: any) => void;
  themeColor?: string;
  activeView?: string;
  onResetView?: () => void;
}

const LogoIcon = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className} shrink-0`}>
    <div className="absolute w-[80%] h-[80%] bg-[#1A73E8] rounded-[20%] bottom-0 left-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[80%] h-[80%] bg-[#F9BC00] rounded-[20%] top-0 right-0 shadow-sm opacity-90"></div>
    <div className="absolute w-[45%] h-[45%] bg-[#EA4335] top-[27.5%] left-[27.5%] rounded-[15%] shadow-sm ring-2 ring-white/10"></div>
  </div>
);

const BrandLockup = ({ size = "text-2xl", iconSize = "w-9 h-9" }) => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <LogoIcon className={iconSize} />
    <span className={`font-extrabold tracking-tighter text-black dark:text-white ${size} relative z-10 flex items-center pt-2`}>
      doc<span className="font-bold opacity-85">npdf</span>
    </span>
  </div>
);

const SimpleSignMockup = ({ themeColor }: { themeColor: string }) => (
  <div className="relative w-full max-w-[480px] bg-white rounded-[3rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border border-slate-100 p-10 lg:p-14 overflow-hidden group/mockup animate-in zoom-in duration-1000">
    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/40 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    
    <div className="flex items-center justify-between mb-14 relative z-10">
      <div className="flex items-center gap-5">
        <div className="size-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
          <ShieldCheck size={32} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-1.5">Vault Node: X-82</p>
          <h4 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">Service Agreement</h4>
        </div>
      </div>
      <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Verified
      </div>
    </div>

    <div className="space-y-6 relative z-10 px-2 mb-16">
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Clause 4.2: Cryptographic Compliance</p>
      <div className="space-y-3">
        <p className="text-[13px] leading-relaxed text-slate-500 font-medium italic">
          "This agreement constitutes a legally binding node between the service provider and the organizational entity. 
          Upon execution, a SHA-256 hash is generated and distributed across the ledger..."
        </p>
        <div className="h-2 w-full bg-slate-50 rounded-full" />
        <div className="h-2 w-5/6 bg-slate-50 rounded-full" />
      </div>
    </div>

    <div className="mt-16 pt-12 border-t border-slate-100 relative z-10 px-4">
      <div className="grid grid-cols-2 gap-10">
         <div className="space-y-4">
            <p className="text-[9px] font-[1000] text-slate-400 uppercase tracking-widest">Authorized Node Representative</p>
            <div className="relative pb-2 border-b border-slate-200 h-16 flex items-end">
               <span className="font-['Dancing_Script',_cursive] text-4xl text-blue-900 transform -rotate-3 select-none">Tehila Rivera</span>
               <div className="absolute bottom-1 right-0 text-emerald-500">
                  <CheckCircle2 size={16} fill="currentColor" className="text-white" />
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-900 truncate">Alexande Rivera-Vazquez</p>
         </div>
         
         <div className="space-y-4 opacity-40 grayscale group-hover/mockup:opacity-100 group-hover/mockup:grayscale-0 transition-all duration-700">
            <p className="text-[9px] font-[1000] text-slate-400 uppercase tracking-widest">Distributed Ledger Witness</p>
            <div className="relative pb-2 border-b border-slate-100 h-16 flex items-end justify-center">
               <ShieldIcon size={32} className="text-blue-100" />
               <div className="absolute inset-0 flex items-center justify-center pt-2">
                 <span className="font-mono text-[8px] text-slate-300 font-bold">DIGITAL_STAMP_0x4F2</span>
               </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">NODE_SYSTEM_AUTO</p>
         </div>
      </div>

      <div className="mt-12 p-5 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-slate-400">
               <Clock size={16} />
            </div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Timestamp</p>
               <p className="text-[10px] font-bold text-slate-900">2025-05-24 | 14:22:04 UTC</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fidelity</p>
            <p className="text-[10px] font-bold text-emerald-600">99.98% SEALED</p>
         </div>
      </div>
      
      <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Authenticity Token: SHA-256 Enabled & Logged</p>
    </div>

    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
  </div>
);

const EliteSuiteCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
  illustration?: React.ReactNode;
  accentColor: string; 
  isEnterprise?: boolean;
  badgeText?: string;
  onClick?: () => void 
}> = ({ icon, title, description, features, illustration, accentColor, isEnterprise, badgeText, onClick }) => (
  <div 
    onClick={onClick} 
    className={`group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:scale-[1.03] transition-all duration-500 text-left flex flex-col h-full relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    style={{ '--accent': accentColor } as any}
  >
    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: accentColor }} />
    
    <div className="flex items-start justify-between mb-4 relative z-10">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg"
        style={{ backgroundColor: `${accentColor}10`, color: accentColor, boxShadow: `0 8px 20px -6px ${accentColor}40` }}
      >
        {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: 2 })}
      </div>
      <div className={`px-3 py-1 rounded-full border shadow-sm transition-colors ${isEnterprise ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}>
         <span className="text-[8px] font-[1000] uppercase tracking-widest">{badgeText || (isEnterprise ? 'Enterprise' : 'Module')}</span>
      </div>
    </div>
    
    {illustration && (
      <div className="mb-4 scale-[0.8] origin-center relative z-10 transition-transform duration-700 group-hover:scale-[0.85] flex items-center justify-center">
         {illustration}
      </div>
    )}

    <div className="relative z-10 flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[16px] font-[1000] text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{title}</h4>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-[12px] leading-relaxed font-medium mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">{description}</p>
      
      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
         {features.map((feat, i) => (
           <span key={i} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter group-hover:text-theme transition-colors border border-transparent group-hover:border-theme/10 whitespace-nowrap">
             {feat}
           </span>
         ))}
      </div>
    </div>
  </div>
);

const MiniToolItem: React.FC<{ icon: React.ReactNode; label: string; bgColor: string; textColor: string; isPro?: boolean; themeColor: string }> = ({ icon, label, bgColor, textColor, isPro, themeColor }) => {
  const isDefaultTheme = bgColor.includes('blue-600');
  
  return (
    <button className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group text-left w-full">
      <div 
        className={`w-10 h-10 ${isDefaultTheme ? '' : bgColor} ${isDefaultTheme ? 'text-white' : textColor} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}
        style={isDefaultTheme ? { backgroundColor: themeColor } : {}}
      >
        {React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 })}
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 truncate">{label}</span>
        {isPro && <Zap size={10} className="text-amber-500 fill-amber-400 shrink-0" />}
      </div>
    </button>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onAction, onNavigate, themeColor = '#2F00FF', activeView = 'landing', onResetView }) => {
  const [activeMenu, setActiveMenu] = useState<'products' | 'solutions' | 'resources' | 'enterprise' | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu: 'products' | 'solutions' | 'resources' | 'enterprise') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const renderMenuContent = () => {
    if (!activeMenu) return null;

    const sections: Record<string, { title: string; items: { label: string; icon: React.ReactNode; desc?: string; target?: any }[] }[]> = {
      products: [
        {
          title: "Intelligence Hub",
          items: [
            { label: "AI PDF Assistant", icon: <Sparkles size={16} />, desc: "Contextual document chat", target: 'dashboard' },
            { label: "Smart Reader", icon: <Headphones size={16} />, desc: "Immersive audio narration", target: 'smart-reader' },
            { label: "Exam Solver", icon: <ClipboardCheck size={16} />, desc: "Pedagogical node resolution", target: 'extract' },
            { label: "Studio IDM", icon: <Workflow size={16} />, desc: "Pipeline automation (Enterprise Product)", target: 'idm-studio' }
          ]
        },
        {
          title: "Creative Studio",
          items: [
            { label: "Intelligent Editor", icon: <Edit3 size={16} />, desc: "High-fidelity doc creation", target: 'vault' },
            { label: "e-Sign Studio", icon: <Signature size={16} />, desc: "Verified signing nodes", target: 'esign' },
            { label: "Drafting Hub", icon: <Wand2 size={16} />, desc: "AI-driven starting points", target: 'dashboard' }
          ]
        },
        {
          title: "Operations Hub",
          items: [
            { label: "Google Drive Sync", icon: <Cloud size={16} />, desc: "Seamless cloud asset link", target: 'vault' },
            { label: "Calendar Node", icon: <Calendar size={16} />, desc: "Deadline & event monitoring", target: 'esign' },
            { label: "Organize Hub", icon: <LayoutGrid size={16} />, desc: "Visual structure architect", target: 'organize-hub' }
          ]
        }
      ],
      solutions: [
        {
          title: "By Industry",
          items: [
            { label: "Real Estate", icon: <Building2 size={16} />, desc: "Property closing automation", target: 'solutions-hub' },
            { label: "Legal Services", icon: <Building2 size={16} />, desc: "Litigation discovery tools", target: 'solutions-hub' },
            { label: "Finance", icon: <Briefcase size={16} />, desc: "Audit-ready reporting", target: 'solutions-hub' }
          ]
        },
        {
          title: "By Department",
          items: [
            { label: "Human Resources", icon: <Users size={16} />, desc: "Seamless onboarding", target: 'solutions-hub' },
            { label: "Sales & Marketing", icon: <Zap size={16} />, desc: "Contract acceleration", target: 'solutions-hub' },
            { label: "Engineering", icon: <Code size={16} />, desc: "API document extraction", target: 'solutions-hub' }
          ]
        },
        {
          title: "Popular Workflows",
          items: [
            { label: "IDM Pipelines", icon: <Activity size={16} />, desc: "Custom document logic", target: 'idm-studio' },
            { label: "Asset Ingestion", icon: <FileUp size={16} />, desc: "Bulk processing nodes", target: 'idm-studio' }
          ]
        }
      ],
      resources: [
        {
          title: "Knowledge",
          items: [
            { label: "Help Center", icon: <HelpCircle size={16} />, target: 'help-center' },
            { label: "User Guides", icon: <BookOpen size={16} />, target: 'documentation' },
            { label: "Video Demos", icon: <Play size={16} />, target: 'documentation' }
          ]
        },
        {
          title: "Community",
          items: [
            { label: "Discussion Hub", icon: <MessageSquare size={16} />, target: 'community' },
            { label: "Discord Server", icon: <Globe2 size={16} />, target: 'community' },
            { label: "Product Blog", icon: <FileText size={16} />, target: 'community' }
          ]
        },
        {
          title: "Developers",
          items: [
            { label: "API Reference", icon: <Terminal size={16} />, target: 'api-reference' },
            { label: "SDK Download", icon: <FileUp size={16} />, target: 'api-reference' },
            { label: "System Status", icon: <Activity size={16} />, target: 'api-reference' }
          ]
        }
      ],
      enterprise: [
        {
          title: "Governance",
          items: [
            { label: "SSO & SCIM", icon: <Key size={16} />, desc: "Centralized user control", target: 'enterprise-admin' },
            { label: "Audit Logs", icon: <Activity size={16} />, desc: "Full compliance history", target: 'enterprise-admin' },
            { label: "Multi-Org", icon: <LayoutGrid size={16} />, desc: "Manage global branches", target: 'enterprise-admin' }
          ]
        },
        {
          title: "Enterprise Scaling",
          items: [
            { label: "Studio IDM", icon: <Workflow size={16} />, desc: "Workflow automation engine", target: 'idm-studio' },
            { label: "Dedicated GPU", icon: <Cpu size={16} />, desc: "Zero-queue processing", target: 'enterprise-admin' },
            { label: "Professional Services", icon: <Users size={16} />, target: 'enterprise-admin' }
          ]
        },
        {
          title: "Trust",
          items: [
            { label: "Compliance Center", icon: <ShieldCheck size={16} />, target: 'enterprise-admin' },
            { label: "Security Whitepaper", icon: <FileText size={16} />, target: 'enterprise-admin' }
          ]
        }
      ]
    };

    const currentSections = sections[activeMenu] || [];

    return (
      <div ref={menuRef} className="absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-500 overflow-hidden z-[200]">
        <div className="max-w-[1700px] mx-auto p-12 lg:p-16">
          <div className="grid grid-cols-4 gap-16">
            {currentSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 pb-3 border-b border-slate-50 dark:border-slate-800">{section.title}</h4>
                <div className="flex flex-col gap-2">
                  {section.items.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => { onNavigate(item.target || 'dashboard'); setActiveMenu(null); }}
                      className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-left"
                    >
                      <div 
                        className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white transition-all shadow-sm"
                      >
                         <div className="group-hover:text-white" style={{ color: activeMenu === 'products' ? themeColor : 'inherit' }}>{item.icon}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-theme transition-colors">{item.label}</p>
                        {item.desc && <p className="text-[11px] text-slate-400 font-medium truncate">{item.desc}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-10 flex flex-col justify-between border border-slate-100 dark:border-slate-800">
               <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Latest Update</h4>
                  <div className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
                    <div className="flex items-center gap-2 text-theme mb-2">
                       <Sparkles size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">DocnPDF v5.0</span>
                    </div>
                    <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug">The high-fidelity workspace for document intelligence is now operational.</p>
                  </div>
               </div>
               <button 
                onClick={() => { onNavigate('pricing'); setActiveMenu(null); }} 
                className="w-full py-4 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
               >
                  Explore Plans <ArrowRight size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeView === 'pricing') return <div className="animate-in fade-in zoom-in-95 duration-700"><PricingPage selectedCountry="United States" onCountryChange={() => {}} /></div>;
    if (['help-center', 'documentation', 'community', 'api-reference'].includes(activeView || '')) {
      return <div className="animate-in fade-in slide-in-from-bottom-4 duration-700"><ResourcesHub initialSection={activeView as any} /></div>;
    }

    return (
      <>
        <section className="relative py-24 px-8 overflow-hidden bg-white dark:bg-slate-950">
          <div className="max-w-[1700px] mx-auto w-full relative group p-10">
            <div className="relative z-10 pt-24 pb-32 overflow-hidden bg-gradient-to-br from-[#1a0066] via-[#002D56] to-[#020617] text-white rounded-[3.5rem] shadow-[0_60px_150px_-20px_rgba(0,45,86,0.6)] border border-white/5">
              <div className="max-w-7xl mx-auto px-8 text-center relative z-30">
                <h1 className="text-[64px] lg:text-[72px] font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  Everything you need <br /> to <span className="opacity-80 italic">reimagine.</span>
                </h1>
                <p className="text-blue-100/70 text-xl lg:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                  Send, sign and manage all your document intelligence in one place.
                </p>
                
                <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center bg-white rounded-lg p-1.5 overflow-hidden shadow-[0_0_8px_rgba(0,0,0,0.3)] group focus-within:ring-4 transition-all" style={{ '--tw-ring-color': `${themeColor}30` } as any}>
                        <input 
                          type="email" 
                          placeholder="name@company.com" 
                          className="flex-1 px-8 py-5 text-slate-900 font-bold text-lg outline-none placeholder:text-slate-300"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button 
                          onClick={() => onSignIn('signup')}
                          className="px-10 py-5 text-white rounded-md font-black text-sm uppercase tracking-widest hover:brightness-125 transition-all active:scale-95 whitespace-nowrap"
                          style={{ backgroundColor: themeColor }}
                        >
                          Get Started
                        </button>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-[11px] font-bold text-blue-200/50 uppercase tracking-widest">Studying for exams?</span>
                        <button 
                          onClick={() => onSignIn('signup')}
                          className="flex items-center gap-1.5 text-[11px] font-black text-indigo-300 hover:text-white transition-colors uppercase tracking-widest group/code"
                        >
                          <GraduationCap size={14} /> Redeem academic code <ArrowRight size={12} className="group-hover/code:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4">
                      <button onClick={() => onAction('Talk to Tehila initiated')} className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 group">
                        <Phone size={18} className="group-hover:rotate-12 transition-transform" /> Talk to Tehila
                      </button>
                      <button onClick={() => setIsDemoModalOpen(true)} className="flex items-center gap-3 px-10 py-5 text-blue-300 font-black text-sm uppercase tracking-widest hover:text-white transition-all group">
                        Watch Demo <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-0 w-[800px] h-[800px] blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20" style={{ backgroundColor: themeColor }} />
              <div className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none z-0 opacity-10" style={{ backgroundColor: themeColor }} />
            </div>

            <div className="absolute w-[95%] h-[95%] bg-[#F9BC00]/5 rounded-[3.5rem] top-0 right-0 -translate-y-10 translate-x-10 shadow-2xl border-2 border-[#F9BC00]/20 z-20 pointer-events-none" />
          </div>
        </section>

        <section className="py-32 px-8 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 flex justify-center lg:justify-start relative">
               <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full" />
               <SimpleSignMockup themeColor={themeColor} />
            </div>
            <div className="flex-1 space-y-10">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full">
                  <Signature size={16} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Secure Agreement Node</span>
               </div>
               <h2 className="text-6xl font-[1000] tracking-tighter text-[#002D56] dark:text-white leading-none">
                 The Studio for <br /> <span className="text-blue-600 italic">Signature Lifecycle.</span>
               </h2>
               <p className="text-slate-50 dark:text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
                 Manage requests, deadlines, and multi-party signing from a unified high-fidelity environment. Simplified for speed, secured for the enterprise.
               </p>
               <ul className="space-y-4">
                 {[
                   { icon: <Calendar size={18} />, label: 'Temporal Deadline Tracking' },
                   { icon: <Mail size={18} />, label: 'Automated Email Node Provisioning' },
                   { icon: <ShieldCheck size={18} />, label: 'Cryptographic Identity Verification' }
                 ].map(item => (
                   <li key={item.label} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest text-[11px]">
                     <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500">{item.icon}</div>
                     {item.label}
                   </li>
                 ))}
               </ul>
               <button 
                 onClick={() => onNavigate?.('esign')}
                 className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
               >
                 Launch E-Sign Studio
               </button>
            </div>
          </div>
        </section>

        <section className="py-32 px-8">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-[1000] tracking-tighter text-[#002D56] dark:text-white mb-4 uppercase">High-Fidelity Fleet.</h2>
              <p className="text-slate-400 text-xl font-medium">Modular document intelligence architecture for the modern organization.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <EliteSuiteCard 
                icon={<Cpu />} 
                accentColor="#4f46e5"
                title="Extract Hub" 
                description="Deconstruct documents with semantic precision. Map assets into structured data instantly."
                features={["Synthesis", "Data Mapping", "Quiz Gen"]}
                illustration={<SectionIllustration type="extract" themeColor="#4f46e5" />}
                onClick={() => onNavigate('extract')}
              />
              <EliteSuiteCard 
                icon={<RefreshCw />} 
                accentColor="#f43f5e"
                title="Convert Hub" 
                description="Industrial transformation node for 50+ formats. Bit-perfect layout fidelity."
                features={["Universal", "OCR Node", "Batch"]}
                illustration={<SectionIllustration type="convert" themeColor="#f43f5e" />}
                onClick={() => onNavigate('converter')}
              />
              <EliteSuiteCard 
                icon={<Layout />} 
                accentColor="#f97316"
                title="Creation Hub" 
                description="Build assets from zero. Use Word, Excel, and PPT clones with real-time AI assistance."
                features={["Intelligent", "Auto Sheets", "AI Co-pilot"]}
                illustration={<SectionIllustration type="native" themeColor="#f97316" />}
                onClick={() => onNavigate('vault')}
              />
              <EliteSuiteCard 
                icon={<Workflow />} 
                accentColor="#6366f1"
                title="Studio IDM" 
                isEnterprise={true}
                description="Design and deploy autonomous organizational document flows and pipelines."
                features={["Flow Architect", "Logic Node", "API Relay"]}
                illustration={<SectionIllustration type="workflow" themeColor="#6366f1" />}
                onClick={() => onNavigate('idm-studio')}
              />
              <EliteSuiteCard 
                icon={<Wand2 />} 
                accentColor="#14b8a6"
                title="Rewrite Studio" 
                description="Modulate document resonance and profissional professional frequency shifts."
                features={["Resonance", "Brand Sync", "Polisher"]}
                illustration={<SectionIllustration type="edit" themeColor="#14b8a6" />}
                onClick={() => onNavigate('tone-studio')}
              />
              <EliteSuiteCard 
                icon={<LayoutGrid />} 
                accentColor="#10b981"
                title="Organize Hub" 
                description="Architect asset structures. Merge, split, and reorder document nodes visually."
                features={["Architect", "Merge", "Audit"]}
                illustration={<SectionIllustration type="organize" themeColor="#10b981" />}
                onClick={() => onNavigate('organize-hub')}
              />
              <EliteSuiteCard 
                icon={<Signature />} 
                accentColor="#ec4899"
                title="e-Sign Hub" 
                description="Secure cryptographic signing ecosystem with temporal multi-party tracking."
                features={["Ledger", "Monitor", "Legal Trail"]}
                illustration={<SectionIllustration type="esign" themeColor="#ec4899" />}
                onClick={() => onNavigate('esign')}
              />
              <EliteSuiteCard 
                icon={<Lock />} 
                accentColor="#64748b"
                title="Security Hub" 
                description="Cryptographic protection. Flatten layers, enforce passwords, audit access nodes."
                features={["Vault Layer", "Flattening", "Audit Log"]}
                illustration={<SectionIllustration type="security" themeColor="#64748b" />}
                onClick={() => onNavigate('security-hub')}
              />
              <EliteSuiteCard 
                icon={<Terminal />} 
                accentColor="#06b6d4"
                title="Unified API" 
                badgeText="Developer"
                description="Expose document intelligence via RESTful endpoints directly into your architecture."
                features={["JSON Endpoints", "Webhook", "SDK"]}
                illustration={<SectionIllustration type="api" themeColor="#06b6d4" />}
                onClick={() => onNavigate('api-reference')}
              />
              <EliteSuiteCard 
                icon={<Scan />} 
                accentColor="#3b82f6"
                title="Scanner Node" 
                description="Digitize physical assets with neural-grade OCR and enhancement logic."
                features={["Mobile Scan", "AI Enhance", "OCR"]}
                illustration={<SectionIllustration type="scanner" themeColor="#3b82f6" />}
                onClick={() => onNavigate('scanner-hub')}
              />
            </div>
          </div>
        </section>

        <section className="pb-32 px-8">
          <div className="max-w-[1700px] mx-auto bg-slate-50/50 dark:bg-slate-900/50 rounded-[4rem] p-12 lg:p-24 border border-slate-100 dark:border-slate-800 shadow-inner">
            <div className="mb-20 text-center lg:text-left">
              <h2 className="text-4xl font-[1000] tracking-tighter text-[#002D56] dark:text-white mb-4">All Workspace Tools.</h2>
              <p className="text-slate-400 font-medium text-lg">Every utility you need to master your PDF ecosystem in one unified view.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-16 pb-16 border-b border-slate-100 dark:border-slate-800">
              <MiniToolItem themeColor={themeColor} icon={<FileMinus />} label="Compress PDF" bgColor="bg-red-50" textColor="text-red-500" />
              <MiniToolItem themeColor={themeColor} icon={<Repeat />} label="PDF Converter" bgColor="bg-red-50" textColor="text-red-500" />
              <MiniToolItem themeColor={themeColor} icon={<Zap />} label="AI PDF Assistant" bgColor="bg-blue-600" textColor="text-white" isPro />
              <MiniToolItem themeColor={themeColor} icon={<Sparkles />} label="Chat with PDF" bgColor="bg-blue-600" textColor="text-white" />
              <MiniToolItem themeColor={themeColor} icon={<Database />} label="AI PDF Summary" bgColor="bg-blue-600" textColor="text-white" />
              <MiniToolItem themeColor={themeColor} icon={<Globe />} label="Translate PDF" bgColor="bg-blue-600" textColor="text-white" />
              <MiniToolItem themeColor={themeColor} icon={<FileSearch />} label="AI Question Gen" bgColor="bg-blue-600" textColor="text-white" />
              <MiniToolItem themeColor={themeColor} icon={<Merge />} label="Merge PDF" bgColor="bg-indigo-50" textColor="text-indigo-600" />
              <MiniToolItem themeColor={themeColor} icon={<Scissors />} label="Split PDF" bgColor="bg-indigo-50" textColor="text-indigo-600" />
              <MiniToolItem themeColor={themeColor} icon={<RotateCcw />} label="Rotate PDF" bgColor="bg-indigo-50" textColor="text-indigo-600" />
              <MiniToolItem themeColor={themeColor} icon={<Trash2 />} label="Delete PDF Pages" bgColor="bg-indigo-50" textColor="text-indigo-600" />
              <MiniToolItem themeColor={themeColor} icon={<FileUp />} label="Extract PDF Pages" bgColor="bg-indigo-50" textColor="text-indigo-600" />
              <MiniToolItem themeColor={themeColor} icon={<LayoutGrid />} label="Organize PDF" bgColor="bg-indigo-50" textColor="text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16 lg:gap-24">
              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10 border-b border-slate-100 dark:border-slate-800 pb-4">View & Edit</h5>
                <div className="space-y-2">
                  <MiniToolItem themeColor={themeColor} icon={<Pen />} label="Edit PDF" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<StickyNote />} label="PDF Annotator" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Eye />} label="PDF Reader" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<ListOrdered />} label="Number Pages" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Crop />} label="Crop PDF" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Underline />} label="Redact PDF" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Droplets />} label="Watermark PDF" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<FormInput />} label="PDF Form Filler" bgColor="bg-teal-50" textColor="text-teal-600" />
                  <MiniToolItem themeColor={themeColor} icon={<ExternalLink />} label="Share PDF" bgColor="bg-teal-50" textColor="text-teal-600" />
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10 border-b border-slate-100 dark:border-slate-800 pb-4">Convert From PDF</h5>
                <div className="space-y-2">
                  <MiniToolItem themeColor={themeColor} icon={<FileText />} label="PDF to Word" bgColor="bg-blue-50" textColor="text-blue-600" />
                  <MiniToolItem themeColor={themeColor} icon={<FileSpreadsheet />} label="PDF to Excel" bgColor="bg-emerald-50" textColor="text-emerald-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Presentation />} label="PDF to PPT" bgColor="bg-orange-50" textColor="text-orange-600" />
                  <MiniToolItem themeColor={themeColor} icon={<ImageIcon />} label="PDF to JPG" bgColor="bg-orange-50" textColor="text-orange-600" />
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10 border-b border-slate-100 dark:border-slate-800 pb-4">Convert To PDF</h5>
                <div className="space-y-2">
                  <MiniToolItem themeColor={themeColor} icon={<FileText />} label="Word to PDF" bgColor="bg-blue-50" textColor="text-blue-600" />
                  <MiniToolItem themeColor={themeColor} icon={<FileSpreadsheet />} label="Excel to PDF" bgColor="bg-emerald-50" textColor="text-emerald-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Presentation />} label="PPT to PDF" bgColor="bg-orange-50" textColor="text-orange-600" />
                  <MiniToolItem themeColor={themeColor} icon={<ImageIcon />} label="JPG to PDF" bgColor="bg-orange-50" textColor="text-orange-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Scan />} label="PDF OCR" bgColor="bg-red-500" textColor="text-white" />
                </div>
              </div>

              <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10 border-b border-slate-100 dark:border-slate-800 pb-4">e-Sign Hub</h5>
                <div className="space-y-2">
                  <MiniToolItem themeColor={themeColor} icon={<Signature />} label="Sign PDF" bgColor="bg-pink-50" textColor="text-pink-600" />
                  <MiniToolItem themeColor={themeColor} icon={<Handshake />} label="Request Signatures" bgColor="bg-yellow-50" textColor="text-yellow-600" isPro />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8 bg-white dark:bg-slate-950 overflow-hidden relative">
          <div className="max-w-[1700px] mx-auto w-full relative group p-10">
            <div className="bg-[#002D56] dark:bg-slate-900 text-white rounded-[2.5rem] p-12 lg:p-24 text-center relative z-10 shadow-[0_60px_150px_-20px_rgba(0,45,86,0.6)] border border-white/10">
              <div className="relative z-30">
                <div className="absolute top-0 right-0 w-full h-full blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-10" style={{ backgroundColor: themeColor }} />
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
                   <Sparkles size={12} className="text-blue-300" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-100">Final Leap</span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-4 leading-tight max-w-3xl mx-auto">Ready to master your document ecosystem?</h2>
                <p className="text-blue-100/60 text-base lg:text-lg font-medium mb-12 max-w-xl mx-auto leading-relaxed">Join thousands of professionals using DocnPDF for high-fidelity operations.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => onSignIn('signup')} 
                    className="w-full sm:w-auto px-12 py-5 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:brightness-125 transition-all shadow-xl active:scale-95"
                    style={{ backgroundColor: themeColor }}
                  >
                    Start Free Session
                  </button>
                  <button onClick={() => onNavigate?.('pricing')} className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                    View Pricing
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute w-[95%] h-[95%] bg-[#F9BC00]/5 rounded-[3.5rem] top-0 right-0 -translate-y-10 translate-x-10 shadow-2xl border-2 border-[#F9BC00]/20 z-20 pointer-events-none" />
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col animate-in fade-in duration-700 font-['Inter',_sans-serif]">
      
      <div className="bg-[#f8fafc] dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-3 px-8 text-center">
        <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-theme transition-colors" onClick={() => onNavigate?.('pricing')}>
          *Offer ends Friday. Save up to 44% with annual plans plus an additional 30% off with promo code <span className="font-bold text-theme">NEWYME2026</span> <ArrowRight size={14} className="inline ml-1" />
        </p>
      </div>

      <nav className="h-20 sticky top-0 bg-white dark:bg-slate-950 z-[100] flex items-center border-b border-slate-50 dark:border-slate-900">
        <div className="max-w-[1700px] mx-auto w-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div onClick={onResetView}>
              <BrandLockup />
            </div>
            
            <div className="hidden xl:flex items-center gap-1">
              {['products', 'solutions', 'resources', 'enterprise'].map((m) => (
                <button 
                  key={m}
                  onClick={() => toggleMenu(m as any)} 
                  className={`flex items-center gap-1 px-4 py-2 text-[14px] font-bold transition-all rounded-xl capitalize ${activeMenu === m ? 'text-theme' : 'text-slate-600 dark:text-slate-400 hover:text-theme'}`}
                >
                  {m} <ChevronDown size={14} className={`transition-transform duration-300 opacity-40 ${activeMenu === m ? 'rotate-180 opacity-100' : ''}`} />
                </button>
              ))}
              <button 
                onClick={() => onNavigate('pricing')} 
                className={`px-4 py-2 text-[14px] font-bold transition-all ${activeView === 'pricing' ? 'text-theme' : 'text-slate-600 dark:text-slate-400 hover:text-theme'}`}
              >
                Plans & Pricing
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <button onClick={() => onAction('Contact Sales initiated')} className="text-theme text-[13px] font-black hover:opacity-70 transition-colors uppercase tracking-widest hidden lg:block">Contact Sales</button>
            <button onClick={() => onSignIn('login')} className="text-theme text-[13px] font-black hover:opacity-70 transition-colors uppercase tracking-widest hidden lg:block">Log In</button>
            <button 
              onClick={() => onSignIn('signup')} 
              className="px-10 py-3.5 text-white rounded-lg text-[13px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
            >
              Try For Free
            </button>
          </div>
        </div>

        {renderMenuContent()}
      </nav>

      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-20 mb-20">
            <div className="max-w-sm">
              <div onClick={onResetView}><BrandLockup size="text-2xl" /></div>
              <p className="mt-8 text-slate-400 font-medium leading-relaxed">
                The high-fidelity workspace for document intelligence and enterprise automation. Securely processing millions of documents globally.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Workspace</h5>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                  <button onClick={() => onNavigate?.('dashboard')} className="text-left hover:text-theme">All Tools</button>
                  <button onClick={() => onNavigate?.('vault')} className="text-left hover:text-theme">Document Vault</button>
                  <button onClick={() => onNavigate?.('esign')} className="text-left hover:text-theme">e-Sign Studio</button>
                  <button onClick={() => onNavigate?.('idm-studio')} className="text-left hover:text-theme">IDM Flow</button>
                </div>
              </div>
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Company</h5>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                  <button onClick={() => onNavigate?.('solutions-hub')} className="text-left hover:text-theme">Solutions</button>
                  <button onClick={() => onNavigate?.('pricing')} className="text-left hover:text-theme">Pricing</button>
                  <button onClick={() => onNavigate?.('enterprise-admin')} className="text-left hover:text-theme">Enterprise</button>
                  <button onClick={() => onNavigate?.('enterprise-admin')} className="text-left hover:text-theme">Security</button>
                </div>
              </div>
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Support</h5>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                  <button onClick={() => onNavigate?.('help-center')} className="text-left hover:text-theme">Help Center</button>
                  <button onClick={() => onNavigate?.('documentation')} className="text-left hover:text-theme">API Docs</button>
                  <button onClick={() => onNavigate?.('community')} className="text-left hover:text-theme">Community</button>
                  <button onClick={() => onNavigate?.('api-reference')} className="text-left hover:text-theme">Status</button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-bold text-slate-400">© 2025 SSLabs. All rights reserved.</p>
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> SOC2 Verified
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={14} className="text-theme" /> AES-256 Encrypted
              </div>
            </div>
          </div>
        </div>
      </footer>

      <DemoVideoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
};

export default LandingPage;