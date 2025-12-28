
import React, { useState } from 'react';
import { safeEval } from '../mathUtils';
import MathRenderer from '../components/MathRenderer';

const FunctionTableView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [fx, setFx] = useState('(x*10^7+1111111)/2019');
  const [gx, setGx] = useState('x^2 - 5x + 6');
  const [start, setStart] = useState('1000');
  const [end, setEnd] = useState('1051');
  const [step, setStep] = useState('1');
  const [table, setTable] = useState<{ x: number, f: number | null, g: number | null }[]>([]);

  const calculate = () => {
    const rows = [];
    const s = parseFloat(start);
    const e = parseFloat(end);
    const st = parseFloat(step);
    
    if (isNaN(s) || isNaN(e) || isNaN(st) || st <= 0) {
      alert("Tham số dải số không hợp lệ.");
      return;
    }

    for (let x = s; x <= e; x += st) {
      const fVal = safeEval(fx, { x });
      const gVal = gx.trim() ? safeEval(gx, { x }) : null;
      rows.push({ x, f: fVal, g: gVal });
      if (rows.length > 1500) break;
    }
    setTable(rows);
  };

  const isInteger = (num: number | null) => {
    if (num === null) return false;
    return Number.isInteger(num) || Math.abs(num - Math.round(num)) < 1e-10;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-all group">
        <span className="text-xl group-hover:scale-110">🏠</span> Trang chủ TMT EDU
      </button>

      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">
          Bảng giá trị <span className="text-emerald-600">Table</span> f(x) & g(x)
        </h2>
        <p className="text-slate-500 font-medium">Lập bảng giá trị đồng thời 2 hàm số, nhận diện nhanh nghiệm nguyên.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-slate-50 space-y-8">
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-black text-emerald-600 uppercase tracking-widest ml-1">Hàm f(x)</label>
                   <input 
                     value={fx} 
                     onChange={e => setFx(e.target.value)} 
                     className="w-full p-4 bg-slate-900 text-emerald-400 border-l-4 border-emerald-500 rounded-2xl font-mono text-xl font-bold outline-none" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-teal-600 uppercase tracking-widest ml-1">Hàm g(x)</label>
                   <input 
                     value={gx} 
                     onChange={e => setGx(e.target.value)} 
                     className="w-full p-4 bg-slate-900 text-teal-400 border-l-4 border-teal-500 rounded-2xl font-mono text-xl font-bold outline-none" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">Bắt đầu</label>
                  <input value={start} onChange={e => setStart(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-lg text-center" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">Kết thúc</label>
                  <input value={end} onChange={e => setEnd(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-lg text-center" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">Bước nhảy</label>
                  <input value={step} onChange={e => setStep(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-lg text-center" />
                </div>
             </div>

             <button onClick={calculate} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95">
               TẠO BẢNG GIÁ TRỊ
             </button>

             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="flex justify-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">f(x) Nguyên</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-teal-400 rounded"></div>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">g(x) Nguyên</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-slate-900 p-8 rounded-[45px] shadow-2xl text-white h-full flex flex-col min-h-[500px]">
              <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar pr-2">
                 {table.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-900 z-10 border-b border-white/10">
                        <tr className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                          <th className="p-4">X</th>
                          <th className="p-4">f(X)</th>
                          <th className="p-4">g(X)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.map((r, i) => (
                          <tr key={i} className="group hover:bg-white/5 border-b border-white/5">
                            <td className="p-4 font-mono text-white/50">{r.x}</td>
                            <td className={`p-4 font-mono font-bold ${isInteger(r.f) ? 'text-emerald-400 bg-emerald-400/10 rounded-lg' : 'text-white'}`}>
                               {r.f !== null ? r.f.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '---'}
                            </td>
                            <td className={`p-4 font-mono font-bold ${isInteger(r.g) ? 'text-teal-400 bg-teal-400/10 rounded-lg' : 'text-white/60'}`}>
                               {r.g !== null ? r.g.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '---'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-40">
                       <p className="font-bold text-xs uppercase tracking-[0.3em]">Chưa có dữ liệu</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionTableView;
