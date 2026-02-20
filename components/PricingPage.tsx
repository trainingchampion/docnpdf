
import React, { useState, useMemo } from 'react';
import { 
  Check, Zap, ShieldCheck, CreditCard, 
  ArrowRight, Globe2, Activity, HardDrive, 
  Users, Sparkles, Building2, HelpCircle,
  Clock, Receipt, Wallet, BadgeCheck,
  ChevronDown, Search, MapPin, Globe,
  ShieldAlert, CreditCard as CardIcon,
  CheckCircle2, GraduationCap, FileSearch,
  BookOpen
} from 'lucide-react';

const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 
  'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Cote d\'Ivoire', 'Djibouti', 'Egypt', 
  'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 
  'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 
  'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 
  'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 
  'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

const GLOBAL_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'India', 'Singapore', 
  'Australia', 'Japan', 'Brazil', 'Mexico', 'United Arab Emirates', 'Saudi Arabia', 'Italy',
  'Spain', 'Netherlands', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Ireland', 'New Zealand'
];

const ALL_COUNTRIES = Array.from(new Set([...GLOBAL_COUNTRIES, ...AFRICAN_COUNTRIES])).sort();

interface PricingPageProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ selectedCountry, onCountryChange }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const isAfrica = useMemo(() => AFRICAN_COUNTRIES.includes(selectedCountry), [selectedCountry]);
  const paymentProvider = isAfrica ? 'Paystack' : 'Stripe';
  const currencySymbol = isAfrica ? '₦' : '$';

  const plans = useMemo(() => {
    const proPrice = isAfrica 
      ? (billingCycle === 'monthly' ? 28500 : 18000)
      : (billingCycle === 'monthly' ? 19 : 12);

    // Student pricing is exactly $5 per month (or ₦2,500)
    const studentPrice = isAfrica ? '2,500' : '5';
    const professionalPrice = proPrice.toLocaleString();

    return [
      {
        name: 'Starter',
        price: '0',
        description: 'Essential nodes for light personal usage.',
        features: [
          '5 Document Cycles / Day',
          'Basic Editor Access',
          '2GB Secure Vault',
          'Standard PDF Tools',
          '1 Signature request'
        ],
        buttonText: 'Current Node',
        buttonVariant: 'outline',
        highlight: false,
        theme: 'slate'
      },
      {
        name: 'Student',
        price: studentPrice,
        description: 'High-fidelity academic intelligence pass.',
        features: [
          'AI Assignment Blueprints',
          'Thesis Presentation Studio',
          'Exam Solver & Solver Node',
          'Universal AI Translator',
          '10GB Academic Vault'
        ],
        buttonText: 'Activate Student Pass',
        buttonVariant: 'student',
        highlight: false,
        theme: 'indigo',
        icon: <GraduationCap size={20} />
      },
      {
        name: 'Professional',
        price: professionalPrice,
        description: 'Advanced strategist for organizations.',
        features: [
          'Unlimited Document Cycles',
          'Gemini 3 Pro Strategist',
          '20GB High-Fidelity Vault',
          'Batch Node Processing',
          'e-Sign Studio Unlocked',
          'Organization Branding'
        ],
        buttonText: `Upgrade via ${paymentProvider}`,
        buttonVariant: 'primary',
        highlight: true,
        theme: 'blue'
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Industrial document infrastructure.',
        features: [
          'Unlimited Pipeline Nodes',
          'Dedicated GPU Clusters',
          'Multi-Entity Governance',
          'SSO / SAML 2.0 Auth',
          'Priority Node Routing',
          '24/7 Strategic Support'
        ],
        buttonText: 'Contact Strategy',
        buttonVariant: 'dark',
        highlight: false,
        theme: 'slate'
      }
    ];
  }, [billingCycle, isAfrica, paymentProvider]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto custom-scrollbar animate-in fade-in duration-700 pb-32 font-['Inter',_sans-serif]">
      {/* Hero Atmosphere */}
      <section className="bg-[#0f172a] text-white px-12 py-24 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8 shadow-2xl">
             <CreditCard size={14} className="text-blue-400" />
             <span className="text-[10px] font-[1000] uppercase tracking-[0.25em] text-blue-100">Plan Distribution Hub</span>
          </div>
          <h1 className="text-7xl font-[1000] tracking-tighter mb-6 leading-none">
            Scale your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">Document Intel.</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Access academic blueprints and high-fidelity intelligence for <b>{currencySymbol}{isAfrica ? '2,500' : '5'} per month</b>.
          </p>
        </div>
      </section>

      {/* Configuration Bar */}
      <div className="max-w-5xl mx-auto w-full px-6 -mt-10 relative z-[100]">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-lg shadow-xl">-40%</span>
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setShowCountrySelector(!showCountrySelector)}
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 transition-all text-left w-full md:min-w-[280px]"
            >
              <MapPin size={18} className="text-blue-500" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Billing Region</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{selectedCountry}</p>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${showCountrySelector ? 'rotate-180' : ''}`} />
            </button>

            {showCountrySelector && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 p-4 z-[200] animate-in zoom-in-95 duration-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Find country..." 
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-1">
                  {ALL_COUNTRIES
                    .filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
                    .map(c => (
                      <button 
                        key={c}
                        onClick={() => { onCountryChange(c); setShowCountrySelector(false); setCountrySearch(''); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedCountry === c ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        {c}
                        {AFRICAN_COUNTRIES.includes(c) && (
                          <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-md uppercase tracking-widest font-black">Africa</span>
                        )}
                        {selectedCountry === c && <Check size={14} />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <main className="max-w-[1700px] mx-auto w-full px-12 mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white dark:bg-slate-900 rounded-[3rem] p-10 flex flex-col border shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                plan.highlight ? 'border-blue-500 ring-4 ring-blue-500/5 scale-105 z-10' : 'border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-2xl font-black tracking-tight uppercase ${plan.theme === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                {plan.icon && <div className="text-indigo-600 dark:text-indigo-400">{plan.icon}</div>}
              </div>

              {plan.highlight && (
                <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full w-fit mb-8 shadow-lg">
                  Most Popular
                </div>
              )}
              
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-10 overflow-hidden">
                {plan.price !== 'Custom' && (
                  <span className="text-4xl font-black text-slate-400 self-center mb-4">{currencySymbol}</span>
                )}
                <span className="text-6xl font-[1000] tracking-tighter text-slate-900 dark:text-white truncate">
                  {plan.price}
                </span>
                {plan.price !== 'Custom' && plan.price !== '0' && (
                  <span className="text-lg font-bold text-slate-400 ml-1">/mo</span>
                )}
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {plan.features.map(feat => (
                  <div key={feat} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.theme === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                    }`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{feat}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-[1.75rem] font-black text-[13px] uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 ${
                plan.buttonVariant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20' :
                plan.buttonVariant === 'student' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20' :
                plan.buttonVariant === 'dark' ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-black transition-all' :
                'bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-default border border-slate-200 dark:border-slate-700 shadow-none'
              }`}>
                {plan.buttonVariant === 'primary' && (
                  isAfrica ? <Wallet size={16} /> : <CardIcon size={16} />
                )}
                {plan.buttonVariant === 'student' && <GraduationCap size={16} />}
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Payment Security Banner */}
      <section className="max-w-5xl mx-auto w-full px-12 mt-20">
         <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={24} className="text-emerald-500" />
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Financial Assurance</h4>
               </div>
               <p className="text-slate-400 font-medium leading-relaxed">
                 We've partnered with <span className="font-black text-slate-900 dark:text-white">{paymentProvider}</span> to provide <span className="text-emerald-600 dark:text-emerald-400 font-bold">{isAfrica ? 'Naira (NGN)' : 'Local Currency'}</span> support for {selectedCountry}. All transactions are cryptographically protected.
               </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
               <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <img 
                      src={isAfrica ? "https://upload.wikimedia.org/wikipedia/commons/3/36/Paystack_logo.png" : "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"} 
                      className="h-6 opacity-80" 
                      alt={paymentProvider} 
                    />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Localized Node</span>
               </div>
            </div>
         </div>
      </section>

      {/* Persistence Bar */}
      <footer className="px-12 py-10 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 flex items-center justify-between opacity-50 shrink-0 mt-20">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} /> PCI DSS Compliant
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
               <Globe2 size={14} /> Distributed Regional Node
            </div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-widest">Pricing Hub v5.4.0</p>
      </footer>
    </div>
  );
};

export default PricingPage;
