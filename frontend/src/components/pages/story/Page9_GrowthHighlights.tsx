import React from 'react';
import { CalculatedStats } from '../../../core/types';
import { calculateGrowthStats } from '../../../core/MathEngine';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { GrowthBoard } from '../growth/GrowthBoard';

interface Props {
  stats: CalculatedStats;
  comparisonStats: CalculatedStats;
  isExportMode?: boolean;
  exportFormat?: 'story' | 'post';
}

export const Page9_GrowthHighlights: React.FC<Props> = ({ 
  stats, 
  comparisonStats, 
  isExportMode, 
  exportFormat = 'story' 
}) => {
  const dateFilter = useLogbookStore((state) => state.dateFilter);
  const growth = calculateGrowthStats(comparisonStats, stats);

  const currentYear = (() => {
    const now = new Date().getFullYear();
    if (dateFilter.type === 'this_year') return now;
    if (dateFilter.type === 'last_year') return now - 1;
    if (dateFilter.start) return parseInt(dateFilter.start.substring(0, 4));
    return now;
  })();

  return (
    <GrowthBoard 
      gStats={growth}
      nameA={currentYear - 1}
      nameB={currentYear}
      isExportMode={isExportMode}
      exportFormat={exportFormat}
    />
  );
};