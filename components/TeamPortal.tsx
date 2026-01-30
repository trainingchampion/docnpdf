
import React, { useState } from 'react';
import { 
  Users, UserPlus, MessageSquare, Share2, 
  Shield, Mail, Settings, MoreVertical, 
  CheckCircle2, Clock, Globe, Zap, 
  FileText, ArrowUpRight, Search, Inbox,
  ShieldAlert, Activity
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  email: string;
  status: 'online' | 'offline';
  avatar: string;
  lastActive: string;
}

interface SharedDoc {
  id: string;
  name: string;
  owner: string;
  sharedOn: string;
  viewers: number;
}

const TeamPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');

  // Cleared simulated data
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [sharedDocs, setSharedDocs] = useState<SharedDoc[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
            <Users size={24} />
          </div>
          <h4 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white">{members.length}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Collaborators</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={24} />
          </div>
          <h4 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white">{sharedDocs.length}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Shared Documents</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h4 className="text-4xl font-[1000] tracking-tighter text-slate-900 dark:text-white">0</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AI Interactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Shared Files */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Shared with Team</h3>
          </div>
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center p-12 text-center opacity-40">
             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <Inbox size={32} className="text-slate-400" />
             </div>
             <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">No Shared Assets</p>
             <p className="text-xs text-slate-400 mt-2 font-medium">Documents shared with your workspace will appear here.</p>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
          <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-10 relative z-10">WORKSTREAM ACTIVITY</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 relative z-10">
             <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                <Activity size={24} className="text-white/20" />
             </div>
             <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">Log clear. Standing by.</p>
          </div>

          <button className="w-full mt-auto py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all cursor-default">
            Audit Log Initialized
          </button>
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <UserPlus size={16} /> Invite Colleague
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {members.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {members.map(member => (
                <tr key={member.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                        {member.status === 'online' && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      member.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                      member.role === 'Editor' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      'bg-slate-50 text-slate-500 border-slate-100'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-[11px] font-bold text-slate-600">{member.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6 opacity-30">
                <Users size={40} className="text-slate-400" />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Workspace Empty</h3>
             <p className="text-slate-400 font-medium max-w-sm px-8">No teammates have been invited to this node yet. Use the button above to begin collaborating.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-12 lg:p-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 dark:text-white leading-none pt-2">Team Portal</h1>
          </div>
          <p className="text-slate-400 font-medium text-lg">Central intelligence for high-performance team collaboration.</p>
        </div>

        <div className="flex items-center p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'overview' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'members' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Directory
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'members' && renderMembers()}
      {activeTab === 'settings' && (
        <div className="p-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
             <Settings size={40} />
           </div>
           <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Enterprise Governance</h3>
           <p className="text-slate-400 font-medium max-w-sm">Permissions, workspace branding, and security policies are managed by the organizational administrator.</p>
        </div>
      )}
    </div>
  );
};

export default TeamPortal;
