import React from 'react';

interface Props {
  children: React.ReactNode;
  pageId: string;
}

export const ExportWrapper: React.FC<Props> = ({ children, pageId }) => {
  return (
    <div 
        id={pageId}
        className="bg-black overflow-hidden flex flex-col relative"
        style={{ 
          width: '450px', 
          height: '800px',
          minWidth: '450px',
          minHeight: '800px',
        }}
      >
        <div className="w-full h-full relative z-10 flex flex-col">
          {children}
        </div>
        
        <div className="absolute bottom-3 left-0 w-full flex justify-center z-[999]">
          <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase drop-shadow-md">
            logbookwrapped.com
          </span>
        </div>
      </div>
  );
};