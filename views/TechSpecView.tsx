
import React, { useState, useRef } from 'react';
import { useTranslation } from '../LanguageContext';
import { 
  Download, 
  Settings2, 
  Plus, 
  Trash2, 
  UserCheck,
  FileText,
  Table as TableIcon,
  Globe,
  Briefcase
} from 'lucide-react';

const TechSpecView: React.FC = () => {
  const { t } = useTranslation();
  const exportRef = useRef<HTMLDivElement>(null);
  const [docLang, setDocLang] = useState<'ru' | 'kk'>('ru');

  // Параметры документа
  const [formData, setFormData] = useState({
    clientName: 'АО «Dosjan temir joly»',
    subjectType: 'Услуга',
    ensCode: '619010.900.000003',
    ensName: 'Услуги телекоммуникационные',
    shortDesc: 'Услуги телекоммуникационные',
    extraDesc: 'Предоставление услуг видеоконференцсвязи, доступа к сети Интернет, каналам передачи данных, международной и междугородней связи и SIP телефонии.',
    procPeriod: 'Декабрь 2025 года – Январь 2026 года',
    deliveryPlace: 'г. Усть-Каменогорск, ул. Республиканская 9/1',
    deliveryTerm: '01.01.2026 – 31.12.2026 гг.',
    unit: 'SIP trunk номер',
    quantity: '2',
    paymentTerms: 'Промежуточный платеж',
    warranty: '',
    requirements: 'Время восстановления нормальной работы сети передачи данных после сбоев должно быть не более 7 часов.',
    // Утверждение
    approverPos: 'Директор «Восточно-Казахстанского филиала» АО «Dosjan temir joly»',
    approverName: 'Рахимов А.И.',
    approverDate: '2025-01-01'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExportWord = () => {
    if (!exportRef.current) return;
    
    const content = exportRef.current.innerHTML;
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          @page WordSection1 { size: 595.3pt 841.9pt; margin: 2.0cm 1.5cm 2.0cm 2.5cm; mso-paper-source:0; }
          div.WordSection1 { page: WordSection1; }
          body { 
            font-family: "Times New Roman", serif; 
            font-size: 12pt; 
            color: black; 
            line-height: 1.0; 
          }
          p { margin: 0; padding: 0; text-align: justify; }
          .header-block { 
            margin-left: auto; 
            margin-right: 0; 
            width: 250pt; 
            text-align: left; 
            margin-bottom: 30pt;
          }
          .title { 
            text-align: center; 
            font-weight: bold; 
            text-transform: uppercase; 
            margin-bottom: 20pt; 
            display: block;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            border: 0.5pt solid black; 
          }
          td { 
            border: 0.5pt solid black; 
            padding: 5pt; 
            vertical-align: top; 
            font-size: 12pt;
          }
          .bold { font-weight: bold; }
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
    link.download = `TechSpec_${formData.ensCode}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return docLang === 'kk' ? '«__» __________ 2025 ж.' : '«__» __________ 2025 г.';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const monthsKk = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
    const month = docLang === 'kk' ? monthsKk[date.getMonth()] : monthsRu[date.getMonth()];
    return `«${day}» ${month} ${date.getFullYear()} ${docLang === 'kk' ? 'ж.' : 'г.'}`;
  };

  const labels = {
    ru: {
      approved: 'УТВЕРЖДАЮ:',
      title: 'ТЕХНИЧЕСКАЯ СПЕЦИФИКАЦИЯ ПО ПЛАНИРУЕМЫМ ЗАКУПКАМ ТРУ',
      client: 'Наименование заказчика:',
      type: 'Вид предмета закупок:',
      code: 'Код товара, работы, услуги (в соответствии с ЕНС ТРУ):',
      name: 'Наименование закупаемых товаров, работ, услуг (в соответствии с ЕНС ТРУ):',
      short: 'Краткая характеристика (описание) товаров, работ и услуг (в соответствии с ЕНС ТРУ):',
      extra: 'Дополнительная характеристика:',
      period: 'Планируемый срок осуществления закупок:',
      place: 'Место поставки:',
      term: 'Срок поставки:',
      unit: 'Единица измерения:',
      qty: 'Количество (объем):',
      payment: 'Условия платежа:',
      warranty: 'Гарантийный срок (в месяцах):',
      reqs: 'Описание требуемых характеристик, параметров и иных исходных данных:'
    },
    kk: {
      approved: 'БЕКІТЕМІН:',
      title: 'ТЖҚ ЖОСПАРЛАНАТЫН САТЫП АЛУЛАРЫ БОЙЫНША ТЕХНИКАЛЫҚ ЕРЕКШЕЛІК',
      client: 'Тапсырыс берушінің атауы:',
      type: 'Сатып алу нысанасының түрі:',
      code: 'Тауардың, жұмыстың, көрсетілетін қызметтің коды (ТЖҚ ЕНС сәйкес):',
      name: 'Сатып алынатын тауарлардың, жұмыстардың, көрсетілетін қызметтердің атауы (ТЖҚ ЕНС сәйкес):',
      short: 'Тауарлардың, жұмыстардың және көрсетілетін қызметтердің қысқаша сипаттамасы (ТЖҚ ЕНС сәйкес):',
      extra: 'Қосымша сипаттама:',
      period: 'Сатып алуды жүзеге асырудың жоспарланған мерзімі:',
      place: 'Жеткізу орны:',
      term: 'Жеткізу мерзімі:',
      unit: 'Өлшем бірлігі:',
      qty: 'Саны (көлемі):',
      payment: 'Төлем шарттары:',
      warranty: 'Кепілдік мерзімі (аймен):',
      reqs: 'Талап етілетін сипаттамалардың, параметрлердің және өзге де бастапқы деректердің сипаттамасы:'
    }
  };

  const currentLabels = labels[docLang];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0046B5] rounded-2xl flex items-center justify-center text-white">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Конструктор ТЗ</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dosjan Temir Joly Procurement</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setDocLang('ru')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${docLang === 'ru' ? 'bg-white text-[#0046B5] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >RU</button>
              <button 
                onClick={() => setDocLang('kk')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${docLang === 'kk' ? 'bg-white text-[#0046B5] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >KZ</button>
           </div>
           <button onClick={handleExportWord} className="flex items-center gap-3 px-8 py-4 bg-[#0046B5] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg group active:scale-95">
             <Download size={18} /> СКАЧАТЬ В WORD
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* EDIT PANEL */}
        <div className="xl:col-span-4 space-y-6 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          
          {/* Утверждение */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={16} className="text-[#0046B5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Данные утверждения</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Должность</label>
                <textarea value={formData.approverPos} onChange={(e) => handleChange('approverPos', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none h-20 resize-none font-medium" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">ФИО</label>
                <input value={formData.approverName} onChange={(e) => handleChange('approverName', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Дата</label>
                <input type="date" value={formData.approverDate} onChange={(e) => handleChange('approverDate', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
              </div>
            </div>
          </div>

          {/* Параметры ТЗ */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 size={16} className="text-[#0046B5]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Параметры спецификации</span>
            </div>
            
            {[
              { id: 'clientName', label: 'Заказчик' },
              { id: 'subjectType', label: 'Вид предмета' },
              { id: 'ensCode', label: 'Код ЕНС ТРУ' },
              { id: 'ensName', label: 'Наименование ЕНС ТРУ' },
              { id: 'shortDesc', label: 'Краткая характеристика' },
              { id: 'extraDesc', label: 'Дополнительная характеристика', area: true },
              { id: 'procPeriod', label: 'Срок закупки' },
              { id: 'place', label: 'Место поставки' },
              { id: 'term', label: 'Срок поставки' },
              { id: 'unit', label: 'Ед. измерения' },
              { id: 'quantity', label: 'Количество' },
              { id: 'paymentTerms', label: 'Условия платежа' },
              { id: 'warranty', label: 'Гарантийный срок (мес)' },
              { id: 'requirements', label: 'Технические требования', area: true }
            ].map((f) => (
              <div key={f.id} className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">{f.label}</label>
                {f.area ? (
                  <textarea value={(formData as any)[f.id]} onChange={(e) => handleChange(f.id, e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none h-24 resize-none" />
                ) : (
                  <input value={(formData as any)[f.id]} onChange={(e) => handleChange(f.id, e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="xl:col-span-8">
          <div className="bg-white shadow-2xl min-h-[1123px] w-full p-[20mm] mx-auto text-black border border-slate-100" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt', lineHeight: '1.0' }}>
            
            {/* Скрытый блок для экспорта, который видит только Word */}
            <div ref={exportRef}>
              
              {/* Шапка утверждения - В ПРАВОЙ СТОРОНЕ */}
              <div className="header-block" style={{ marginLeft: 'auto', marginRight: '0', width: '250pt', textAlign: 'left', marginBottom: '30pt' }}>
                <p className="bold" style={{ fontWeight: 'bold' }}>{currentLabels.approved}</p>
                <p style={{ margin: '4pt 0' }}>{formData.approverPos}</p>
                <p style={{ margin: '4pt 0' }}>_____________________ {formData.approverName}</p>
                <p style={{ margin: '4pt 0' }}>{formatDate(formData.approverDate)}</p>
              </div>

              {/* Заголовок - ПО ЦЕНТРУ */}
              <div className="title" style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20pt', marginTop: '40pt' }}>
                {currentLabels.title}
              </div>

              {/* Основная таблица */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '0.5pt solid black' }}>
                <tbody>
                  {[
                    { label: currentLabels.client, val: formData.clientName },
                    { label: currentLabels.type, val: formData.subjectType },
                    { label: currentLabels.code, val: formData.ensCode },
                    { label: currentLabels.name, val: formData.ensName },
                    { label: currentLabels.short, val: formData.shortDesc },
                    { label: currentLabels.extra, val: formData.extraDesc },
                    { label: currentLabels.period, val: formData.procPeriod },
                    { label: currentLabels.place, val: formData.deliveryPlace },
                    { label: currentLabels.term, val: formData.deliveryTerm },
                    { label: currentLabels.unit, val: formData.unit },
                    { label: currentLabels.qty, val: formData.quantity },
                    { label: currentLabels.payment, val: formData.paymentTerms },
                    { label: currentLabels.warranty, val: formData.warranty },
                    { label: currentLabels.reqs, val: formData.requirements }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ border: '0.5pt solid black', padding: '6pt', width: '40%', textAlign: 'left', verticalAlign: 'top' }}>
                        {row.label}
                      </td>
                      <td style={{ border: '0.5pt solid black', padding: '6pt', width: '60%', textAlign: 'left', verticalAlign: 'top' }}>
                        {row.val || '—'}
                      </td>
                    </tr>
                  ))}
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

export default TechSpecView;
