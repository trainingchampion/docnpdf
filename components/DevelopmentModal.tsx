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
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModal;
