
import React from 'react';
import { AppTab, Language } from '../types';
import { useTranslation } from '../LanguageContext'; // Updated import
import { Bell, Search, User, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const { t, lang, setLang } = useTranslation();

  const getTitle = () => {
    switch (activeTab) {
      case AppTab.Home: return t('menu_home');
      case AppTab.Marketing: return t('menu_marketing');
      case AppTab.Orders: return t('menu_orders');
      case AppTab.TechnicalSpec: return t('menu_tech_spec');
      // case AppTab.Protocols: return t('menu_protocols'); // Удалено
      case AppTab.ProcurementPlan: return t('menu_plan');
      case AppTab.SuppliersDB: return t('menu_suppliers_db');
      case AppTab.EnsTru: return t('menu_enstru');
      default: return 'Dosjan Temir Joly';
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'RU' },
    { code: 'kk', label: 'KZ' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <header className="h-20 glass border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase animate-in slide-in-from-left duration-500">{getTitle()}</h1>
        <div className="h-1 w-12 bg-[#0046B5] rounded-full mt-1"></div>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 items-center">
          <Globe size={14} className="ml-2 mr-1 text-slate-400" />
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                lang === l.code ? 'bg-white text-[#0046B5] shadow-sm' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="relative hidden lg:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0046B5] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={t('header_search')}
            className="pl-12 pr-6 py-2.5 bg-slate-100/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-[#0046B5]/20 w-64 outline-none transition-all"
          />
        </div>

        <button className="relative p-3 hover:bg-white rounded-full transition-all group border border-transparent hover:border-slate-100">
          <Bell size={18} className="text-slate-600 group-hover:scale-110 transition-transform" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-[#0046B5] rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{t('header_admin')}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{t('header_dept')}</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-[#0046B5] to-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 cursor-pointer overflow-hidden transform hover:rotate-6 transition-transform">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
