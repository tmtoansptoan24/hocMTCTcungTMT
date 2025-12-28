
import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';
import { safeEval } from '../mathUtils';

const DiophantineView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [expr, setExpr] = useState('x^2 - y^2');
  const [a, setA] = useState('5');
  const [rangeX, setRangeX] = useState({ min: '-100', max: '100' });
  const [rangeY, setRangeY] = useState({ min: '-100', max: '100' });
  const [results, setResults] = useState<[number, number][]>([]);

  const handleSolve = () => {
    const minX = parseInt(rangeX.min) || 0;
    const maxX = parseInt(rangeX.max) || 0;
    const minY = parseInt(rangeY.min) || 0;
    const maxY = parseInt(rangeY.max) || 0;
    const target = parseFloat(a) || 0;

    const found: [number, number][] = [];

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const val = safeEval(expr, { x, y });
        if (Math.abs(val - target) < 1e-9) {
          found.push([x, y]);
        }
      }
    }
    setResults(found);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Trang chủ TMT EDU
      </button>
      
      <h2 className="text-3xl font-extrabold text-slate-800 mb-8">Phương trình Nghiệm nguyên</h2>
      
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
              <MathRenderer tex="\text{Đa thức } f(x,y)" />
            </label>
            <input 
              value={expr} 
              onChange={e => setExpr(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-lg font-bold" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
              <MathRenderer tex="\text{Hằng số } a" />
            </label>
            <input 
              value={a} 
              onChange={e => setA(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-400 text-xl font-black" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">X Range</label>
            <div className="flex items-center gap-4">
              <input value={rangeX.min} onChange={e => setRangeX({...rangeX, min: e.target.value})} className="w-1/2 p-3 bg-white border rounded-xl text-center font-bold" />
              <input value={rangeX.max} onChange={e => setRangeX({...rangeX, max: e.target.value})} className="w-1/2 p-3 bg-white border rounded-xl text-center font-bold" />
            </div>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">Y Range</label>
            <div className="flex items-center gap-4">
              <input value={rangeY.min} onChange={e => setRangeY({...rangeY, min: e.target.value})} className="w-1/2 p-3 bg-white border rounded-xl text-center font-bold" />
              <input value={rangeY.max} onChange={e => setRangeY({...rangeY, max: e.target.value})} className="w-1/2 p-3 bg-white border rounded-xl text-center font-bold" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSolve} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg transition-all"
        >
          QUÉT TÌM NGHIỆM
        </button>
      </div>

      <div className="mt-12">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {results.map(([x, y], i) => (
              <div key={i} className="p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm text-center font-bold text-emerald-700">
                <MathRenderer tex={`(${x}, ${y})`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-[40px] text-center text-slate-400 italic">
            Chưa tìm thấy nghiệm.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiophantineView;
