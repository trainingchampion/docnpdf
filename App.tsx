
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolItem from './components/ToolItem';
import AIModal from './components/AIModal';
import GenericToolModal from './components/GenericToolModal';
import IngestionZone from './components/IngestionZone';
import DocumentReader from './components/DocumentReader';
import DocumentsPage from './components/DocumentsPage';
import SettingsPage from './components/SettingsPage';
import ResourcesHub from './components/ResourcesHub';
import PricingPage from './components/PricingPage';
import Toast from './components/Toast';
import LiveCallOverlay from './components/LiveCallOverlay';
import LandingPage from './components/LandingPage';
import AuthPage, { AuthPersona } from './components/AuthPage';
import UpgradeModal from './components/UpgradeModal';
import TemplateGallery from './components/TemplateGallery';
import SmartReaderPage from './components/SmartReaderPage';
import TeamPortal from './components/TeamPortal';
import IDMStudio from './components/IDMStudio';
import EnterpriseConsole from './components/EnterpriseConsole';
import CompareStudio from './components/CompareStudio';
import DocEditor from './components/DocEditor';
import SpreadsheetEditor from './components/SpreadsheetEditor';
import SlideEditor from './components/SlideEditor';
import SignDashboard from './components/SignDashboard';
import CompressDashboard from './components/CompressDashboard';
import ConverterDashboard from './components/ConverterDashboard';
import ExtractDashboard from './components/ExtractDashboard';
import OrganizeDashboard from './components/OrganizeDashboard';
import ViewEditDashboard from './components/ViewEditDashboard';
import QuizStudio from './components/QuizStudio';
import TranslationStudio from './components/TranslationStudio';
import ToneStudio from './components/ToneStudio';
import ExtractStudio from './components/ExtractStudio';
import OrganizeStudio from './components/OrganizeStudio';
import SecurityDashboard from './components/SecurityDashboard';
import ScannerDashboard from './components/ScannerDashboard';
import ScannerStudio from './components/ScannerStudio';
import APINodeStudio from './components/APINodeStudio';
import ExportModal, { ExportFormat } from './components/ExportModal';
import DevelopmentModal from './components/DevelopmentModal';

import { CATEGORIES, TOOLS } from './constants';
import { PDFTool, ViewType, WorkspaceTab, TextBlock } from './types';
import { 
  LayoutGrid, 
  List, 
  Zap, 
  Sparkles,
  ShieldCheck,
  X,
  FileText,
  GraduationCap,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
  Users,
  Workflow,
  GitCompare,
  Shield,
  ExternalLink,
  ShieldAlert,
  Globe,
  Database,
  Building2,
  Layout,
  Languages,
  Activity,
  ClipboardCheck,
  ChevronRight,
  FileSearch,
  BookOpen,
  RefreshCw,
  Palette,
  Wand2,
  Table as TableIcon,
  Presentation,
  Image as ImageIcon,
  Merge,
  Scissors,
  RotateCcw,
  Edit3,
  Eye,
  StickyNote,
  Scan,
  Camera,
  Smartphone,
  Key,
  ExternalLink as LinkIcon,
  Terminal
} from 'lucide-react';

interface RecentFile {
  id: string;
  name: string;
  size: number;
  base64: string;
  timestamp: Date;
  toolId: string;
}

