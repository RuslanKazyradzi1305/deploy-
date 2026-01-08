
import React, { useState } from 'react';
import { useTranslation } from '../LanguageContext'; // Updated import
import { Search, RefreshCw, ExternalLink, Filter, ChevronRight, Info, Book, Loader2, X, QrCode, FileCheck, Layers } from 'lucide-react';
import { EnsTruItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const MOCK_DATA: EnsTruItem[] = [
  { 
    code: '242040.700.000016', 
    nameRu: 'Трубы и фасонные изделия стальные с тепловой изоляцией из пенополиуретана', 
    nameKk: 'Пенополиуретаннан жылу оқшаулағышы бар болат құбырлар мен фасонды бұйымдар', 
    unitRu: 'Штука', 
    category: 'Трубная продукция',
    standards: ['ГОСТ 30732-2020 Трубы и фасонные изделия стальные'],
    mkei: [{ code: '0796', name: 'Штука' }],
    tnved: [
      { code: '7307231000', name: 'Колена и отводы для сварки встык из нержавеющей стали' },
      { code: '7307239000', name: 'Прочие фитинги для сварки встык из нержавеющей стали' },
      { code: '7307291009', name: 'Прочие фитинги для труб или трубок из коррозинностойкой стали, снабженные резьбой' }
    ]
  },
  { 
    code: '262011.000.000000', 
    nameRu: 'Ноутбуки, планшетные компьютеры', 
    nameKk: 'Ноутбуктар, планшеттік компьютерлер', 
    unitRu: 'Штука', 
    category: 'Техника' 
  },
  { 
    code: '611011.000.000000', 
    nameRu: 'Услуги доступа к интернету', 
    nameKk: 'Интернетке қол жеткізу қызметтері', 
    unitRu: 'Услуга', 
    category: 'Связь' 
  },
];

const EnsTruView: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [items, setItems] = useState<EnsTruItem[]>(MOCK_DATA);
  const [selectedItem, setSelectedItem] = useState<EnsTruItem | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setItems(MOCK_DATA);
      return;
    }

    setIsSyncing(true);
    try {
      // Ensure API_KEY is provided, default to empty string if not found
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Действуй как профессиональный справочник ЕНС ТРУ Казахстана. 
                  Найди детальную информацию по запросу: "${query}". 
                  Обязательно используй формат кода XXXXXX.XXX.XXXXXX (например 242040.700.000016).
                  
                  Требуемые данные:
                  1. code (строго в формате XXXXXX.XXX.XXXXXX)
                  2. nameRu, nameKk
                  3. unitRu, category
                  4. standards (массив строк ГОСТ/ISO)
                  5. mkei (массив объектов {code, name}, например 0796 - Штука)
                  6. tnved (массив объектов {code, name})
                  
                  Верни только JSON массив объектов. Если данных мало, попытайся найти максимально похожие позиции.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                nameRu: { type: Type.STRING },
                nameKk: { type: Type.STRING },
                unitRu: { type: Type.STRING },
                category: { type: Type.STRING },
                standards: { type: Type.ARRAY, items: { type: Type.STRING } },
                mkei: { type: Type.ARRAY, items: { 
                  type: Type.OBJECT, 
                  properties: { code: { type: Type.STRING }, name: { type: Type.STRING } } 
                }},
                tnved: { type: Type.ARRAY, items: { 
                  type: Type.OBJECT, 
                  properties: { code: { type: Type.STRING }, name: { type: Type.STRING } } 
                }},
              },
              required: ["code", "nameRu", "nameKk", "unitRu", "category"]
            }
          }
        },
      });

      const text = response.text || '[]';
      const results = JSON.parse(text);
      setItems(results);
    } catch (error) {
      console.error("Search error:", error);
      const localFiltered = MOCK_DATA.filter(item => 
        item.code.replace(/\./g, '').includes(query.replace(/\./g, '')) || 
        item.nameRu.toLowerCase().includes(query.toLowerCase())
      );
      setItems(localFiltered);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(searchTerm);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="relative flex-1 w-full max-w-2xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0046B5] transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Поиск по коду (напр. 242040.700.000016) или наименованию..." 
            className="w-full pl-16 pr-8 py-5 bg-white apple-card border-transparent focus:border-[#0046B5]/20 outline-none transition-all font-semibold text-base shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={() => performSearch(searchTerm)}
            disabled={isSyncing}
            className={`flex items-center gap-3 px-8 py-5 bg-[#0046B5] text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group active:scale-95 ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />}
            {isSyncing ? 'Поиск...' : 'Искать в ЕНС ТРУ'}
          </button>
          <a 
            href="https://enstru.kz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-5 bg-white apple-card text-[#0046B5] hover:bg-slate-50 transition-all flex items-center justify-center border border-slate-100"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="space-y-6">
          <div className="apple-card p-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Filter size={16} className="text-[#0046B5]" />
              Категории
            </h3>
            <div className="space-y-2">
              {['Все разделы', 'Товары', 'Работы', 'Услуги', 'ИТ-услуги'].map((cat, i) => (
                <button 
                  key={i} 
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center group ${i === 0 ? 'bg-slate-100 text-[#0046B5]' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {cat}
                  <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${i === 0 ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="apple-card overflow-hidden border border-slate-100 relative">
            {isSyncing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="text-[#0046B5] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0046B5]">Загрузка данных ЕНС ТРУ...</p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Код ЕНС ТРУ</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Наименование</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ед. изм.</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Раздел</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-slate-50/30 transition-all group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs font-black text-[#0046B5] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 whitespace-nowrap">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900 text-sm tracking-tight mb-1">{item.nameRu}</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">{item.nameKk}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">{item.unitRu}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl flex flex-col lg:flex-row custom-scrollbar">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-6 right-6 p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-full transition-all z-20"
            >
              <X size={24} />
            </button>

            {/* LEFT SIDE: QR & STATUS */}
            <div className="lg:w-1/3 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center">
              <div className="w-full aspect-square bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex items-center justify-center mb-8">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://enstru.kz/code/${selectedItem.code}`} 
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center space-y-2 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Код ЕНС ТРУ</p>
                <p className="text-lg font-black text-[#0046B5] font-mono">{selectedItem.code}</p>
              </div>
              <a 
                href={`https://enstru.kz/code/${selectedItem.code}`} 
                target="_blank" 
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#0046B5] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
              >
                <ExternalLink size={16} /> Открыть на портале
              </a>
            </div>

            {/* RIGHT SIDE: DATA */}
            <div className="lg:w-2/3 p-10 space-y-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-4">{selectedItem.nameRu}</h3>
                <p className="text-sm font-medium text-slate-500 italic mb-6">{selectedItem.nameKk}</p>
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                    {selectedItem.category}
                  </span>
                  <span className="px-4 py-2 bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0046B5] border border-blue-100">
                    Ед.изм: {selectedItem.unitRu}
                  </span>
                </div>
              </div>

              {/* STANDARDS */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <FileCheck size={14} className="text-[#0046B5]" /> Стандарты
                </h4>
                {selectedItem.standards && selectedItem.standards.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedItem.standards.map((s, idx) => (
                      <li key={idx} className="p-4 bg-slate-50 rounded-2xl text-xs font-bold text-slate-700 border border-slate-100 flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-[#0046B5] rounded-full mt-1.5 shrink-0"></div>
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">Стандарты не указаны</p>
                )}
              </div>

              {/* MKEI & TNVED */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Layers size={14} className="text-[#0046B5]" /> Коды МКЕИ
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.mkei?.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black text-[#0046B5]">{m.code}</span>
                        <span className="text-[10px] font-bold text-slate-600">{m.name}</span>
                      </div>
                    )) || <p className="text-xs text-slate-400 italic">Нет данных</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Layers size={14} className="text-[#0046B5]" /> Коды ТН ВЭД
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.tnved?.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] font-black text-[#0046B5]">{t.code}</span>
                        </div>
                        <p className="text-[9px] font-medium text-slate-500 line-clamp-2">{t.name}</p>
                      </div>
                    )) || <p className="text-xs text-slate-400 italic">Нет данных</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default EnsTruView;
