import React, { useState } from 'react';
import { 
  HelpCircle, BookOpen, Code, Users, Search, 
  ChevronRight, ExternalLink, ShieldCheck, 
  MessageSquare, Terminal, Globe2, Sparkles,
  ArrowRight, Play, Book, Lightbulb, Zap,
  Settings, Mail, FileText, Layout, Activity,
  Star
} from 'lucide-react';

interface ResourcesHubProps {
  initialSection?: 'help-center' | 'documentation' | 'api-reference' | 'community';
}

const ResourcesHub: React.FC<ResourcesHubProps> = ({ initialSection = 'documentation' }) => {
  const [activeTab, setActiveTab] = useState(initialSection);

  const renderHelpCenter = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 mb-6">How can we help?</h2>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search help articles..." 
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-lg font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-xl shadow-slate-200/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Zap className="text-amber-500" />, title: 'Getting Started', desc: 'New to DocnPDF? Start here for the basics.' },
          { icon: <ShieldCheck className="text-emerald-500" />, title: 'Security & Privacy', desc: 'Learn how we secure your high-fidelity data.' },
          { icon: <Settings className="text-blue-500" />, title: 'Account & Billing', desc: 'Manage your enterprise plan and team seats.' }
        ].map(card => (
          <div key={card.title} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="text-lg font-black text-slate-900 mb-3">{card.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{card.desc}</p>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 group-hover:gap-4 transition-all">Explore Category <ChevronRight size={14} /></span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="flex gap-12 animate-in fade-in duration-500">
      <aside className="w-64 shrink-0 space-y-8">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">User Guides</h4>
          <nav className="space-y-1">
            {['Introduction', 'Workspace Basics', 'AI Extraction', 'Smart Reading', 'e-Sign Studio', 'Vault Management'].map(item => (
              <button key={item} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
          <Sparkles size={20} className="text-blue-400 mb-4" />
          <p className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-2">Pro Tip</p>
          <p className="text-xs font-medium leading-relaxed">Use AI Assistant (Tehila) to summarize documentation while you work.</p>
        </div>
      </aside>

      <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-12 lg:p-16 shadow-sm">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 mb-8">AI Extraction Protocol</h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            DocnPDF uses advanced Gemini 3 Pro reasoning to perform semantic extraction on complex document workloads. Unlike traditional OCR, our system understands context, relationships, and nested table structures.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
              <h3 className="text-lg font-black text-blue-900 mb-4">Supported Formats</h3>
              <ul className="space-y-2 text-sm text-blue-700 font-bold">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> High-Resolution PDF</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Scanned Documents</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Encrypted Workspace Docs</li>
              </ul>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
              <h3 className="text-lg font-black text-emerald-900 mb-4">Extraction Modes</h3>
              <ul className="space-y-2 text-sm text-emerald-700 font-bold">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Semantic Logic</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Table Mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Key-Value Pairing</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-12 mb-6">Workflow Integration</h2>
          <p className="text-slate-500 leading-relaxed">
            Every extraction can be automatically routed to your Vault, IDM Studio, or exported as a structured JSON/CSV payload for downstream processing.
          </p>
        </article>
      </div>
    </div>
  );

  const renderApiReference = () => (
    <div className="animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
        <div className="p-8 lg:p-12 border-b border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Terminal size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">API Reference v1.2</h2>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">RESTful Interface • Webhooks Enabled</p>
              </div>
           </div>
           <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">Get API Key</button>
        </div>
        
        <div className="flex flex-col lg:flex-row">
           <aside className="w-full lg:w-72 bg-black/20 p-8 border-r border-white/10 shrink-0">
              <nav className="space-y-6">
                <div>
                   <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Core Endpoints</h4>
                   <div className="space-y-1">
                      {['Authentication', 'Documents', 'Extractions', 'E-Signatures', 'Workflows'].map(item => (
                        <button key={item} className="w-full text-left px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-all">
                           {item}
                        </button>
                      ))}
                   </div>
                </div>
              </nav>
           </aside>

           <main className="flex-1 p-8 lg:p-16 overflow-x-auto">
              <div className="max-w-3xl space-y-12">
                 <section>
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">POST</span>
                       <h3 className="text-xl font-bold text-white tracking-tight">/v1/extract</h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                       Submits a document for high-fidelity semantic extraction. Returns a task ID for asynchronous polling or executes immediately based on document size.
                    </p>
                    <div className="bg-black/40 rounded-2xl p-8 border border-white/5 font-mono text-[13px] text-blue-400">
                       <p className="text-white/30 mb-4">// Request Example</p>
                       <pre className="overflow-x-auto">
{`curl -X POST https://api.docnpdf.ai/v1/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/invoice.pdf" \\
  -F "precision=high"`}
                       </pre>
                    </div>
                 </section>
              </div>
           </main>
        </div>
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Discussions</h3>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Start Thread</button>
             </div>
             <div className="space-y-6">
                {[
                  { title: 'Best practices for multi-tenant IDM flows?', author: 'dev_mark82', replies: 12, time: '2h ago', tags: ['Enterprise', 'Flows'] },
                  { title: 'Optimizing extraction precision for hand-written forms', author: 'sarah_arch', replies: 45, time: '5h ago', tags: ['AI', 'OCR'] },
                  { title: 'DocnPDF v4.8 Update Discussion', author: 'tehila_official', replies: 128, time: '1d ago', tags: ['Announcement'] }
                ].map((thread, i) => (
                  <div key={i} className="p-6 bg-slate-50/50 hover:bg-slate-50 rounded-3xl transition-all cursor-pointer group">
                     <div className="flex items-center gap-3 mb-3">
                        {thread.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                        ))}
                     </div>
                     <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{thread.title}</h4>
                     <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <div className="flex items-center gap-4">
                           <span className="text-slate-900">@{thread.author}</span>
                           <span>{thread.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <MessageSquare size={14} /> {thread.replies}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       <div className="space-y-8">
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-[1000] tracking-tighter mb-4">Join our Discord</h3>
                <p className="text-blue-100 text-sm mb-8 leading-relaxed">Connect with 12,000+ developers and power users in our official community hub.</p>
                <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Join Conversation</button>
             </div>
             <Globe2 size={120} className="absolute -right-10 -bottom-10 opacity-10 text-white" />
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Top Contributors</h4>
             <div className="space-y-6">
                {[
                  { name: 'Alex Rivera', points: '14.2k', avatar: 'https://picsum.photos/seed/alex/100/100' },
                  { name: 'Mia Wong', points: '11.8k', avatar: 'https://picsum.photos/seed/mia/100/100' },
                  { name: 'Jordan Smyth', points: '9.4k', avatar: 'https://picsum.photos/seed/jordan/100/100' }
                ].map(user => (
                  <div key={user.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                        <div>
                           <p className="text-sm font-bold text-slate-900">{user.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.points} Reputation</p>
                        </div>
                     </div>
                     <Star size={16} className="text-amber-400" />
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar animate-in fade-in duration-1000">
      <section className="bg-white border-b border-slate-100 px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <BookOpen size={14} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">Knowledge Ecosystem</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-tighter text-[#0f172a] leading-none mb-4">
               {activeTab === 'help-center' ? 'Help Center.' : 
                activeTab === 'documentation' ? 'Documentation.' : 
                activeTab === 'api-reference' ? 'API Reference.' : 'Community.'}
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl">Deep insights and technical mastery for the DocnPDF workspace ecosystem.</p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
              {[
                { id: 'help-center', label: 'Help Center', icon: <HelpCircle size={14} /> },
                { id: 'documentation', label: 'Docs', icon: <BookOpen size={14} /> },
                { id: 'api-reference', label: 'API', icon: <Code size={14} /> },
                { id: 'community', label: 'Community', icon: <Users size={14} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                    activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                  }`}
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
          {activeTab === 'help-center' && renderHelpCenter()}
          {activeTab === 'documentation' && renderDocumentation()}
          {activeTab === 'api-reference' && renderApiReference()}
          {activeTab === 'community' && renderCommunity()}
        </div>
      </main>

      <footer className="px-12 py-10 border-t border-slate-100 bg-white flex items-center justify-between opacity-50 shrink-0 mt-20">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} /> Security Whitepapers Available
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <Globe2 size={14} /> Global Multi-Node Sync
            </div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">Documentation v4.8.5-Stable</p>
      </footer>
    </div>
  );
};

const CheckCircle2 = (props: any) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default ResourcesHub;