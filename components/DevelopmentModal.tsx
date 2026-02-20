
import React from 'react';
import { X, Wrench, ShieldAlert, Rocket, ArrowRight, Construction, Timer } from 'lucide-react';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevelopmentModal: React.FC<DevelopmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-xl group">
        {/* Layered Depth Effect */}
        <div className="absolute w-[105%] h-[105%] bg-blue-600/10 rounded-[4rem] -top-[2.5%] -left-[2.5%] blur-2xl animate-pulse" />
        
        <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-12 text-center flex flex-col items-center">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="relative mb-10">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-700">
              <Construction size={48} strokeWidth={1.5} className="animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-xl">
              <ShieldAlert size={18} fill="currentColor" className="text-white" />
            </div>
          </div>

          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full">
              <Timer size={14} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">System Optimization in Progress</span>
            </div>
            <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
              IAM Node <br /> <span className="text-blue-600">Offline.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-sm mx-auto">
              Our engineering team is currently scaling the <b>Identity & Access Management</b> cluster to support high-fidelity enterprise workloads.
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-left flex items-start gap-4">
              <Rocket size={20} className="text-blue-500 shrink-0 mt-1" />
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight leading-relaxed">
                Public access nodes are being rotated. You can still explore the <span className="text-blue-600 dark:text-blue-400">Documentation</span> and <span className="text-blue-600 dark:text-blue-400">Product Previews</span> while we complete the sync.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.25em] hover:bg-blue-600 dark:hover:bg-blue-50 transition-all shadow-xl active:scale-95"
            >
              Continue Exploring
            </button>
          </div>

          <p className="mt-8 text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">
            Deployment Stage: Alpha v5.4-SCIM
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModal;
