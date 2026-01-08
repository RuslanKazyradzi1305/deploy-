
import React from 'react';
import { useTranslation } from '../LanguageContext'; // Updated import
import { ShoppingCart, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, ArrowRight, Zap } from 'lucide-react';

const MetricCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend?: string, trendUp?: boolean, index: number }> = ({ title, value, icon, trend, trendUp, index }) => (
  <div 
    className="apple-card p-6 flex flex-col animate-in fade-in slide-in-from-bottom duration-700"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-slate-50 text-[#0046B5] rounded-2xl flex items-center justify-center shadow-inner border border-slate-100">
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

const HomeView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard index={0} title={t('home_active_proc')} value="24" icon={<ShoppingCart size={22} />} trend="+12%" trendUp={true} />
        <MetricCard index={1} title={t('home_completed')} value="142" icon={<CheckCircle size={22} />} trend="+5.4%" trendUp={true} />
        <MetricCard index={2} title={t('home_cycle_time')} value="18" icon={<Clock size={22} />} trend="-2d" trendUp={true} />
        <MetricCard index={3} title={t('home_critical')} value="3" icon={<AlertTriangle size={22} />} trend="+1" trendUp={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 apple-card p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{t('home_recent')}</h2>
              <div className="h-1.5 w-16 bg-[#0046B5] rounded-full mt-2"></div>
            </div>
            <button className="text-[#0046B5] font-black text-xs uppercase tracking-widest flex items-center gap-2 group hover:gap-4 transition-all">
              {t('home_view_all')} <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0046B5]/5 flex items-center justify-center text-[#0046B5] group-hover:bg-[#0046B5] group-hover:text-white transition-all duration-500 shadow-sm">
                    {i % 2 === 0 ? <Zap size={22} /> : <FileText size={22} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg tracking-tight uppercase group-hover:translate-x-1 transition-transform">Procurement of Spare Parts #{i}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ID: PRQ-24-0{i} • 14:30 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg">45.5M ₸</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gradient-to-br from-[#0046B5] to-[#007AFF] text-white p-10 rounded-[40px] relative overflow-hidden shadow-2xl shadow-blue-200 group animate-float">
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t('home_plan_status')}</h3>
              <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed opacity-80">Annual procurement goal fulfillment tracking</p>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-8 backdrop-blur-md">
                <div className="bg-white h-full w-[68%] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse"></div>
              </div>
              <button className="w-full bg-white text-[#0046B5] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                {t('plan_export')}
              </button>
            </div>
            <div className="absolute -right-16 -bottom-16 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Zap size={250} />
            </div>
          </div>

          <div className="apple-card p-10">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-[#0046B5] rounded-full animate-ping"></div>
              {t('home_new_suppliers')}
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Kazakh Export Corp', cat: 'Services' },
                { name: 'Almaty Tech Supply', cat: 'Parts' },
                { name: 'Central Asia Logistics', cat: 'Fuel' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-tight block">{s.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.cat}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-200 group-hover:text-[#0046B5] group-hover:translate-x-2 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileText = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

export default HomeView;
