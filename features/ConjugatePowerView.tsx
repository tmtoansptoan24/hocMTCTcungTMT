import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';

const ConjugatePowerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [a, setA] = useState('5');
  const [b, setB] = useState('7');
  const [n, setN] = useState('42');
  const [c, setC] = useState('2027');
  const [result, setResult] = useState<{ exact: string; remainder: string; params: any } | null>(null);

  const multiply = (A: bigint[][], B: bigint[][], mod: bigint) => {
    const C = [[0n, 0n], [0n, 0n]];
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        for (let k = 0; k < 2; k++) {
          let val = (A[i][k] * B[k][j]) % mod;
          C[i][j] = (C[i][j] + val + mod) % mod;
        }
    return C;
  };

  const matrixPower = (A: bigint[][], p: bigint, mod: bigint) => {
    let res = [[1n, 0n], [0n, 1n]];
    let base = [[A[0][0], A[0][1]], [A[1][0], A[1][1]]];
    while (p > 0n) {
      if (p % 2n === 1n) res = multiply(res, base, mod);
      base = multiply(base, base, mod);
      p /= 2n;
    }
    return res;
  };

  const handleSolve = () => {
    try {
      const bigA = BigInt(a);
      const bigB = BigInt(b);
      const bigN = BigInt(n);
      const bigC = BigInt(c);

      if (bigN < 0n) throw new Error("n must be >= 0");

      let remainderStr = "";
      if (bigN === 0n) remainderStr = (2n % bigC).toString();
      else if (bigN === 1n) remainderStr = ((2n * bigA) % bigC).toString();
      else {
        const T = [[(2n * bigA) % bigC, (bigB - bigA * bigA) % bigC], [1n, 0n]];
        const Tn = matrixPower(T, bigN - 1n, bigC);
        const s1 = (2n * bigA) % bigC;
        const s0 = 2n % bigC;
        const sn = (Tn[0][0] * s1 + Tn[0][1] * s0) % bigC;
        remainderStr = ((sn + bigC) % bigC).toString();
      }

      let exactStr = "Số quá lớn để hiển thị toàn bộ";
      if (bigN <= 5000n) {
        let sPrev2 = 2n;
        let sPrev1 = 2n * bigA;
        if (bigN === 0n) exactStr = sPrev2.toString();
        else if (bigN === 1n) exactStr = sPrev1.toString();
        else {
          let currentS = 0n;
          const coeff = bigB - bigA * bigA;
          for (let i = 2n; i <= bigN; i++) {
            currentS = 2n * bigA * sPrev1 + coeff * sPrev2;
            sPrev2 = sPrev1;
            sPrev1 = currentS;
          }
          exactStr = currentS.toString();
        }
      }

      setResult({ 
        exact: exactStr, 
        remainder: remainderStr,
        params: { a, b, n, c }
      });
    } catch (e) {
      alert("Lỗi dữ liệu đầu vào. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fadeIn text-slate-800">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110">🏠</span> Trang chủ TMT EDU
      </button>

      <div className="mb-10 text-left">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic uppercase">
          Lũy thừa <span className="text-emerald-600">Liên hợp</span>
        </h2>
        <div className="flex items-center gap-3">
           <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
             TMT EDU Advanced Math Solver
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
        <div className="lg:col-span-5 bg-white p-10 rounded-[50px] border border-emerald-50 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 font-black text-7xl italic pointer-events-none">INPUT</div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tham số a</label>
              <input value={a} onChange={e => setA(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-2xl text-center outline-none focus:border-emerald-400 transition-all shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tham số b</label>
              <input value={b} onChange={e => setB(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-2xl text-center outline-none focus:border-emerald-400 transition-all shadow-inner" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Số mũ n</label>
            <input value={n} onChange={e => setN(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-2xl text-center outline-none focus:border-emerald-400 transition-all shadow-inner" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-emerald-600 uppercase tracking-widest ml-1 italic">Số chia c (Modulo)</label>
            <input value={c} onChange={e => setC(e.target.value)} className="w-full p-6 bg-emerald-50 border-4 border-emerald-100 rounded-[35px] font-black text-4xl text-center outline-none focus:border-emerald-500 transition-all shadow-inner text-emerald-900" />
          </div>
          <button 
            onClick={handleSolve} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-7 rounded-[35px] font-black text-2xl shadow-xl hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            🚀 TÍNH TOÁN NGAY
          </button>
        </div>

        <div className="lg:col-span-7 bg-slate-900 p-12 rounded-[60px] shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border-8 border-slate-800">
           <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 space-y-8">
              <div className="inline-block px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">Biểu thức tổng quát</span>
              </div>
              <div className="text-5xl text-white font-light tracking-tight">
                 <MathRenderer tex={`S_n = (a + \\sqrt{b})^n + (a - \\sqrt{b})^n`} display />
              </div>
              <div className="p-6 bg-white/5 rounded-[30px] border border-white/10 text-emerald-300 italic text-lg max-w-md mx-auto leading-relaxed">
                "Tìm số dư của biểu thức liên hợp khi biết các tham số hằng số và số mũ."
              </div>
           </div>
        </div>
      </div>

      {result && (
        <div className="space-y-10 animate-slideUp">
           <div className="bg-white p-12 rounded-[60px] border-l-[16px] border-emerald-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-9xl font-black italic pointer-events-none">Q</div>
              <div className="flex items-center gap-4 mb-8">
                 <span className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Đề bài bài toán</span>
                 <div className="h-0.5 flex-1 bg-slate-100"></div>
              </div>
              
              <div className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight tracking-tight">
                Cho biểu thức liên hợp <MathRenderer tex="S_n" /> có dạng:
                <div className="my-8 py-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                   <MathRenderer tex={`S_{${result.params.n}} = (${result.params.a} + \\sqrt{${result.params.b}})^{${result.params.n}} + (${result.params.a} - \\sqrt{${result.params.b}})^{${result.params.n}}`} display />
                </div>
                Hãy tìm <span className="text-emerald-600 underline decoration-4 underline-offset-8">số dư</span> của <MathRenderer tex={`S_{${result.params.n}}`} /> khi thực hiện phép chia cho số tự nhiên <MathRenderer tex={`c = ${result.params.c}`} />.
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 bg-white p-10 rounded-[50px] border border-emerald-100 shadow-xl overflow-hidden relative">
                 <h3 className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Giá trị chính xác (Full Precision)
                 </h3>
                 <div className="max-h-60 overflow-y-auto custom-scrollbar p-8 bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-100 font-mono text-2xl font-black text-slate-700 break-all leading-relaxed shadow-inner">
                    {result.exact}
                 </div>
                 {result.exact.length > 50 && (
                    <button 
                      onClick={() => { navigator.clipboard.writeText(result.exact); alert("Đã sao chép giá trị chính xác!"); }}
                      className="mt-6 flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                    >
                      <span className="text-xl">📋</span> Sao chép toàn bộ giá trị
                    </button>
                 )}
              </div>

              <div className="md:col-span-5 bg-emerald-600 p-12 rounded-[55px] text-white shadow-2xl relative group overflow-hidden flex flex-col justify-center items-center text-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                 <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 opacity-80">KẾT QUẢ SỐ DƯ (REMAINDER)</p>
                 <div className="text-8xl font-black tracking-tighter drop-shadow-2xl mb-6">
                   {result.remainder}
                 </div>
                 <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/20 backdrop-blur-md">
                    <MathRenderer tex={`S_{${result.params.n}} \\equiv ${result.remainder} \\pmod{${result.params.c}}`} className="text-xl font-bold text-emerald-50" />
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ConjugatePowerView;