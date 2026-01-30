
import React, { useState } from 'react';
import { 
  X, Users, UserPlus, Mail, Shield, 
  Link as LinkIcon, Check, Copy, Globe, 
  Settings, Lock, MessageSquare, Sparkles,
  ChevronDown, ArrowRight, UserCheck, ShieldCheck,
  EyeOff, Printer, Download, Share2, Eye,
  ShieldAlert, Fingerprint
} from 'lucide-react';

interface Collaborator {
  id: string;
  email: string;
  role: 'Viewer' | 'Editor' | 'Admin';
  status: 'active' | 'pending';
  avatar: string;
}

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onInvite: (emails: string[]) => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose, fileName, onInvite }) => {
  const [activeView, setActiveView] = useState<'members' | 'policies'>('members');
  const [emailInput, setEmailInput] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Viewer' | 'Editor' | 'Admin'>('Editor');
  
  // Policy States
  const [policies, setPolicies] = useState({
    restrictedDomain: true,
    allowPrinting: false,
    allowDownloads: true,
    requireMFA: true,
    publicLink: false,
    aiOversight: true
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: '1', email: 'alex.rivera@enterprise.com', role: 'Admin', status: 'active', avatar: 'https://picsum.photos/seed/alex/100/100' },
    { id: '2', email: 'sarah.c@docnpdf.ai', role: 'Editor', status: 'active', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: '3', email: 'jordan.s@vault.io', role: 'Viewer', status: 'pending', avatar: 'https://picsum.photos/seed/jordan/100/100' },
  ]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const link = `https://docnpdf.ai/share/${Math.random().toString(36).substr(2, 9)}`;
    navigator.clipboard.writeText(link);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    const newCollab: Collaborator = {
      id: Math.random().toString(36).substr(2, 9),
      email: emailInput,
      role: selectedRole,
      status: 'pending',
      avatar: `https://picsum.photos/seed/${emailInput}/100/100`
    };
    
    setCollaborators([newCollab, ...collaborators]);
    setEmailInput('');
    onInvite([emailInput]);
  };

  const togglePolicy = (key: keyof typeof policies) => {
    setPolicies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 bg-[#0f172a] text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between relative z-10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-[1000] tracking-tighter leading-none">Collaboration Studio</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                  Project Hub: <span className="text-blue-400">"{fileName}"</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Sub Navigation (Settings Switcher) */}
          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit relative z-10">
             <button 
              onClick={() => setActiveView('members')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'members' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               <Users size={14} /> Active Members
             </button>
             <button 
              onClick={() => setActiveView('policies')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'policies' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               <Settings size={14} /> Security Policies
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 space-y-10 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white">
          
          {activeView === 'members' ? (
            <>
              {/* Invite Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Mail size={14} className="text-slate-400" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Add New Teammates</h3>
                </div>
                <form onSubmit={handleAddCollaborator} className="flex gap-3">
                  <div className="flex-1 relative group">
                    <input 
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-6 pr-32 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        className="bg-white border border-slate-200 text-[10px] font-black uppercase rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-blue-300 transition-all"
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                  >
                    Invite
                  </button>
                </form>
              </section>

              {/* Collaborator List */}
              <section>
                <div className="flex items-center justify-between mb-6 px-2">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active & Pending</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{collaborators.length} Members</span>
                </div>
                
                <div className="space-y-3">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all hover:shadow-lg hover:shadow-blue-500/[0.02]">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={collab.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
                          {collab.status === 'active' ? (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                          ) : (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-200 border-2 border-white rounded-full shadow-sm" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{collab.email}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {collab.status === 'pending' ? 'Invite Sent' : collab.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600">
                          <Settings size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-50 rounded-xl transition-all text-slate-300 hover:text-rose-500">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* Policy Settings View (Contextual Collaboration Settings) */
            <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { key: 'restrictedDomain', icon: <Globe size={18} />, label: 'Restrict to Organization Domain', desc: 'Only users with verified organizational emails can join.' },
                    { key: 'publicLink', icon: <Share2 size={18} />, label: 'Enable Public Share Link', desc: 'Allows anyone with the cryptographic link to view the file.' },
                    { key: 'requireMFA', icon: <Fingerprint size={18} />, label: 'Enforce Biometric/MFA Login', desc: 'External users must verify identity via secondary node.' },
                    { key: 'allowPrinting', icon: <Printer size={18} />, label: 'Allow Document Printing', desc: 'Permit collaborators to output physical copies.' },
                    { key: 'allowDownloads', icon: <Download size={18} />, label: 'Allow Export & Download', desc: 'Permit users to save local copies of this intelligence.' },
                    { key: 'aiOversight', icon: <Sparkles size={18} />, label: 'Mina Intelligence Oversight', desc: 'AI monitoring for PII leaks and non-compliant edits.' }
                  ].map((policy) => (
                    <div key={policy.key} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-colors group">
                       <div className="flex gap-4">
                          <div className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-blue-600 transition-colors">
                            {policy.icon}
                          </div>
                          <div>
                             <p className="text-[14px] font-bold text-slate-900 leading-tight">{policy.label}</p>
                             <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">{policy.desc}</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => togglePolicy(policy.key as any)}
                        className={`w-12 h-6 rounded-full relative p-1 transition-all duration-300 shrink-0 ${policies[policy.key as keyof typeof policies] ? 'bg-blue-600' : 'bg-slate-200'}`}
                       >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${policies[policy.key as keyof typeof policies] ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>
                  ))}
               </div>

               <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-start gap-4">
                  <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[12px] font-black text-amber-900 uppercase tracking-widest mb-1">Governance Notice</h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">Policy modifications are logged in the enterprise audit trail. Some changes may require secondary Admin approval.</p>
                  </div>
               </div>
            </section>
          )}

          {/* Secure Link Section (Always Visible at bottom of scrolling area) */}
          <section className="pt-6 border-t border-slate-50">
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">Secure Invite Link</h4>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Transient Access Node</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-white border border-blue-100 rounded-xl px-4 flex items-center text-[11px] font-mono text-blue-700 overflow-hidden truncate">
                  docnpdf.ai/share/shk-492-xlp
                </div>
                <button 
                  onClick={handleCopyLink}
                  className={`px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shrink-0 ${
                    isLinkCopied ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {isLinkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enterprise Secure Tunnel</span>
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Studio v5.2 Collaboration Hub</p>
        </div>

      </div>
    </div>
  );
};

export default CollaborationModal;
