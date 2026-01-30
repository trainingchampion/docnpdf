import React, { useState } from 'react';
import { X, Check, Zap, ShieldCheck, CreditCard, GraduationCap, ArrowRight, Sparkles, FileSearch, BookOpen, Globe } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onActivateStudentPass?: () => void;
  trigger: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, onActivateStudentPass, trigger }) => {
  const [passCode, setPassCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleActivatePass = () => {
    // Updated to NEWYME2026 as requested by the user
    if (passCode.toUpperCase() === 'NEWYME2026') {
      onActivateStudentPass?.();
      setPassCode('');
      setError('');
    } else {
      setError('Invalid student code. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Left: Value Prop */}
        <div className="flex-1 bg-[#002D56] text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_70%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full mb-6">
              <Zap size={14} className="text-amber-300 fill-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Feature Locked</span>
            </div>
            <h2 className="text-4xl font-[1000] tracking-tighter mb-4 leading-[0.95]">
              Unlock the full <br />
              <span className="text-blue-400">Intelligence.</span>
            </h2>
            <p className="text-blue-100/80 font-medium text-lg leading-relaxed">
              You hit a limit on the Free plan. {trigger} is available exclusively on Student, Professional, and Enterprise tiers.
            </p>
          </div>
          
          <div className="relative z-10 space-y-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} strokeWidth={3} /></div>
              <span className="text-sm font-bold">Unlimited AI Analysis & Chat</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} strokeWidth={3} /></div>
              <span className="text-sm font-bold">Access 500+ Premium Blueprints</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Check size={14} strokeWidth={3} /></div>
              <span className="text-sm font-bold">Remove DocnPDF Branding</span>
            </div>
          </div>
        </div>

        {/* Right: Plans & Student Pass */}
        <div className="flex-1 p-10 bg-white flex flex-col justify-center">
           <div className="text-center mb-8">
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Upgrade Workspace</h3>
             <p className="text-slate-500 font-medium text-sm">Choose a plan to instantly unlock this feature.</p>
           </div>

           <div className="space-y-4">
             <button 
               onClick={onUpgrade}
               className="w-full p-4 border-2 border-blue-600 bg-blue-50/50 rounded-2xl flex items-center justify-between group hover:bg-blue-600 hover:text-white transition-all"
             >
               <div className="text-left">
                 <p className="text-xs font-black uppercase tracking-widest text-blue-600 group-hover:text-white">Professional</p>
                 <p className="text-sm font-medium text-slate-600 group-hover:text-blue-100">For power users</p>
               </div>
               <div className="text-right">
                 <p className="text-xl font-black text-slate-900 group-hover:text-white">$12<span className="text-xs font-normal opacity-70">/mo</span></p>
               </div>
             </button>

             <div className="h-px bg-slate-100 my-2" />

             {/* Student Pass Section */}
             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={18} className="text-indigo-600" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Student Intelligence Pass</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                   <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <BookOpen size={14} className="text-indigo-600 mb-1" />
                      <span className="text-[8px] font-black uppercase leading-none">Reader</span>
                   </div>
                   <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <FileSearch size={14} className="text-indigo-600 mb-1" />
                      <span className="text-[8px] font-black uppercase leading-none">Extractor</span>
                   </div>
                   <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <Globe size={14} className="text-indigo-600 mb-1" />
                      <span className="text-[8px] font-black uppercase leading-none">Translator</span>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter code (NEWYME2026)" 
                      value={passCode}
                      onChange={(e) => setPassCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-widest outline-none focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>
                  {error && <p className="text-[10px] text-rose-500 font-bold px-1">{error}</p>}
                  <button 
                    onClick={handleActivatePass}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    Activate 10 Day Pass <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 mt-4 text-center font-medium leading-relaxed">
                  Grants 10-day high-fidelity access to Reader, Extractor, and Translator nodes for just <b>$5 per month</b>.
                </p>
             </div>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
               <ShieldCheck size={14} className="text-emerald-500" />
               30-day money back guarantee
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;