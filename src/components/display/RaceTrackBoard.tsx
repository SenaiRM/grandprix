'use client';

import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseColumn from './PhaseColumn';

interface RaceTrackBoardProps {
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
}

export default function RaceTrackBoard({ teams, justAdvancedId, onTeamClick }: RaceTrackBoardProps) {
  return (
    <div className="flex gap-3 flex-1 min-h-0 px-4 pb-4">
      {PHASES.map((phase) => (
        <PhaseColumn
          key={phase.key}
          phase={phase}
          teams={teams.filter((t) => t.currentPhase === phase.index)}
          justAdvancedId={justAdvancedId}
          onTeamClick={onTeamClick}
        />
      ))}
    </div>
  );
}
