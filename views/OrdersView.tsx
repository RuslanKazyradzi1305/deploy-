
import React, { useState, useRef } from 'react';
import { useTranslation } from '../LanguageContext'; // Updated import
import { 
  Download, 
  Settings2, 
  Plus, 
  Trash2, 
  UserCheck,
  Table as TableIcon,
  FileText,
  Gavel
} from 'lucide-react';

interface AnnexRow {
  id: string;
  type: string;
  planNo: string;
  ensName: string;
  budgetName: string;
  quantity: number;
  planSum: number;
  supplier: string;
  supplierSum: number;
}

const SIGNERS = [
  { pos: 'Заместитель Председателя Правления по развитию', name: 'С. Бейсембаев' },
  { pos: 'Заместитель Председателя Правления по экономике и финансам', name: 'А. Бадан' },
  { pos: 'Заместитель Председателя Правления по производству', name: 'Н. Адильбаев' },
  { pos: 'Директор Восточно-Казахстанского филиала', name: 'А. Рахимов' }
];

const OrdersView: React.FC = () => {
  const { t, lang } = useTranslation();
  const exportRef = useRef<HTMLDivElement>(null);

  const SUBJECT_TEMPLATES = [
    { id: 'services', label: t('orders_template_services'), text: lang === 'kk' ? 'Бір көзден алу тәсілімен қызметтерді сатып алуды жүзеге асыру туралы' : 'Об осуществлении закупок услуг способом из одного источника' },
    { id: 'works', label: t('orders_template_works'), text: lang === 'kk' ? 'Бір көзден алу тәсілімен жұмыстарды сатып алуды жүзеге асыру туралы' : 'Об осуществлении закупок работ способом из одного источника' },
    { id: 'goods', label: t('orders_template_goods'), text: lang === 'kk' ? 'Бір көзден алу тәсілімен тауарларды сатып алуды жүзеге асыру туралы' : 'Об осуществлении закупок товаров способом из одного источника' }
  ];

  // --- Параметры Приказа (Лист 1) ---
  const [orderNo, setOrderNo] = useState('_______');
  const [orderDate, setOrderDate] = useState(lang === 'kk' ? '«__» __________ 202_ ж.' : '«__» __________ 202_ г.');
  const [selectedTemplate, setSelectedTemplate] = useState(SUBJECT_TEMPLATES[0]);
  const [itemNameGeneral, setItemNameGeneral] = useState(lang === 'kk' ? '«Интернетке қол жеткізу қызметтері (Өскемен-1-Шар)»' : '«Услуги доступа в интернет (Өскемен-1-Шар)»');
  const [subpoint, setSubpoint] = useState('4)');
  const [point, setPoint] = useState('132');
  
  // Подписи
  const [selectedSignerIndex, setSelectedSignerIndex] = useState(0);
  const [signerPos, setSignerPos] = useState(SIGNERS[0].pos);
  const [signerName, setSignerName] = useState(SIGNERS[0].name);

  // Исполнитель
  const [executorName, setExecutorName] = useState('Казыев Р.Д.');
  const [executorPhone, setExecutorPhone] = useState('+7 747 491 77 69 (вн.220)');

  // --- Параметры Приложения №1 (Лист 2) ---
  const [rows, setRows] = useState<AnnexRow[]>([
    {
      id: '1',
      type: lang === 'kk' ? 'Қызмет' : 'Услуга',
      planNo: '17',
      ensName: lang === 'kk' ? 'Интернетке қол жеткізу қызметтері' : 'Услуги по доступу к Интернету',
      budgetName: lang === 'kk' ? 'Интернетке қол жеткізу қызметтері (Өскемен-1-Шар)' : 'Услуги доступа в интернет (Өскемен-1-Шар)',
      quantity: 1,
      planSum: 3504000,
      supplier: 'АО «Транстелеком»',
      supplierSum: 3504000
    }
  ]);

  // --- Параметры Приложения №2 (Лист 3) ---
  const [techSpec, setTechSpec] = useState({
    truCode: '611042.100.000000',
    deliveryPlace: lang === 'kk' ? 'Шығыс Қазақстан облысы, Өскемен қ., Республикалық к-сі 9/1.' : 'Восточно-Казахстанская область, г.Усть-Каменогорск, ул.Республиканская 9/1.',
    deliveryTerm: lang === 'kk' ? '01.01.2026 – 31.12.2026 жж.' : '01.01.2026 – 31.12.2026 гг.',
    requirements: lang === 'kk' ? '1) Жеткізуші 4 статикалық жария IP-мекенжай блогын ұсынады.\n2) Деректерді беру арналары аптасына 7 күн, тәулігіне 24 сағат жұмыс істеуі тиіс.' : '1) Поставщик подает блок из 4-х статических публичных IP-адресов.\n2) Каналы передачи данных должны работать 7 дней в неделю 24 часа в сутки.'
  });

  const handleSignerChange = (index: number) => {
    setSelectedSignerIndex(index);
    setSignerPos(SIGNERS[index].pos);
    setSignerName(SIGNERS[index].name);
  };

  const addRow = () => {
    setRows([...rows, {
      id: Math.random().toString(36).substr(2, 9),
      type: lang === 'kk' ? 'Қызмет' : 'Услуга',
      planNo: '',
      ensName: '',
      budgetName: '',
      quantity: 1,
      planSum: 0,
      supplier: '',
      supplierSum: 0
    }]);
  };

  const updateRow = (id: string, field: keyof AnnexRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) setRows(rows.filter(r => r.id !== id));
  };

  const formatNum = (val: number) => {
    return new Intl.NumberFormat('ru-RU').format(val);
  };

  const handleExportWord = () => {
    if (!exportRef.current) return;
    
    const page1 = document.getElementById('page-1')?.innerHTML || '';
    const page2 = document.getElementById('page-2')?.innerHTML || '';
    const page3 = document.getElementById('page-3')?.innerHTML || '';

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          @page WordSection1 { size: 595.3pt 841.9pt; margin: 1.5cm 1.5cm 1.5cm 2.5cm; mso-header-margin:35.4pt; mso-footer-margin:35.4pt; mso-paper-source:0; }
          div.WordSection1 { page: WordSection1; }
          body { font-family: "Times New Roman", Times, serif; font-size: 14pt; color: black; line-height: 1.15; }
          p { margin: 0; padding: 0; text-align: justify; }
          table { border-collapse: collapse; width: 100%; border: 0.5pt solid black; margin: 10pt 0; }
          th, td { border: 0.5pt solid black; padding: 4pt; font-size: 8pt; vertical-align: middle; }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          ${page1}
          <br clear="all" style="page-break-before:always" />
          ${page2}
          <br clear="all" style="page-break-before:always" />
          ${page3}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Prikaz_${orderNo}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0046B5] rounded-2xl flex items-center justify-center text-white">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('orders_constructor')}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dosjan Temir Joly Procurement</p>
          </div>
        </div>
        <button onClick={handleExportWord} className="flex items-center gap-3 px-8 py-4 bg-[#0046B5] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 group">
          <Download size={18} /> {t('orders_generate_word')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* SIDEBAR EDITORS */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Section: Subject */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 size={16} className="text-[#0046B5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{t('orders_subject_type')}</span>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_subject_type')}</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer"
                onChange={(e) => setSelectedTemplate(SUBJECT_TEMPLATES.find(t => t.id === e.target.value) || SUBJECT_TEMPLATES[0])}
                value={selectedTemplate.id}
              >
                {SUBJECT_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_item_name')}</label>
              <textarea value={itemNameGeneral} onChange={(e) => setItemNameGeneral(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none h-20 resize-none font-bold" />
            </div>
          </div>

          {/* Section: Legal Basis (ПОДПУНКТ / ПУНКТ) */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Gavel size={16} className="text-[#0046B5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{t('orders_legal_basis')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_subpoint')}</label>
                <input value={subpoint} onChange={(e) => setSubpoint(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-[#0046B5]" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_point')}</label>
                <input value={point} onChange={(e) => setPoint(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-[#0046B5]" />
              </div>
            </div>
          </div>

          {/* Section: Signer */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={16} className="text-[#0046B5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{t('orders_signer')}</span>
            </div>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer"
              value={selectedSignerIndex}
              onChange={(e) => handleSignerChange(parseInt(e.target.value))}
            >
              {SIGNERS.map((s, i) => (
                <option key={i} value={i}>{s.name} — {s.pos.substring(0, 30)}...</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_executor')}</label>
                <input value={executorName} onChange={(e) => setExecutorName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" placeholder={t('orders_executor')} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{t('orders_phone')}</label>
                <input value={executorPhone} onChange={(e) => setExecutorPhone(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" placeholder={t('orders_phone')} />
              </div>
            </div>
          </div>

          {/* Section: Table Rows */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TableIcon size={16} className="text-[#0046B5]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{t('orders_annex_1')}</span>
              </div>
              <button onClick={addRow} className="p-2 bg-slate-50 text-[#0046B5] rounded-lg hover:bg-[#0046B5] hover:text-white transition-all"><Plus size={14} /></button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {rows.map((row) => (
                <div key={row.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 relative group">
                  <button onClick={() => removeRow(row.id)} className="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={row.type} onChange={(e) => updateRow(row.id, 'type', e.target.value)} className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px] font-bold outline-none">
                      <option value={lang === 'kk' ? 'Қызмет' : 'Услуга'}>{lang === 'kk' ? 'Қызмет' : 'Услуга'}</option>
                      <option value={lang === 'kk' ? 'Жұмыс' : 'Работа'}>{lang === 'kk' ? 'Жұмыс' : 'Работа'}</option>
                      <option value={lang === 'kk' ? 'Тауар' : 'Товар'}>{lang === 'kk' ? 'Тауар' : 'Товар'}</option>
                    </select>
                    <input placeholder="№ в ПЗ" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px]" value={row.planNo} onChange={(e) => updateRow(row.id, 'planNo', e.target.value)} />
                  </div>
                  <input placeholder="Наименование по ЕНС ТРУ" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px]" value={row.ensName} onChange={(e) => updateRow(row.id, 'ensName', e.target.value)} />
                  <input placeholder="Наименование по Бюджету" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px]" value={row.budgetName} onChange={(e) => updateRow(row.id, 'budgetName', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Кол-во" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px]" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 1)} />
                    <input type="number" placeholder="Сумма плана (без НДС)" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px]" value={row.planSum} onChange={(e) => updateRow(row.id, 'planSum', parseFloat(e.target.value) || 0)} />
                  </div>
                  <input placeholder="Поставщик" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px] font-bold" value={row.supplier} onChange={(e) => updateRow(row.id, 'supplier', e.target.value)} />
                  <input type="number" placeholder="Сумма поставщика (без НДС)" className="w-full bg-white border border-slate-100 rounded-lg p-2 text-[10px] font-bold" value={row.supplierSum} onChange={(e) => updateRow(row.id, 'supplierSum', parseFloat(e.target.value) || 0)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PREVIEW PAGES */}
        <div className="xl:col-span-8 space-y-10">
          <div ref={exportRef} className="space-y-12">
            
            {/* PAGE 1: ПРИКАЗ */}
            <div id="page-1" className="bg-white shadow-2xl min-h-[1123px] w-full p-[20mm] mx-auto relative text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              
              <div style={{ fontWeight: 'bold', fontSize: '14pt', marginBottom: '20pt', textAlign: 'left', width: '100%', lineHeight: '1.2' }}>
                 {selectedTemplate.text} {itemNameGeneral}
              </div>

              <div style={{ fontSize: '14pt', lineHeight: '1.3', textAlign: 'justify' }}>
                <p style={{ textIndent: '1.25cm', marginBottom: '12pt' }}>
                  {lang === 'kk' ? (
                    <>
                      «Dosjan temir joly» АҚ (бұдан әрі – Қоғам) Директорлар кеңесінің 17.11.2017 жылғы (№7 хаттама) шешімімен бекітілген «Dosjan temir joly» АҚ тауарларды, жұмыстарды және қызметтерді сатып алуды жүзеге асыру ережесінің» (бұдан әрі - Ереже) <strong>{point}</strong>-тармағының <strong>{subpoint}</strong>-тармақшасына сәйкес <strong>БҰЙЫРАМЫН:</strong>
                    </>
                  ) : (
                    <>
                      В соответствии с подпунктом <strong>{subpoint}</strong> пункта <strong>{point}</strong> «Правил осуществления закупок товаров, работ и услуг АО «Dosjan temir joly» (далее-Общество), утвержденный решением Совета директоров Общества от 17.11.2017 года (протокол №7) <strong>ПРИКАЗЫВАЮ:</strong>
                    </>
                  )}
                </p>
                <p style={{ marginBottom: '8pt' }}>
                  {lang === 'kk' ? '1. Осы бұйрыққа №1, №2 қосымшаларға сәйкес бір көзден алу тәсілімен сатып алуды жүзеге асыру.' : '1. Осуществить закупки способом из одного источника, согласно приложениям №1, №2 к настоящему приказу.'}
                </p>
                <p style={{ marginBottom: '8pt' }}>
                  {lang === 'kk' ? '2. Осы бұйрықтың орындалуын бақылауды өзіме қалдырамын.' : '2. Контроль за исполнением настоящего приказа оставляю за собой.'}
                </p>
                <p style={{ marginBottom: '8pt' }}>
                  {lang === 'kk' ? '3. Осы бұйрық қол қойылған сәттен бастап күшіне енеді.' : '3. Настоящий приказ вступает в силу с момента подписания.'}
                </p>
              </div>

              <table className="no-border" style={{ width: '100%', marginTop: '80pt', fontWeight: 'bold', border: 'none' }}>
                <tbody>
                  <tr style={{ border: 'none' }}>
                    <td style={{ textAlign: 'left', width: '60%', verticalAlign: 'top', border: 'none' }}>{signerPos}</td>
                    <td style={{ textAlign: 'right', width: '40%', verticalAlign: 'top', border: 'none' }}>{signerName}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ position: 'absolute', bottom: '20mm', left: '20mm', fontSize: '9pt', fontStyle: 'italic' }}>
                 {lang === 'kk' ? 'Орынд.' : 'Исп.'} {executorName} | {executorPhone}
              </div>
            </div>

            {/* PAGE 2: ПРИЛОЖЕНИЕ №1 */}
            <div id="page-2" className="bg-white shadow-2xl min-h-[1123px] w-full p-[15mm] mx-auto text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              <div style={{ textAlign: 'right', fontSize: '11pt', fontStyle: 'italic', marginBottom: '15pt' }}>
                {t('orders_annex_1')}<br />
                {lang === 'kk' ? `${selectedTemplate.label.toLowerCase()} сатып алуды жүзеге асыру туралы бұйрыққа` : `К приказу об осуществлении закупок ${selectedTemplate.label.toLowerCase()}`}
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14pt', marginBottom: '15pt', textTransform: 'uppercase' }}>
                {lang === 'kk' ? `Сатып алынатын ${selectedTemplate.label.toLowerCase()} тізбесі` : `Перечень закупаемых ${selectedTemplate.label.toLowerCase()}`}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', border: '0.5pt solid black' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>№ п/п</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Сатып алу нысанасының түрі' : 'Вид предмета закупки'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'САЖ-дағы нөмірі' : 'Номер в ПЗ'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'ТЖҚ ЕНС-ке сәйкес атауы' : 'Наименование согласно ЕНС ТРУ'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Бюджетке сәйкес атауы' : 'Наименование согласно Бюджету'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Саны' : 'Количество'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Жалпы сома (Жоспар), ҚҚС-сыз' : 'Общая сумма (План), без НДС'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Жеткізуші' : 'Поставщик'}</th>
                    <th style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{lang === 'kk' ? 'Жеткізушінің жалпы сомасы, ҚҚС-сыз' : 'Общая сумма Поставщика, без НДС'}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id}>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center' }}>{row.type}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center' }}>{row.planNo}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'left' }}>{row.ensName}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'left' }}>{row.budgetName}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center' }}>{row.quantity}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center' }}>{formatNum(row.planSum)}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'left' }}>{row.supplier}</td>
                      <td style={{ padding: '4pt', fontSize: '7pt', border: '0.5pt solid black', textAlign: 'center', fontWeight: 'bold' }}>{formatNum(row.supplierSum)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGE 3: ПРИЛОЖЕНИЕ №2 */}
            <div id="page-3" className="bg-white shadow-2xl min-h-[1123px] w-full p-[15mm] mx-auto text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              <div style={{ textAlign: 'right', fontSize: '11pt', fontStyle: 'italic', marginBottom: '15pt' }}>
                {t('orders_annex_2')}<br />
                {lang === 'kk' ? `${selectedTemplate.label.toLowerCase()} сатып алуды жүзеге асыру туралы бұйрыққа` : `К приказу об осуществлении закупок ${selectedTemplate.label.toLowerCase()}`}
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14pt', marginBottom: '20pt', textTransform: 'uppercase' }}>
                {t('orders_tech_spec_title')}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', border: '0.5pt solid black' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '10pt', fontWeight: 'bold', width: '35%', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{lang === 'kk' ? 'ТЖҚ ЕНС коды' : 'Код ЕНС ТРУ'}</td>
                    <td style={{ padding: '10pt', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{techSpec.truCode}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10pt', fontWeight: 'bold', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{lang === 'kk' ? 'Жеткізу орны' : 'Место поставки'}</td>
                    <td style={{ padding: '10pt', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{techSpec.deliveryPlace}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10pt', fontWeight: 'bold', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{lang === 'kk' ? 'Жеткізу мерзімі' : 'Срок поставки'}</td>
                    <td style={{ padding: '10pt', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>{techSpec.deliveryTerm}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10pt', fontWeight: 'bold', textAlign: 'left', verticalAlign: 'top', fontSize: '11pt', border: '0.5pt solid black' }}>{lang === 'kk' ? 'Техникалық талаптар' : 'Технические требования'}</td>
                    <td style={{ padding: '10pt', textAlign: 'left', fontSize: '11pt', border: '0.5pt solid black' }}>
                      {techSpec.requirements.split('\n').map((l, idx) => <div key={idx} style={{ marginBottom: '4pt' }}>{l}</div>)}
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default OrdersView;
