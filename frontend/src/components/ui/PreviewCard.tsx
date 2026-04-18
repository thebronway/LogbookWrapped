import React, { useEffect, useRef, useState } from 'react';
import { ExportWrapper } from '../layout/ExportWrapper';

interface Props {
  page: any;
  format: 'story' | 'post';
}

export const PreviewCard: React.FC<Props> = ({ page, format }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3); // Start small to prevent flicker

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setScale((entries[0].contentRect.width / 450) + 0.0035);
      }
    });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const aspectClass = format === 'post' ? 'aspect-[4/5]' : 'aspect-[9/16]';
  const internalHeight = format === 'post' ? '562.5px' : '800px';

  return (
    <div ref={containerRef} className={`w-full ${aspectClass} bg-transparent rounded-xl overflow-hidden relative border border-slate-700 shadow-inner group transition-all duration-500 ease-in-out`}>
       <div 
         className="absolute top-0 left-[50%] w-[450px] pointer-events-none transition-all duration-500"
         style={{ 
           transform: `translateX(-50%) scale(${scale})`, 
           transformOrigin: 'top center',
           height: internalHeight 
         }}
       >
          <ExportWrapper pageId={`${page.id}-preview`} format={format}>
             {page.render(format)}
          </ExportWrapper>
       </div>
       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none z-10" />
    </div>
  );
};