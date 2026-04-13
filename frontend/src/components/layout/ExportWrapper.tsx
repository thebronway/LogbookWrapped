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
        // We use a 450x800 base (9:16) so Tailwind's text/padding classes scale beautifully.
        // html2canvas will multiply this by 2.4 to get exactly 1080x1920.
        style={{ 
          width: '450px', 
          height: '800px',
          minWidth: '450px',
          minHeight: '800px',
        }}
      >
        {/* Universal Export Title */}
        <div className="absolute top-6 left-0 w-full flex justify-center z-[50]">
          <span className="text-slate-400 font-bold tracking-widest uppercase text-xs opacity-80">
            My LogbookWrapped
          </span>
        </div>

        <div className="w-full h-full relative z-10 flex flex-col pt-4">
          {children}
        </div>
        
        {/* Watermark: Adjusted margin for the smaller container and scaled up exactly 25% relative to the new layout */}
        <div className="absolute bottom-4 right-4 z-[999] opacity-70">
          <img src="/logo3.webp" alt="LogbookWrapped" className="w-[70px] h-auto" />
        </div>
      </div>
  );
};