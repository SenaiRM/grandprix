'use client';

import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseNode from './PhaseNode';

interface RaceTrackBoardProps {
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
}

// Asphalt road connector between nodes
function Road({ direction }: { direction: 'right' | 'left' | 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex flex-col items-center justify-center flex-shrink-0" style={{ width: 36, minHeight: 20 }}>
        {/* Road vertical */}
        <div className="relative flex flex-col items-center w-6 flex-1 min-h-8" style={{ background: '#1a1a1a' }}>
          {/* Center dashes */}
          <div className="absolute inset-x-0 flex flex-col items-center gap-1 py-1">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-0.5 h-2 rounded" style={{ background: '#F26522aa' }} />
            ))}
          </div>
          {/* Side stripes */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: '#F2652244' }} />
          <div className="absolute right-0 top-0 bottom-0 w-0.5" style={{ background: '#F2652244' }} />
        </div>
        {/* Arrow */}
        <svg width="16" height="10" viewBox="0 0 16 10" className="flex-shrink-0">
          <path d="M8 10L0 0H16L8 10Z" fill="#F26522" fillOpacity="0.8" />
        </svg>
      </div>
    );
  }

  const isLeft = direction === 'left';
  return (
    <div className="flex items-center flex-shrink-0" style={{ width: 44, height: 24 }}>
      {/* Horizontal road */}
      <div className="relative flex items-center flex-1 h-6" style={{ background: '#1a1a1a' }}>
        {/* Center dashes */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-1">
          {[0,1,2].map(i => (
            <div key={i} className="h-0.5 w-3 rounded" style={{ background: '#F26522aa' }} />
          ))}
        </div>
        {/* Side stripes */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#F2652244' }} />
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#F2652244' }} />
      </div>
      {/* Arrow */}
      {isLeft ? (
        <svg width="10" height="16" viewBox="0 0 10 16" className="flex-shrink-0">
          <path d="M0 8L10 0V16L0 8Z" fill="#F26522" fillOpacity="0.8" />
        </svg>
      ) : (
        <svg width="10" height="16" viewBox="0 0 10 16" className="flex-shrink-0">
          <path d="M10 8L0 0V16L10 8Z" fill="#F26522" fillOpacity="0.8" />
        </svg>
      )}
    </div>
  );
}

export default function RaceTrackBoard({ teams, justAdvancedId, onTeamClick }: RaceTrackBoardProps) {
  // Top row: phases 0 → 1 → 2 (left to right)
  // Bottom row: phases 5 ← 4 ← 3 (right to left, displayed as [5][4][3])
  const topPhases   = [PHASES[0], PHASES[1], PHASES[2]];
  const bottomPhases = [PHASES[5], PHASES[4], PHASES[3]];

  return (
    <div className="flex-1 flex flex-col justify-center gap-2 px-4 pb-2 min-h-0">

      {/* START label */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="px-3 py-0.5 rounded text-xs font-black tracking-widest uppercase"
          style={{
            background: 'rgba(242,101,34,0.15)',
            border: '1px solid rgba(242,101,34,0.4)',
            color: '#F26522',
          }}
        >
          🚦 START
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #F26522aa, transparent)' }} />
      </div>

      {/* Top row: phases 0 → 1 → 2 */}
      <div className="flex items-stretch">
        {topPhases.map((phase, i) => (
          <div key={phase.key} className="flex items-center" style={{ flex: '1 1 0', minWidth: 0 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                checkpointNumber={i + 1}
              />
            </div>
            {i < 2 && <Road direction="right" />}
          </div>
        ))}

        {/* Right-side vertical road connector */}
        <div className="flex items-center ml-1">
          <Road direction="down" />
        </div>
      </div>

      {/* Bottom row: phases 5 ← 4 ← 3 */}
      <div className="flex items-stretch">
        {bottomPhases.map((phase, i) => (
          <div key={phase.key} className="flex items-center" style={{ flex: '1 1 0', minWidth: 0 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                checkpointNumber={6 - i}
              />
            </div>
            {i < 2 && <Road direction="left" />}
          </div>
        ))}
        {/* Spacer aligns with vertical connector above */}
        <div style={{ width: 44 }} />
      </div>

      {/* FINISH label */}
      <div className="flex items-center gap-2 mt-1">
        <div
          className="px-3 py-0.5 rounded text-xs font-black tracking-widest uppercase"
          style={{
            backgroundImage: 'repeating-conic-gradient(#111 0% 25%, #eee 0% 50%)',
            backgroundSize: '8px 8px',
            color: 'transparent',
            border: '1px solid #FFD700aa',
          }}
        >
          🏁
        </div>
        <div
          className="px-3 py-0.5 rounded text-xs font-black tracking-widest uppercase"
          style={{
            background: 'rgba(255,215,0,0.12)',
            border: '1px solid rgba(255,215,0,0.4)',
            color: '#FFD700',
          }}
        >
          🏁 FINISH LINE
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700aa, transparent)' }} />
      </div>
    </div>
  );
}
