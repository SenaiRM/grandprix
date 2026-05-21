'use client';

import { AnimatePresence } from 'framer-motion';
import { Phase, Team } from '@/types';
import TeamBubble from './TeamBubble';

interface PhaseColumnProps {
  phase: Phase;
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
}

const isWinnerPhase = (phase: Phase) => phase.index === 5;

export default function PhaseColumn({ phase, teams, justAdvancedId, onTeamClick }: PhaseColumnProps) {
  const winner = isWinnerPhase(phase);

  return (
    <div
      className="flex flex-col flex-1 min-w-0 rounded-2xl overflow-hidden border border-white/10"
      style={{
        background: winner
          ? 'linear-gradient(180deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.04) 100%)'
          : 'rgba(255,255,255,0.03)',
        borderLeft: `4px solid ${phase.color}`,
      }}
    >
      {/* Phase header */}
      <div
        className="px-3 py-4 text-center border-b border-white/10"
        style={{ background: `${phase.color}22` }}
      >
        <div className="text-3xl mb-1">{phase.emoji}</div>
        <div className="text-white font-bold font-display text-sm leading-tight">{phase.label}</div>
        <div className="text-white/50 text-xs mt-1">{teams.length} equipe{teams.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Teams */}
      <div className="flex flex-col items-center gap-4 p-3 flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {teams.map((team) => (
            <TeamBubble
              key={team.id}
              team={team}
              onClick={() => onTeamClick(team)}
              isJustAdvanced={justAdvancedId === team.id}
            />
          ))}
        </AnimatePresence>

        {teams.length === 0 && (
          <div className="text-white/20 text-xs text-center mt-4 select-none">
            nenhuma equipe
          </div>
        )}
      </div>
    </div>
  );
}
