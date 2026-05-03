import React from 'react';
import { GrowthStats } from '../../../core/types';
import { GrowthBoard } from './GrowthBoard';

interface Props {
  nameA: string;
  nameB: string;
  gStats: GrowthStats;
}

export const GrowthPage1_Stats: React.FC<Props> = ({ nameA, nameB, gStats }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="w-full max-w-md h-full sm:h-[750px] rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border-y sm:border border-slate-800 shrink-0">
        <GrowthBoard 
          gStats={gStats}
          nameA={nameA}
          nameB={nameB}
          isExportMode={false}
          exportFormat="story"
        />
      </div>
    </div>
  );
};