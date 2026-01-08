
import React from 'react';
import { AppTab } from '../types';
import { useTranslation } from '../LanguageContext';
import { 
  Home, 
  BarChart2, 
  FileText, 
  Settings, 
  // ClipboardList, // Удалено
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  
  const menuItems = [
    { id: AppTab.Home, label: t('menu_home'), icon: Home },
    { id: AppTab.Marketing, label: t('menu_marketing'), icon: BarChart2 },
    { id: AppTab.Orders, label: t('menu_orders'), icon: FileText },
    { id: AppTab.TechnicalSpec, label: t('menu_tech_spec'), icon: Settings },
    // { id: AppTab.Protocols, label: t('menu_protocols'), icon: ClipboardList }, // Удалено
    { id: AppTab.ProcurementPlan, label: t('menu_plan'), icon: Calendar },
    { id: AppTab.SuppliersDB, label: t('menu_suppliers_db'), icon: Users },
    { id: AppTab.EnsTru, label: t('menu_enstru'), icon: Database },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen glass border-r border-slate-200 transition-all duration-500 z-50 ${isOpen ? 'w-80' : 'w-20'}`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="font-black text-[#0046B5] text-lg leading-tight tracking-tighter uppercase">
            Dosjan <br /> <span className="text-slate-400 font-medium text-[10px] tracking-widest">Temir Joly</span>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-[#0046B5] hover:text-white rounded-full transition-all"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="mt-8 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[#0046B5] text-white shadow-lg shadow-[#0046B5]/20 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-[#0046B5]'
            }`}
          >
            <div className={`shrink-0 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </div>
            {isOpen && (
              <span className="font-semibold text-left text-sm tracking-tight leading-tight">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-10 left-0 w-full px-6">
        {isOpen && (
          <div className="bg-white/50 border border-white/80 p-4 rounded-3xl">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Ecosystem</p>
            <p className="text-xs font-bold text-slate-800">v2.8.5 Enterprise</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
