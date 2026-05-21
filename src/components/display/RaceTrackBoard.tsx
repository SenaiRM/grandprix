'use client';

import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseNode from './PhaseNode';

interface RaceTrackBoardProps {
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
}

function RoadArrow({ direction }: { direction: 'right' | 'left' | 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center justify-center gap-1 self-stretch px-1" style={{ minHeight: 20 }}>
        <div className="w-px flex-1 bg-gradient-to-b from-orange-500/60 to-orange-500/20" style={{ minHeight: 12 }} />
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M7 10L0.937822 0.25H13.0622L7 10Z" fill="#F26522" fillOpacity="0.7" />
        </svg>
      </div>
    );
  }
  if (direction === 'left') {
    return (
      <div className="flex items-center justify-center flex-shrink-0 gap-1" style={{ width: 32 }}>
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
          <path d="M0 7L9.75 0.937822L9.75 13.0622L0 7Z" fill="#F26522" fillOpacity="0.7" />
        </svg>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, #F2652299, transparent)' }} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center flex-shrink-0 gap-1" style={{ width: 32 }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, #F2652299, transparent)' }} />
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M10 7L0.25 13.0622V0.937822L10 7Z" fill="#F26522" fillOpacity="0.7" />
      </svg>
    </div>
  );
}

export default function RaceTrackBoard({ teams, justAdvancedId, onTeamClick }: RaceTrackBoardProps) {
  // Circuit layout: top row phases 0→1→2, then down, bottom row phases 5←4←3
  const topPhases = [PHASES[0], PHASES[1], PHASES[2]];
  const bottomPhases = [PHASES[5], PHASES[4], PHASES[3]]; // reversed visually

  return (
    <div className="flex-1 flex flex-col justify-center px-6 pb-4 gap-3 min-h-0">

      {/* Top row: phases 0 → 1 → 2 */}
      <div className="flex items-stretch gap-0">
        {topPhases.map((phase, i) => (
          <div key={phase.key} className="flex items-center" style={{ flex: '1 1 0', minWidth: 0, gap: 0 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                index={i}
              />
            </div>
            {i < 2 && <RoadArrow direction="right" />}
          </div>
        ))}

        {/* Vertical connector on right side */}
        <div className="flex flex-col items-center justify-center ml-0" style={{ width: 32 }}>
          <RoadArrow direction="down" />
        </div>
      </div>

      {/* Bottom row: phases 5 ← 4 ← 3 (visually right-to-left flow) */}
      <div className="flex items-stretch gap-0">
        {bottomPhases.map((phase, i) => (
          <div key={phase.key} className="flex items-center" style={{ flex: '1 1 0', minWidth: 0 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                index={i + 3}
              />
            </div>
            {i < 2 && <RoadArrow direction="left" />}
          </div>
        ))}
        {/* Spacer to align with top row's vertical connector */}
        <div style={{ width: 32 }} />
      </div>
    </div>
  );
}
