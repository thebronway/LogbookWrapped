import React from 'react';
import { CalculatedStats, ExportItem } from '../core/types';

import { Page1_Cover } from '../components/pages/Page1_Cover';
import { Page2_BigPicture } from '../components/pages/Page2_BigPicture';
import { Page3_Fleet } from '../components/pages/Page3_Fleet';
import { Page4_Extremes } from '../components/pages/Page4_Extremes';
import { Page5_Superlatives } from '../components/pages/Page5_Superlatives';
import { Page6_Elements } from '../components/pages/Page6_Elements';
import { Page7_Passport } from '../components/pages/Page7_Passport';
import { Page8_Stats } from '../components/pages/Page8_Stats';

export const getExportPages = (stats: CalculatedStats): ExportItem[] => [
  { id: 'export-p7', name: 'Passport', isPoster: false, render: (format) => <Page7_Passport stats={stats} isExportMode={true} exportFormat={format} /> },
  { id: 'export-p8', name: 'Stats', isPoster: false, render: (format) => <Page8_Stats stats={stats} isExportMode={true} exportFormat={format} /> },
  { id: 'export-p1', name: 'Cover', isPoster: false, render: (format) => <Page1_Cover stats={stats} exportFormat={format} /> },
  { id: 'export-p2', name: 'Big Picture', isPoster: false, render: (format) => <Page2_BigPicture stats={stats} exportFormat={format} /> },
  { id: 'export-p3', name: 'Fleet', isPoster: false, render: (format) => <Page3_Fleet stats={stats} exportFormat={format} /> },
  { id: 'export-p4', name: 'Extremes', isPoster: false, render: (format) => <Page4_Extremes stats={stats} exportFormat={format} /> },
  { id: 'export-p5', name: 'Superlatives', isPoster: false, render: (format) => <Page5_Superlatives stats={stats} exportFormat={format} /> },
  { id: 'export-p6', name: 'Elements', isPoster: false, render: (format) => <Page6_Elements stats={stats} exportFormat={format} /> },
];