
import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  tex: string;
  className?: string;
  display?: boolean;
  raw?: boolean; // Nếu true, sẽ không tự động bọc $ vào đầu/cuối
}

const MathRenderer: React.FC<MathRendererProps> = ({ tex, className = '', display = false, raw = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && (window as any).MathJax) {
      // Sử dụng typesetPromise để render lại khi nội dung thay đổi
      (window as any).MathJax.typesetPromise([containerRef.current]).catch((err: any) => console.error(err));
    }
  }, [tex]);

  // Kiểm tra xem chuỗi có chứa ký hiệu toán học chưa
  const hasDelimiters = tex.includes('$') || tex.includes('\\(') || tex.includes('\\[') || tex.includes('$$');
  const shouldWrap = !raw && !hasDelimiters;

  return (
    <span ref={containerRef} className={`${className} ${display ? 'block text-center my-4' : 'inline-block'}`}>
      {shouldWrap 
        ? (display ? `$$${tex}$$` : `$${tex}$`) 
        : tex
      }
    </span>
  );
};

export default MathRenderer;
