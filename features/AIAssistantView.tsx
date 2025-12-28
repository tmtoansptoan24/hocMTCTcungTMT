
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import MathRenderer from '../components/MathRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string;
}

const AIAssistantView: React.FC<{ onBack: () => void, userEmail?: string }> = ({ onBack, userEmail }) => {
  const defaultWelcome: Message = {
    role: 'assistant',
    content: 'Chào em! Thầy là Trần Minh Toàn, giáo viên Toán từ trường THCS Tăng Bạt Hổ. Thầy rất vui được đồng hành cùng em. Em đang gặp khó khăn ở bài toán nào? Em có thể gõ đề bài hoặc chụp ảnh, dán ảnh (Ctrl+V) gửi cho thầy nhé!',
    timestamp: new Date().toISOString()
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem(`tmt_chat_${userEmail}`);
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch (e) {
          setMessages([defaultWelcome]);
        }
      } else {
        setMessages([defaultWelcome]);
      }
    } else {
      setMessages([defaultWelcome]);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail && messages.length > 0 && !loading) {
      localStorage.setItem(`tmt_chat_${userEmail}`, JSON.stringify(messages));
    }
  }, [messages, userEmail, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(index);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const clearHistory = () => {
    if (window.confirm("Em có chắc muốn xóa hết lịch sử trò chuyện này không?")) {
      setMessages([defaultWelcome]);
      if (userEmail) localStorage.removeItem(`tmt_chat_${userEmail}`);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !image) || loading) return;

    const currentInput = input;
    const currentImage = image;
    
    const userMsg: Message = { 
      role: 'user', 
      content: currentInput || (currentImage ? "Em gửi thầy hình ảnh đề bài toán ạ." : ""), 
      timestamp: new Date().toISOString(),
      image: currentImage || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImage(null);
    setLoading(true);

    // Chuẩn bị tin nhắn trống cho Assistant để bắt đầu streaming
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      if (currentImage) {
        parts.push({
          inlineData: {
            mimeType: 'image/png',
            data: currentImage.split(',')[1]
          }
        });
      }
      parts.push({ text: currentInput || "Em cần thầy giải giúp bài toán trong hình ảnh này." });

      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: [
          ...messages.slice(-8).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: parts }
        ],
        config: {
          systemInstruction: `Bạn là Thầy Trần Minh Toàn, giáo viên Toán chuyên sâu tại trường THCS Tăng Bạt Hổ. 
          Kiến thức của bạn là khổng lồ về Toán phổ thông, toán HSG và máy tính Casio.
          Nhiệm vụ:
          1. Giải các bài toán từ văn bản hoặc hình ảnh học sinh gửi.
          2. Luôn trình bày LaTeX cực kỳ đẹp mắt ($ cho inline, $$ cho display).
          3. Xưng hô "Thầy" và "em" thân thiện nhưng chuyên nghiệp.
          4. Nếu có lỗi về hạn ngạch (quota), hãy hướng dẫn em đợi một chút rồi thử lại.`,
          temperature: 0.7,
        }
      });

      let accumulatedText = "";
      for await (const chunk of streamResponse) {
        const textChunk = chunk.text;
        if (textChunk) {
          accumulatedText += textChunk;
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: accumulatedText
              };
            }
            return updated;
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      let errorMsg = 'Thầy gặp lỗi kỹ thuật khi phân tích bài toán. Em hãy thử lại sau giây lát nhé.';
      
      // Xử lý lỗi 429 Resource Exhausted
      if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMsg = 'Hệ thống của thầy hiện đang quá tải (vượt hạn ngạch API). Em vui lòng đợi khoảng 1-2 phút rồi gửi lại câu hỏi cho thầy nhé. Cảm ơn em!';
      }

      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
          updated[updated.length - 1].content = errorMsg;
        } else {
          updated.push({
            role: 'assistant',
            content: errorMsg,
            timestamp: new Date().toISOString()
          });
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[90vh] flex flex-col p-4 md:p-8 animate-fadeIn">
      <header className="flex items-center justify-between mb-6 bg-white p-6 rounded-[30px] shadow-xl border border-emerald-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-all">
            ←
          </button>
          <div className="relative">
            <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-emerald-500">
              👨‍🏫
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Thầy Trần Minh Toàn</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              {userEmail ? `Lịch sử: ${userEmail}` : 'Chuyên gia Toán - THCS Tăng Bạt Hổ'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={clearHistory} className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all shadow-sm">
             Xóa lịch sử
           </button>
           <div className="hidden md:block bg-emerald-900 text-emerald-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-700">
             Streaming Core
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2 mb-6 bg-slate-50/50 rounded-[40px] p-8 border border-slate-100 shadow-inner">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
            <div className={`max-w-[85%] p-6 rounded-[30px] shadow-sm relative group/msg ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-emerald-50 rounded-tl-none'
            }`}>
              {msg.image && (
                <div className="mb-4 rounded-xl overflow-hidden border-2 border-white/20 shadow-md">
                  <img src={msg.image} alt="Đề bài của em" className="max-w-full h-auto max-h-72 object-contain" />
                </div>
              )}
              
              {msg.role === 'assistant' && msg.content !== '' && (
                <div className="absolute -top-3 -right-3 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => copyToClipboard(msg.content, i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl border border-white/20 ${
                      copyStatus === i ? 'bg-green-500 scale-105' : 'bg-emerald-800 hover:bg-emerald-900 opacity-90 group-hover/msg:opacity-100'
                    }`}
                    title="Sao chép lời giải của thầy"
                  >
                    {copyStatus === i ? (
                      <><span>✅</span> Đã chép!</>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className={`text-sm md:text-lg leading-relaxed ${msg.role === 'assistant' ? 'font-medium' : 'font-bold'}`}>
                {msg.content === '' && msg.role === 'assistant' ? (
                  <div className="flex gap-1 py-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                  </div>
                ) : (
                  <MathRenderer tex={msg.content} raw />
                )}
              </div>
              
              <div className={`text-[9px] mt-3 uppercase font-black opacity-50 flex items-center gap-2 ${msg.role === 'user' ? 'text-emerald-100 justify-end' : 'text-slate-400 justify-start'}`}>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.role === 'assistant' && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
                {msg.role === 'assistant' && <span>TMT EDU AI</span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative group">
        {image && (
          <div className="absolute bottom-full mb-4 left-0 animate-slideUp z-20">
             <div className="relative p-2 bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 inline-block">
                <img src={image} className="h-40 w-auto rounded-lg object-contain" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
             </div>
          </div>
        )}

        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-[35px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white rounded-[32px] shadow-2xl p-2 border border-emerald-100">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
            title="Tải ảnh hoặc chụp ảnh đề bài"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập câu hỏi hoặc dán ảnh (Ctrl+V) tại đây..."
            className="flex-1 bg-transparent p-4 outline-none resize-none font-medium text-slate-700 min-h-[60px] max-h-[150px] custom-scrollbar"
          />
          
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !image) || loading}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AIAssistantView;
