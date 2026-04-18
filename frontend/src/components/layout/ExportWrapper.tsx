import React from 'react';

interface Props {
  children: React.ReactNode;
  pageId: string;
  format?: 'story' | 'post';
}

export const ExportWrapper: React.FC<Props> = ({ children, pageId, format = 'story' }) => {
  const isPost = format === 'post';
  const width = '450px';
  // 562.5px height perfectly creates a 4:5 aspect ratio with a 450px width
  const height = isPost ? '562.5px' : '800px';

  return (
    <div 
        id={pageId}
        className="bg-black overflow-hidden flex flex-col relative"
        style={{ 
          width, 
          height,
          minWidth: width,
          minHeight: height,
        }}
      >
        <div className="w-full h-full relative z-10 flex flex-col">
          {children}
        </div>
        
        <div className={`absolute left-0 w-full flex justify-center z-[999] ${isPost ? 'bottom-2' : 'bottom-3'}`}>
          <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase drop-shadow-md">
            logbookwrapped.com
          </span>
        </div>
      </div>
  );
};