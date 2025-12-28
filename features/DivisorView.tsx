
import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';
import { getPrimeFactors, getAllDivisors } from '../mathUtils';

const DivisorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [a, setA] = useState('2024');
  const [rangeM, setRangeM] = useState('1');
  const [rangeN, setRangeN] = useState('1000');
  const [divisibleK, setDivisibleK] = useState('4');
  const [endingS, setEndingS] = useState('4');
  
  const [results, setResults] = useState<{
    primeFactors: string;
    totalCount: number;
    sumAll: number;
    sumOdd: number;
    sumEven: number;
    divisorsInRange: number[];
    sumInRange: number;
    divisorsByK: number[];
    sumByK: number;
    divisorsEndingS: number[];
    sumEndingS: number;
  } | null>(null);

  const handleSolve = () => {
    const numA = parseInt(a);
    const m = parseInt(rangeM);
    const n = parseInt(rangeN);
    const k = parseInt(divisibleK);
    const s = endingS.trim();

    if (isNaN(numA) || numA < 1) {
      alert("Vui lòng nhập số tự nhiên A > 0");
      return;
    }

    // 1. Phân tích thừa số nguyên tố
    const factorsMap = getPrimeFactors(numA);
    const factorsArr: string[] = [];
    factorsMap.forEach((exp, p) => {
      factorsArr.push(`${p}^{${exp}}`);
    });
    const primeStr = factorsArr.join(' \\cdot ');

    // 2. Lấy tất cả ước
    const allDivs = getAllDivisors(numA);
    
    // 3. Tính toán các tổng cơ bản
    let sumAll = 0, sumOdd = 0, sumEven = 0;
    allDivs.forEach(d => {
      sumAll += d;
      if (d % 2 === 0) sumEven += d;
      else sumOdd += d;
    });

    // 4. Ước trong phạm vi m đến n
    const inRange = allDivs.filter(d => d >= m && d <= n);
    const sumInRange = inRange.reduce((acc, val) => acc + val, 0);

    // 5. Ước chia hết cho k
    const byK = (!isNaN(k) && k > 0) ? allDivs.filter(d => d % k === 0) : [];
    const sumByK = byK.reduce((acc, val) => acc + val, 0);

    // 6. Ước tận cùng là s
    const ending = (s !== "") ? allDivs.filter(d => d.toString().endsWith(s)) : [];
    const sumEndingS = ending.reduce((acc, val) => acc + val, 0);

    setResults({
      primeFactors: primeStr,
      totalCount: allDivs.length,
      sumAll,
      sumOdd,
      sumEven,
      divisorsInRange: inRange,
      sumInRange,
      divisorsByK: byK,
      sumByK,
      divisorsEndingS: ending,
      sumEndingS
    });
  };

  const renderDivisorList = (title: string, icon: string, list: number[], sum: number, color: string) => (
    <div className="bg-white p-8 rounded-[45px] border border-emerald-100 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
          {icon} {title}
        </h3>
        <div className={`${color} px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current opacity-80`}>
          {list.length} kết quả
        </div>
      </div>

      {list.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-2 custom-scrollbar">
            {list.map((d, i) => (
              <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-center font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-default">
                {d}
              </div>
            ))}
          </div>
          <div className={`p-6 rounded-3xl text-white flex justify-between items-center shadow-lg bg-gradient-to-r ${color.includes('emerald') ? 'from-emerald-600 to-green-700' : color.includes('teal') ? 'from-teal-600 to-emerald-700' : 'from-green-600 to-lime-700'}`}>
            <span className="font-bold uppercase text-[9px] tracking-widest opacity-80 text-white">Tổng các ước số:</span>
            <span className="text-3xl font-black">{sum.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <div className="p-10 border-2 border-dashed border-emerald-50 rounded-3xl text-center text-emerald-300 italic">
          Không có kết quả nào phù hợp.
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Quay lại Trang chủ TMT EDU
      </button>
      
      <div className="mb-10">
        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-4">Mô-đun số học</div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">
          Ước số và <span className="text-emerald-600">Thừa số</span>
        </h2>
        <p className="text-slate-500 font-medium italic underline decoration-emerald-200 decoration-4">Phân tích đa chiều tập hợp ước của số tự nhiên $A$.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel Nhập liệu */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-emerald-100 shadow-xl space-y-6 sticky top-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Nhập số tự nhiên A</label>
              <input 
                type="number" 
                value={a} 
                onChange={e => setA(e.target.value)} 
                className="w-full p-4 bg-emerald-50/30 border-4 border-transparent focus:border-emerald-100 rounded-3xl outline-none text-4xl font-black text-slate-800 transition-all text-center shadow-inner" 
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-emerald-50">
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Từ (m)</span>
                    <input value={rangeM} onChange={e => setRangeM(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center border border-slate-100 focus:border-emerald-200 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Đến (n)</span>
                    <input value={rangeN} onChange={e => setRangeN(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center border border-slate-100 focus:border-emerald-200 outline-none" />
                  </div>
               </div>

               <div className="space-y-1">
                  <span className="text-[9px] text-emerald-500 font-black ml-1 uppercase tracking-widest">Ước chia hết cho (k)</span>
                  <input value={divisibleK} onChange={e => setDivisibleK(e.target.value)} className="w-full p-3 bg-emerald-50/50 rounded-xl font-bold text-center border border-emerald-100 outline-none focus:bg-emerald-100 transition-colors" />
               </div>

               <div className="space-y-1">
                  <span className="text-[9px] text-green-500 font-black ml-1 uppercase tracking-widest">Ước tận cùng là (s)</span>
                  <input value={endingS} onChange={e => setEndingS(e.target.value)} className="w-full p-3 bg-green-50/30 rounded-xl font-bold text-center border border-green-100 outline-none focus:bg-green-100 transition-colors" placeholder="VD: 5" />
               </div>
            </div>

            <button 
              onClick={handleSolve} 
              className="w-full bg-gradient-to-br from-emerald-500 to-green-600 hover:shadow-emerald-200 hover:shadow-xl text-white py-6 rounded-[30px] font-black text-xl shadow-lg transition-all active:scale-95"
            >
              🚀 PHÂN TÍCH NGAY
            </button>
          </div>
        </div>

        {/* Panel Kết quả */}
        <div className="lg:col-span-8 space-y-8">
          {results ? (
            <div className="space-y-8 animate-slideUp">
              {/* Phân tích thừa số nguyên tố */}
              <div className="bg-emerald-950 p-10 rounded-[45px] shadow-2xl border-4 border-emerald-800 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-8xl text-white italic pointer-events-none uppercase">Thừa Số</div>
                <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Phân tích thừa số nguyên tố
                </h3>
                <div className="text-center py-6">
                  <MathRenderer tex={`A = ${results.primeFactors}`} display className="text-5xl text-emerald-100 font-medium" />
                </div>
              </div>

              {/* Thống kê 4 Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-[30px] border border-emerald-100 shadow-md text-center group hover:bg-emerald-50 transition-colors">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500">Số lượng ước</p>
                   <p className="text-2xl font-black text-slate-800">{results.totalCount}</p>
                </div>
                <div className="bg-white p-5 rounded-[30px] border border-emerald-100 shadow-md text-center group hover:bg-emerald-50 transition-colors">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500">Tổng các ước</p>
                   <p className="text-2xl font-black text-slate-800">{results.sumAll.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-[30px] border border-emerald-100 shadow-md text-center group hover:bg-emerald-50 transition-colors">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500">Tổng ước lẻ</p>
                   <p className="text-2xl font-black text-green-600">{results.sumOdd.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-[30px] border border-emerald-100 shadow-md text-center group hover:bg-emerald-50 transition-colors">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500">Tổng ước chẵn</p>
                   <p className="text-2xl font-black text-emerald-700">{results.sumEven.toLocaleString()}</p>
                </div>
              </div>

              {/* Danh sách lọc điều kiện */}
              <div className="space-y-8">
                {renderDivisorList(`Ước trong dải [${rangeM} → ${rangeN}]`, "🎯", results.divisorsInRange, results.sumInRange, "text-emerald-600 bg-emerald-50")}
                {divisibleK && renderDivisorList(`Ước chia hết cho ${divisibleK}`, "🔗", results.divisorsByK, results.sumByK, "text-green-600 bg-green-50")}
                {endingS && renderDivisorList(`Ước tận cùng là ${endingS}`, "✨", results.divisorsEndingS, results.sumEndingS, "text-teal-600 bg-teal-50")}
              </div>
            </div>
          ) : (
            <div className="h-full border-4 border-dashed border-emerald-100 rounded-[50px] flex flex-col items-center justify-center p-20 text-center bg-white/40">
              <div className="text-7xl mb-8 opacity-20">🧬</div>
              <h4 className="text-2xl font-black text-emerald-300 mb-4 uppercase tracking-tighter">Sẵn sàng phân tích</h4>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">Vui lòng thiết lập các tham số ở bảng bên trái để hệ thống TMT EDU xử lý dữ liệu.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #059669; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DivisorView;
