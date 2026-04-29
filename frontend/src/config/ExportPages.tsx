import React from 'react';
import { CalculatedStats, ExportItem } from '../core/types';

import { Page1_Cover } from '../components/pages/story/Page1_Cover';
import { Page2_BigPicture } from '../components/pages/story/Page2_BigPicture';
import { Page3_Fleet } from '../components/pages/story/Page3_Fleet';
import { Page4_Extremes } from '../components/pages/story/Page4_Extremes';
import { Page5_Superlatives } from '../components/pages/story/Page5_Superlatives';
import { Page6_Elements } from '../components/pages/story/Page6_Elements';
import { Page7_Passport } from '../components/pages/story/Page7_Passport';
import { Page8_Stats } from '../components/pages/story/Page8_Stats';
import { Page8_5_GrowthHighlights } from '../components/pages/story/Page8_5_GrowthHighlights';
import { useLogbookStore } from '../store/useLogbookStore';

export const getExportPages = (stats: CalculatedStats): ExportItem[] => {
  const comparisonStats = useLogbookStore.getState().comparisonStats;
  const items: ExportItem[] = [
    { id: 'export-p7', name: 'Passport', isPoster: false, render: (format) => <Page7_Passport stats={stats} isExportMode={true} exportFormat={format} /> },
    { id: 'export-p8', name: 'Stats', isPoster: false, render: (format) => <Page8_Stats stats={stats} isExportMode={true} exportFormat={format} /> },
  ];

  if (comparisonStats) {
    items.push({
      id: 'export-p8-5',
      name: 'Growth Highlights',
      isPoster: false,
      render: (format) => (
        <Page8_5_GrowthHighlights 
          stats={stats} 
          comparisonStats={comparisonStats} 
          isExportMode={true} 
          exportFormat={format} 
        />
      )
    });
  }

  items.push(
    { id: 'export-p1', name: 'Cover', isPoster: false, render: (format) => <Page1_Cover stats={stats} exportFormat={format} /> },
    { id: 'export-p2', name: 'Big Picture', isPoster: false, render: (format) => <Page2_BigPicture stats={stats} exportFormat={format} /> },
    { id: 'export-p3', name: 'Fleet', isPoster: false, render: (format) => <Page3_Fleet stats={stats} exportFormat={format} /> },
    { id: 'export-p4', name: 'Extremes', isPoster: false, render: (format) => <Page4_Extremes stats={stats} exportFormat={format} /> },
    { id: 'export-p5', name: 'Superlatives', isPoster: false, render: (format) => <Page5_Superlatives stats={stats} exportFormat={format} /> },
    { id: 'export-p6', name: 'Elements', isPoster: false, render: (format) => <Page6_Elements stats={stats} exportFormat={format} /> },
  );

  return items;
};