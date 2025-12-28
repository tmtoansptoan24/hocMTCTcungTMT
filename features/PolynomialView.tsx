
// Fix: Added missing closing tags and export default to resolve "no default export" error in App.tsx
import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';
import { solveLinearSystem, safeEval } from '../mathUtils';

const PolynomialView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [degree, setDegree] = useState<3 | 4>(3);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [inputs, setInputs] = useState({
    p1: '3x^2 - x - 1', r1: '5x - 7',
    p2: '2x^2 + x', r2: '8x - 6',
    a: '1', b: '2',
    calcX: '2023'
  });
  const [result, setResult] = useState<{ 
    fText: string, 
    fCalc: string,
    fValRaw: string
  } | null>(null);

  const showCopyFeedback = (msg: string) => {
    setCopyStatus(msg);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    showCopyFeedback(msg);
  };

  const copyAll = () => {
    if (!result) return;
    const fullText = `${result.fText}\n${result.fCalc}`;
    copyToClipboard(fullText, "Đã chép toàn bộ!");
  };

  const loadHardExample = (deg: 3 | 4) => {
    setDegree(deg);
    if (deg === 3) {
      setInputs({
        p1: '13x^2 + 7x - 5', r1: '102x - 89',
        p2: '17x^2 - 11', r2: '45x + 123',
        a: '0', b: '0',
        calcX: '2025'
      });
    } else {
      setInputs({
        p1: '5x^2 - 12x + 7', r1: '33x + 44',
        p2: '2x^2 + 15x - 9', r2: '101x - 5',
        a: '2', b: '1500',
        calcX: '2025'
      });
    }
    setResult(null);
  };

  const getCoeffsQuadratic = (expr: string) => {
    const c = safeEval(expr, { x: 0 });
    const apb = safeEval(expr, { x: 1 }) - c;
    const amb = safeEval(expr, { x: -1 }) - c;
    const a = (apb + amb) / 2;
    const b = (apb - amb) / 2;
    return { a, b, c };
  };

  const getCoeffsLinear = (expr: string) => {
    const e = safeEval(expr, { x: 0 });
    const d = safeEval(expr, { x: 1 }) - e;
    return { d, e };
  };

  const solve = () => {
    try {
      const g = getCoeffsQuadratic(inputs.p1);
      const h = getCoeffsLinear(inputs.r1);
      const m = getCoeffsQuadratic(inputs.p2);
      const n = getCoeffsLinear(inputs.r2);

      let finalCoeffs: number[] = [];

      if (degree === 3) {
        const matrix = [
          [g.a, 0, -m.a, 0, 0],
          [g.b, g.a, -m.b, -m.a, 0],
          [g.c, g.b, -m.c, -m.b, n.d - h.d],
          [0, g.c, 0, -m.c, n.e - h.e]
        ];
        const sol = solveLinearSystem(matrix);
        if (!sol) throw new Error();
        const [a, b] = sol;
        finalCoeffs = [g.a * a, g.a * b + g.b * a, g.b * b + g.c * a + h.d, g.c * b + h.e];
      } else {
        const valA = parseFloat(inputs.a);
        const valB = parseFloat(inputs.b);
        const gAtA = safeEval(inputs.p1, { x: valA });
        const hAtA = safeEval(inputs.r1, { x: valA });
        const matrix = [
          [g.a, 0, 0, -m.a, 0, 0, 0],
          [g.b, g.a, 0, -m.b, -m.a, 0, 0],
          [g.c, g.b, g.a, -m.c, -m.b, -m.a, 0],
          [0, g.c, g.b, 0, -m.c, -m.b, n.d - h.d],
          [0, 0, g.c, 0, 0, -m.c, n.e - h.e],
          [gAtA * valA * valA, gAtA * valA, gAtA, 0, 0, 0, valB - hAtA]
        ];
        const sol = solveLinearSystem(matrix);
        if (!sol) throw new Error();
        const [a, b, c] = sol;
        finalCoeffs = [g.a * a, g.a * b + g.b * a, g.a * c + g.b * b + g.c * a, g.b * c + g.c * b + h.d, g.c * c + h.e];
      }

      const terms: string[] = [];
      finalCoeffs.forEach((v, i) => {
        const p = finalCoeffs.length - 1 - i;
        const val = Math.round(v * 1e10) / 1e10;
        if (val === 0) return;
        let s = val > 0 ? (terms.length === 0 ? "" : " + ") : (terms.length === 0 ? "-" : " - ");
        let num = Math.abs(val);
        let nStr = (num === 1 && p > 0) ? "" : num.toLocaleString(undefined, { maximumFractionDigits: 6 }).replace(/,/g, '');
        let pStr = p === 0 ? nStr : p === 1 ? nStr + "x" : nStr + "x^" + p;
        terms.push(s + pStr);
      });

      const targetX = parseFloat(inputs.calcX);
      let fValAtX = 0;
      finalCoeffs.forEach((v, i) => { fValAtX += v * Math.pow(targetX, finalCoeffs.length - 1 - i); });

      const fValString = fValAtX.toLocaleString(undefined, { maximumFractionDigits: 2 }).replace(/,/g, '');

      setResult({
        fText: "f(x) = " + terms.join(""),
        fCalc: `f(${inputs.calcX}) = ${fValString}`,
        fValRaw: fValString
      });
    } catch (e) {
      alert("Hệ phương trình không có nghiệm hoặc dữ liệu không hợp lệ.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 animate-fadeIn relative">
      {/* Toast Feedback */}
      {copyStatus && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-3 rounded-full font-black shadow-2xl z-[100] animate-bounce text-sm">
          {copyStatus}
        </div>
      )}

      {/* Guide Modal Overlay */}
      {showGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white max-w-4xl w-full max-h-[90vh] rounded-[50px] overflow-y-auto p-12 relative shadow-2xl">
              <button onClick={() => setShowGuide(false)} className="absolute top-8 right-8 w-12 h-12 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center font-black transition-all">✕</button>
              
              <div className="mb-10 text-center">
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Hướng dẫn <span className="text-emerald-600">Tìm Đa Thức</span></h3>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">TMT EDU Academic Roadmap</p>
              </div>

              <div className="space-y-12">
                 <div className="flex gap-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex-shrink-0 flex items-center justify-center text-2xl font-black">01</div>
                    <div className="space-y-3">
                       <h4 className="text-xl font-black text-slate-800">Thiết lập phương trình cơ bản</h4>
                       <p className="text-slate-500 leading-relaxed">Sử dụng định lý chia đa thức, ta luôn có biểu thức của $f(x)$ dựa trên đa thức chia và số dư:</p>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                          <MathRenderer tex="f(x) = P(x) \cdot Q(x) + R(x)" display />
                          <p className="text-center text-[10px] text-slate-400 mt-2">Trong đó $Q(x)$ là thương số ta cần tìm hệ số.</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-3xl flex-shrink-0 flex items-center justify-center text-2xl font-black">02</div>
                    <div className="space-y-3">
                       <h4 className="text-xl font-black text-slate-800">Phương pháp Hệ số bất định</h4>
                       <p className="text-slate-500 leading-relaxed">Giả sử đa thức cần tìm có dạng bậc {degree}. Ta gọi thương là:</p>
                       <ul className="list-disc list-inside text-slate-500 space-y-2 ml-4">
                          <li>Bậc 3: $Q_1(x) = ax + b$</li>
                          <li>Bậc 4: $Q_1(x) = ax^2 + bx + c$</li>
                       </ul>
                       <p className="text-slate-500">Đồng nhất hệ số giữa hai cách viết $f(x)$ từ hai phép chia để lập hệ phương trình.</p>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex-shrink-0 flex items-center justify-center text-2xl font-black">03</div>
                    <div className="space-y-3">
                       <h4 className="text-xl font-black text-slate-800">Giải hệ & Kiểm tra</h4>
                       <p className="text-slate-500 leading-relaxed">Giải hệ phương trình tuyến tính để tìm các ẩn $a, b, c...$ Nếu là đa thức bậc 4, đừng quên thế điểm $f(a)=b$ vào để tìm nốt ẩn cuối cùng.</p>
                       <div className="p-5 bg-blue-50 border-l-8 border-blue-400 rounded-r-2xl">
                          <p className="text-blue-700 font-bold italic">Mẹo: Hệ số đa thức trong các đề thi HSG thường là số nguyên. Nếu giải ra số quá lẻ, hãy kiểm tra lại các bước thiết lập hệ thức!</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-16 text-center">
                 <button onClick={() => setShowGuide(false)} className="bg-emerald-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-xl hover:bg-emerald-700 transition-all">TÔI ĐÃ HIỂU!</button>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <button onClick={onBack} className="flex items-center gap-3 text-emerald-600 font-black hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all group">
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span> TRANG CHỦ
        </button>
        <div className="flex flex-wrap gap-4">
           <button onClick={() => setShowGuide(true)} className="px-6 py-3 bg-white text-emerald-600 border-2 border-emerald-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 shadow-lg flex items-center gap-2 transition-all">
             <span>💡</span> Hướng dẫn giải
           </button>
           <button onClick={() => loadHardExample(3)} className="px-6 py-3 bg-slate-800 text-yellow-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 shadow-lg">🔥 Đề Khó Bậc 3</button>
           <button onClick={() => loadHardExample(4)} className="px-6 py-3 bg-slate-800 text-orange-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 shadow-lg">💀 Đề Khó Bậc 4</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-4 border-emerald-500 pb-6">
        <div>
          <h2 className="text-6xl font-black text-slate-800 tracking-tighter italic uppercase">
            Xác định <span className="text-emerald-600">Đa thức</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">TMT EDU High-Speed Solving Engine v6.0</p>
        </div>
        <div className="flex bg-slate-200 p-2 rounded-[30px] shadow-inner scale-110">
           <button onClick={() => { setDegree(3); setResult(null); }} className={`px-12 py-3 rounded-[25px] font-black transition-all ${degree === 3 ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-500'}`}>BẬC 3</button>
           <button onClick={() => { setDegree(4); setResult(null); }} className={`px-12 py-3 rounded-[25px] font-black transition-all ${degree === 4 ? 'bg-white shadow-xl text-emerald-600' : 'text-slate-500'}`}>BẬC 4</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-50 space-y-8">
            <div className="space-y-6">
               <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 relative group">
                  <div className="absolute -top-3 left-8 bg-emerald-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase">Hệ thức 01</div>
                  <input value={inputs.p1} onChange={e => setInputs({...inputs, p1: e.target.value})} className="w-full p-5 bg-white border-2 border-emerald-200 rounded-2xl font-mono text-center font-bold text-2xl mb-4 focus:ring-4 ring-emerald-100 outline-none" placeholder="Đa thức chia P1" />
                  <input value={inputs.r1} onChange={e => setInputs({...inputs, r1: e.target.value})} className="w-full p-5 bg-white border-2 border-emerald-200 rounded-2xl font-mono text-center font-bold text-2xl focus:ring-4 ring-emerald-100 outline-none" placeholder="Số dư R1" />
               </div>

               <div className="p-8 bg-teal-50 rounded-[40px] border border-teal-100 relative group">
                  <div className="absolute -top-3 left-8 bg-teal-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase">Hệ thức 02</div>
                  <input value={inputs.p2} onChange={e => setInputs({...inputs, p2: e.target.value})} className="w-full p-5 bg-white border-2 border-teal-200 rounded-2xl font-mono text-center font-bold text-2xl mb-4 focus:ring-4 ring-teal-100 outline-none" placeholder="Đa thức chia P2" />
                  <input value={inputs.r2} onChange={e => setInputs({...inputs, r2: e.target.value})} className="w-full p-5 bg-white border-2 border-teal-200 rounded-2xl font-mono text-center font-bold text-2xl focus:ring-4 ring-teal-100 outline-none" placeholder="Số dư R2" />
               </div>

               {degree === 4 && (
                 <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 relative animate-slideUp">
                    <div className="absolute -top-3 left-8 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase">Điểm f(a)=b</div>
                    <div className="flex gap-4">
                      <input value={inputs.a} onChange={e => setInputs({...inputs, a: e.target.value})} className="w-1/2 p-5 bg-white border-2 border-blue-200 rounded-2xl font-bold text-center text-2xl" placeholder="a" />
                      <input value={inputs.b} onChange={e => setInputs({...inputs, b: e.target.value})} className="w-1/2 p-5 bg-white border-2 border-blue-200 rounded-2xl font-bold text-center text-2xl" placeholder="b" />
                    </div>
                 </div>
               )}
            </div>

            <div className="pt-6 border-t-2 border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Giá trị X cần tính</p>
              <input value={inputs.calcX} onChange={e => setInputs({...inputs, calcX: e.target.value})} className="w-full p-8 bg-slate-900 text-emerald-400 border-l-[12px] border-emerald-500 rounded-[35px] text-5xl font-black text-center shadow-2xl focus:scale-105 transition-transform outline-none" />
            </div>

            <button onClick={solve} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-8 rounded-[40px] font-black text-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4">
              <span>⚡ GIẢI TOÁN TỨC THÌ</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-slate-900 p-12 rounded-[70px] shadow-2xl h-full flex flex-col justify-center text-white border-8 border-slate-800 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
              
              <div className="relative z-10 space-y-16">
                 {/* Result f(x) */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.8em]">ĐA THỨC f(x)</p>
                      {result && (
                        <button 
                          onClick={() => copyToClipboard(result.fText, "Đã chép f(x)!")}
                          className="bg-white/10 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all active:scale-90"
                        >
                          COPY f(x)
                        </button>
                      )}
                    </div>
                    {result ? (
                      <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] shadow-inner animate-slideUp group relative text-center">
                         <MathRenderer tex={result.fText} className="text-3xl md:text-5xl font-black text-emerald-300 leading-tight" display />
                      </div>
                    ) : (
                      <div className="py-24 opacity-5 flex flex-col items-center italic">
                         <div className="text-9xl font-black">f(x)</div>
                      </div>
                    )}
                 </div>

                 {/* Result f(a) */}
                 <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.8em]">ĐÁP SỐ CUỐI CÙNG</p>
                      {result && (
                        <button 
                          onClick={() => copyToClipboard(result.fValRaw, "Đã chép đáp số!")}
                          className="bg-white/10 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all active:scale-90"
                        >
                          COPY ĐÁP SỐ
                        </button>
                      )}
                    </div>
                    {result ? (
                      <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] shadow-inner animate-slideUp group relative text-center">
                         <div className="text-4xl md:text-7xl font-black text-white tracking-tighter break-all">
                            {result.fValRaw}
                         </div>
                      </div>
                    ) : (
                      <div className="py-24 opacity-5 flex flex-col items-center italic">
                         <div className="text-9xl font-black">f(a)</div>
                      </div>
                    )}
                 </div>
              </div>

              {result && (
                 <div className="mt-12 flex justify-center">
                    <button 
                      onClick={copyAll}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all"
                    >
                      COPY TOÀN BỘ KẾT QUẢ
                    </button>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PolynomialView;