const WorkspaceFooter: React.FC<{ 
  themeColor: string; 
  onNavigate: (view: string) => void;
  onOverlay: (type: 'pricing' | 'help') => void;
}> = ({ themeColor, onNavigate, onOverlay }) => (
  <footer className="mt-20 py-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-10 opacity-60 hover:opacity-100 transition-opacity">
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
      <button onClick={() => onOverlay('pricing')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Plans & Pricing</button>
      <button onClick={() => onOverlay('help')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</button>
      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</button>
      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">API Docs</button>
    </div>
    <div className="flex items-center gap-10">
       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
         <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption
       </div>
       <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
         <Globe size={14} /> Cloud Sync Active
       </div>
    </div>
    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© 2025 DocnPDF Studio v5.4</p>
  </footer>
);

const FeatureGate: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  requiredTier: 'pro' | 'enterprise';
  onUpgrade: () => void;
  persona: AuthPersona;
}> = ({ title, description, icon, requiredTier, onUpgrade, persona }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-950 animate-in fade-in zoom-in-95 duration-500 h-full relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/5 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#002D56 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

    <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-16 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] relative z-10">
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-slate-300 shadow-inner group">
         <div className="group-hover:scale-110 transition-transform duration-500">
           {React.cloneElement(icon as React.ReactElement, { size: 48, strokeWidth: 1.5 })}
         </div>
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-full mb-8">
        <Lock size={14} className="text-amber-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Tier Restricted
        </span>
      </div>
      
      <h2 className="text-5xl font-[1000] tracking-tighter text-slate-900 dark:text-white mb-6 leading-none">
        Unlock {title}.
      </h2>
      
      <p className="text-slate-50 dark:text-slate-400 text-lg font-medium leading-relaxed mb-12">
        {description} This feature is reserved for Student, Professional, and Enterprise tiers.
      </p>

      {persona === 'student' || persona === 'teacher' ? (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-[2rem] p-8 mb-10 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles size={48} className="text-indigo-600" />
          </div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <GraduationCap size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-[11px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest">Student Access</h4>
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed relative z-10">
            Students can unlock the entire high-fidelity suite using an <b>Academic Pass</b>.
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-10 text-sm text-slate-500 text-left border border-slate-100 dark:border-slate-700">
          This feature is part of the <span className="font-black text-slate-900 dark:text-white uppercase">{requiredTier}</span> workspace.
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button 
          onClick={onUpgrade}
          className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
        >
          Explore Plans <ArrowRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

export type InterfaceMode = 'light' | 'dark' | 'system' | 'midnight' | 'sepia' | 'ocean' | 'contrast';
export type AccountTier = 'free' | 'pro' | 'enterprise';

export interface BrandingConfig {
  isCustom: boolean;
  companyName: string;
  primaryColor: string;
  logoUrl?: string;
}

export interface StudentPassData {
  isActive: boolean;
  expiryDate: number | null;
}

const App: React.FC = () => {
  const [keySelected, setKeySelected] = useState<boolean>(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountTier, setAccountTier] = useState<AccountTier>('free');
  const [authPersona, setAuthPersona] = useState<AuthPersona>(() => {
    return (localStorage.getItem('docnpdf_persona') as AuthPersona) || 'personal';
  });
  const [authView, setAuthView] = useState<'login' | 'signup' | null>(null);
  const [publicView, setPublicView] = useState<ViewType | 'landing' | string>('landing');
  
  const [tabs, setTabs] = useState<WorkspaceTab[]>([{ id: 'dashboard', title: 'Dashboard', type: 'dashboard' }]);
  const [activeTabId, setActiveTabId] = useState('dashboard');
  
  const [themeColor, setThemeColor] = useState('#2F00FF'); 
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('light');
  const [uiScaling, setUiScaling] = useState<'compact' | 'standard' | 'spacious'>('standard');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [utilityCreditUsed, setUtilityCreditUsed] = useState<boolean>(() => {
    return localStorage.getItem('docnpdf_utility_credit_used') === 'true';
  });

  const [studentPass, setStudentPass] = useState<StudentPassData>(() => {
    const saved = localStorage.getItem('docnpdf_student_pass');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expiryDate && data.expiryDate > Date.now()) {
        return data;
      }
    }
    return { isActive: false, expiryDate: null };
  });

  const [branding, setBranding] = useState<BrandingConfig>({
    isCustom: false,
    companyName: 'Doc and PDF Studio',
    primaryColor: '#2F00FF',
  });

  const [selectedTool, setSelectedTool] = useState<PDFTool | null>(null);
  
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isExtractStudioOpen, setIsExtractStudioOpen] = useState(false);
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState('This Feature');
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeOverlayView, setActiveOverlayView] = useState<'pricing' | 'help' | null>(null);
  
  const [exportModalConfig, setExportModalConfig] = useState<{ isOpen: boolean; fileName: string; sourceType: 'doc' | 'sheet' | 'slide' | 'pdf' }>({
    isOpen: false,
    fileName: '',
    sourceType: 'doc'
  });

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIngestion, setShowIngestion] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState<{ file: File; base64: string } | null>(null);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    const checkApiKey = async () => {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setKeySelected(hasKey);
    };
    checkApiKey();

    const handleReauth = () => setKeySelected(false);
    window.addEventListener('aistudio:reauth', handleReauth);
    return () => window.removeEventListener('aistudio:reauth', handleReauth);
  }, []);

  useEffect(() => {
    localStorage.setItem('docnpdf_student_pass', JSON.stringify(studentPass));
  }, [studentPass]);

  useEffect(() => {
    localStorage.setItem('docnpdf_utility_credit_used', utilityCreditUsed.toString());
  }, [utilityCreditUsed]);

  useEffect(() => {
    const root = window.document.documentElement;
    const activeTheme = branding.isCustom ? branding.primaryColor : themeColor;
    root.style.setProperty('--theme-color', activeTheme);
    root.classList.remove('dark', 'mode-midnight', 'mode-sepia', 'mode-ocean', 'mode-contrast');
    let effectiveMode = interfaceMode;
    if (interfaceMode === 'system') {
      effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (effectiveMode === 'dark') root.classList.add('dark');
    else if (effectiveMode !== 'light') {
      root.classList.add(`mode-${effectiveMode}`);
      if (['midnight', 'ocean', 'contrast'].includes(effectiveMode)) root.classList.add('dark');
    }
  }, [interfaceMode, themeColor, branding]);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId) || tabs[0], [tabs, activeTabId]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isAcademicPersona = authPersona === 'student' || authPersona === 'teacher';
      if (isAcademicPersona) {
        if (!searchQuery && ['enterprise-admin', 'idm-studio', 'request-sigs', 'api-node'].includes(tool.id)) return false;
      } else if (authPersona === 'professional' || authPersona === 'enterprise') {
        if (!searchQuery && ['s4', 's6'].includes(tool.id)) return false;
      }
      return matchesSearch;
    });
  }, [searchQuery, authPersona]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleLandingAction = (msg: string) => {
    if (msg === 'Talk to Tehila initiated' || msg === 'Contact Sales initiated') {
      setIsCallActive(true);
    } else {
      showToast(msg);
    }
  };

  const handlePersonaChange = (newPersona: AuthPersona) => {
    setAuthPersona(newPersona);
    localStorage.setItem('docnpdf_persona', newPersona);
    
    if (newPersona === 'student' || newPersona === 'teacher') {
      const academicTheme = newPersona === 'teacher' ? '#10b981' : '#4f46e5';
      setThemeColor(academicTheme);
      setBranding({ isCustom: true, companyName: 'Academic Workspace', primaryColor: academicTheme });
      showToast('Environment: Switched to Student Workspace');
    } else {
      const industrialTheme = newPersona === 'enterprise' ? '#135bec' : '#2F00FF';
      setThemeColor(industrialTheme);
      setBranding({ isCustom: newPersona === 'enterprise', companyName: newPersona === 'enterprise' ? 'Enterprise Workspace' : 'Doc and PDF Studio', primaryColor: industrialTheme });
      showToast('Environment: Switched to Professional Workspace');
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setKeySelected(true);
  };

  const addTab = (tab: Omit<WorkspaceTab, 'id'>) => {
    const existingTab = tabs.find(t => t.type === tab.type && (tab.type === 'dashboard' ? true : t.title === tab.title));
    if (existingTab) {
      setTabs(prev => prev.map(t => t.id === existingTab.id ? { ...t, initialConfig: tab.initialConfig } : t));
      setActiveTabId(existingTab.id);
      return;
    }
    const id = Math.random().toString(36).substr(2, 9);
    setTabs(prev => [...prev, { ...tab, id }]);
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    if (id === 'dashboard') return;
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  };

  const handleStudy = (text: string, originalBase64?: string) => {
    addTab({ 
      title: 'Study Session', 
      type: 'reader', 
      textContent: text,
      fileData: originalBase64 ? { file: null as any, base64: originalBase64 } : undefined 
    });
    setIsAIModalOpen(false);
    setIsExtractStudioOpen(false);
    setSelectedTool(null);
  };

  const handleToolClick = (tool: PDFTool) => {
    if (!isAuthenticated) {
      setIsDevModalOpen(true);
      return;
    }

    const isPro = accountTier !== 'free' || studentPass.isActive;
    const coreUtilityTools = ['Compress', 'Convert Hub', 'Organize Hub', 'View & Edit Hub', 'e-Sign Hub'];
    const isUtility = coreUtilityTools.includes(tool.category);

    if (!isPro) {
      if (!isUtility) {
        setUpgradeTrigger(tool.name);
        setIsUpgradeModalOpen(true);
        return;
      }
      if (utilityCreditUsed) {
        setUpgradeTrigger(`${tool.name} (Credit Exhausted)`);
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    if (tool.id === 'compress-pdf') { handleNavigate('compress'); return; }
    if (tool.category === 'Convert Hub' || tool.id === 'pdf-converter') { handleNavigate('converter'); return; }
    if (tool.category === 'Organize Hub' || tool.id === 'organize-pdf') { handleNavigate('organize-hub'); return; }
    if (tool.category === 'View & Edit Hub' || tool.id === 'edit-pdf') { handleNavigate('view-edit-hub'); return; }
    if (tool.category === 'e-Sign Hub' || tool.id === 'sign-pdf') { handleNavigate('esign'); return; }
    if (tool.category === 'Security Hub') { handleNavigate('security-hub'); return; }
    if (tool.category === 'Scan' || tool.id === 'pdf-scanner') { handleNavigate('scanner-hub'); return; }
    if (tool.id === 'summarizer' || tool.id === 'question-solver' || tool.id === 'ai-assistant') { setSelectedTool(tool); setShowIngestion(true); return; }

    const extractTools = ['chat-pdf', 'translate', 'q-gen'];
    if (extractTools.includes(tool.id)) { handleNavigate('extract'); return; }

    setSelectedTool(tool);
    setShowIngestion(true);
  };

  const handleIngestComplete = (file: File, base64: string) => {
    setShowIngestion(false);
    const fileData = { file, base64 };
    setUploadedFileData(fileData);

    const nameLower = file.name.toLowerCase();

    if (accountTier === 'free' && !studentPass.isActive && selectedTool) {
      const coreUtilityTools = ['Compress', 'Convert Hub', 'Organize Hub', 'View & Edit Hub', 'e-Sign Hub'];
      if (coreUtilityTools.includes(selectedTool.category)) {
        setUtilityCreditUsed(true);
        showToast('Utilized your 1-time Free Credit.');
      }
    }

    if (selectedTool) {
      if (selectedTool.id === 'reader') {
        addTab({ title: file.name, type: 'reader', fileData });
      } else if (selectedTool.id === 'summarizer' || selectedTool.id === 'question-solver' || selectedTool.id === 'ai-assistant') {
        setIsExtractStudioOpen(true);
      } else if (selectedTool.category === 'Organize Hub') {
        addTab({ title: 'Organize Session', type: 'organize-studio', fileData });
      } else if (selectedTool.functional) {
        setIsAIModalOpen(true);
      } else {
        setIsGenericModalOpen(true);
      }
    } else {
      if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.csv')) {
        addTab({ title: file.name, type: 'sheet-editor', fileData });
      } else if (nameLower.endsWith('.pptx') || nameLower.endsWith('.ppt')) {
        addTab({ title: file.name, type: 'slide-editor', fileData });
      } else if (nameLower.endsWith('.docx') || nameLower.endsWith('.doc')) {
        addTab({ title: file.name, type: 'doc-editor', fileData });
      } else {
        addTab({ title: file.name, type: 'reader', fileData });
      }
    }

    setRecentFiles(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      base64,
      timestamp: new Date(),
      toolId: selectedTool?.id || 'upload'
    }, ...prev].slice(0, 20));
  };

  const handleNavigate = (view: ViewType | string, config?: any) => {
    if (!isAuthenticated) {
      if (['pricing', 'help-center', 'documentation', 'api-reference'].includes(view)) {
        setPublicView(view as ViewType);
        return;
      }
      setIsDevModalOpen(true);
      return;
    }

    const isPro = accountTier !== 'free' || studentPass.isActive;
    
    if (!isPro) {
      const proViews = [
        'idm-studio', 'enterprise-admin', 'compare', 
        'extract', 'quiz-studio', 'translation-studio', 
        'tone-studio', 'security-hub', 'scanner-hub', 'api-node'
      ];
      if (proViews.includes(view)) {
        setUpgradeTrigger(view.replace('-', ' ').toUpperCase());
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    // Intercept api-reference for authenticated users to show the functional studio
    if (view === 'api-reference' || view === 'api-node') {
        addTab({ title: 'API Studio', type: 'api-node', initialConfig: config });
        return;
    }

    const titles: Record<string, string> = {
      'vault': 'My Vault',
      'library': 'Templates',
      'smart-reader': 'Smart Reader',
      'team': 'My Team',
      'idm-studio': 'Workflow Studio',
      'enterprise-admin': 'Admin Console',
      'compare': 'Compare Tools',
      'history': 'Activity History',
      'settings': 'Settings',
      'esign': 'Sign Requests',
      'compress': 'Compress Hub',
      'converter': 'Convert Hub',
      'extract': 'Data Hub',
      'quiz-studio': 'Quiz Builder',
      'translation-studio': 'Translation Hub',
      'tone-studio': 'Style Shifter',
      'organize-hub': 'Organize Hub',
      'organize-studio': 'Organize Files',
      'view-edit-hub': 'View & Edit',
      'security-hub': 'Security Hub',
      'scanner-hub': 'Scanner Hub',
      'scanner-studio': 'Scanning Node'
    };
    
    if (titles[view]) {
      addTab({ title: titles[view], type: view as ViewType, initialConfig: config });
    }
  };

  const handleAuthComplete = (email: string, persona: AuthPersona, hasValidPass?: boolean) => {
    setIsAuthenticated(true);
    setAuthView(null);
    handlePersonaChange(persona);
    
    if (persona === 'professional') setAccountTier('pro');
    else if (persona === 'enterprise') setAccountTier('enterprise');
    else setAccountTier('free');

    if (hasValidPass) {
      setStudentPass({ isActive: true, expiryDate: Date.now() + (10 * 24 * 60 * 60 * 1000) });
    }
  };

  const handleConvertToDoc = (title: string, content: string) => {
    const blocks: TextBlock[] = [
      { id: 'h1', type: 'heading', x: 50, y: 50, content: title.toUpperCase(), fontSize: 32, fontWeight: '900', fontStyle: 'normal', color: '#0f172a', alignment: 'center' },
      { id: 'p1', type: 'text', x: 50, y: 150, content: content, fontSize: 14, fontWeight: '500', fontStyle: 'normal', color: '#334155', alignment: 'left', width: 700 }
    ];
    addTab({ title: `${title} (Draft)`, type: 'doc-editor', initialBlocks: blocks });
    showToast('File converted to Smart Document');
  };

  const handleExportToReader = (title: string, content?: string, base64?: string) => {
    addTab({ 
      title: `${title} (Read)`, 
      type: 'reader', 
      textContent: content,
      fileData: base64 ? { file: null as any, base64 } : undefined
    });
    showToast('Document exported to Reader');
  };

  const triggerExport = (fileName: string, type: 'doc' | 'sheet' | 'slide' | 'pdf') => {
    setExportModalConfig({ isOpen: true, fileName, sourceType: type });
  };

  const handleExportConfirm = (format: ExportFormat) => {
    showToast(`Asset successfully exported as ${format.toUpperCase()}`);
  };

  const handleUpgrade = () => {
    setAccountTier('pro');
    showToast('Switched to Pro Mode');
    setIsUpgradeModalOpen(false);
  };

  const handleActivateStudentPass = () => {
    setStudentPass({ isActive: true, expiryDate: Date.now() + (10 * 24 * 60 * 60 * 1000) });
    showToast('Student Pass Activated (10 Days)');
    setIsUpgradeModalOpen(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAccountTier('free');
    setAuthPersona('personal');
    setPublicView('landing');
    setTabs([{ id: 'dashboard', title: 'Dashboard', type: 'dashboard' }]);
    setActiveTabId('dashboard');
    setBranding({ isCustom: false, companyName: 'Doc and PDF Studio', primaryColor: '#2F00FF' });
    setThemeColor('#2F00FF');
    setUtilityCreditUsed(false);
    showToast('Signed out successfully');
  };

  const activeThemeColor = branding.isCustom ? branding.primaryColor : themeColor;

  if (!keySelected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6 font-['Inter',_sans-serif]">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 blur-[80px] rounded-full pointer-events-none" />
          <div className="w-20 h-20 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-blue-500/30">
            <Key size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-[1000] tracking-tighter text-slate-900 mb-4 uppercase">Authorize Node</h1>
          <p className="text-slate-50 font-medium mb-10 leading-relaxed">
            High-fidelity document intelligence requires a valid project authorization. Please select your paid API key to initialize the workspace.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 mb-8"
          >
            <ShieldCheck size={20} /> Authorize Workspace
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
          >
            Review Billing Documentation <LinkIcon size={12} />
          </a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !authView) {
    return (
      <div className={`app-scale-${uiScaling} transition-all duration-300 min-h-screen bg-white dark:bg-slate-950`}>
        <LandingPage onSignIn={() => setIsDevModalOpen(true)} onAction={handleLandingAction} onNavigate={handleNavigate} themeColor={themeColor} activeView={publicView as any} onResetView={() => setPublicView('landing')} />
        {isCallActive && <LiveCallOverlay onClose={() => setIsCallActive(false)} />}
        <DevelopmentModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />
      </div>
    );
  }

  if (authView) {
    return (
      <div className={`app-scale-${uiScaling} transition-all duration-300 min-h-screen bg-white dark:bg-slate-950`}>
        <AuthPage initialMode={authView} onAuthComplete={handleAuthComplete} onCancel={() => setAuthView(null)} />
      </div>
    );
  }

  const isProUnlocked = accountTier !== 'free' || studentPass.isActive || authPersona === 'teacher';
  const isEnterpriseUnlocked = accountTier === 'enterprise';

  return (
    <div className={`flex h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden app-scale-${uiScaling}`}>
      <Sidebar 
        onAction={(msg) => {
          if (msg.startsWith('Navigated to ')) handleNavigate(msg.replace('Navigated to ', ''));
          else if (msg === 'Sign Out') handleSignOut();
          else if (msg === 'Upgrade plan') setIsUpgradeModalOpen(true);
          else showToast(msg);
        }} 
        currentView={activeTab.type} 
        isAuthenticated={isAuthenticated} 
        themeColor={activeThemeColor}
        branding={branding}
        accountTier={accountTier}
        studentPassActive={studentPass.isActive}
        persona={authPersona}
        onPersonaChange={handlePersonaChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onAction={showToast} onSearch={setSearchQuery} onToolSelect={handleToolClick} onNavigate={handleNavigate} currentView={activeTab.type} themeColor={activeThemeColor} isAuthenticated={isAuthenticated} branding={branding} accountTier={accountTier} />

        <div className="h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-1 overflow-x-auto shrink-0 no-scrollbar">
          {tabs.map(tab => (
            <div key={tab.id} onClick={() => setActiveTabId(tab.id)} style={activeTabId === tab.id ? { borderTopColor: activeThemeColor } : {}} className={`group flex items-center gap-3 px-6 h-full border-x border-transparent cursor-pointer transition-all min-w-[140px] max-w-[240px] ${activeTabId === tab.id ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 border-t-2' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600'}`}>
              <span className={`text-[11px] font-black uppercase tracking-widest truncate flex-1 ${activeTabId === tab.id ? 'text-slate-900 dark:text-white' : ''}`}>{tab.title}</span>
              {tab.id !== 'dashboard' && <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><X size={12} /></button>}
            </div>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto relative bg-white dark:bg-slate-950 custom-scrollbar">
          <div className="min-h-full flex flex-col">
            <div className="flex-1 p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
              {activeTab.type === 'dashboard' && (
                <>
                   <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-5">
                        {branding.isCustom && <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl" style={{ backgroundColor: branding.primaryColor }}>{accountTier === 'enterprise' ? <Building2 size={32} /> : authPersona === 'teacher' ? <BookOpen size={32} /> : <GraduationCap size={32} />}</div>}
                        <div>
                          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white mb-2">My Workspace</h1>
                          <p className="text-slate-400 font-medium">Tools for document analysis, organization, and teamwork.</p>
                        </div>
                      </div>
                   </div>

                   {CATEGORIES.map(category => {
                     const categoryTools = filteredTools.filter(t => t.category === category.id);
                     if (categoryTools.length === 0 && !['Extract Hub', 'Convert Hub', 'Extract & Rewrite Hub', 'Organize Hub', 'View & Edit Hub', 'Security Hub', 'Scan'].includes(category.id)) return null;
                     
                     return (
                       <div key={category.id} className="mb-12">
                         <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                           {category.title}
                           <div className="h-px flex-1 bg-slate-100 dark:border-slate-800" />
                         </h3>
                         
                         {category.id === 'Extract Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'AI Synthesis', icon: <Layout size={24} />, desc: 'Summaries & Digests', color: 'bg-blue-50 text-blue-600', target: 'extract' },
                                { title: 'Data Mapping', icon: <Database size={24} />, desc: 'Table Extraction', color: 'bg-indigo-50 text-indigo-600', target: 'extract' },
                                { title: 'Study Lab', icon: <ClipboardCheck size={24} />, desc: 'Quiz Gen & Exam Solver', color: 'bg-emerald-50 text-emerald-600', target: 'quiz-studio' },
                                { title: 'Translation', icon: <Languages size={24} />, desc: 'Global Sync', color: 'bg-rose-50 text-rose-600', target: 'translation-studio' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-indigo-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">Open <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'Convert Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'Office Converter', icon: <FileText size={24} />, desc: 'Word, Excel, PPTX', color: 'bg-blue-50 text-blue-600', target: 'converter' },
                                { title: 'Image Converter', icon: <ImageIcon size={24} />, desc: 'JPG, PNG, TIFF', color: 'bg-rose-50 text-rose-600', target: 'converter' },
                                { title: 'Smart OCR', icon: <RefreshCw size={24} />, desc: 'Text Recognition', color: 'bg-emerald-50 text-emerald-600', target: 'converter' },
                                { title: 'Data Tools', icon: <TableIcon size={24} />, desc: 'CSV & Structured Files', color: 'bg-indigo-50 text-indigo-600', target: 'converter' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">Launch <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'Extract & Rewrite Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'Style Studio', icon: <Palette size={24} />, desc: 'Voice & Persona', color: 'bg-rose-50 text-rose-600', target: 'tone-studio' },
                                { title: 'Doc Digest', icon: <Database size={24} />, desc: 'Key Summaries', color: 'bg-blue-50 text-blue-600', target: 'extract' },
                                { title: 'Refine Tools', icon: <Wand2 size={24} />, desc: 'Clarity & Edits', color: 'bg-teal-50 text-teal-600', target: 'extract' },
                                { title: 'Presentation Prep', icon: <Presentation size={24} />, desc: 'Scripting Support', color: 'bg-orange-50 text-orange-600', target: 'tone-studio' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-rose-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0">Open <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'Organize Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'Page Manager', icon: <LayoutGrid size={24} />, desc: 'Reorder & Organize', color: 'bg-blue-50 text-blue-600', target: 'organize-hub' },
                                { title: 'Merge Tools', icon: <Merge size={24} />, desc: 'Join Files', color: 'bg-indigo-50 text-indigo-600', target: 'organize-hub' },
                                { title: 'Split PDF', icon: <Scissors size={24} />, desc: 'Extract Pages', color: 'bg-emerald-50 text-emerald-600', target: 'organize-hub' },
                                { title: 'Rotate Tool', icon: <RotateCcw size={24} />, desc: 'Orientation Fix', color: 'bg-rose-50 text-rose-600', target: 'organize-hub' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0">Launch <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'View & Edit Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'PDF Editor', icon: <Edit3 size={24} />, desc: 'Text & Images', color: 'bg-teal-50 text-teal-600', target: 'view-edit-hub' },
                                { title: 'Smart Reader', icon: <Eye size={24} />, desc: 'Immersive Reading', color: 'bg-blue-50 text-blue-600', target: 'smart-reader' },
                                { title: 'Markup Lab', icon: <StickyNote size={24} />, desc: 'Annotations', color: 'bg-amber-50 text-amber-600', target: 'view-edit-hub' },
                                { title: 'File Compare', icon: <GitCompare size={24} />, desc: 'See Changes', color: 'bg-purple-50 text-purple-600', target: 'compare' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-teal-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-teal-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0">Open <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'Security Hub' ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {[
                                { title: 'Unlock Tool', icon: <Unlock size={24} />, desc: 'Remove Password', color: 'bg-rose-50 text-rose-600', target: 'security-hub' },
                                { title: 'Protect Tool', icon: <Lock size={24} />, desc: 'Add Password', color: 'bg-rose-50 text-rose-600', target: 'security-hub' },
                                { title: 'Flatten Engine', icon: <Layers size={24} />, desc: 'Secure Layers', color: 'bg-rose-50 text-rose-600', target: 'security-hub' },
                                { title: 'Governance', icon: <ShieldAlert size={24} />, desc: 'Policy Controls', color: 'bg-slate-50 text-slate-600', target: 'security-hub' }
                              ].map((feat, fIdx) => (
                                <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-rose-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0">Open <ChevronRight size={12} /></div>
                                </button>
                              ))}
                           </div>
                         ) : category.id === 'Scan' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                               {[
                                 { title: 'Scanner Hub', icon: <Scan size={24} />, desc: 'Digitize Physical Assets', color: 'bg-blue-50 text-blue-600', target: 'scanner-hub' },
                                 { title: 'Mobile Link', icon: <Smartphone size={24} />, desc: 'Remote Capture Node', color: 'bg-indigo-50 text-indigo-600', target: 'scanner-hub' },
                                 { title: 'Smart OCR', icon: <FileSearch size={24} />, desc: 'Text Mapping Engine', color: 'bg-purple-50 text-purple-600', target: 'scanner-hub' },
                                 { title: 'Photo Import', icon: <ImageIcon size={24} />, desc: 'Camera Media Sync', color: 'bg-rose-50 text-rose-600', target: 'scanner-hub' }
                               ].map((feat, fIdx) => (
                                 <button key={fIdx} onClick={() => handleNavigate(feat.target)} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:border-blue-400 hover:shadow-2xl transition-all duration-500 text-left group flex flex-col items-start">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feat.color} shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                                   <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{feat.title}</h4>
                                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{feat.desc}</p>
                                   <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0">Open <ChevronRight size={12} /></div>
                                 </button>
                               ))}
                            </div>
                         ) : (
                           <div className={`grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
                             {categoryTools.map(tool => (
                               <ToolItem key={tool.id} tool={tool} onClick={handleToolClick} themeColor={activeThemeColor} />
                             ))}
                           </div>
                         )}
                       </div>
                     );
                   })}
                </>
              )}

              {activeTab.type === 'vault' && (
                <DocumentsPage files={recentFiles} onDelete={(id) => setRecentFiles(prev => prev.filter(f => f.id !== id))} onView={(file) => addTab({ title: file.name, type: 'reader', fileData: { file: null as any, base64: file.base64 } })} onEdit={(file) => {
                    const nameLower = file.name.toLowerCase();
                    let type: ViewType = 'doc-editor';
                    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.csv')) type = 'sheet-editor';
                    else if (nameLower.endsWith('.pptx') || nameLower.endsWith('.ppt')) type = 'slide-editor';
                    addTab({ title: file.name, type, fileData: { file: null as any, base64: file.base64 } });
                  }} onUpload={() => { setSelectedTool(null); setShowIngestion(true); }} onCreateBlank={(t) => {
                    const types: Record<string, ViewType> = { doc: 'doc-editor', sheet: 'sheet-editor', slide: 'slide-editor' };
                    addTab({ title: `Untitled ${t.toUpperCase()}`, type: types[t] });
                  }} onOpenTemplates={() => handleNavigate('library')} />
              )}

              {activeTab.type === 'library' && (
                <TemplateGallery isAuthenticated={isAuthenticated} accountTier={accountTier} persona={authPersona} onUpgrade={() => setIsUpgradeModalOpen(true)} onUseTemplate={(name, type) => {
                    const types: Record<string, ViewType> = { doc: 'doc-editor', sheet: 'sheet-editor', slide: 'slide-editor' };
                    addTab({ title: name, type: types[type] });
                  }} />
              )}

              {activeTab.type === 'smart-reader' && (
                <SmartReaderPage recentFiles={recentFiles} onOpenFile={(file) => addTab({ title: file.name, type: 'reader', fileData: { file: null as any, base64: file.base64 } })} onUpload={() => { setSelectedTool(null); setShowIngestion(true); }} />
              )}

              {activeTab.type === 'team' && (
                isProUnlocked ? <TeamPortal /> : <FeatureGate title="Team Portal" description="Invite teammates, manage roles, and review history for your workspace." icon={<Users />} requiredTier="pro" onUpgrade={() => setIsUpgradeModalOpen(true)} persona={authPersona} />
              )}

              {activeTab.type === 'idm-studio' && (
                isProUnlocked ? <IDMStudio /> : <FeatureGate title="Workflow Studio" description="Build complex document workflows. Automate uploads, data extraction, and routing." icon={<Workflow />} requiredTier="pro" onUpgrade={() => setIsUpgradeModalOpen(true)} persona={authPersona} />
              )}

              {activeTab.type === 'api-node' && (
                isProUnlocked ? <APINodeStudio /> : <FeatureGate title="API Node" description="Programmatic interface for your document architecture. Expose DocnPDF logic via RESTful nodes." icon={<Terminal />} requiredTier="pro" onUpgrade={() => setIsUpgradeModalOpen(true)} persona={authPersona} />
              )}

              {activeTab.type === 'enterprise-admin' && (
                isEnterpriseUnlocked ? <EnterpriseConsole initialTab={activeTab.initialConfig?.tab} /> : <FeatureGate title="Admin Console" description="Manage security, user history, and multiple teams from one place." icon={<ShieldCheck />} requiredTier="enterprise" onUpgrade={() => setIsUpgradeModalOpen(true)} persona={authPersona} />
              )}

              {activeTab.type === 'compare' && (
                isProUnlocked ? <CompareStudio onClose={() => closeTab(activeTab.id)} onAction={showToast} /> : <FeatureGate title="File Compare" description="Compare two documents to see changes, added text, or modified clauses." icon={<GitCompare />} requiredTier="pro" onUpgrade={() => setIsUpgradeModalOpen(true)} persona={authPersona} />
              )}

              {activeTab.type === 'settings' && (
                <SettingsPage currentTheme={themeColor} currentMode={interfaceMode} currentScaling={uiScaling} branding={branding} accountTier={accountTier} studentPassActive={studentPass.isActive} onThemeChange={setThemeColor} onModeChange={setInterfaceMode} onScalingChange={setUiScaling} onBrandingChange={setBranding} onNavigate={handleNavigate} />
              )}

              {activeTab.type === 'esign' && <SignDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'compress' && <CompressDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'converter' && <ConverterDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'extract' && <ExtractDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'organize-hub' && <OrganizeDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'organize-studio' && <OrganizeStudio fileData={activeTab.fileData?.base64} onClose={() => closeTab(activeTab.id)} onFinish={() => showToast('Organization complete.')} />}
              {activeTab.type === 'view-edit-hub' && <ViewEditDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'security-hub' && <SecurityDashboard onNavigate={handleNavigate} onToolSelect={handleToolClick} />}
              {activeTab.type === 'scanner-hub' && <ScannerDashboard onNavigate={handleNavigate} />}
              {activeTab.type === 'quiz-studio' && <QuizStudio onClose={() => closeTab(activeTab.id)} onConvertToDoc={handleConvertToDoc} isTeacher={authPersona === 'teacher'} />}
              {activeTab.type === 'translation-studio' && <TranslationStudio onClose={() => closeTab(activeTab.id)} onConvertToDoc={handleConvertToDoc} />}
              {activeTab.type === 'tone-studio' && <ToneStudio onClose={() => closeTab(activeTab.id)} onConvertToDoc={handleConvertToDoc} />}

              {activeTab.type === 'history' && (
                <div className="p-24 flex flex-col items-center justify-center text-center opacity-40">
                   <List size={64} className="mb-6 text-slate-300" />
                   <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Activity History</h3>
                   <p className="text-sm font-medium mt-2">Your document history is loading...</p>
                </div>
              )}
            </div>
            
            {['dashboard', 'vault', 'library', 'smart-reader', 'team', 'idm-studio', 'enterprise-admin', 'compare', 'settings', 'history', 'esign', 'compress', 'converter', 'extract', 'quiz-studio', 'translation-studio', 'tone-studio', 'organize-hub', 'organize-studio', 'view-edit-hub', 'security-hub', 'scanner-hub', 'api-node'].includes(activeTab.type) && (
              <WorkspaceFooter themeColor={activeThemeColor} onNavigate={handleNavigate} onOverlay={(type) => setActiveOverlayView(type)} />
            )}
          </div>
        </main>

        {/* Fix: Changed closeTab argument from tab.id to activeTab.id to resolve reference error */}
        {activeTab.type === 'doc-editor' && <DocEditor fileName={activeTab.title} fileData={activeTab.fileData?.base64} initialBlocks={activeTab.initialBlocks} onClose={() => closeTab(activeTab.id)} onSave={() => showToast('File saved to Vault')} onExport={handleExportToReader} onOpenExport={() => triggerExport(activeTab.title, 'doc')} />}
        {activeTab.type === 'sheet-editor' && <SpreadsheetEditor fileName={activeTab.title} onClose={() => closeTab(activeTab.id)} onSave={() => showToast('Sheet saved to Vault')} onExport={handleExportToReader} onOpenExport={() => triggerExport(activeTab.title, 'sheet')} />}
        {activeTab.type === 'slide-editor' && <SlideEditor fileName={activeTab.title} fileData={activeTab.fileData?.base64} onClose={() => closeTab(activeTab.id)} onSave={() => showToast('Deck saved to Vault')} onExport={handleExportToReader} onOpenExport={() => triggerExport(activeTab.title, 'slide')} />}
        {activeTab.type === 'reader' && <DocumentReader fileName={activeTab.title} fileData={activeTab.fileData?.base64} textContent={activeTab.textContent} userCountry={selectedCountry} onClose={() => closeTab(activeTab.id)} onAction={showToast} branding={branding} studentPass={studentPass} />}
        {activeTab.type === 'scanner-studio' && <ScannerStudio onClose={() => closeTab(activeTab.id)} onFinish={() => { closeTab(activeTab.id); showToast('Scan indexed to Vault'); }} />}

        <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />

        {showIngestion && (
          <div className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm">
            <IngestionZone onSelect={handleIngestComplete} onBack={() => { setShowIngestion(false); setSelectedTool(null); }} toolName={selectedTool?.name} toolColor={selectedTool?.iconBgColor} />
          </div>
        )}

        {isAIModalOpen && (
          <AIModal tool={selectedTool || TOOLS[2]} isOpen={isAIModalOpen} onClose={() => { setIsAIModalOpen(false); setSelectedTool(null); }} onStudy={handleStudy} initialFile={uploadedFileData} themeColor={activeThemeColor} accountTier={accountTier} studentPass={studentPass} />
        )}

        {isExtractStudioOpen && (
          <ExtractStudio 
            fileName={uploadedFileData?.file.name || "Analysis Session"} 
            fileData={uploadedFileData?.base64} 
            initialMode={selectedTool?.id === 'question-solver' ? 'question-solver' : 'summarizer'} 
            onClose={() => { setIsExtractStudioOpen(false); setSelectedTool(null); }} 
            onFinish={() => { setIsExtractStudioOpen(false); setSelectedTool(null); }} 
            onStudy={handleStudy}
          />
        )}

        {isGenericModalOpen && (
          <GenericToolModal tool={selectedTool || TOOLS[0]} isOpen={isGenericModalOpen} onClose={() => { setIsGenericModalOpen(false); setSelectedTool(null); }} onAction={showToast} initialFile={uploadedFileData} />
        )}

        <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={handleUpgrade} onActivateStudentPass={handleActivateStudentPass} trigger={upgradeTrigger} />
        
        <DevelopmentModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />

        <ExportModal 
          isOpen={exportModalConfig.isOpen} 
          fileName={exportModalConfig.fileName} 
          sourceType={exportModalConfig.sourceType} 
          onClose={() => setExportModalConfig({ ...exportModalConfig, isOpen: false })} 
          onConfirm={handleExportConfirm} 
        />

        {activeOverlayView === 'pricing' && (
          <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-in zoom-in-300 duration-300">
            <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white dark:bg-slate-950 shrink-0">
               <span className="text-[12px] font-[1000] text-slate-900 dark:text-white uppercase tracking-widest">Plan Management</span>
               <button onClick={() => setActiveOverlayView(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
               <PricingPage selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
            </div>
          </div>
        )}

        {activeOverlayView === 'help' && (
          <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 overflow-hidden flex flex-col animate-in zoom-in-300 duration-300">
            <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white dark:bg-slate-950 shrink-0">
               <span className="text-[12px] font-[1000] text-slate-900 dark:text-white uppercase tracking-widest">Support Center</span>
               <button onClick={() => setActiveOverlayView(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
               <ResourcesHub initialSection="help-center" />
            </div>
          </div>
        )}

        {isCallActive && <LiveCallOverlay onClose={() => setIsCallActive(false)} />}
        
        <div className="fixed bottom-8 right-8 z-[150]">
          <button onClick={() => setIsCallActive(true)} style={{ backgroundColor: activeThemeColor }} className="w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all">
            <Zap size={28} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
