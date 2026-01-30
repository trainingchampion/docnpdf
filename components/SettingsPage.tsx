import React, { useState } from 'react';
import { 
  Shield, 
  Palette, 
  User, 
  Globe, 
  Lock, 
  Bell, 
  CreditCard, 
  Zap, 
  Check, 
  Info,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock,
  Users,
  Settings as GearIcon,
  Monitor,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  CreditCard as CardIcon,
  Download,
  ExternalLink,
  History,
  Cloud,
  Share2,
  Bot,
  Link,
  MessageSquarePlus,
  Loader2,
  FileText,
  UserPlus,
  Globe2
} from 'lucide-react';
import { InterfaceMode, BrandingConfig, AccountTier } from '../App';

interface SettingsPageProps {
  currentTheme: string;
  currentMode: InterfaceMode;
  currentScaling: 'compact' | 'standard' | 'spacious';
  branding: BrandingConfig;
  accountTier: AccountTier;
  studentPassActive: boolean;
  onThemeChange: (color: string) => void;
  onModeChange: (mode: InterfaceMode) => void;
  onScalingChange: (scaling: 'compact' | 'standard' | 'spacious') => void;
  onBrandingChange: (branding: BrandingConfig) => void;
  onNavigate?: (view: any) => void;
  initialTab?: SettingsTab;
}

