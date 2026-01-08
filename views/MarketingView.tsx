
import React, { useState, useRef } from 'react';
import { useTranslation } from '../LanguageContext'; // Updated import
import { 
  Plus, 
  Trash2, 
  Download, 
  Settings2,
  Scale,
  Target
} from 'lucide-react';

interface TableRow {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  cost1: number; 
  cost2: number; 
  cost3: number;
}

const MarketingView: React.FC = () => {
  const { t } = useTranslation();
  const docRef = useRef<HTMLDivElement>(null);
  
  // Состояние документа
  const [initiator, setInitiator] = useState('Начальник отдела закупа Ахметов А.Б.');
  const [memoNumber, setMemoNumber] = useState('123-ВН');
  const [memoDate, setMemoDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemType, setItemType] = useState<'товары' | 'работы' | 'услуги'>('работы');
  const [itemName, setItemName] = useState('Работы по разработке/корректировке нормативной/технической документации/технологических схем/паспортов/локальных смет');
  const [calcMethod, setCalcMethod] = useState<'avg' | 'min'>('avg');
  const [showVAT, setShowVAT] = useState(true);
  
  // Названия поставщиков
  const [sup1, setSup1] = useState('ТОО «СК Асар»');
  const [sup2, setSup2] = useState('ТОО «Артис»');
  const [sup3, setSup3] = useState('ТОО «Project-GS»');

  const vatRate = 0.16; // 16% НДС

  // Данные таблицы
  const [rows, setRows] = useState<TableRow[]>([
    { 
      id: '1', 
      name: 'Работы по разработке/корректировке нормативной/технической документации/технологических схем/паспортов/локальных смет', 
      unit: 'Работы', 
      quantity: 1,
      cost1: 5300000, 
      cost2: 5500000, 
      cost3: 5200000 
    }
  ]);

  const addRow = () => {
    setRows([...rows, {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      unit: itemType === 'товары' ? 'шт' : (itemType === 'работы' ? 'услуга' : 'усл'),
      quantity: 1,
      cost1: 0, cost2: 0, cost3: 0
    }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof TableRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const getRowBaseValue = (row: TableRow) => {
    const prices = [row.cost1, row.cost2, row.cost3].filter(p => p > 0);
    if (prices.length === 0) return 0;
    return calcMethod === 'avg' 
      ? (prices.reduce((a, b) => a + b, 0) / prices.length) 
      : Math.min(...prices);
  };

  const totalBase = rows.reduce((acc, row) => acc + (getRowBaseValue(row) * row.quantity), 0);
  const totalVAT = showVAT ? totalBase * vatRate : 0;
  const totalWithVAT = totalBase + totalVAT;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  const handleExportWord = () => {
    if (!docRef.current) return;
    const content = docRef.current.innerHTML;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          @page WordSection1 { size: 21.0cm 29.7cm; margin: 2.0cm 2.0cm 2.0cm 2.5cm; mso-page-orientation: portrait; }
          div.WordSection1 { page: WordSection1; }
          body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: black; }
          p { margin: 0; padding: 0; text-align: justify; line-height: 1.5; }
          .doc-title { text-align: center; font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 20pt; }
          .indent { text-indent: 1.25cm; margin-bottom: 12pt; }
          table { border-collapse: collapse; width: 100%; border: 1.0pt solid black; margin: 10pt 0; }
          th, td { border: 1.0pt solid black; padding: 3pt; font-size: 9pt; text-align: center; vertical-align: middle; }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .text-left { text-align: left; }
          .text-center { text-align: center; }
          .uppercase { text-transform: uppercase; }
          .underline { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          ${content}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Marketing_${memoNumber}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* КНОПКИ ДЕЙСТВИЯ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Заключение</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Dosjan Temir Joly Procurement Ecosystem</p>
          <div className="h-1.5 w-16 bg-[#0046B5] rounded-full mt-4"></div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExportWord} className="flex items-center gap-3 px-10 py-5 bg-[#0046B5] text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 group">
            <Download size={20} className="group-hover:translate-y-1 transition-transform" /> СКАЧАТЬ В WORD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 print:block">
        
        {/* ПАНЕЛЬ РЕДАКТИРОВАНИЯ */}
        <div className="xl:col-span-4 space-y-8 print:hidden">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings2 size={18} className="text-[#0046B5]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Параметры документа</h3>
            </div>
            
            <div className="space-y-6">
              {/* ВИДЖЕТ ВЫБОРА МЕТОДА (ЗАКЛЮЧЕНИЕ) */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Заключение по стоимости</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setCalcMethod('min')}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${calcMethod === 'min' ? 'bg-white text-[#0046B5] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Target size={16} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Минимальная</span>
                  </button>
                  <button 
                    onClick={() => setCalcMethod('avg')}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${calcMethod === 'avg' ? 'bg-white text-[#0046B5] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Scale size={16} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Средневзвешенная</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Инициатор</label>
                <input type="text" value={initiator} onChange={(e) => setInitiator(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-[#0046B5]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="№ СЗ" value={memoNumber} onChange={(e) => setMemoNumber(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" />
                <input type="date" value={memoDate} onChange={(e) => setMemoDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Поставщики</label>
                <div className="space-y-2">
                  <input type="text" value={sup1} onChange={(e) => setSup1(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" placeholder="Поставщик 1" />
                  <input type="text" value={sup2} onChange={(e) => setSup2(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" placeholder="Поставщик 2" />
                  <input type="text" value={sup3} onChange={(e) => setSup3(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" placeholder="Поставщик 3" />
                </div>
              </div>

              <button onClick={() => setShowVAT(!showVAT)} className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center ${showVAT ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">НДС 16%</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${showVAT ? 'bg-[#0046B5]' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showVAT ? 'left-6' : 'left-1'}`}></div>
                </div>
              </button>
            </div>
          </div>

          <div className="apple-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Табличная часть</h3>
              <button onClick={addRow} className="p-2 bg-[#0046B5] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"><Plus size={18} /></button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {rows.map((row) => (
                <div key={row.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
                  <button onClick={() => removeRow(row.id)} className="absolute top-2 right-2 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                  <textarea placeholder="Наименование..." className="w-full bg-transparent border-b border-slate-200 py-1 text-xs font-bold outline-none h-12 resize-none" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Ед.изм" className="bg-transparent border-b border-slate-200 text-[10px] outline-none" value={row.unit} onChange={(e) => updateRow(row.id, 'unit', e.target.value)} />
                    <input type="number" placeholder="Кол-во" className="bg-transparent border-b border-slate-200 text-[10px] outline-none" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 1)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(n => (
                      <div key={n}>
                        <input type="number" className="w-full bg-white border border-slate-100 rounded-lg p-1 text-[10px] outline-none" value={(row as any)[`cost${n}`]} onChange={(e) => updateRow(row.id, `cost${n}` as any, parseFloat(e.target.value) || 0)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ПРЕДПРОСМОТР ЛИСТА A4 */}
        <div className="xl:col-span-8 print:col-span-12">
          <div ref={docRef} className="bg-white shadow-2xl min-h-[1123px] w-full p-[20mm] mx-auto print:shadow-none print:p-0"
               style={{ fontFamily: '"Times New Roman", Times, serif', color: 'black' }}>
            
            {/* ШАПКА 16pt ЦЕНТР */}
            <div style={{ textAlign: 'center', marginBottom: '25pt' }}>
              <h1 style={{ fontSize: '16pt', fontWeight: 'bold', textTransform: 'uppercase', margin: '0', textAlign: 'center' }} className="doc-title">
                Маркетинговое заключение
              </h1>
              <div style={{ width: '180pt', height: '1.2pt', backgroundColor: 'black', margin: '4pt auto 0' }}></div>
            </div>

            {/* ВВОДНЫЙ ТЕКСТ С АБЗАЦЕМ 1.25см */}
            <div style={{ fontSize: '14pt', lineHeight: '1.5', textAlign: 'justify', marginBottom: '15pt' }}>
              <p style={{ textIndent: '1.25cm', margin: '0', textAlign: 'justify' }}>
                Согласно «Регламенту проведения маркетинга цен на товары, работы и услуги в АО «Dosjan temir joly», от <strong>{initiator}</strong>, служебная записка <strong>№ {memoNumber}</strong> от <strong>{new Date(memoDate).toLocaleDateString('ru-RU')}</strong> для маркетингового заключения на <strong>{itemType}</strong> <strong>«{itemName}»</strong>, в результате проведенного маркетинга цен на вышеуказанные <strong>{itemType}</strong> было получено <strong>3</strong> коммерческих предложения (прилагаются):
              </p>
            </div>

            {/* НАЗВАНИЕ ТРУ ПО ЦЕНТРУ */}
            <div style={{ textAlign: 'center', marginBottom: '10pt' }}>
              <p style={{ fontSize: '11pt', fontWeight: 'bold', fontStyle: 'italic', textTransform: 'uppercase', textDecoration: 'underline', margin: '0', textAlign: 'center' }}>
                «{itemName}»
              </p>
            </div>

            {/* ТАБЛИЦА */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1pt solid black', fontSize: '9pt' }}>
              <thead>
                <tr>
                  <th rowSpan={2} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold', width: '30px' }}>№</th>
                  <th rowSpan={2} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold' }}>Наименование ТРУ</th>
                  <th rowSpan={2} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold', width: '45px' }}>Ед. изм.</th>
                  <th rowSpan={2} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold', width: '40px' }}>Кол-во</th>
                  <th colSpan={3} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold' }}>Стоимость поставщиков (без учета НДС)</th>
                  <th rowSpan={2} style={{ border: '1pt solid black', padding: '3pt', fontWeight: 'bold', width: '100px' }}>
                    {calcMethod === 'avg' ? 'Средневзвеш. ст-ть (без НДС)' : 'Мин. ст-ть (без НДС)'}
                  </th>
                </tr>
                <tr>
                  <th style={{ border: '1.0pt solid black', padding: '3pt', fontSize: '8pt', fontWeight: 'bold' }}>{sup1}</th>
                  <th style={{ border: '1.0pt solid black', padding: '3pt', fontSize: '8pt', fontWeight: 'bold' }}>{sup2}</th>
                  <th style={{ border: '1.0pt solid black', padding: '3pt', fontSize: '8pt', fontWeight: 'bold' }}>{sup3}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'left', lineHeight: '1.1' }}>{row.name || '—'}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{row.unit || '—'}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{row.quantity}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{row.cost1 > 0 ? formatCurrency(row.cost1) : '—'}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{row.cost2 > 0 ? formatCurrency(row.cost2) : '—'}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{row.cost3 > 0 ? formatCurrency(row.cost3) : '—'}</td>
                    <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center', fontWeight: 'bold' }}>
                      {formatCurrency(getRowBaseValue(row) * row.quantity)}
                    </td>
                  </tr>
                ))}
                
                <tr style={{ fontWeight: 'bold' }}>
                  <td colSpan={4} style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'right', fontStyle: 'italic' }}>Итого (без учета НДС):</td>
                  <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{formatCurrency(rows.reduce((a, b) => a + (b.cost1 * b.quantity), 0))}</td>
                  <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{formatCurrency(rows.reduce((a, b) => a + (b.cost2 * b.quantity), 0))}</td>
                  <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{formatCurrency(rows.reduce((a, b) => a + (b.cost3 * b.quantity), 0))}</td>
                  <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center', backgroundColor: '#f9fafb' }} className="print:bg-transparent">{formatCurrency(totalBase)}</td>
                </tr>
                {showVAT && (
                  <>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan={7} style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'right', fontStyle: 'italic' }}>НДС (16%):</td>
                      <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{formatCurrency(totalVAT)}</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', fontSize: '11pt' }}>
                      <td colSpan={7} style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'right', fontStyle: 'italic', textTransform: 'uppercase' }}>Всего с учетом НДС:</td>
                      <td style={{ border: '1.0pt solid black', padding: '4pt', textAlign: 'center' }}>{formatCurrency(totalWithVAT)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* ЗАКЛЮЧИТЕЛЬНЫЙ ТЕКСТ С УКАЗАНИЕМ ПАРАМЕТРА ВЫБОРА */}
            <div style={{ fontSize: '14pt', lineHeight: '1.5', textAlign: 'justify', marginTop: '15pt' }}>
              <p style={{ textIndent: '1.25cm', margin: '0', textAlign: 'justify' }}>
                В результате маркетингового анализа на {itemType} <strong>«{itemName}»</strong> <strong>{calcMethod === 'avg' ? 'средневзвешенная' : 'минимальная'}</strong> стоимость составила <strong>{formatCurrency(totalBase)}</strong> тенге без учета НДС, согласно коммерческим предложениям.
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MarketingView;
