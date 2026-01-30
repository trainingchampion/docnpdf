
import React, { useState } from 'react';
import { 
  Building2, Scale, Briefcase, Stethoscope, 
  Workflow, ArrowRight, Zap, Sparkles, 
  ShieldCheck, CheckCircle2, ChevronRight,
  Database, Users, LayoutGrid, Clock, Rocket,
  FileText, PenTool, Search, Filter, Share2,
  Lock, Activity, Globe
} from 'lucide-react';

const SOLUTIONS = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: <Building2 />,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'hover:border-blue-200',
    description: 'Accelerate property closings with intelligent document processing.',
    workflows: [
      { id: 're-1', name: 'Closing Package Automation', meta: 'Extracts buyer/seller data from 20+ forms' },
      { id: 're-2', name: 'Lease Agreement Review', meta: 'AI-driven clause auditing for commercial leases' },
      { id: 're-3', name: 'Listing Doc Extraction', meta: 'Convert physical listing sheets to digital databases' }
    ]
  },
  {
    id: 'legal',
    name: 'Legal Services',
    icon: <Scale />,
    color: 'bg-indigo-50 text-indigo-600',
    borderColor: 'hover:border-indigo-200',
    description: 'Transform contract review and due diligence from hours into seconds.',
    workflows: [
      { id: 'leg-1', name: 'Recursive Discovery Search', meta: 'Analyze thousands of litigation docs instantly' },
      { id: 'leg-2', name: 'MSA Redline Assistant', meta: 'Automated policy-based contract redlining' },
      { id: 'leg-3', name: 'e-Signature Chain', meta: 'Multi-party cryptographic signing flows' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    icon: <Briefcase />,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'hover:border-emerald-200',
    description: 'End-to-end security for sensitive financial data and audits.',
    workflows: [
      { id: 'fin-1', name: 'Loan Package Ingestion', meta: 'Verify IDs and paystubs with high-fidelity OCR' },
      { id: 'fin-2', name: 'Audit Trail Generator', meta: 'Generate SOC2 compliant document logs' },
      { id: 'fin-3', name: 'Portfolio Data Scraping', meta: 'Extract P&L tables from PDF reports to Excel' }
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: <Users />,
    color: 'bg-orange-50 text-orange-600',
    borderColor: 'hover:border-orange-200',
    description: 'Create high-performance onboarding and talent acquisition flows.',
    workflows: [
      { id: 'hr-1', name: 'Hiring Pipeline Hub', meta: 'Draft offers and manage NDAs programmatically' },
      { id: 'hr-2', name: 'Policy Update Distribution', meta: 'Multi-recipient tracked document signing' },
      { id: 'hr-3', name: 'Resume Intelligence', meta: 'Extract skills & experience from large PDF batches' }
    ]
  }
];

interface SolutionsHubProps {
  onNavigate?: (view: string) => void;
}

const SolutionsHub: React.FC<SolutionsHubProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-[#0f172a] text-white px-12 py-20 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">DocnFlow Enterprise</span>
            </div>
            <h1 className="text-6xl font-[1000] tracking-tighter leading-[0.95] mb-6">
              Industry-Specific <br />
              <span className="text-blue-400 italic">Document Automation.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-10">
              Deploy battle-tested document workflows designed for your specific business requirements. Secure, automated, and ready for global scale.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate?.('idm-studio')}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-3"
              >
                <Rocket size={18} /> Deploy first Workflow
              </button>
              <button className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[13px] uppercase tracking-widest transition-all active:scale-95">
                Contact Strategy Team
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-full max-w-md">
             <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-600/30">
                   <span className="animate-tilt block"><Workflow size={32} /></span>
                </div>
                <h3 className="text-xl font-black mb-8">Process Blueprint</h3>
                <div className="space-y-10 relative">
                   <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent opacity-20" />
                   {[
                     { step: '1', title: 'Injest Package', meta: 'Multi-source API upload' },
                     { step: '2', title: 'AI Extraction', meta: 'High-fidelity table mapping' },
                     { step: '3', title: 'Verification', meta: 'SOC2 compliant data audit' }
                   ].map(s => (
                     <div key={s.step} className="flex gap-6 relative z-10">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black border-4 border-[#1e293b] shadow-lg animate-tilt">{s.step}</div>
                        <div>
                          <p className="text-sm font-bold">{s.title}</p>
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">{s.meta}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              {['All Industries', 'Real Estate', 'Legal', 'Finance', 'HR'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t.toLowerCase())}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t.toLowerCase() || (activeTab === 'all industries' && t === 'All Industries') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Workspace
              </span>
              <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-400 transition-all shadow-sm">
                <Filter size={14} /> Advanced Filter
              </button>
           </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <main className="flex-1 p-12 lg:p-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {SOLUTIONS.filter(s => activeTab === 'all industries' || activeTab === 'all' || s.id === activeTab).map((solution, idx) => (
            <div 
              key={solution.id} 
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`stagger-item group bg-white border border-slate-100 rounded-[3.5rem] p-12 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 ${solution.borderColor}`}
            >
              <div className="flex items-start justify-between mb-10">
                {/* Cast to any to satisfy TS for cloneElement props */}
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${solution.color} shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                  <span className="animate-tilt block">
                    {React.cloneElement(solution.icon as React.ReactElement<any>, { size: 32, strokeWidth: 2.5 })}
                  </span>
                </div>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest">v4.5</span>
                </div>
              </div>

              <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter mb-4">{solution.name}</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12">
                {solution.description}
              </p>

              <div className="space-y-4 mb-12">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Popular Workflows</p>
                 {solution.workflows.map(wf => (
                   <div key={wf.id} className="p-5 bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-[2rem] transition-all cursor-pointer group/wf flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-20 group-hover/wf:opacity-100 transition-opacity" />
                         <div>
                            <p className="text-sm font-bold text-slate-900">{wf.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{wf.meta}</p>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover/wf:text-blue-600 translate-x-[-10px] group-hover/wf:translate-x-0 transition-all opacity-0 group-hover/wf:opacity-100" />
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => onNavigate?.('idm-studio')}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                 Initiate {solution.name} Studio <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Solution CTA */}
        <div className="max-w-7xl mx-auto mt-32">
           <div className="bg-gradient-to-br from-indigo-900 to-[#020617] rounded-[4rem] p-16 lg:p-24 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
                 <div className="flex-1">
                    <h2 className="text-5xl lg:text-7xl font-[1000] tracking-tighter mb-8 leading-[0.95]">
                      Need a custom <br /> <span className="text-blue-400 italic">automation engine?</span>
                    </h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12 max-w-xl">
                      Our strategy team can architect bespoke high-fidelity document flows tailored for your organization's unique requirements.
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <button className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl active:scale-95">
                         Schedule Consultation
                       </button>
                    </div>
                 </div>

                 <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                    {[
                      { icon: <Database size={24} />, title: 'Vault Logic', desc: 'Secure document data storage' },
                      { icon: <Workflow size={24} />, title: 'Process Flow', desc: 'Custom pipeline automation' },
                      { icon: <Lock size={24} />, title: 'Governance', desc: 'Enterprise policy controls' },
                      { icon: <Activity size={24} />, title: 'Analytics', desc: 'Detailed extraction logs' }
                    ].map(feat => (
                      <div key={feat.title} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm group hover:bg-white/10 transition-all">
                         <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform animate-tilt">{feat.icon}</div>
                         <h4 className="text-lg font-black mb-1">{feat.title}</h4>
                         <p className="text-xs text-white/40 font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="px-12 py-10 border-t border-slate-100 flex items-center justify-between opacity-50">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <Globe size={14} /> 24 Edge Nodes Active
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <CheckCircle2 size={14} /> SOC2 Type II Certified
            </div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">DocnFlow Solutions v4.8.2</p>
      </footer>
    </div>
  );
};

export default SolutionsHub;
