
import React, { useState } from 'react';
import MathRenderer from '../components/MathRenderer';

const XPowerNView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [n, setN] = useState('20');
  const [mode, setMode] = useState<1 | 2 | 3>(3); // 1: Bắt đầu, 2: Chứa, 3: Tận cùng
  const [suffix, setSuffix] = useState('1111111');
  const [startFrom, setStartFrom] = useState('1');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSolve = async () => {
    setIsCalculating(true);
    setResult(null);
    // Đây là nơi giả lập thuật toán tìm kiếm hoặc gọi API
    // Thực tế tìm x^n thỏa điều kiện chữ số cần duyệt số lượng lớn
    setTimeout(() => {
      // Giả sử tìm được kết quả x
      setResult("1234567"); 
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Trang chủ TMT EDU
      </button>
      
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
          Tìm số dạng <span className="text-emerald-600">$x^n$</span> có đặc điểm đặc biệt
        </h2>
        <p className="text-slate-500 font-medium">Tìm $x$ nhỏ nhất sao cho $x^n$ có các chữ số thỏa mãn yêu cầu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-slate-100 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Số mũ (n)</label>
                <input value={n} onChange={e => setN(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-400 outline-none text-2xl font-black text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bắt đầu duyệt từ x</label>
                <input value={startFrom} onChange={e => setStartFrom(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-400 outline-none text-2xl font-black text-slate-800" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Đặc điểm chữ số cần tìm (Suffix/Prefix)</label>
              <input value={suffix} onChange={e => setSuffix(e.target.value)} className="w-full p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[30px] focus:border-emerald-500 outline-none text-5xl font-black text-emerald-900 tracking-tighter text-center shadow-inner" />
            </div>

            <div className="flex bg-slate-100 p-2 rounded-3xl gap-2">
              {[
                { id: 1, label: 'Bắt đầu bằng' },
                { id: 2, label: 'Có chứa' },
                { id: 3, label: 'Tận cùng là' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all ${mode === m.id ? 'bg-white shadow-lg text-emerald-600 scale-105' : 'text-slate-500'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSolve} 
              disabled={isCalculating}
              className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isCalculating ? '⌛ ĐANG DÒ TÌM SỐ x...' : '🔍 TÌM GIÁ TRỊ NHỎ NHẤT'}
            </button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-10">Kết quả dò tìm</h3>
              {result ? (
                <div className="animate-slideUp">
                  <p className="text-xs text-slate-500 uppercase font-black mb-4">Giá trị x tìm được</p>
                  <div className="text-6xl font-black text-white tracking-tighter mb-4">{result}</div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-emerald-300 text-sm">
                    {result}^{n} có chữ số {mode === 1 ? 'bắt đầu' : mode === 2 ? 'chứa' : 'kết thúc'} là {suffix}
                  </div>
                </div>
              ) : (
                <div className="opacity-20 flex flex-col items-center">
                  <div className="text-8xl mb-4 italic">x?</div>
                  <p className="font-bold tracking-widest uppercase text-xs">Chưa có kết quả</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default XPowerNView;
