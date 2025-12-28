
import React, { useState, useMemo } from 'react';
import MathRenderer from '../components/MathRenderer';
import { safeEval } from '../mathUtils';

const OptimizationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<1 | 2 | 3 | 4>(1);
  const [params, setParams] = useState({ a: '1', b: 'pi', c: '1', d: '0', e: '2' });
  const [result, setResult] = useState<{ min: string, max: string } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const formulaLatex = useMemo(() => {
    const { a, b, c, d, e } = params;
    if (mode === 1) return `f(x) = \\frac{${a}x + ${b}}{${c}x^2 + ${d}x + ${e}}`;
    if (mode === 2) return `f(x) = \\frac{${c}x^2 + ${d}x + ${e}}{${a}x + ${b}}`;
    if (mode === 3) return `f(x) = \\frac{${a}x + ${b}}{\\sqrt{${c}x + ${d}}}`;
    if (mode === 4) return `f(x) = \\frac{\\sqrt{${c}x + ${d}}}{${a}x + ${b}}`;
    return '';
  }, [mode, params]);

  const calculate = () => {
    setCalculating(true);
    setResult(null);
    setTimeout(() => {
      const p = {
        a: safeEval(params.a), b: safeEval(params.b),
        c: safeEval(params.c), d: safeEval(params.d), e: safeEval(params.e)
      };
      let vals: number[] = [];
      for (let x = -500; x <= 500; x += 0.05) {
        let v: number | null = null;
        if (mode === 1) v = (p.a*x+p.b)/(p.c*x*x+p.d*x+p.e);
        if (mode === 2) v = (p.c*x*x+p.d*x+p.e)/(p.a*x+p.b);
        if (mode === 3 && p.c*x+p.d >= 0) v = (p.a*x+p.b)/Math.sqrt(p.c*x+p.d);
        if (mode === 4 && p.c*x+p.d >= 0) v = Math.sqrt(p.c*x+p.d)/(p.a*x+p.b);
        if (v !== null && isFinite(v)) vals.push(v);
      }
      if (vals.length) {
        setResult({
          max: Math.max(...vals).toLocaleString(undefined, { maximumFractionDigits: 6 }),
          min: Math.min(...vals).toLocaleString(undefined, { maximumFractionDigits: 6 })
        });
      }
      setCalculating(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl">🏠</span> Trang chủ TMT EDU
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">Cực trị <span className="text-emerald-600">Hàm số</span></h2>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[1, 2, 3, 4].map(m => (
            <button key={m} onClick={() => setMode(m as any)} className={`px-6 py-2 rounded-xl font-bold transition-all ${mode === m ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500'}`}>Dạng {m}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-xl space-y-8">
           <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center min-h-[100px] flex items-center justify-center">
              <MathRenderer tex={formulaLatex} className="text-3xl font-bold text-emerald-800" />
           </div>
           <div className="grid grid-cols-3 gap-4">
              {Object.keys(params).map(k => (
                <div key={k} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">Hệ số {k.toUpperCase()}</label>
                  <input value={(params as any)[k]} onChange={e => setParams({...params, [k]: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-center font-bold" />
                </div>
              ))}
           </div>
           <button onClick={calculate} disabled={calculating} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50">
             {calculating ? 'ĐANG TÌM...' : 'GIẢI TOÁN'}
           </button>
        </div>

        <div className="bg-slate-900 p-10 rounded-[45px] text-white shadow-2xl flex flex-col justify-center text-center">
           {result ? (
             <div className="space-y-10 animate-slideUp">
                <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">GTLN (MAX)</p><div className="text-5xl font-black text-emerald-400">{result.max}</div></div>
                <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">GTNN (MIN)</p><div className="text-5xl font-black text-red-400">{result.min}</div></div>
             </div>
           ) : (
             <div className="opacity-20 py-20"><p className="font-bold text-xs uppercase">Chưa có kết quả</p></div>
           )}
        </div>
      </div>
    </div>
  );
};

export default OptimizationView;
