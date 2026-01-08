
import React, { useState } from 'react';
import { useTranslation } from '../LanguageContext'; // Updated import
import { Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert, Star, UserPlus, Clock } from 'lucide-react';

const SuppliersDBView: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const suppliers = [
    { id: '1', name: 'TechnoSnab Almaty', bin: '980123445566', category: 'Spare Parts', rating: 4.8, status: 'Active', contracts: 12 },
    { id: '2', name: 'WayTrade Astana', bin: '051234556677', category: 'Construction', rating: 3.5, status: 'Pending', contracts: 4 },
    { id: '3', name: 'Global Logistics KZ', bin: '110544552233', category: 'Logistics', rating: 4.9, status: 'Active', contracts: 28 },
    { id: '4', name: 'Blacklist Corp IE', bin: '990112233445', category: 'Services', rating: 1.2, status: 'Blacklisted', contracts: 1 },
    { id: '5', name: 'EnergoSbyt Karaganda', bin: '020444556611', category: 'Electricity', rating: 4.5, status: 'Active', contracts: 56 },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative flex-1 w-full max-w-lg group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0046B5] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={t('suppliers_search')} 
            className="w-full pl-14 pr-8 py-4 bg-white apple-card border-transparent focus:border-[#0046B5]/20 outline-none transition-all font-semibold text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center gap-3 px-8 py-4 bg-white apple-card text-slate-900 font-black text-[10px] uppercase tracking-widest hover:border-[#0046B5]/20">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-3 px-10 py-4 bg-[#0046B5] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group">
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            {t('suppliers_add')}
          </button>
        </div>
      </div>

      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('suppliers_org')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">BIN</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('suppliers_rating')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('common_status')}</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">{t('common_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/30 transition-all group cursor-default">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0046B5] to-[#007AFF] text-white flex items-center justify-center text-sm font-black group-hover:rotate-6 transition-transform">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base uppercase tracking-tight leading-none mb-1.5">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.contracts} {t('contracts_active')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-slate-500 font-mono">{s.bin}</td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span className="font-black text-slate-900 text-base">{s.rating}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {s.status === 'Active' && (
                      <span className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <ShieldCheck size={16} /> {s.status}
                      </span>
                    )}
                    {s.status === 'Blacklisted' && (
                      <span className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                        <ShieldAlert size={16} /> {s.status}
                      </span>
                    )}
                    {s.status === 'Pending' && (
                      <span className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 italic">
                        <Clock size={16} /> {s.status}
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuppliersDBView;
