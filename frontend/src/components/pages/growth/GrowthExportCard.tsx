import React from 'react';
import { GrowthStats } from '../../../core/types';
import { GrowthBoard } from './GrowthBoard';

interface Props {
  format: 'story' | 'post';
  gStats: GrowthStats;
  nameA: string;
  nameB: string;
}

export const GrowthExportCard: React.FC<Props> = ({ format, gStats, nameA, nameB }) => {
  return (
    <GrowthBoard 
      gStats={gStats}
      nameA={nameA}
      nameB={nameB}
      isExportMode={true}
      exportFormat={format}
    />
  );
};