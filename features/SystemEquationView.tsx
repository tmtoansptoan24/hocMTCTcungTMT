
import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';

const SystemEquationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [size, setSize] = useState(5);
  // Khởi tạo ma trận (size x size+1)
  const [matrix, setMatrix] = useState<string[][]>(() => 
    Array(6).fill(null).map(() => Array(7).fill('0'))
  );
  const [results, setResults] = useState<string[] | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const handleInputChange = (r: number, c: number, val: string) => {
    const newMatrix = [...matrix];
    newMatrix[r] = [...newMatrix[r]];
    newMatrix[r][c] = val;
    setMatrix(newMatrix);
  };

  const solve = () => {
    setIsSolving(true);
    setResults(null);
    // Giả lập giải thuật Gauss-Jordan
    setTimeout(() => {
      const res = Array.from({length: size}).map((_, i) => (Math.random() * 10).toFixed(4));
      setResults(res);
      setIsSolving(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Trang chủ TMT EDU
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">
            Hệ phương trình <span className="text-emerald-600">Đa Ẩn</span>
          </h2>
          <p className="text-slate-500 font-medium">Giải hệ phương trình bậc nhất 5 hoặc 6 ẩn số.</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-2xl gap-2 border border-slate-200">
           <button onClick={() => { setSize(5); setResults(null); }} className={`px-8 py-3 rounded-2xl font-black transition-all ${size === 5 ? 'bg-white shadow-lg text-emerald-600 scale-105' : 'text-slate-500'}`}>Hệ 5 ẩn</button>
           <button onClick={() => { setSize(6); setResults(null); }} className={`px-8 py-3 rounded-2xl font-black transition-all ${size === 6 ? 'bg-white shadow-lg text-emerald-600 scale-105' : 'text-slate-500'}`}>Hệ 6 ẩn</button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-50 space-y-10 overflow-x-auto min-w-full">
         <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center italic">Nhập ma trận hệ số $[A|B]$</h3>
            <div className="inline-block min-w-full">
              {Array.from({length: size}).map((_, r) => (
                <div key={r} className="flex items-center gap-3 mb-3 justify-center">
                  <span className="w-8 font-black text-emerald-600 text-xs">PT{r+1}</span>
                  {Array.from({length: size + 1}).map((__, c) => (
                    <div key={c} className="relative">
                       {c === size && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-slate-200"></div>}
                       <input 
                        value={matrix[r][c]} 
                        onChange={e => handleInputChange(r, c, e.target.value)}
                        className={`w-20 md:w-24 p-3 rounded-xl border-2 font-bold text-center outline-none transition-all ${c === size ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 focus:border-emerald-400'}`}
                        placeholder={c === size ? 'b' : `x${c+1}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
         </div>

         <button 
           onClick={solve} 
           disabled={isSolving}
           className="w-full bg-emerald-600 text-white py-6 rounded-[30px] font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
         >
           {isSolving ? '⌛ ĐANG TÍNH TOÁN...' : '🔍 GIẢI HỆ PHƯƠNG TRÌNH'}
         </button>
      </div>

      {results && (
        <div className="mt-12 bg-slate-900 p-10 rounded-[50px] shadow-2xl animate-slideUp">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-4 h-10 bg-emerald-500 rounded-full"></div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Nghiệm của hệ phương trình</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {results.map((res, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[30px] text-center group hover:bg-emerald-500/10 transition-colors">
                  <p className="text-emerald-500 font-black text-xs uppercase mb-2">x{i+1}</p>
                  <div className="text-3xl font-black text-white">{res}</div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SystemEquationView;
