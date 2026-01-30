
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Key, Activity, Users, Building2, 
  ArrowRight, Download, Search, Filter, 
  CheckCircle2, AlertCircle, Clock, Globe, 
  Zap, Database, Lock, Server, MoreVertical,
  ChevronRight, UserPlus, Mail, ShieldCheck,
  Smartphone, ExternalLink, X, Loader2, Sparkles,
  Terminal, RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { FormattedResponse } from './AIModal';

type AdminTab = 'governance' | 'audit' | 'multi-org';

interface EnterpriseConsoleProps {
  initialTab?: AdminTab;
}

interface OrgUnit {
  id: string;
  name: string;
  users: number;
  docs: number;
  storage: string;
  status: 'healthy' | 'active' | 'warning';
}

const EnterpriseConsole: React.FC<EnterpriseConsoleProps> = ({ initialTab = 'governance' }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sync internal state if prop changes (external navigation trigger)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Governance State
  const [mfaForced, setMfaForced] = useState(true);
  const [sharingRestricted, setSharingRestricted] = useState(true);
  const [autoProvisioning, setAutoProvisioning] = useState(false);
  const [ssoUrl, setSsoUrl] = useState('https://sso.docnpdf.ai/v1/auth/74X9-P2');
  
  // Multi-Org State
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([
    { id: 'na', name: 'North America Operations', users: 450, docs: 12400, storage: '840GB', status: 'healthy' },
    { id: 'eu', name: 'EMEA Legal Hub', users: 120, docs: 4200, storage: '1.2TB', status: 'active' },
    { id: 'apac', name: 'APAC Sales Node', users: 85, docs: 1100, storage: '240GB', status: 'active' },
  ]);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // AI Audit State
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);

  // Audit Logs
  const initialLogs = [
    { id: '1', user: 'alex.rivera@docnpdf.ai', action: 'Document Signed', doc: 'Q4_Projections.pdf', time: '2 mins ago', status: 'verified', ip: '192.168.1.45' },
    { id: '2', user: 'system.node.ny', action: 'AES-256 Rotation', doc: 'Vault Index', time: '14 mins ago', status: 'automated', ip: '10.0.4.12' },
    { id: '3', user: 'sarah.chen@docnpdf.ai', action: 'Doc Exported', doc: 'Confidential_M&A.doc', time: '1 hour ago', status: 'logged', ip: '172.16.2.8' },
    { id: '4', user: 'jordan.s@docnpdf.ai', action: 'New Signer Added', doc: 'Vendor_Agreement_v4.pdf', time: '3 hours ago', status: 'verified', ip: '192.168.1.102' },
    { id: '5', user: 'alex.rivera@docnpdf.ai', action: 'Permissions Modified', doc: 'Legal_Archive', time: '5 hours ago', status: 'caution', ip: '192.168.1.45' },
  ];

  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.doc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleProvisionNode = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      const newOrg: OrgUnit = {
        id: Math.random().toString(36).substr(2, 4),
        name: `Node ${orgUnits.length + 1} - New Entity`,
        users: 1,
        docs: 0,
        storage: '0GB',
        status: 'healthy'
      };
      setOrgUnits([newOrg, ...orgUnits]);
      setIsProvisioning(false);
    }, 1500);
  };

  const runAIAudit = async () => {
    setIsAuditRunning(true);
    setAuditReport(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const configSummary = `
        Current Enterprise Config:
        - MFA Forced: ${mfaForced}
        - Public Sharing Restricted: ${sharingRestricted}
        - Auto-Provisioning: ${autoProvisioning}
        - Total Nodes: ${orgUnits.length}
        - Recent Activity: ${initialLogs.slice(0, 3).map(l => l.action).join(', ')}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a high-level security governance audit for this enterprise configuration. 
        Format your response as a professional executive report.
        1. Use **BOLD HEADINGS** for sections.
        2. Use !!CRITICAL HIGHLIGHTS!! for urgent risks or alerts.
        3. Use ==STANDARD HIGHLIGHTS== for key findings.
        4. Use plain text without markdown hashes (#).
        Required sections: **STATUS OVERVIEW**, **SECURITY RISK ASSESSMENT**, **STRATEGIC RECOMMENDATIONS**.
        ${configSummary}`,
      });

      setAuditReport(response.text || "Audit failed to generate.");
    } catch (e) {
      setAuditReport("Connectivity error during security scan. Please ensure your API key is valid.");
    } finally {
      setIsAuditRunning(false);
    }
  };

  const renderGovernance = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SSO Config Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">SSO & SCIM Setup</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">SAML 2.0 • OIDC • OKTA</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Provisioning Status</p>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${autoProvisioning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                   <span className="text-sm font-bold text-slate-900">
                     {autoProvisioning ? 'Active Sync with Provider' : 'Manual Provisioning Only'}
                   </span>
                 </div>
                 <button 
                  onClick={() => setAutoProvisioning(!autoProvisioning)}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                 >
                   {autoProvisioning ? 'Disable SCIM' : 'Enable SCIM'}
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SSO Endpoint URL</label>
                  <div className="flex gap-2">
                    <input 
                      value={ssoUrl}
                      onChange={(e) => setSsoUrl(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
                    />
                    <button onClick={() => navigator.clipboard.writeText(ssoUrl)} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Copy</button>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Smartphone size={16} className={mfaForced ? "text-emerald-500" : "text-slate-400"} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  MFA Policy: {mfaForced ? 'Enforced' : 'Optional'}
                </span>
             </div>
             <button 
              onClick={() => setMfaForced(!mfaForced)}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${mfaForced ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none' : 'bg-blue-600 text-white shadow-blue-500/20'}`}
             >
               {mfaForced ? 'Disable Force MFA' : 'Enforce MFA Global'}
             </button>
          </div>
        </div>

        {/* Security Summary Dashboard */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <ShieldCheck size={28} className="text-emerald-400" />
              <h3 className="text-xl font-black tracking-tight">Active Governance</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">CRYPTOGRAPHIC STATUS</p>
                  <p className="text-2xl font-black tracking-tighter">AES-256</p>
                  <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-widest flex items-center gap-1.5"><RefreshCw size={10} /> Rotated Today</p>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3">NODE LATENCY</p>
                  <p className="text-2xl font-black tracking-tighter">14ms</p>
                  <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-widest">Optimized</p>
               </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4 mt-12">
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                   <Users size={16} className="text-white/40" />
                   <span className="text-xs font-bold">New User Auto-Provisioning</span>
                </div>
                <button 
                  onClick={() => setAutoProvisioning(!autoProvisioning)}
                  className={`w-10 h-5 rounded-full relative p-1 transition-colors ${autoProvisioning ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoProvisioning ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
             </div>
             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                   <Lock size={16} className="text-white/40" />
                   <span className="text-xs font-bold">Public Sharing Restriction</span>
                </div>
                <button 
                  onClick={() => setSharingRestricted(!sharingRestricted)}
                  className={`w-10 h-5 rounded-full relative p-1 transition-colors ${sharingRestricted ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform ${sharingRestricted ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* AI Audit Trigger Section */}
      <div className="bg-[#f0f7ff] rounded-[3rem] p-12 border border-blue-100 flex flex-col items-center text-center">
         {isAuditRunning ? (
           <div className="flex flex-col items-center">
              <Loader2 size={48} className="text-blue-600 animate-spin mb-6" />
              <h3 className="text-2xl font-[1000] text-blue-900 tracking-tighter">Mina is scanning your enterprise infrastructure...</h3>
              <p className="text-blue-700/60 mt-2 font-medium uppercase tracking-[0.2em] text-[10px]">Checking cross-node latency and cryptographic integrity</p>
           </div>
         ) : auditReport ? (
           <div className="w-full text-left">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-blue-100/50">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Sparkles size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-[1000] text-blue-900 tracking-tighter uppercase leading-none">Security Governance Report</h3>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2">Generated by Mina v5.2 Node-A1</p>
                   </div>
                 </div>
                 <button onClick={() => setAuditReport(null)} className="p-3 hover:bg-blue-100 rounded-2xl text-blue-400 transition-all"><X size={24} /></button>
              </div>
              <div className="bg-white rounded-[2.5rem] p-12 lg:p-16 border border-blue-100 shadow-2xl overflow-auto max-h-[600px] custom-scrollbar prose prose-blue prose-sm max-w-none">
                <FormattedResponse text={auditReport} themeColor="#135bec" />
              </div>
              <div className="mt-12 flex justify-end gap-4">
                 <button onClick={runAIAudit} className="px-10 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100">Re-Scan Infrastructure</button>
                 <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95">
                    <Download size={18} /> Export Audit (.PDF)
                 </button>
              </div>
           </div>
         ) : (
           <>
             <Sparkles size={40} className="text-blue-600 mb-6 animate-pulse" />
             <h3 className="text-3xl font-[1000] text-blue-900 tracking-tighter mb-4 uppercase">Run AI Governance Scan</h3>
             <p className="text-blue-700/60 text-lg font-medium max-w-xl mb-10 leading-relaxed">
               Let Mina analyze your current organizational settings, node distribution, and audit history to identify potential policy gaps or cryptographic risks.
             </p>
             <button 
              onClick={runAIAudit}
              className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.25em] hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all active:scale-95 group"
             >
                <RefreshCw size={18} className="inline mr-3 group-hover:rotate-180 transition-transform duration-700" />
                Initialize Intelligence Scan
             </button>
           </>
         )}
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user, doc, or IP (e.g. 'alex', '192.168', 'rotation')..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-transparent border focus:bg-white focus:border-blue-400 rounded-2xl text-sm font-bold outline-none transition-all shadow-inner"
            />
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-rose-500"><X size={18} /></button>
          )}
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 whitespace-nowrap">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        {filteredLogs.length > 0 ? (
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network IP</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Log</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-12">Assurance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map(log => (
                <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{log.user}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Enterprise ID: v4-{log.id}82</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-700">{log.action}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Database size={14} className="text-slate-300" />
                      <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{log.doc}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <code className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-widest">{log.ip}</code>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[11px] font-bold text-slate-600">{log.time}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right pr-12">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       log.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                       log.status === 'automated' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                       log.status === 'caution' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                       'bg-slate-50 text-slate-500 border-slate-100'
                     }`}>
                       {log.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-32 text-center flex flex-col items-center opacity-30">
             <Search size={64} className="mb-4" />
             <p className="text-xl font-[1000] uppercase tracking-widest">No Events Match Query</p>
             <p className="text-sm font-bold mt-2">Adjust your filters to see more activity logs.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMultiOrg = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
        <div className="flex-1 max-w-xl">
           <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter mb-4 leading-none">Hierarchical Organization Management</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed">
             Govern distinct document ecosystems for global branches while maintaining centralized policy control. Each unit can maintain its own storage node and user directory.
           </p>
           <button 
            disabled={isProvisioning}
            onClick={handleProvisionNode}
            className="mt-10 flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
           >
             {isProvisioning ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={16} />}
             {isProvisioning ? 'Provisioning New Node...' : 'Provision New Org Unit'}
           </button>
        </div>

        <div className="w-full lg:w-[450px] bg-slate-50 border border-slate-100 rounded-[3rem] p-10">
           <div className="flex items-center gap-3 mb-8">
             <Globe size={20} className="text-blue-500" />
             <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Node Geography</h4>
           </div>
           <div className="space-y-6">
              {[
                { region: 'United States', status: 'Healthy', latency: '4ms' },
                { region: 'European Union', status: 'Healthy', latency: '22ms' },
                { region: 'Southeast Asia', status: 'Healthy', latency: '14ms' }
              ].map(n => (
                <div key={n.region} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${n.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-sm font-bold">{n.region}</span>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.latency}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {orgUnits.map(org => (
           <div key={org.id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.05)] transition-all duration-500 hover:border-blue-200">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
                  <Building2 size={28} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                   <div className={`w-1 h-1 rounded-full ${org.status === 'healthy' || org.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{org.status}</span>
                </div>
              </div>

              <h4 className="text-xl font-black text-slate-900 tracking-tight mb-8 leading-tight">{org.name}</h4>

              <div className="space-y-4 mb-10">
                 <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Active Users</span>
                    <span className="text-slate-900">{org.users}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Vault Assets</span>
                    <span className="text-slate-900">{org.docs}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Encrypted Storage</span>
                    <span className="text-slate-900">{org.storage}</span>
                 </div>
              </div>

              <button className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3">
                 Manage Entity <ChevronRight size={14} />
              </button>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      {/* Header Atmosphere */}
      <section className="bg-[#0f172a] text-white px-12 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8">
              <ShieldCheck size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Admin Command Center v4.8</span>
            </div>
            <h1 className="text-5xl font-[1000] tracking-tighter leading-none mb-6">Enterprise Console.</h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              Centralized governance for global document operations. Manage security protocols, audit trails, and multi-entity hierarchies from a single command node.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-8 shadow-2xl">
                <div>
                   <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Vault Uptime</p>
                   <p className="text-lg font-black text-blue-400">99.998%</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                   <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Users</p>
                   <p className="text-lg font-black text-white">{orgUnits.reduce((a,b) => a + b.users, 0)}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Sub Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
              <button 
                onClick={() => setActiveTab('governance')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'governance' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Governance (SSO)
              </button>
              <button 
                onClick={() => setActiveTab('audit')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'audit' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Audit Explorer
              </button>
              <button 
                onClick={() => setActiveTab('multi-org')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'multi-org' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Hierarchy
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Globe size={14} className="text-blue-500" /> All Regions Reporting
              </span>
           </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <main className="flex-1 p-12 lg:p-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'governance' && renderGovernance()}
          {activeTab === 'audit' && renderAudit()}
          {activeTab === 'multi-org' && renderMultiOrg()}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="px-12 py-10 border-t border-slate-100 bg-white flex items-center justify-between opacity-50 shrink-0 mt-20">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} /> Cryptographic Layer AES-256 Verified
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <Database size={14} /> Distributed Node Synced
            </div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">DocnPDF Admin v5.1.0-Release</p>
      </footer>
    </div>
  );
};

export default EnterpriseConsole;
