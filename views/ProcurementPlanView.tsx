
import React, { useState, useMemo } from 'react';
import { useTranslation } from '../LanguageContext';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ChevronRight, 
  MoreHorizontal, 
  Eye, 
  Table as TableIcon,
  X,
  MapPin,
  Calendar as CalendarIcon,
  Wallet,
  Tag,
  Save,
  Trash2,
  FilterX
} from 'lucide-react';

interface PlanItem {
  id: number;
  type: string;
  subjectType: string;
  struCode: string;
  nameKk: string;
  nameRu: string;
  descKk: string;
  descRu: string;
  extraKk: string;
  extraRu: string;
  budgetName: string;
  method: string;
  unit: string;
  quantity: number;
  marketingPrice: number;
  totalSum2026: number;
  sum2026: number;
  plannedMonth: string;
  termKk: string;
  termRu: string;
  katoCode: string;
  placeKk: string;
  placeRu: string;
  advancePercent: number;
  initiator: string;
}

const INITIAL_DATA: PlanItem[] = [
  {
    id: 1,
    type: 'Первичный',
    subjectType: 'Услуга',
    struCode: '611011.000.000000',
    nameKk: 'Интернетке қол жеткізу қызметтері',
    nameRu: 'Услуги по доступу к Интернету',
    descKk: 'Интернетке жылдамдығы 100 Мбит/с кем емес қол жеткізу',
    descRu: 'Доступ к интернету со скоростью не менее 100 Мбит/с',
    extraKk: 'Тәулік бойы қолдау',
    extraRu: 'Круглосуточная поддержка',
    budgetName: 'Интернет байланысы 2026',
    method: 'Один источник',
    unit: 'Услуга',
    quantity: 12,
    marketingPrice: 150000,
    totalSum2026: 1800000,
    sum2026: 1800000,
    plannedMonth: 'Январь',
    termKk: '31 желтоқсанға дейін',
    termRu: 'До 31 декабря',
    katoCode: '631010000',
    placeKk: 'Өскемен қ., Республикалық к-сі 9/1',
    placeRu: 'г. Усть-Каменогорск, ул. Республиканская 9/1',
    advancePercent: 0,
    initiator: 'ИТ Департамент'
  },
  {
    id: 2,
    type: 'Первичный',
    subjectType: 'Товар',
    struCode: '262011.000.000000',
    nameKk: 'Ноутбуктар',
    nameRu: 'Ноутбуки',
    descKk: 'Процессор i7, 16GB RAM, 512GB SSD',
    descRu: 'Процессор i7, 16GB RAM, 512GB SSD',
    extraKk: 'Кепілдік 3 жыл',
    extraRu: 'Гарантия 3 года',
    budgetName: 'Техникалық жабдықтау',
    method: 'Тендер',
    unit: 'Штука',
    quantity: 5,
    marketingPrice: 450000,
    totalSum2026: 2250000,
    sum2026: 2250000,
    plannedMonth: 'Февраль',
    termKk: '60 күн ішінде',
    termRu: 'В течение 60 дней',
    katoCode: '711010000',
    placeKk: 'Астана қ., Мәңгілік Ел 8',
    placeRu: 'г. Астана, Мәңгілік Ел 8',
    advancePercent: 30,
    initiator: 'Административный отдел'
  }
];

