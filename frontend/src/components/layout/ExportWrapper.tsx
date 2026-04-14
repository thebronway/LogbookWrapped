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
        
        <div className="absolute bottom-4 right-4 z-[999] opacity-70">
          <img src="/logo4.webp" alt="LogbookWrapped" className="w-[84px] h-auto" />
        </div>
      </div>
  );
};