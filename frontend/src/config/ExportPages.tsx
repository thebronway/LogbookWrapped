import React from 'react';
import { CalculatedStats } from '../core/types';

import { Page1_Cover } from '../components/pages/Page1_Cover';
import { Page2_BigPicture } from '../components/pages/Page2_BigPicture';
import { Page3_Fleet } from '../components/pages/Page3_Fleet';
import { Page4_Extremes } from '../components/pages/Page4_Extremes';
import { Page5_Superlatives } from '../components/pages/Page5_Superlatives';
import { Page6_Elements } from '../components/pages/Page6_Elements';
import { Page7_Passport } from '../components/pages/Page7_Passport';
import { Page8_Stats } from '../components/pages/Page8_Stats';

export const getExportPages = (stats: CalculatedStats) => [
  { id: 'export-p7', name: 'Passport', isPoster: false, render: (f: any) => <Page7_Passport stats={stats} isExportMode={true} exportFormat={f} /> },
  { id: 'export-p8', name: 'Stats', isPoster: false, render: (f: any) => <Page8_Stats stats={stats} isExportMode={true} exportFormat={f} /> },
  { id: 'export-p1', name: 'Cover', isPoster: false, render: (f: any) => <Page1_Cover stats={stats} exportFormat={f} /> },
  { id: 'export-p2', name: 'Big Picture', isPoster: false, render: (f: any) => <Page2_BigPicture stats={stats} exportFormat={f} /> },
  { id: 'export-p3', name: 'Fleet', isPoster: false, render: (f: any) => <Page3_Fleet stats={stats} exportFormat={f} /> },
  { id: 'export-p4', name: 'Extremes', isPoster: false, render: (f: any) => <Page4_Extremes stats={stats} exportFormat={f} /> },
  { id: 'export-p5', name: 'Superlatives', isPoster: false, render: (f: any) => <Page5_Superlatives stats={stats} exportFormat={f} /> },
  { id: 'export-p6', name: 'Elements', isPoster: false, render: (f: any) => <Page6_Elements stats={stats} exportFormat={f} /> },
];