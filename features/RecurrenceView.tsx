
import React, { useState, useMemo } from 'react';
import MathRenderer from '../components/MathRenderer';
import { evaluatePolynomial } from '../mathUtils';

const RecurrenceView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [type, setType] = useState<1 | 2>(1); // 1: Bậc 2, 2: Bậc 3
  const [u1, setU1] = useState('1');
  const [u2, setU2] = useState('2');
  const [u3, setU3] = useState('3');
  const [fn, setFn] = useState('n');
  const [gn, setGn] = useState('-2');
  const [hn, setHn] = useState('n^2-2*n+3');
  const [kn, setKn] = useState('0');
  const [targetN, setTargetN] = useState('20');
  
  const [sumStart, setSumStart] = useState('1');
  const [sumEnd, setSumEnd] = useState('20');

  const [sequence, setSequence] = useState<number[]>([]);
  const [sumResult, setSumResult] = useState<number | null>(null);

  const calculate = () => {
    const limit = parseInt(targetN);
    const seq: number[] = [];
    try {
      if (type === 1) {
        seq[1] = parseFloat(u1);
        seq[2] = parseFloat(u2);
        for (let n = 1; n <= limit - 2; n++) {
          seq[n + 2] = evaluatePolynomial(fn, n) * seq[n + 1] + evaluatePolynomial(gn, n) * seq[n] + evaluatePolynomial(hn, n);
        }
      } else {
        seq[1] = parseFloat(u1);
        seq[2] = parseFloat(u2);
        seq[3] = parseFloat(u3);
        for (let n = 1; n <= limit - 3; n++) {
          seq[n + 3] = evaluatePolynomial(fn, n) * seq[n + 2] + evaluatePolynomial(gn, n) * seq[n + 1] + evaluatePolynomial(hn, n) * seq[n] + evaluatePolynomial(kn, n);
        }
      }
      setSequence(seq);

      const s = parseInt(sumStart);
      const e = Math.min(parseInt(sumEnd), seq.length - 1);
      if (!isNaN(s) && !isNaN(e) && s <= e && s > 0) {
        let currentSum = 0;
        for (let i = s; i <= e; i++) {
          currentSum += seq[i] || 0;
        }
        setSumResult(currentSum);
      }
    } catch (err) {
      alert("Lỗi tính toán: Vui lòng kiểm tra các hàm số n.");
    }
  };

  const formulaPreview = useMemo(() => {
    if (type === 1) {
      return `U_{n+2} = (${fn}) \\cdot U_{n+1} + (${gn}) \\cdot U_n + (${hn})`;
    } else {
      return `U_{n+3} = (${fn}) \\cdot U_{n+2} + (${gn}) \\cdot U_{n+1} + (${hn}) \\cdot U_n + (${kn})`;
    }
  }, [type, fn, gn, hn, kn]);

  const renderFuncInput = (val: string, setVal: (v: string) => void, label: string) => (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 transition-all group">
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest group-hover:text-emerald-600">
        <MathRenderer tex={`${label}(n)`} />
      </label>
      <input 
        value={val} 
        onChange={e => setVal(e.target.value)} 
        className="w-full bg-white border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-400 outline-none font-bold text-slate-800"
        placeholder={`Nhập biểu thức...`}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110">🏠</span> Trang chủ TMT EDU
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">
          Dãy số <span className="text-emerald-600">Truy hồi</span> Pro
        </h2>
        <div className="flex bg-slate-100 p-2 rounded-3xl border border-slate-200">
           <button onClick={() => setType(1)} className={`px-8 py-3 rounded-2xl font-black transition-all ${type === 1 ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-500'}`}>Bậc 2</button>
           <button onClick={() => setType(2)} className={`px-8 py-3 rounded-2xl font-black transition-all ${type === 2 ? 'bg-white shadow-lg text-emerald-600' : 'text-slate-500'}`}>Bậc 3</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-slate-100 space-y-8">
             <div className="space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Xem trước công thức</h3>
               <div className="bg-slate-900 p-8 rounded-3xl text-center text-white border-b-4 border-emerald-500 shadow-xl overflow-x-auto">
                 <MathRenderer tex={formulaPreview} className="text-2xl font-medium text-emerald-300" />
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">U1</label>
                  <input value={u1} onChange={e => setU1(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-xl text-center" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">U2</label>
                  <input value={u2} onChange={e => setU2(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-xl text-center" />
                </div>
                {type === 2 && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-slideUp text-center">
                    <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">U3</label>
                    <input value={u3} onChange={e => setU3(e.target.value)} className="w-full bg-white border-2 border-emerald-100 rounded-xl p-3 font-black text-xl text-center" />
                  </div>
                )}
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderFuncInput(fn, setFn, 'f')}
                {renderFuncInput(gn, setGn, 'g')}
                {renderFuncInput(hn, setHn, 'h')}
                {type === 2 && renderFuncInput(kn, setKn, 'k')}
             </div>

             <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tính tổng dãy số</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                   <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Từ U(i)</label>
                     <input value={sumStart} onChange={e => setSumStart(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold text-center" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Đến U(j)</label>
                     <input value={sumEnd} onChange={e => setSumEnd(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold text-center" />
                   </div>
                   <div className="hidden md:block">
                     <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Giới hạn n</label>
                     <input type="number" value={targetN} onChange={e => setTargetN(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold text-center" />
                   </div>
                </div>
             </div>

             <button onClick={calculate} className="w-full bg-emerald-600 text-white py-6 rounded-[35px] font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95">
               TÍNH TOÁN DÃY VÀ TỔNG
             </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           {sumResult !== null && (
             <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl animate-slideUp">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 text-center">Tổng ∑ U từ {sumStart} đến {sumEnd}</p>
                <div className="text-4xl font-black text-center truncate">{sumResult.toLocaleString()}</div>
             </div>
           )}

           <div className="bg-slate-900 p-8 rounded-[45px] shadow-2xl h-full flex flex-col text-white">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">Bảng số hạng</h3>
              <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar space-y-3 pr-2">
                 {sequence.length > 0 ? sequence.map((v, i) => i > 0 && (
                   <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-emerald-500/10 transition-colors">
                     <span className="text-slate-500 font-black text-xs">U({i})</span>
                     <span className="font-mono text-xl font-bold text-emerald-400">{v.toLocaleString()}</span>
                   </div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                     <p className="font-bold text-xs uppercase">Chưa có dãy số</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceView;
