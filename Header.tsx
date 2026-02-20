
import React, { useState } from 'react';
import { Search, Bell, Settings, User, X } from 'lucide-react';

interface HeaderProps {
  onAction: (message: string) => void;
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAction, onSearch }) => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = ['Dashboard', 'Documents', 'Team'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onAction('Back to Home')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-md">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">OmniPDF</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                onAction(`Switched to ${item}`);
              }}
              className={`text-sm font-semibold transition-all hover:text-blue-600 active:scale-95 ${
                activeNav === item ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block group">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-blue-500' : 'text-gray-400'}`} size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search tools (e.g. 'merge')..." 
            className="pl-10 pr-10 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full text-sm outline-none w-72 transition-all shadow-inner font-medium"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => onAction('Notifications opened')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all active:scale-90 hover:text-blue-600"
        >
          <Bell size={20} />
        </button>
        <button 
          onClick={() => onAction('Settings opened')}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all active:scale-90 hover:text-blue-600"
        >
          <Settings size={20} />
        </button>
        
        <div 
          onClick={() => onAction('Profile settings')}
          className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 cursor-pointer overflow-hidden border border-blue-200 active:scale-90 transition-transform shadow-sm"
        >
           <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
