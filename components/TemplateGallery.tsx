import React, { useState, useMemo } from 'react';
import { 
  Search, FileText, FileSpreadsheet, Presentation, 
  ChevronRight, Star, Zap, LayoutGrid, Clock, 
  Sparkles, Filter, X, ArrowRight, User, Briefcase, 
  Scale, GraduationCap, PenTool, Globe, Shield, 
  Activity, Database, Heart, ShoppingBag, Code,
  Cpu, Rocket, PieChart, Users, Building2, Stethoscope,
  School, ShoppingCart, Landmark, Newspaper, Microscope,
  ShieldCheck, Terminal, Globe2, CheckCircle2, Lock,
  BookOpen, ClipboardCheck
} from 'lucide-react';
import { AccountTier } from '../App';
import { AuthPersona } from './AuthPage';

interface Template {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'slide';
  category: string;
  description: string;
  isPro?: boolean;
  popularity: number;
  isStudent?: boolean;
}

interface TemplateGalleryProps {
  onUseTemplate: (name: string, type: 'doc' | 'sheet' | 'slide') => void;
  isAuthenticated: boolean;
  accountTier?: AccountTier;
  onUpgrade: () => void;
  persona?: AuthPersona;
}

const TEMPLATES: Template[] = [
  // Student & Academic Blueprints
  { id: 's1', name: 'Lab Report Master', type: 'doc', category: 'Academic', description: 'Standardized scientific structure for research and results.', popularity: 99, isStudent: true },
  { id: 's2', name: 'Exam Study Guide', type: 'doc', category: 'Academic', description: 'Structured revision node for active recall and summaries.', popularity: 98, isStudent: true },
  { id: 's3', name: 'Thesis Defense Deck', type: 'slide', category: 'Academic', description: 'High-impact presentation for academic finals.', popularity: 94, isStudent: true },
  { id: 's4', name: 'GPA Analytics Tracker', type: 'sheet', category: 'Academic', description: 'Automated semester performance and credit tracking.', popularity: 88, isStudent: true },
  { id: 's5', name: 'Lecture Logic Organizer', type: 'doc', category: 'Academic', description: 'Cornell-method based notes for high retention.', popularity: 92, isStudent: true },
  { id: 's6', name: 'Assignment Cover Kit', type: 'doc', category: 'Academic', description: 'Professional APA/MLA compliant submission headers.', popularity: 85, isStudent: true },

  // 500+ Global Vault (Hidden from Students)
  { id: 'v1', name: 'Global Expansion Playbook', type: 'doc', category: 'vault', description: 'Step-by-step architecture for entering international markets.', popularity: 99, isPro: true },
  { id: 'v2', name: 'Series B Fundraising Master', type: 'slide', category: 'vault', description: 'The gold-standard deck for mid-to-late stage funding.', popularity: 97, isPro: true },
  { id: 'v3', name: 'Enterprise Resource Model', type: 'sheet', category: 'vault', description: 'Advanced financial modeling for multi-national corps.', popularity: 95, isPro: true },
  { id: 'v4', name: 'GDPR/CCPA Compliance Hub', type: 'doc', category: 'vault', description: 'Consolidated regulatory framework for global data.', popularity: 98, isPro: true },
  
  // Strategy
  { id: 't1', name: 'Annual Strategic Plan', type: 'doc', category: 'Strategy', description: 'Comprehensive roadmap for enterprise growth and OKRs.', popularity: 98 },
  { id: 't2', name: 'Market Entry Analysis', type: 'doc', category: 'Strategy', description: 'Deep dive into competitive landscape and entry barriers.', popularity: 85, isPro: true },
  { id: 't3', name: 'QBR Presentation', type: 'slide', category: 'Strategy', description: 'Standardized deck for Quarterly Business Reviews.', popularity: 92 },

  // Finance
  { id: 't4', name: 'Cash Flow Projection', type: 'sheet', category: 'Finance', description: '12-month automated forecasting model.', popularity: 95 },
  { id: 't5', name: 'Budget Allocation Studio', type: 'sheet', category: 'Finance', description: 'Dynamic departmental spend management.', popularity: 88, isPro: true },
  { id: 't6', name: 'Investor Pitch Deck', type: 'slide', category: 'Finance', description: 'Silicon Valley standard fundraising template.', popularity: 99 },

  // Tech
  { id: 't20', name: 'Product Requirements (PRD)', type: 'doc', category: 'Tech', description: 'High-fidelity specification for software features.', popularity: 93 },
  { id: 't21', name: 'API Documentation Hub', type: 'doc', category: 'Tech', description: 'Developer-first endpoint and schema definitions.', popularity: 87, isPro: true },
];

