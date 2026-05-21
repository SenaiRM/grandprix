'use client';

import { motion } from 'framer-motion';
import { Phase, Team } from '@/types';
import TeamBubble from './TeamBubble';

interface PhaseNodeProps {
  phase: Phase;
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
  index: number;
}

const PHASE_BG: Record<number, string> = {
  0: 'rgba(107,114,128,0.15)',
  1: 'rgba(245,158,11,0.15)',
  2: 'rgba(59,130,246,0.15)',
  3: 'rgba(139,92,246,0.15)',
  4: 'rgba(236,72,153,0.15)',
  5: 'rgba(245,158,11,0.22)',
};

export default function PhaseNode({ phase, teams, justAdvancedId, onTeamClick, index }: PhaseNodeProps) {
  const isWinner = phase.index === 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: PHASE_BG[phase.index],
        border: `2px solid ${phase.color}44`,
        boxShadow: isWinner
          ? `0 0 32px ${phase.color}55, inset 0 0 32px ${phase.color}11`
          : `0 0 12px ${phase.color}22`,
        minWidth: 160,
        maxWidth: 190,
        flex: '1 1 0',
      }}
    >
      {/* Glow bar at top */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, transparent, ${phase.color}, transparent)` }}
      />

      {/* Phase header */}
      <div className="px-3 pt-3 pb-2 text-center">
        <div className={`text-4xl mb-1 ${isWinner ? 'animate-bounce' : ''}`}>{phase.emoji}</div>
        <div
          className="font-bold font-display text-sm leading-tight"
          style={{ color: isWinner ? '#FFD700' : 'white' }}
        >
          {phase.label}
        </div>
        {/* Team count badge */}
        <div
          className="inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: `${phase.color}33`, color: phase.color }}
        >
          {teams.length} equipe{teams.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: `${phase.color}33` }} />

      {/* Teams */}
      <div className="flex flex-wrap justify-center gap-2 p-3 min-h-[80px]">
        {teams.map((team) => (
          <TeamBubble
            key={team.id}
            team={team}
            onClick={() => onTeamClick(team)}
            isJustAdvanced={justAdvancedId === team.id}
          />
        ))}
        {teams.length === 0 && (
          <div className="text-white/20 text-xs text-center self-center select-none w-full">
            aguardando...
          </div>
        )}
      </div>
    </motion.div>
  );
}
