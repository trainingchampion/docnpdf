
import React from 'react';
import { X, User, Users, CheckCircle2, ExternalLink, ShieldCheck, Mail, Home, FileText, ArrowRight, MousePointer2 } from 'lucide-react';

interface SignFlowProps {
  fileName: string;
  onClose: () => void;
  onSignMyself: () => void;
  onGetSignatures: () => void;
}

const SignFlow: React.FC<SignFlowProps> = ({ fileName, onClose, onSignMyself, onGetSignatures }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-12 py-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900 group">
              <Home size={20} />
              <span className="text-[12px] font-black uppercase tracking-widest hidden group-hover:inline">Back Home</span>
            </button>
            <div>
              <h2 className="text-[40px] font-[1000] text-[#0f172a] tracking-tight leading-none">Who's signing?</h2>
              <p className="text-slate-400 font-medium mt-2 text-lg">
                Ready to finalize <span className="text-[#0f172a] font-bold">"{fileName}"</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <X size={28} />
          </button>
        </div>

        {/* Options Content */}
        <div className="flex-1 px-12 pb-14 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Sign Myself Option */}
          <div className="flex flex-col group h-full">
            <div className="flex-1 bg-blue-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-300 transition-all p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
               <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-blue-600 shadow-xl mb-10 group-hover:scale-110 transition-transform duration-500">
                  <User size={48} strokeWidth={1.5} />
               </div>
               
               <div className="text-center mb-12">
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Sign Myself</h4>
                  <p className="text-sm text-slate-500 font-medium max-w-[240px] mx-auto leading-relaxed">Add your own signature, initials, and date nodes instantly.</p>
               </div>
               
               <button 
                onClick={onSignMyself}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                 Go to Studio <ArrowRight size={18} />
               </button>
            </div>
          </div>

          {/* Get Signatures Option */}
          <div className="flex flex-col group h-full">
            <div className="flex-1 bg-emerald-50 rounded-[2.5rem] border-2 border-transparent hover:border-emerald-300 transition-all p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
               <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-xl mb-10 group-hover:scale-110 transition-transform duration-500">
                  <Users size={48} strokeWidth={1.5} />
               </div>

               <div className="text-center mb-12">
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Collect Signatures</h4>
                  <p className="text-sm text-slate-500 font-medium max-w-[240px] mx-auto leading-relaxed">Send document to recipients with tracked signing nodes.</p>
               </div>

               <button 
                onClick={onGetSignatures}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                 Setup Request <ExternalLink size={18} className="ml-1" />
               </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-12 py-8 bg-[#f8fafc] border-t border-slate-100 flex items-center justify-center gap-2 opacity-60">
           <ShieldCheck size={20} className="text-emerald-500" />
           <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] ml-1">Secure High-Fidelity Infrastructure</span>
           <div className="mx-6 h-4 w-px bg-slate-200" />
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank-Level Cryptographic Tunnel</p>
        </div>
      </div>
    </div>
  );
};

export default SignFlow;