const RAW_CATEGORIES = [
  { id: 'all', label: 'All Blueprints', icon: <LayoutGrid size={16} /> },
  { id: 'Academic', label: 'Cognition Studio', icon: <GraduationCap size={16} className="text-indigo-500" /> },
  { id: 'vault', label: '500+ Global Vault', icon: <Zap size={16} className="text-amber-500 fill-amber-500" />, premiumOnly: true },
  { id: 'Strategy', label: 'Strategy', icon: <Rocket size={16} /> },
  { id: 'Finance', label: 'Finance', icon: <PieChart size={16} /> },
  { id: 'Tech', label: 'Engineering', icon: <Code size={16} /> },
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onUseTemplate, isAuthenticated, accountTier = 'free', onUpgrade, persona }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(persona === 'student' ? 'Academic' : 'all');

  const visibleCategories = useMemo(() => {
    if (persona === 'student') {
      return RAW_CATEGORIES.filter(c => !c.premiumOnly);
    }
    return RAW_CATEGORIES;
  }, [persona]);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      // Rule: Students never see the 500+ Vault
      if (persona === 'student' && t.category === 'vault') return false;
      
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, persona]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfdfe] overflow-hidden animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <header className="px-12 py-12 border-b border-slate-100 bg-[#0f172a] text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                {persona === 'student' ? <GraduationCap size={24} strokeWidth={2.5} /> : <BookOpen size={24} strokeWidth={2.5} />}
              </div>
              <h1 className="text-5xl font-[1000] tracking-tighter leading-none">Blueprint Library</h1>
            </div>
            <p className="text-slate-400 font-medium text-lg">
              {persona === 'student' 
                ? 'Architect your academic career with high-fidelity assignment and research templates.'
                : 'Architect your professional lifecycle with our comprehensive library of industrial templates.'}
            </p>
          </div>
          
          <div className="relative w-full lg:w-[480px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Search blueprints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 focus:bg-white focus:text-slate-900 rounded-[1.5rem] text-lg font-bold outline-none transition-all shadow-inner placeholder:text-slate-600"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-80 border-r border-slate-100 bg-white p-8 overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
             <Filter size={14} className="text-slate-400" />
             <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Categories</span>
          </div>
          <nav className="space-y-1.5 mb-12 flex-1">
            {visibleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-black transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-2' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </nav>

          <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white relative overflow-hidden group cursor-default shadow-2xl mt-auto">
              <div className="absolute top-8 right-8 text-indigo-400 opacity-100">
                <Sparkles size={22} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-[1000] text-slate-500 uppercase tracking-[0.3em] mb-8">
                  {persona === 'student' ? 'STUDENT NODE' : 'GLOBAL NODE'}
                </p>
                <h4 className="text-[20px] font-[900] leading-tight mb-4">
                  {persona === 'student' ? 'Academic Suite Active' : 'Professional Vault'}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {persona === 'student' ? 'Optimized for Retention' : 'Enterprise Standards'}
                </p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.15)_0%,_transparent_60%)] pointer-events-none" />
          </div>
        </aside>

        {/* Content Grid */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            {filteredTemplates.length === 0 ? (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-30">
                <Search size={64} className="mb-6" />
                <h3 className="text-2xl font-[1000] uppercase tracking-[0.2em]">No Results</h3>
                <p className="text-sm font-bold mt-2">Refine your search criteria or change categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredTemplates.map((template, idx) => {
                  const isLocked = template.isPro && accountTier === 'free' && persona !== 'student';
                  
                  return (
                    <div 
                      key={template.id}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className="stagger-item group bg-white border border-slate-200 rounded-[3.5rem] overflow-hidden hover:border-indigo-400 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all flex flex-col relative"
                    >
                      <div className="aspect-[4/5] bg-[#f9fbfd] relative overflow-hidden flex items-center justify-center p-14 group-hover:bg-indigo-50/20 transition-colors">
                         <div className={`w-full h-full bg-white rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] border border-slate-100 p-10 flex flex-col gap-6 transform group-hover:-translate-y-5 group-hover:rotate-1 transition-transform duration-700 ease-out ${isLocked ? 'blur-sm opacity-50 grayscale-[0.5]' : ''}`}>
                            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white mb-2 shadow-lg ${
                              template.isStudent ? 'bg-indigo-600 shadow-indigo-500/20' :
                              template.type === 'doc' ? 'bg-blue-600 shadow-blue-500/20' : 
                              template.type === 'sheet' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-orange-600 shadow-orange-500/20'
                            }`}>
                              {template.type === 'doc' ? <FileText size={32} /> : 
                               template.type === 'sheet' ? <FileSpreadsheet size={32} /> : <Presentation size={32} />}
                            </div>
                            <div className="space-y-4">
                               <div className="h-4 w-full bg-slate-100 rounded-full" />
                               <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                               <div className="h-4 w-full bg-slate-100 rounded-full" />
                            </div>
                         </div>
                         
                         <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                            {isLocked ? (
                              <button 
                                onClick={onUpgrade}
                                className="bg-amber-500 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-amber-600 transition-all flex items-center gap-4 transform hover:scale-105 active:scale-95"
                              >
                                <Lock size={20} /> Upgrade to Access
                              </button>
                            ) : (
                              <button 
                                onClick={() => onUseTemplate(template.name, template.type)}
                                className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-500 transition-all flex items-center gap-4 transform hover:scale-105 active:scale-95"
                              >
                                Start Drafting <ArrowRight size={20} />
                              </button>
                            )}
                         </div>

                         {template.isStudent && (
                           <div className="absolute top-10 right-10 px-6 py-2.5 bg-indigo-500 text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-2xl">
                              <GraduationCap size={14} fill="white" />
                              Cognitive Choice
                           </div>
                         )}
                      </div>
                      
                      <div className="p-10">
                         <div className="flex items-center gap-4 mb-5">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              template.isStudent ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                              template.type === 'doc' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {template.isStudent ? 'Student Node' : template.type === 'doc' ? 'Doc' : 'Sheet'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <Star size={14} className="text-amber-400 fill-amber-400" />
                               {template.popularity}% Usage
                            </div>
                         </div>
                         <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors mb-3 uppercase leading-tight">{template.name}</h3>
                         <p className="text-sm text-slate-400 font-medium leading-relaxed">{template.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="h-14 border-t border-slate-100 bg-white px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Encrypted</span>
           </div>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v5.4.2-Blueprint-Sync</p>
      </footer>
    </div>
  );
};

export default TemplateGallery;