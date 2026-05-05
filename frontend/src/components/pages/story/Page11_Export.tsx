import React from 'react';
import { CalculatedStats } from '../../../core/types';
import { useLogbookStore } from '../../../store/useLogbookStore';
import { ExportCTA_Owner } from './ExportCTA_Owner';
import { ExportCTA_SharedDemo } from './ExportCTA_SharedDemo';

interface Props {
  // Kept for API symmetry with other story pages; not currently rendered here.
  stats?: CalculatedStats;
  onOpenExport?: () => void;
  onOpenDonation?: () => void;
  isExportMode?: boolean;
}

export const Page11_Export: React.FC<Props> = ({ onOpenExport, onOpenDonation, isExportMode }) => {
  const { isSharedView, isDemo } = useLogbookStore();

  // Export mode renders nothing (pages are rendered headlessly for image export)
  if (isExportMode) return null;

  // Shared-link viewers and demo users get a "make your own" pitch
  if (isSharedView || isDemo) {
    return <ExportCTA_SharedDemo />;
  }

  // Logbook owner gets the full action ticket
  return <ExportCTA_Owner onOpenExport={onOpenExport} onOpenDonation={onOpenDonation} />;
};
