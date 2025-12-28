
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import CongruenceView from './features/CongruenceView';
import DiophantineView from './features/DiophantineView';
import XPowerNView from './features/XPowerNView';
import CRTView from './features/CRTView';
import RecurrenceView from './features/RecurrenceView';
import OptimizationView from './features/OptimizationView';
import TriangleView from './features/TriangleView';
import FunctionTableView from './features/FunctionTableView';
import SystemEquationView from './features/SystemEquationView';
import SimilarProblemView from './features/SimilarProblemView';
import DivisorView from './features/DivisorView';
import PolynomialView from './features/PolynomialView';
import ConjugatePowerView from './features/ConjugatePowerView';
import AIAssistantView from './features/AIAssistantView';
import MathRenderer from './components/MathRenderer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem('tmt_user_email') || '');

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('tmt_user_email', userEmail);
    }
  }, [userEmail]);

  const menuItems = [
    { id: AppView.CONGRUENCE, title: 'Đồng dư $A^b \\pmod m$', icon: '🔢', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-emerald-100/50' },
    { id: AppView.CONJUGATE_POWER, title: '$(a \\pm \\sqrt{b})^n \\pmod c$', icon: '🎭', color: 'bg-teal-50 hover:bg-teal-100 border-teal-200 shadow-teal-100/50' },
    { id: AppView.DIOPHANTINE, title: 'Nghiệm nguyên $f(x,y)=a$', icon: '秤', color: 'bg-green-50 hover:bg-green-100 border-green-200 shadow-green-100/50' },
    { id: AppView.POLYNOMIAL, title: 'Xác định Đa thức', icon: '🎋', color: 'bg-emerald-100/70 hover:bg-emerald-200/70 border-emerald-300 shadow-emerald-200/50' },
    { id: AppView.CRT, title: 'Đồng dư Trung Hoa', icon: '🇨🇳', color: 'bg-lime-50 hover:bg-lime-100 border-lime-200 shadow-lime-100/50' },
    { id: AppView.DIVISORS, title: 'Ước số và Thừa số', icon: '🧬', color: 'bg-emerald-100/50 hover:bg-emerald-200/50 border-emerald-300 shadow-emerald-200/50' },
    { id: AppView.RECURRENCE, title: 'Dãy số Truy hồi', icon: '📉', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-emerald-100/50' },
    { id: AppView.OPTIMIZATION, title: 'GTLN và GTNN', icon: '📈', color: 'bg-green-50 hover:bg-green-100 border-green-200 shadow-green-100/50' },
    { id: AppView.TRIANGLE, title: 'Giải Tam Giác', icon: '📐', color: 'bg-teal-50 hover:bg-teal-100 border-teal-200 shadow-teal-100/50' },
    { id: AppView.FUNC_TABLE, title: 'Bảng giá trị $f(x)$', icon: '📊', color: 'bg-lime-50 hover:bg-lime-100 border-lime-200 shadow-lime-100/50' },
    { id: AppView.SYSTEM_EQ, title: 'Hệ PT 5-6 ẩn', icon: '🧩', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 shadow-emerald-100/50' },
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.CONGRUENCE: return <CongruenceView onBack={() => setCurrentView(AppView.HOME)} userEmail={userEmail} />;
      case AppView.CONJUGATE_POWER: return <ConjugatePowerView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.DIOPHANTINE: return <DiophantineView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.X_POWER_N: return <XPowerNView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.CRT: return <CRTView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.RECURRENCE: return <RecurrenceView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.OPTIMIZATION: return <OptimizationView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.TRIANGLE: return <TriangleView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.FUNC_TABLE: return <FunctionTableView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.SYSTEM_EQ: return <SystemEquationView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.SIMILAR_PROB: return <SimilarProblemView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.DIVISORS: return <DivisorView onBack={() => setCurrentView(AppView.HOME)} userEmail={userEmail} />;
      case AppView.POLYNOMIAL: return <PolynomialView onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.AI_ASSISTANT: return <AIAssistantView onBack={() => setCurrentView(AppView.HOME)} userEmail={userEmail} />;
      default:
        return (
          <div className="max-w-6xl mx-auto p-6 animate-fadeIn relative">
            <header className="text-center mb-16 pt-10">
              <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-black text-xs uppercase tracking-[0.3em] mb-4 shadow-sm border border-emerald-200">
                TMT EDU Academic Excellence
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter leading-tight">
                HỌC TOÁN MÁY TÍNH CẦM TAY <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 italic">CÙNG TMT EDU</span>
              </h1>
              
              {/* User Identity Section */}
              <div className="max-w-sm mx-auto mb-10 bg-white p-4 rounded-[30px] shadow-lg border border-emerald-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm">👤</div>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Nhập Email để lưu lịch sử..."
                  className="flex-1 bg-transparent outline-none font-bold text-slate-700 text-sm"
                />
              </div>

              <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mb-6"></div>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                Hệ thống công cụ chuyên sâu giúp bạn làm chủ các kỳ thi học sinh giỏi máy tính cầm tay và toán học phổ thông.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`${item.color} p-10 rounded-[40px] border shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center justify-center text-center group relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                  <span className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500 z-10">{item.icon}</span>
                  <MathRenderer tex={item.title} className="text-xl font-extrabold text-slate-700 z-10" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => setCurrentView(AppView.AI_ASSISTANT)}
                className="bg-slate-900 hover:bg-black text-white p-12 rounded-[50px] border-4 border-emerald-500 shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 animate-pulse"></div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                <span className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">👨‍🏫</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-emerald-400">Trợ lý AI Thầy Toàn</h2>
                <p className="text-slate-400 font-bold mt-2 italic text-sm">Chuyên gia Toán học từ THCS Tăng Bạt Hổ</p>
                <div className="mt-6 px-6 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Hỗ trợ giải toán 24/7</div>
              </button>

              <button
                onClick={() => setCurrentView(AppView.SIMILAR_PROB)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white p-12 rounded-[50px] border-4 border-emerald-700 shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <span className="text-7xl mb-6 group-hover:rotate-12 transition-transform duration-500">🤖</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Bài toán Tương tự</h2>
                <p className="text-emerald-300 font-bold mt-2 italic text-sm">Hệ thống Smith tạo biến thể đề thi</p>
                <p className="text-[10px] font-bold text-emerald-400/60 mt-4 tracking-widest uppercase">Powered by TMT AI</p>
              </button>
            </div>

            <footer className="mt-20 text-center pb-10 border-t border-emerald-100 pt-10">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2024 TMT EDU - Kiến tạo tương lai toán học</p>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      {renderView()}
    </div>
  );
};

export default App;