type SettingsTab = 'appearance' | 'profile' | 'branding' | 'notifications' | 'security' | 'subscription' | 'collaboration' | 'integrations';

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentTheme, 
  currentMode,
  currentScaling,
  branding,
  accountTier,
  studentPassActive,
  onThemeChange, 
  onModeChange,
  onScalingChange,
  onBrandingChange,
  onNavigate,
  initialTab = 'appearance'
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);

  const [notifState, setNotifState] = useState({
    aiComplete: true,
    newShare: true,
    mentions: true,
    securityLogin: true,
    marketing: false,
    dailyDigest: true,
    pushEnabled: true
  });

  const toggleNotif = (key: keyof typeof notifState) => {
    setNotifState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const brandThemes = [
    { name: 'Signature Blue', color: '#2F00FF', description: 'Primary brand identity' },
    { name: 'Original Indigo', color: '#4c1d95', description: 'Standard enterprise theme' },
    { name: 'Emerald Green', color: '#006D41', description: 'Eco-focused workspace' },
    { name: 'Brand Blue', color: '#1A73E8', description: 'Clean professional style' },
    { name: 'Vibrant Yellow', color: '#F9BC00', description: 'High-visibility theme' },
    { name: 'Classic Red', color: '#EA4335', description: 'Action-oriented workspace' },
  ];

  const handleConnect = (id: string, isPro: boolean) => {
    if (isPro && accountTier === 'free') {
      window.dispatchEvent(new CustomEvent('openUpgrade', { detail: { trigger: id.replace('-', ' ') } }));
      return;
    }

    if (connectedIds.includes(id)) {
      setConnectedIds(prev => prev.filter(i => i !== id));
      return;
    }
    setConnectingId(id);
    setTimeout(() => {
      setConnectingId(null);
      setConnectedIds(prev => [...prev, id]);
    }, 1500);
  };

  const renderIntegrations = () => {
    const integrations = [
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        desc: 'Automatically create events for signature deadlines and document follow-ups.',
        icon: <Calendar className="text-red-500" />,
        isPro: true
      },
      {
        id: 'google-drive',
        name: 'Google Drive',
        desc: 'Sync your Vault files directly to Google Drive to access them anywhere.',
        icon: <Cloud className="text-blue-600" />,
        isPro: true
      },
      {
        id: 'slack',
        name: 'Slack',
        desc: 'Get real-time alerts and document notifications directly in your Slack channels.',
        icon: <MessageSquarePlus className="text-purple-600" />,
        isPro: true
      },
      {
        id: 'zapier',
        name: 'Zapier',
        desc: 'Connect to 5,000+ apps. Trigger workflows when a document is signed or updated.',
        icon: <Zap className="text-orange-500" />,
        isPro: true
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        desc: 'Send document data directly into your CRM. Automate contracts and pipeline updates.',
        icon: <Activity className="text-sky-500" />,
        isPro: true
      }
    ];

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-10">
            <Link size={18} style={{ color: currentTheme }} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Connected Apps</h3>
          </div>

          <div className="space-y-6">
            {integrations.map((int) => {
              const isConnected = connectedIds.includes(int.id);
              const isConnecting = connectingId === int.id;
              const isGated = int.isPro && accountTier === 'free';
              
              return (
                <div key={int.id} className={`p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group ${isConnected ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 dark:border-slate-800 hover:border-blue-200'}`}>
                  <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                      {React.cloneElement(int.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{int.name}</h4>
                        {int.isPro && (
                          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded text-[8px] font-black uppercase tracking-widest border border-amber-100">Pro</span>
                        )}
                        {isConnected && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-2 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-in zoom-in">
                            <Check size={10} strokeWidth={4} /> Active Node
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {int.desc} <button className="text-blue-600 font-bold ml-1 hover:underline">Help</button>
                      </p>
                    </div>
                  </div>
                  
                  <div className="shrink-0 w-full sm:w-auto">
                    <button 
                      onClick={() => handleConnect(int.id, int.isPro)}
                      disabled={isConnecting}
                      className={`w-full sm:w-auto px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 min-w-[140px] flex items-center justify-center gap-2 ${
                        isConnected 
                        ? 'bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200' 
                        : isGated
                        ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Synchronizing...
                        </>
                      ) : isConnected ? (
                        'Disconnect'
                      ) : isGated ? (
                        <><Lock size={14} /> Upgrade to Connect</>
                      ) : 'Connect'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="p-12 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-[3rem] text-center">
           <Bot size={40} className="text-indigo-600 mx-auto mb-6" />
           <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight mb-2">Need a Custom Connection?</h3>
           <p className="text-indigo-700 dark:text-indigo-300 text-sm font-medium max-w-sm mx-auto mb-8">Use our API to connect your own software directly to DocnPDF.</p>
           <button 
            onClick={() => {
              if (accountTier === 'free') {
                window.dispatchEvent(new CustomEvent('openUpgrade', { detail: { trigger: 'API Access' } }));
              }
            }}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-blue-500/20"
           >
             {accountTier === 'free' ? <><Lock size={14} className="inline mr-2" /> Unlock API</> : 'Explore API Docs'}
           </button>
        </div>
      </div>
    );
  };

  const renderCollaboration = () => {
    const activeCol = branding.isCustom ? branding.primaryColor : currentTheme;
    
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 lg:p-24 text-center shadow-sm relative overflow-hidden">
           <div className="relative h-64 mb-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-50/20 dark:bg-blue-900/5 blur-[120px] rounded-full" />
              <div className="relative z-10 w-full max-w-md">
                 <div className="relative flex justify-center">
                    <div className="absolute -left-12 -top-4 w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center animate-bounce-slow">
                       <img src="https://picsum.photos/seed/p1/100/100" className="w-12 h-12 rounded-full mb-2" alt="p1" />
                       <div className="w-10 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    </div>
                    <div className="absolute -right-8 top-12 w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center animate-bounce-slow" style={{ animationDelay: '1.2s' }}>
                       <img src="https://picsum.photos/seed/p2/100/100" className="w-10 h-10 rounded-full mb-2" alt="p2" />
                       <div className="w-8 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    </div>
                    <div className="w-40 h-52 bg-[#002D56] rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,45,86,0.4)] flex flex-col p-6 items-start gap-4 relative overflow-hidden group">
                       <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center text-white"><FileText size={18} /></div>
                       <div className="w-full h-1.5 bg-white/20 rounded-full" />
                       <div className="w-3/4 h-1.5 bg-white/20 rounded-full" />
                       <div className="w-full h-1.5 bg-white/20 rounded-full" />
                       <div className="mt-auto flex -space-x-3">
                          <div className="w-8 h-8 rounded-full border-2 border-[#002D56] bg-indigo-500" />
                          <div className="w-8 h-8 rounded-full border-2 border-[#002D56] bg-blue-500" />
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50" />
                    </div>
                 </div>
              </div>
           </div>

           <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white mb-4">Work's always better together.</h2>
           <p className="text-slate-50 dark:text-slate-400 text-lg font-medium max-w-lg mx-auto mb-12 leading-relaxed">
             Add teammates and you'll be able to collaborate and quickly see what's happening in your projects.
           </p>

           <button 
            onClick={() => {
              if (accountTier === 'free') {
                window.dispatchEvent(new CustomEvent('openUpgrade', { detail: { trigger: 'Collaboration' } }));
              }
            }}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 mx-auto active:scale-95"
           >
             {accountTier === 'free' ? <Lock size={20} /> : <UserPlus size={20} />}
             {accountTier === 'free' ? 'Unlock Collaboration' : 'Send an invite'}
           </button>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-10">
            <Users size={18} style={{ color: activeCol }} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Team Sharing Rules</h3>
          </div>

          <div className="space-y-8">
             <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Invite and Manage</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                   Admins can invite new members and manage their document access levels.
                </p>
             </div>
          </div>
        </section>
      </div>
    );
  };

  const renderPlaceholder = (title: string) => (
    <div className="p-20 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem]">
       <h3 className="text-xl font-black uppercase text-slate-400">{title} Settings coming soon</h3>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      <header className="px-12 py-16 shrink-0 relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: currentTheme }}>
                 <GearIcon size={24} />
              </div>
              <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Settings.</h1>
           </div>
           <p className="text-slate-400 text-xl font-medium max-w-xl">Configure your workspace identity, appearance, and high-fidelity integrations.</p>
        </div>
      </header>

      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-12 py-6 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
           {(['appearance', 'profile', 'branding', 'notifications', 'security', 'subscription', 'collaboration', 'integrations'] as SettingsTab[]).map(tab => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
             >
               {tab.replace('-', ' ')}
             </button>
           ))}
        </div>
      </div>

      <main className="flex-1 p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'integrations' && renderIntegrations()}
          {activeTab === 'collaboration' && renderCollaboration()}
          {activeTab === 'appearance' && renderPlaceholder('Appearance')}
          {activeTab === 'profile' && renderPlaceholder('Profile')}
          {activeTab === 'branding' && renderPlaceholder('Branding')}
          {activeTab === 'notifications' && renderPlaceholder('Notifications')}
          {activeTab === 'security' && renderPlaceholder('Security')}
          {activeTab === 'subscription' && renderPlaceholder('Subscription')}
        </div>
      </main>

      <footer className="px-12 py-10 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between opacity-50 shrink-0 mt-20 transition-colors">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" /> Vault Governance v5.4
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
               <Globe2 size={14} /> Node: Regional-US-1
            </div>
         </div>
      </footer>
    </div>
  );
};

export default SettingsPage;
