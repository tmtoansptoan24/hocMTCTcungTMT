
import React, { useState, useEffect } from 'react';
import MathRenderer from '../components/MathRenderer';
import { powerMod } from '../mathUtils';

interface CalculationHistory {
  a: string;
  b: string;
  m: string;
  res: string;
  time: string;
}

const CongruenceView: React.FC<{ onBack: () => void, userEmail?: string }> = ({ onBack, userEmail }) => {
  const [a, setA] = useState('2025');
  const [b, setB] = useState('2026');
  const [m, setM] = useState('100000');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem(`tmt_history_congruence_${userEmail}`);
      if (saved) {
        try {
          setHistory(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [userEmail]);

  const saveToHistory = (newCalc: CalculationHistory) => {
    if (!userEmail) return;
    const updated = [newCalc, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(`tmt_history_congruence_${userEmail}`, JSON.stringify(updated));
  };

  const handleSolve = () => {
    try {
      const res = powerMod(BigInt(a), BigInt(b), BigInt(m));
      const resStr = res.toString();
      setResult(resStr);
      
      saveToHistory({
        a, b, m, res: resStr,
        time: new Date().toLocaleTimeString()
      });
    } catch (e) {
      setResult('Lỗi dữ liệu');
    }
  };

  const loadFromHistory = (item: CalculationHistory) => {
    setA(item.a);
    setB(item.b);
    setM(item.m);
    setResult(item.res);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn flex flex-col md:flex-row gap-10">
      <div className="flex-1">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
          <span className="text-xl group-hover:scale-110 transition-transform">🏠</span> Trang chủ TMT EDU
        </button>
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8">Tính toán Đồng dư</h2>
        
        <div className="space-y-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
              <MathRenderer tex="\text{Cơ số } A" />
            </label>
            <input 
              type="number" 
              value={a} 
              onChange={e => setA(e.target.value)} 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
              <MathRenderer tex="\text{Số mũ } b" />
            </label>
            <input 
              type="number" 
              value={b} 
              onChange={e => setB(e.target.value)} 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
              <MathRenderer tex="\text{Số chia } m" />
            </label>
            <input 
              type="number" 
              value={m} 
              onChange={e => setM(e.target.value)} 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-bold" 
            />
          </div>
          <button 
            onClick={handleSolve} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all"
          >
            GIẢI BÀI TOÁN
          </button>
        </div>

        {result && (
          <div className="mt-10 p-10 bg-emerald-50 rounded-[40px] border border-emerald-200 animate-slideUp text-center relative group">
            <button 
              onClick={copyResult}
              className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md ${
                copyStatus ? 'bg-green-500' : 'bg-emerald-600 hover:bg-emerald-700 opacity-80 group-hover:opacity-100'
              }`}
            >
              {copyStatus ? 'Đã chép!' : 'Copy kết quả'}
            </button>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">Kết quả phép chia</p>
            <MathRenderer 
              tex={`${a}^{${b}} \\equiv ${result} \\pmod{${m}}`} 
              display 
              className="text-3xl font-black text-emerald-900" 
            />
          </div>
        )}
      </div>

      <div className="w-full md:w-80 bg-slate-900 p-8 rounded-[45px] shadow-2xl text-white">
        <h3 className="text-emerald-500 font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Lịch sử tính toán
        </h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {history.length > 0 ? history.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => loadFromHistory(item)}
              className="w-full text-left bg-white/5 hover:bg-emerald-500/20 p-4 rounded-2xl border border-white/10 transition-all group"
            >
              <div className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-bold mb-1">{item.time}</div>
              <div className="text-sm font-mono truncate">
                <MathRenderer tex={`${item.a}^{${item.b}} \\pmod{${item.m}}`} className="text-emerald-100" />
              </div>
              <div className="text-xs text-emerald-500 font-black mt-2">→ {item.res}</div>
            </button>
          )) : (
            <div className="py-20 text-center opacity-20 italic text-sm">Chưa có lịch sử</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CongruenceView;