const ProcurementPlanView: React.FC = () => {
  const { t } = useTranslation();
  const [planData, setPlanData] = useState<PlanItem[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PlanItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Колонки фильтрации
  const [colFilters, setColFilters] = useState({
    struCode: '',
    nameRu: '',
    method: '',
    initiator: ''
  });

  const filteredData = useMemo(() => {
    return planData.filter(item => {
      const matchesSearch = item.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.struCode.includes(searchTerm) ||
                            item.initiator.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCode = item.struCode.toLowerCase().includes(colFilters.struCode.toLowerCase());
      const matchesName = item.nameRu.toLowerCase().includes(colFilters.nameRu.toLowerCase());
      const matchesMethod = item.method.toLowerCase().includes(colFilters.method.toLowerCase());
      const matchesInitiator = item.initiator.toLowerCase().includes(colFilters.initiator.toLowerCase());

      return matchesSearch && matchesCode && matchesName && matchesMethod && matchesInitiator;
    });
  }, [planData, searchTerm, colFilters]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU').format(val) + ' ₸';
  };

  const handleExportCSV = () => {
    const headers = ["№", "Тип", "Предмет", "Код СТРУ", "Наименование (RU)", "Наименование (KK)", "Метод", "Кол-во", "Цена", "Сумма", "Инициатор"];
    const rows = filteredData.map(item => [
      item.id,
      item.type,
      item.subjectType,
      item.struCode,
      `"${item.nameRu}"`,
      `"${item.nameKk}"`,
      item.method,
      item.quantity,
      item.marketingPrice,
      item.totalSum2026,
      item.initiator
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Procurement_Plan_2026_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setColFilters({ struCode: '', nameRu: '', method: '', initiator: '' });
    setSearchTerm('');
  };

  const [newItem, setNewItem] = useState<Partial<PlanItem>>({
    type: 'Первичный',
    subjectType: 'Товар',
    method: 'Тендер',
    unit: 'Штука',
    quantity: 1,
    marketingPrice: 0,
    advancePercent: 0,
    plannedMonth: 'Январь'
  });

  const handleAddNewItem = () => {
    const id = planData.length > 0 ? Math.max(...planData.map(d => d.id)) + 1 : 1;
    const total = (newItem.quantity || 0) * (newItem.marketingPrice || 0);
    const fullItem = { 
      ...newItem, 
      id, 
      totalSum2026: total, 
      sum2026: total 
    } as PlanItem;
    
    setPlanData([...planData, fullItem]);
    setIsAddModalOpen(false);
    setNewItem({
      type: 'Первичный',
      subjectType: 'Товар',
      method: 'Тендер',
      unit: 'Штука',
      quantity: 1,
      marketingPrice: 0,
      advancePercent: 0,
      plannedMonth: 'Январь'
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#0046B5] rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-blue-100 animate-float">
            <TableIcon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('plan_title')} 2026</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Утвержден
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">База данных ТРУ: {filteredData.length} позиций</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0046B5] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Мгновенный поиск..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-[#0046B5]/20 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl transition-all shadow-sm active:scale-95 border ${showFilters ? 'bg-[#0046B5] text-white border-transparent' : 'bg-white border-slate-100 text-slate-400 hover:text-[#0046B5]'}`}
          >
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-[#0046B5] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Добавить пункт
          </button>
        </div>
      </div>

      {/* DYNAMIC POWER TABLE */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="sticky left-0 z-20 bg-slate-50/50 px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">№ п/п</th>
                <th className="sticky left-20 z-20 bg-slate-50/50 px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Код СТРУ</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">Наименование (RU)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-center">Способ закупа</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">Кол-во</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48 text-right">Общая сумма</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-center">Инициатор</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-right">Действия</th>
              </tr>
              {/* FILTER ROW */}
              {showFilters && (
                <tr className="bg-slate-50 border-b border-slate-100">
                  <td className="sticky left-0 z-20 bg-slate-50 px-4 py-3 border-r border-slate-100">
                    <button onClick={resetFilters} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mx-auto block">
                      <FilterX size={14} />
                    </button>
                  </td>
                  <td className="sticky left-20 z-20 bg-slate-50 px-4 py-3 border-r border-slate-100">
                    <input 
                      type="text" 
                      placeholder="Фильтр..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-[#0046B5]"
                      value={colFilters.struCode}
                      onChange={(e) => setColFilters({...colFilters, struCode: e.target.value})}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      placeholder="Фильтр по названию..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-[#0046B5]"
                      value={colFilters.nameRu}
                      onChange={(e) => setColFilters({...colFilters, nameRu: e.target.value})}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-[#0046B5]"
                      value={colFilters.method}
                      onChange={(e) => setColFilters({...colFilters, method: e.target.value})}
                    >
                      <option value="">Все</option>
                      <option value="Тендер">Тендер</option>
                      <option value="Один источник">Один источник</option>
                      <option value="Запрос ЦП">Запрос ЦП</option>
                    </select>
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      placeholder="Инициатор..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] outline-none focus:border-[#0046B5]"
                      value={colFilters.initiator}
                      onChange={(e) => setColFilters({...colFilters, initiator: e.target.value})}
                    />
                  </td>
                  <td className="px-4 py-3"></td>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 transition-colors px-6 py-6 text-xs font-black text-slate-400 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    {item.id}
                  </td>
                  <td className="sticky left-20 z-10 bg-white group-hover:bg-blue-50/50 transition-colors px-6 py-6 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    <span className="font-mono text-[10px] font-black text-[#0046B5] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {item.struCode}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">{item.nameRu}</p>
                    <p className="text-[9px] text-slate-400 font-medium italic mt-1 line-clamp-1">{item.nameKk}</p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.method === 'Тендер' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {item.method}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-slate-600 text-sm">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-6 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(item.totalSum2026)}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.initiator}</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-[#0046B5] hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">По вашему запросу ничего не найдено</p>
            </div>
          )}
        </div>
        
        {/* TABLE FOOTER */}
        <div className="bg-slate-50/80 p-6 flex justify-between items-center border-t border-slate-100">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Общий бюджет выборки</span>
              <span className="text-lg font-black text-slate-900 tracking-tight">{formatCurrency(filteredData.reduce((a,b) => a + b.totalSum2026, 0))}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Активных лотов</span>
              <span className="text-lg font-black text-[#0046B5] tracking-tight">{filteredData.length}</span>
            </div>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#0046B5] hover:border-[#0046B5]/30 transition-all shadow-sm group"
          >
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
            Экспорт в Excel (CSV)
          </button>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl animate-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0046B5] text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Новый пункт плана</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Заполнение реестра ТРУ 2026</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              {/* SECTION 1: BASE INFO */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#0046B5] rounded-full"></div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Общая информация</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField label="Код СТРУ" value={newItem.struCode} onChange={v => setNewItem({...newItem, struCode: v})} placeholder="XXXXXX.XXX.XXXXXX" />
                  <InputField label="Тип пункта" value={newItem.type} onChange={v => setNewItem({...newItem, type: v})} />
                  <SelectField label="Предмет закупки" value={newItem.subjectType} options={['Товар', 'Работа', 'Услуга']} onChange={v => setNewItem({...newItem, subjectType: v})} />
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextAreaField label="Наименование (RU)" value={newItem.nameRu} onChange={v => setNewItem({...newItem, nameRu: v})} />
                    <TextAreaField label="Наименование (KK)" value={newItem.nameKk} onChange={v => setNewItem({...newItem, nameKk: v})} />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FINANCE */}
              <div className="space-y-6 p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-[#0046B5]" />
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Финансовые параметры</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <InputField label="Ед. измерения" value={newItem.unit} onChange={v => setNewItem({...newItem, unit: v})} />
                  <InputField label="Количество" type="number" value={newItem.quantity} onChange={v => setNewItem({...newItem, quantity: parseFloat(v)})} />
                  <InputField label="Маркетинговая цена" type="number" value={newItem.marketingPrice} onChange={v => setNewItem({...newItem, marketingPrice: parseFloat(v)})} />
                  <InputField label="Аванс (%)" type="number" value={newItem.advancePercent} onChange={v => setNewItem({...newItem, advancePercent: parseFloat(v)})} />
                  <div className="col-span-2">
                    <SelectField label="Способ закупа" value={newItem.method} options={['Тендер', 'Один источник', 'Запрос ЦП']} onChange={v => setNewItem({...newItem, method: v})} />
                  </div>
                  <div className="col-span-2">
                    <InputField label="Инициатор" value={newItem.initiator} onChange={v => setNewItem({...newItem, initiator: v})} />
                  </div>
                </div>
              </div>

              {/* SECTION 3: LOGISTICS */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#0046B5]" />
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Логистика и место поставки</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Код КАТО" value={newItem.katoCode} onChange={v => setNewItem({...newItem, katoCode: v})} />
                  <SelectField label="Планируемый месяц" value={newItem.plannedMonth} options={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']} onChange={v => setNewItem({...newItem, plannedMonth: v})} />
                  <TextAreaField label="Место поставки (RU)" value={newItem.placeRu} onChange={v => setNewItem({...newItem, placeRu: v})} />
                  <TextAreaField label="Место поставки (KK)" value={newItem.placeKk} onChange={v => setNewItem({...newItem, placeKk: v})} />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >Отмена</button>
              <button 
                onClick={handleAddNewItem}
                className="px-10 py-4 bg-[#0046B5] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center gap-3 group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                Сохранить в базу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER (EXISTING) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar">
            
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0046B5]/10 text-[#0046B5] rounded-2xl flex items-center justify-center">
                  <Eye size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Карточка ТРУ</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">№ {selectedItem.id} | {selectedItem.struCode}</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#0046B5] rounded-full"></div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Базовая информация</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem label="Тип пункта плана" value={selectedItem.type} />
                  <DetailItem label="Вид предмета закупок" value={selectedItem.subjectType} />
                  <div className="col-span-full">
                    <DetailItem label="Наименование (RU)" value={selectedItem.nameRu} bold />
                  </div>
                  <div className="col-span-full">
                    <DetailItem label="Наименование (KK)" value={selectedItem.nameKk} italic />
                  </div>
                </div>
              </section>

              <section className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                   <Wallet size={18} className="text-[#0046B5]" />
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Финансовые показатели</h4>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <DetailItem label="Ед. измерения" value={selectedItem.unit} />
                  <DetailItem label="Количество / Объём" value={selectedItem.quantity.toString()} />
                  <DetailItem label="Маркетинговая цена за ед." value={formatCurrency(selectedItem.marketingPrice)} blue />
                  <DetailItem label="Общая сумма (без НДС)" value={formatCurrency(selectedItem.totalSum2026)} blue />
                  <DetailItem label="Авансовый платеж (%)" value={`${selectedItem.advancePercent}%`} />
                </div>
              </section>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Инициатор закупок</p>
                    <p className="text-sm font-black text-slate-900">{selectedItem.initiator}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => {
                      setPlanData(planData.filter(d => d.id !== selectedItem.id));
                      setSelectedItem(null);
                    }}
                    className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                   >
                     <Trash2 size={18} />
                   </button>
                   <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0046B5] transition-all">
                    Редактировать
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

/* HELPER COMPONENTS FOR FORMS */
const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-[#0046B5] transition-all" 
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-[#0046B5] transition-all h-24 resize-none" 
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-[#0046B5] transition-all appearance-none cursor-pointer"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const DetailItem = ({ label, value, bold, italic, blue }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <div className={`text-sm ${bold ? 'font-black' : 'font-semibold'} ${italic ? 'italic' : ''} ${blue ? 'text-[#0046B5]' : 'text-slate-800'}`}>
      {value || '—'}
    </div>
  </div>
);

export default ProcurementPlanView;
