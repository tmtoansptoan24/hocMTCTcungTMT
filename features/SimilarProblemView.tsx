
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import MathRenderer from '../components/MathRenderer';

interface ProblemVariant {
  problem: string;
  answer: string;
  guide: string;
}

const SimilarProblemView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<ProblemVariant[]>([]);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (event) => setImage(event.target?.result as string);
              reader.readAsDataURL(blob);
            }
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const showCopyFeedback = (msg: string) => {
    setCopyStatus(msg);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const copyProblem = (p: ProblemVariant, index: number) => {
    const textToCopy = `BÀI TOÁN BIẾN THỂ 0${index + 1}\n\nĐỀ BÀI:\n${p.problem}\n\nĐÁP SỐ: ${p.answer}\n\nHƯỚNG DẪN GIẢI:\n${p.guide.replace(/\$/g, '')}\n\n--- Nguồn: TMT EDU AI Smith ---`;
    navigator.clipboard.writeText(textToCopy);
    showCopyFeedback(`Đã chép bài số ${index + 1}!`);
  };

  const generate = async () => {
    if (!input && !image) return alert("Vui lòng nhập đề bài hoặc dán ảnh!");
    setLoading(true);
    setProblems([]);
    setActiveGuide(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemPrompt = `Bạn là chuyên gia ra đề thi Học sinh giỏi Giải toán trên máy tính cầm tay.
      Nhiệm vụ: Dựa trên đề bài gốc, hãy tạo ra 5 biến thể toán học.
      
      Yêu cầu về logic biến thể:
      1. GIỮ NGUYÊN dạng toán và phương pháp giải cốt lõi.
      2. LINH HOẠT thay đổi các tham số: 
         - Nếu đề gốc tìm "nhỏ nhất", hãy tạo biến thể tìm "lớn nhất" và ngược lại.
         - Thay đổi "số chữ số" (ví dụ: từ 10 chữ số thành 12, 15 chữ số).
         - Thay đổi các hằng số, số dư, số chia, hoặc hệ số trong đa thức.
      3. Đảm bảo dữ kiện mới logic, không bị mâu thuẫn.
      
      Yêu cầu về nội dung trả về:
      - "problem": Đề bài viết bằng tiếng Việt, công thức bọc trong LaTeX.
      - "answer": Đáp số cuối cùng (chính xác).
      - "guide": Hướng dẫn giải chi tiết từng bước (Step-by-step). Trình bày cách tư duy, thiết lập công thức và cách bấm máy tính (nếu cần).
      
      Trả về JSON thuần túy theo schema.`;

      const parts: any[] = [{ text: systemPrompt }];
      if (input) parts.push({ text: `Đề bài mẫu: ${input}` });
      if (image) parts.push({ inlineData: { mimeType: 'image/png', data: image.split(',')[1] } });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              items: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { 
                    problem: { type: Type.STRING }, 
                    answer: { type: Type.STRING },
                    guide: { type: Type.STRING }
                  },
                  required: ["problem", "answer", "guide"]
                } 
              }
            },
            required: ["items"]
          }
        }
      });
      
      const data = JSON.parse(response.text);
      setProblems(data.items || []);
    } catch (e) { 
      console.error(e);
      alert("AI gặp sự cố khi tạo bài. Vui lòng thử lại!"); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 animate-fadeIn relative">
      {/* Toast Feedback */}
      {copyStatus && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-3 rounded-full font-black shadow-2xl z-[100] animate-bounce text-sm">
          {copyStatus}
        </div>
      )}

      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 font-bold hover:translate-x-1 transition-transform group">
        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span> Trang chủ TMT EDU
      </button>
      
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-emerald-500 pb-8">
        <div className="text-left">
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-2 italic">
            TMT <span className="text-emerald-600">Problem Smith</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Hệ thống tạo biến thể nâng cao & Hướng dẫn giải chi tiết
          </p>
        </div>
        <div className="hidden md:block bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-200">
           <span className="text-emerald-700 font-black text-[10px] uppercase tracking-widest">AI Core Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-8">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-7xl font-black italic">INPUT</div>
            <textarea 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="w-full h-44 p-8 bg-slate-50 border-2 border-slate-100 rounded-[35px] outline-none focus:border-emerald-300 font-medium text-xl shadow-inner transition-all resize-none" 
              placeholder="Nhập đề bài mẫu... (VD: Tìm số nhỏ nhất có 10 chữ số chia 3 dư 5)" 
            />
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <label className="flex-1 px-8 py-5 bg-white border-2 border-emerald-100 rounded-[25px] text-emerald-600 font-black cursor-pointer hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                📷 {image ? 'Đã nhận ảnh' : 'Dán ảnh đề'} 
                <input type="file" hidden accept="image/*" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { const r = new FileReader(); r.onload = x => setImage(x.target?.result as string); r.readAsDataURL(f); }
                }} />
              </label>
              <button 
                onClick={generate} 
                disabled={loading} 
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[25px] font-black text-2xl shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'AI ĐANG XỬ LÝ...' : '✨ TẠO 5 BIẾN THỂ LINH HOẠT'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
           <div className="bg-slate-900 p-8 rounded-[50px] shadow-2xl h-full flex items-center justify-center overflow-hidden border-8 border-slate-800 relative group">
             {image ? (
               <img src={image} className="max-w-full rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500" />
             ) : (
               <div className="text-center space-y-4 opacity-20">
                 <div className="text-8xl italic font-black text-white">?</div>
                 <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Image Preview</p>
               </div>
             )}
             {image && (
               <button onClick={() => setImage(null)} className="absolute top-4 right-4 bg-red-500 text-white w-10 h-10 rounded-full font-black shadow-lg hover:scale-110 transition-transform">✕</button>
             )}
           </div>
        </div>
      </div>

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center gap-8 animate-pulse">
           <div className="w-20 h-20 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-xs text-center leading-loose">
             AI đang tư duy biến thể...<br/>Xây dựng lộ trình giải chi tiết...
           </p>
        </div>
      )}

      {/* Danh sách các bài toán biến thể */}
      <div className="space-y-12">
        {problems.map((p, i) => (
          <div key={i} className="group bg-white rounded-[60px] shadow-xl hover:shadow-2xl transition-all border border-slate-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-9xl font-black italic pointer-events-none">{i+1}</div>
            
            <div className="p-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-emerald-900 text-emerald-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">
                  Biến thể {i+1}
                </span>
                <div className="h-0.5 flex-1 bg-slate-100"></div>
              </div>
              
              <div className="mb-12">
                <MathRenderer tex={p.problem} raw className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight tracking-tight" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-slate-900 px-10 py-5 rounded-[30px] border-b-8 border-emerald-500 shadow-2xl">
                  <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Đáp số chính xác</p>
                  <MathRenderer tex={p.answer} className="text-3xl font-black text-white" />
                </div>
                
                <div className="flex flex-wrap gap-4 ml-auto">
                  <button 
                    onClick={() => copyProblem(p, i)}
                    className="px-8 py-5 bg-white border-2 border-slate-200 rounded-[30px] font-black text-sm uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-3 shadow-md active:scale-95"
                  >
                    <span>📋</span> Sao chép
                  </button>
                  <button 
                    onClick={() => setActiveGuide(activeGuide === i ? null : i)}
                    className={`px-10 py-5 rounded-[30px] font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 active:scale-95 ${activeGuide === i ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    {activeGuide === i ? '✕ Ẩn hướng dẫn' : '💡 Xem cách giải chi tiết'}
                  </button>
                </div>
              </div>
            </div>

            {/* Phần hướng dẫn giải (Expandable) */}
            {activeGuide === i && (
              <div className="bg-emerald-50/40 border-t-2 border-emerald-100 p-12 animate-slideDown overflow-hidden">
                <div className="max-w-4xl space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
                    <h4 className="text-2xl font-black text-emerald-900 italic tracking-tight uppercase">Lộ trình giải toán</h4>
                  </div>
                  
                  <div className="prose prose-emerald max-w-none text-slate-700 font-medium leading-relaxed text-xl bg-white p-10 rounded-[40px] shadow-inner border border-emerald-100/50">
                    <MathRenderer tex={p.guide} raw />
                  </div>
                  
                  <div className="pt-6 flex justify-between items-center opacity-40">
                    <span className="text-[9px] font-black uppercase tracking-widest italic">TMT EDU AI-Powered Solution</span>
                    <button onClick={() => setActiveGuide(null)} className="text-[10px] font-black uppercase underline decoration-emerald-500 decoration-2 underline-offset-4">Đã hiểu bài này</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 1s ease-out both; }
        .animate-slideDown { animation: slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { 
          from { opacity: 0; max-height: 0; transform: scaleY(0.9); } 
          to { opacity: 1; max-height: 2500px; transform: scaleY(1); } 
        }
      `}</style>
    </div>
  );
};

export default SimilarProblemView;
