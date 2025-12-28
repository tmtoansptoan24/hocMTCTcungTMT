
import React, { useState } from 'react';
import { TriangleState } from '../types';
import MathRenderer from '../components/MathRenderer';

const TriangleView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const initialState: TriangleState = {
    a: '', b: '', c: '',
    A: '', B: '', C: '',
    ha: '', hb: '', hc: '',
    ma: '', mb: '', mc: '',
    la: '', lb: '', lc: '',
    P: '', S: '', R: '', r: ''
  };

  const [data, setData] = useState<TriangleState>(initialState);

  const resetData = () => {
    setData(initialState);
  };

  const solve = () => {
    // Chuyển đổi dữ liệu sang số, giữ null nếu không có
    const parse = (v: string) => (v === '' || isNaN(parseFloat(v))) ? null : parseFloat(v);
    
    let a = parse(data.a), b = parse(data.b), c = parse(data.c);
    let A = parse(data.A), B = parse(data.B), C = parse(data.C);
    let ha = parse(data.ha), hb = parse(data.hb), hc = parse(data.hc);
    let ma = parse(data.ma), mb = parse(data.mb), mc = parse(data.mc);
    let la = parse(data.la), lb = parse(data.lb), lc = parse(data.lc);
    let P = parse(data.P), S = parse(data.S), R = parse(data.R), r = parse(data.r);

    const toRad = (deg: number) => deg * Math.PI / 180;
    const toDeg = (rad: number) => rad * 180 / Math.PI;

    // Thuật toán giải lặp: Áp dụng các định lý liên tục cho đến khi không còn thay đổi
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 15) {
      changed = false;
      const oldState = JSON.stringify({a, b, c, A, B, C, ha, hb, hc, ma, mb, mc, la, lb, lc, P, S, R, r});

      // 1. Định lý tổng 3 góc
      if (A && B && !C) { C = 180 - A - B; }
      if (A && C && !B) { B = 180 - A - C; }
      if (B && C && !A) { A = 180 - B - C; }

      // 2. Liên hệ Diện tích và Cạnh/Đường cao
      if (S) {
        if (a && !ha) ha = 2 * S / a;
        if (b && !hb) hb = 2 * S / b;
        if (c && !hc) hc = 2 * S / c;
        if (ha && !a) a = 2 * S / ha;
        if (hb && !b) b = 2 * S / hb;
        if (hc && !c) c = 2 * S / hc;
      }
      if (a && ha && !S) S = 0.5 * a * ha;
      if (b && hb && !S) S = 0.5 * b * hb;
      if (c && hc && !S) S = 0.5 * c * hc;

      // 3. Định lý hàm số Sin: a/sinA = b/sinB = c/sinC = 2R
      if (R) {
        if (A && !a) a = 2 * R * Math.sin(toRad(A));
        if (B && !b) b = 2 * R * Math.sin(toRad(B));
        if (C && !c) c = 2 * R * Math.sin(toRad(C));
        if (a && !A) A = toDeg(Math.asin(Math.min(1, a / (2 * R))));
        if (b && !B) B = toDeg(Math.asin(Math.min(1, b / (2 * R))));
        if (c && !C) C = toDeg(Math.asin(Math.min(1, c / (2 * R))));
      }
      if (a && A && !R) R = a / (2 * Math.sin(toRad(A)));
      if (b && B && !R) R = b / (2 * Math.sin(toRad(B)));
      if (c && C && !R) R = c / (2 * Math.sin(toRad(C)));

      // 4. Cặp cạnh và góc tương ứng (Sin)
      if (a && A && b && !B) B = toDeg(Math.asin(Math.min(1, b * Math.sin(toRad(A)) / a)));
      if (a && A && c && !C) C = toDeg(Math.asin(Math.min(1, c * Math.sin(toRad(A)) / a)));
      if (b && B && a && !A) A = toDeg(Math.asin(Math.min(1, a * Math.sin(toRad(B)) / b)));
      if (b && B && c && !C) C = toDeg(Math.asin(Math.min(1, c * Math.sin(toRad(B)) / b)));
      if (c && C && a && !A) A = toDeg(Math.asin(Math.min(1, a * Math.sin(toRad(C)) / c)));
      if (c && C && b && !B) B = toDeg(Math.asin(Math.min(1, b * Math.sin(toRad(C)) / c)));
      
      if (A && B && a && !b) b = a * Math.sin(toRad(B)) / Math.sin(toRad(A));
      if (A && C && a && !c) c = a * Math.sin(toRad(C)) / Math.sin(toRad(A));
      if (B && A && b && !a) a = b * Math.sin(toRad(A)) / Math.sin(toRad(B));
      if (B && C && b && !c) c = b * Math.sin(toRad(C)) / Math.sin(toRad(B));

      // 5. Định lý hàm số Cos
      if (a && b && c) {
        if (!A) A = toDeg(Math.acos(Math.max(-1, Math.min(1, (b*b + c*c - a*a) / (2*b*c)))));
        if (!B) B = toDeg(Math.acos(Math.max(-1, Math.min(1, (a*a + c*c - b*b) / (2*a*c)))));
        if (!C) C = toDeg(Math.acos(Math.max(-1, Math.min(1, (a*a + b*b - c*c) / (2*a*b)))));
      }
      if (a && b && C && !c) c = Math.sqrt(Math.max(0, a*a + b*b - 2*a*b*Math.cos(toRad(C))));
      if (a && c && B && !b) b = Math.sqrt(Math.max(0, a*a + c*c - 2*a*c*Math.cos(toRad(B))));
      if (b && c && A && !a) a = Math.sqrt(Math.max(0, b*b + c*c - 2*b*c*Math.cos(toRad(A))));

      // 6. Diện tích Heron & P
      if (a && b && c) {
        const pVal = (a + b + c) / 2;
        if (!P) P = a + b + c;
        if (!S) S = Math.sqrt(Math.max(0, pVal * (pVal - a) * (pVal - b) * (pVal - c)));
      }
      if (S && P && !r) r = S / (P / 2);
      if (r && P && !S) S = r * (P / 2);
      if (S && r && !P) P = 2 * S / r;

      // 7. Diện tích từ 2 cạnh 1 góc
      if (a && b && C && !S) S = 0.5 * a * b * Math.sin(toRad(C));
      if (a && c && B && !S) S = 0.5 * a * c * Math.sin(toRad(B));
      if (b && c && A && !S) S = 0.5 * b * c * Math.sin(toRad(A));

      // 8. Trung tuyến & Phân giác (Công thức thuận)
      if (a && b && c) {
        if (!ma) ma = 0.5 * Math.sqrt(Math.max(0, 2*b*b + 2*c*c - a*a));
        if (!mb) mb = 0.5 * Math.sqrt(Math.max(0, 2*a*a + 2*c*c - b*b));
        if (!mc) mc = 0.5 * Math.sqrt(Math.max(0, 2*a*a + 2*b*b - c*c));
        const pVal = (a + b + c) / 2;
        if (!la) la = (2 * Math.sqrt(Math.max(0, b * c * pVal * (pVal - a)))) / (b + c);
        if (!lb) lb = (2 * Math.sqrt(Math.max(0, a * c * pVal * (pVal - b)))) / (a + c);
        if (!lc) lc = (2 * Math.sqrt(Math.max(0, a * b * pVal * (pVal - c)))) / (a + b);
      }

      const newState = JSON.stringify({a, b, c, A, B, C, ha, hb, hc, ma, mb, mc, la, lb, lc, P, S, R, r});
      if (oldState !== newState) changed = true;
      iterations++;
    }

    const fmt = (num: number | null) => (num === null || isNaN(num)) ? "" : num.toFixed(4);

    setData({
      a: fmt(a), b: fmt(b), c: fmt(c),
      A: fmt(A), B: fmt(B), C: fmt(C),
      ha: fmt(ha), hb: fmt(hb), hc: fmt(hc),
      ma: fmt(ma), mb: fmt(mb), mc: fmt(mc),
      la: fmt(la), lb: fmt(lb), lc: fmt(lc),
      P: fmt(P), S: fmt(S), R: fmt(R), r: fmt(r)
    });

    if (!a || !b || !c) {
       alert("Dữ liệu nhập vào chưa đủ để xác định hoàn toàn tam giác hoặc có mâu thuẫn hình học.");
    }
  };

  const renderInput = (key: keyof TriangleState, label: string, colorClass: string) => (
    <div className={`p-4 rounded-2xl ${colorClass} border border-opacity-50 transition-all hover:shadow-md group`}>
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
        <MathRenderer tex={label} />
      </label>
      <input
        value={data[key]}
        onChange={e => setData({...data, [key]: e.target.value})}
        className="w-full bg-white/60 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-slate-800 text-lg transition-all"
        placeholder="..."
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Quay lại Trang chủ TMT EDU
      </button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter italic">Giải Tam Giác <span className="text-emerald-600">Pro</span></h2>
          <p className="text-slate-500 mt-2 font-medium">Hỗ trợ giải toán từ bất kỳ 3 yếu tố (Cạnh, Góc, Diện tích, Bán kính, Đường cao...).</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={resetData} 
            className="px-8 py-4 rounded-2xl font-black text-slate-500 bg-white border-2 border-slate-100 hover:bg-slate-50 hover:border-emerald-200 transition-all active:scale-95 shadow-sm"
          >
            🧹 GIẢI BÀI MỚI
          </button>
          <button 
            onClick={solve} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all active:scale-95"
          >
            🚀 GIẢI NGAY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Panel Nhập liệu chính */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-emerald-50 shadow-xl">
             <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Thông số đầu vào
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                {renderInput('a', 'Cạnh a', 'bg-emerald-50 border-emerald-200')}
                {renderInput('b', 'Cạnh b', 'bg-emerald-50 border-emerald-200')}
                {renderInput('c', 'Cạnh c', 'bg-emerald-50 border-emerald-200')}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                {renderInput('A', 'Góc A (°)', 'bg-green-50 border-green-200')}
                {renderInput('B', 'Góc B (°)', 'bg-green-50 border-green-200')}
                {renderInput('C', 'Góc C (°)', 'bg-green-50 border-green-200')}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderInput('S', 'Diện tích S', 'bg-lime-50 border-lime-200')}
                {renderInput('P', 'Chu vi P', 'bg-lime-50 border-lime-200')}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderInput('ha', 'Đường cao h_a', 'bg-slate-50 border-slate-200')}
            {renderInput('hb', 'Đường cao h_b', 'bg-slate-50 border-slate-200')}
            {renderInput('hc', 'Đường cao h_c', 'bg-slate-50 border-slate-200')}
          </div>
        </div>

        {/* Panel Nhập liệu phụ */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-emerald-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black italic">R/r</div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6">Bán kính nội/ngoại</h3>
              <div className="space-y-4">
                {renderInput('R', 'Bán kính R', 'bg-white/10 border-white/20')}
                {renderInput('r', 'Bán kính r', 'bg-white/10 border-white/20')}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-emerald-50 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Trung tuyến / Phân giác</h3>
              <div className="space-y-4">
                {renderInput('ma', 'Trung tuyến m_a', 'bg-slate-50 border-slate-100')}
                {renderInput('la', 'Phân giác l_a', 'bg-slate-50 border-slate-100')}
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic text-center">Các yếu tố khác sẽ tự động được tính sau khi giải.</p>
           </div>
        </div>
      </div>

      {/* Bảng kết quả tổng hợp */}
      <div className="mt-16 bg-white p-10 rounded-[50px] shadow-2xl border border-emerald-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <span className="text-9xl font-black text-emerald-950 italic uppercase">TMT EDU</span>
        </div>
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-4 h-12 bg-emerald-500 rounded-full"></div>
          <div>
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">KẾT QUẢ GIẢI TOÁN CHI TIẾT</h3>
            <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mt-1">Hệ thống phân tích TMT Pro Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-6">
            <h4 className="text-emerald-600 font-black text-xs uppercase tracking-widest border-b border-emerald-100 pb-2">Cạnh & Chu vi</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Cạnh $a$:</span> <span className="font-mono font-black">{data.a || '---'}</span></div>
              <div className="flex justify-between"><span>Cạnh $b$:</span> <span className="font-mono font-black">{data.b || '---'}</span></div>
              <div className="flex justify-between"><span>Cạnh $c$:</span> <span className="font-mono font-black">{data.c || '---'}</span></div>
              <div className="flex justify-between text-emerald-700"><span>Chu vi $P$:</span> <span className="font-mono font-black">{data.P || '---'}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-emerald-600 font-black text-xs uppercase tracking-widest border-b border-emerald-100 pb-2">Góc & Diện tích</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Góc $A$:</span> <span className="font-mono font-black">{data.A ? `${data.A}°` : '---'}</span></div>
              <div className="flex justify-between"><span>Góc $B$:</span> <span className="font-mono font-black">{data.B ? `${data.B}°` : '---'}</span></div>
              <div className="flex justify-between"><span>Góc $C$:</span> <span className="font-mono font-black">{data.C ? `${data.C}°` : '---'}</span></div>
              <div className="flex justify-between text-emerald-700"><span>Diện tích $S$:</span> <span className="font-mono font-black">{data.S || '---'}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-emerald-600 font-black text-xs uppercase tracking-widest border-b border-emerald-100 pb-2">Bán kính & Cao</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Ngoại tiếp $R$:</span> <span className="font-mono font-black">{data.R || '---'}</span></div>
              <div className="flex justify-between"><span>Nội tiếp $r$:</span> <span className="font-mono font-black">{data.r || '---'}</span></div>
              <div className="flex justify-between"><span>Cao $h_a$:</span> <span className="font-mono font-black">{data.ha || '---'}</span></div>
              <div className="flex justify-between"><span>Cao $h_b$:</span> <span className="font-mono font-black">{data.hb || '---'}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-emerald-600 font-black text-xs uppercase tracking-widest border-b border-emerald-100 pb-2">Trung tuyến / Phân giác</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Tr.tuyến $m_a$:</span> <span className="font-mono font-black">{data.ma || '---'}</span></div>
              <div className="flex justify-between"><span>Tr.tuyến $m_b$:</span> <span className="font-mono font-black">{data.mb || '---'}</span></div>
              <div className="flex justify-between"><span>P.giác $l_a$:</span> <span className="font-mono font-black">{data.la || '---'}</span></div>
              <div className="flex justify-between"><span>P.giác $l_b$:</span> <span className="font-mono font-black">{data.lb || '---'}</span></div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-emerald-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Algorithm optimized for High School Mathematics Excellence</p>
        </div>
      </div>
    </div>
  );
};

export default TriangleView;
