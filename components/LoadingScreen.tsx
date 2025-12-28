
import React, { useState, useEffect } from 'react';

const quotes = [
  "Dân ta phải biết sử ta...",
  "Hào khí Đông A, tinh thần bất khuất.",
  "Nam quốc sơn hà Nam đế cư...",
  "Đang phác họa hào kiệt phương Nam...",
  "Đang tìm kiếm sử liệu hào hùng..."
];

export const LoadingScreen: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border-4 border-amber-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-amber-700 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <p className="text-xl font-medium text-amber-900 animate-bounce">
        {quotes[quoteIndex]}
      </p>
      <p className="text-sm text-amber-700/60 max-w-md text-center italic">
        Trí tuệ nhân tạo đang tạo nên bức tranh và tái hiện lịch sử cho bạn.
      </p>
    </div>
  );
};
