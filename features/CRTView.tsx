
import React, { useState, useMemo } from 'react';
import MathRenderer from '../components/MathRenderer';
import { solveCRT } from '../mathUtils';

const CRTView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'MIN' | 'MAX'>('MIN');
  const [numEq, setNumEq] = useState(3);
  const [inputs, setInputs] = useState({
    m1: '3', r1: '2',
    m2: '5', r2: '3',
    m3: '7', r3: '2',
    m4: '11', r4: '5',
    digits: '10'
  });
  const [result, setResult] = useState<string | null>(null);
  const [lcmVal, setLcmVal] = useState<string | null>(null);

  const gcd = (a: bigint, b: bigint): bigint => b === 0n ? a : gcd(b, a % b);
  const lcm = (a: bigint, b: bigint): bigint => (a * b) / gcd(a, b);

  const handleSolve = () => {
    const moduli: number[] = [];
    const remainders: number[] = [];
    
    for (let i = 1; i <= numEq; i++) {
      moduli.push(parseInt((inputs as any)[`m${i}`]));
      remainders.push(parseInt((inputs as any)[`r${i}`]));
    }

    const sol = solveCRT(remainders, moduli);
    if (sol !== null) {
      let currentLcm = BigInt(moduli[0]);
      for (let i = 1; i < moduli.length; i++) {
        currentLcm = lcm(currentLcm, BigInt(moduli[i]));
      }
      setLcmVal(currentLcm.toString());

      const numDigits = parseInt(inputs.digits) || 1;
      const lowerBound = 10n ** BigInt(numDigits - 1);
      const upperBound = (10n ** BigInt(numDigits)) - 1n;

      let current = sol;
      current = ((current % currentLcm) + currentLcm) % currentLcm;

      if (mode === 'MIN') {
        if (current < lowerBound) {
          const diff = lowerBound - current;
          const k = (diff + currentLcm - 1n) / currentLcm;
          current += k * currentLcm;
        }
        if (current > upperBound) {
          setResult("Không tìm thấy số thỏa mãn trong khoảng chữ số này.");
        } else {
          setResult(current.toString());
        }
      } else {
        if (current > upperBound) {
          setResult("Không tìm thấy số thỏa mãn trong khoảng chữ số này.");
        } else {
          const diff = upperBound - current;
          const k = diff / currentLcm;
          current += k * currentLcm;
          if (current < lowerBound) {
            setResult("Không tìm thấy số thỏa mãn trong khoảng chữ số này.");
          } else {
            setResult(current.toString());
          }
        }
      }
    } else {
      setResult("Hệ phương trình vô nghiệm.");
    }
  };

  const renderInputRow = (id: number) => (
    <div key={id} className="flex items-center gap-4 bg-slate-50 p-6 rounded-[35px] border-2 border-slate-100 group hover:border-emerald-200 transition-all shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shadow-inner">
        {id}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">
            Số dư (<MathRenderer tex={`r_{${id}}`} />)
          </label>
          <input 
            value={(inputs as any)[`r${id}`]} 
            onChange={e => setInputs({...inputs, [`r${id}`]: e.target.value})}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-400 font-black text-2xl text-center shadow-inner"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-widest">
            Số chia (<MathRenderer tex={`m_{${id}}`} />)
          </label>
          <input 
            value={(inputs as any)[`m${id}`]} 
            onChange={e => setInputs({...inputs, [`m${id}`]: e.target.value})}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-400 font-black text-2xl text-center shadow-inner"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Trang chủ TMT EDU
      </button>
      
      <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">
            Đồng dư <span className="text-emerald-600">Trung Hoa</span>
          </h2>
          <p className="text-slate-500 font-medium italic underline decoration-emerald-200 decoration-4">Giải hệ phương trình bậc nhất trên tập hợp số tự nhiên lớn.</p>
        </div>
        
        <div className="flex bg-slate-100 p-2 rounded-3xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setMode('MIN')}
            className={`px-8 py-3 rounded-2xl font-black transition-all ${mode === 'MIN' ? 'bg-white shadow-lg text-emerald-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Số nhỏ nhất
          </button>
          <button 
            onClick={() => setMode('MAX')}
            className={`px-8 py-3 rounded-2xl font-black transition-all ${mode === 'MAX' ? 'bg-white shadow-lg text-emerald-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Số lớn nhất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Đề bài Math View */}
          <div className="bg-slate-900 p-12 rounded-[50px] shadow-2xl border-4 border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-white italic pointer-events-none">CRT</div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="h-0.5 w-12 bg-emerald-500"></div>
                 <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">Hệ thức toán học</span>
              </div>
              <p className="text-2xl text-slate-200 font-medium leading-relaxed">
                Tìm số tự nhiên $n$ {mode === 'MIN' ? 'nhỏ nhất' : 'lớn nhất'} có $k = {inputs.digits}$ chữ số, thỏa mãn hệ thức:
              </p>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                 <div className="text-5xl font-light text-emerald-300">
                    <span className="text-6xl mr-4">{"{"}</span>
                    <span className="inline-block text-left align-middle space-y-2">
                       {Array.from({length: numEq}).map((_, i) => (
                         <div key={i} className="block">
                           <MathRenderer tex={`n \\equiv r_{${i+1}} \\pmod{m_{${i+1}}}`} />
                         </div>
                       ))}
                    </span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[55px] border border-slate-100 shadow-2xl space-y-10">
             <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Cấu hình tham số</label>
                <div className="flex gap-3">
                  {[2, 3, 4].map(num => (
                    <button 
                      key={num} 
                      onClick={() => { setNumEq(num); setResult(null); }}
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${numEq === num ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
             </div>

             <div className="space-y-4">
                {Array.from({length: numEq}).map((_, i) => renderInputRow(i + 1))}
             </div>

             <div className="pt-8 border-t border-slate-50 text-center">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6 block">Yêu cầu về số chữ số (k)</label>
                <div className="relative max-w-xs mx-auto">
                  <input 
                    type="number" 
                    value={inputs.digits} 
                    onChange={e => setInputs({...inputs, digits: e.target.value})} 
                    className="w-full p-8 bg-emerald-50 border-4 border-transparent focus:border-emerald-200 rounded-[40px] outline-none text-6xl font-black text-emerald-900 transition-all text-center shadow-inner" 
                  />
                  <div className="mt-4 text-[10px] font-black text-emerald-600/50 uppercase italic tracking-widest">Duyệt dải 10^{(parseInt(inputs.digits)||1)-1}</div>
                </div>
             </div>

             <button 
               onClick={handleSolve} 
               className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:scale-[1.02] active:scale-95 text-white py-8 rounded-[40px] font-black text-3xl shadow-2xl shadow-emerald-200 transition-all"
             >
               🔍 GIẢI TOÁN NGAY
             </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-900 p-12 rounded-[55px] shadow-2xl border border-slate-800 h-full flex flex-col">
              <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-12 flex items-center gap-4">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                Phân tích nghiệm thực tế
              </h3>

              {result ? (
                <div className="flex-1 space-y-12 animate-slideUp text-center">
                  <div className="space-y-6">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Số $n$ nhỏ nhất cần tìm</p>
                    <div className="bg-white/5 border border-white/10 p-12 rounded-[45px] shadow-inner relative overflow-hidden">
                       <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full"></div>
                       <div className="relative z-10 text-5xl md:text-7xl font-black text-white tracking-tighter break-all font-mono">
                        {result}
                      </div>
                    </div>
                  </div>
                  
                  {lcmVal && (
                    <div className="p-10 bg-emerald-500/5 rounded-[40px] border border-emerald-500/10 space-y-4">
                       <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Công thức tổng quát</p>
                       <MathRenderer tex={`n = ${result} + t \\cdot ${lcmVal}`} className="text-2xl font-bold text-emerald-300" />
                       {/* Fixed: Use MathRenderer for the integer set symbol to avoid "Cannot find name 'Z'" and ensure consistent styling */}
                       <p className="text-[9px] text-slate-500 italic mt-2">với <MathRenderer tex="t \in \mathbb{Z}" /></p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-40">
                  <div className="text-9xl mb-10 transform -rotate-12">🏮</div>
                  <p className="text-slate-400 font-black text-sm uppercase tracking-[0.5em]">Đang chờ dữ liệu</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CRTView;
