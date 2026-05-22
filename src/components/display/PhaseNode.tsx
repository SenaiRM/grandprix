'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phase, Team } from '@/types';
import TeamBubble from './TeamBubble';

interface PhaseNodeProps {
  phase: Phase;
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
  checkpointNumber: number;
}

export default function PhaseNode({ phase, teams, justAdvancedId, onTeamClick, checkpointNumber }: PhaseNodeProps) {
  const isFinal = phase.index === 5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: checkpointNumber * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex flex-col rounded-xl overflow-hidden flex-1"
      style={{
        background: 'linear-gradient(160deg, #0d1117 0%, #131929 100%)',
        border: `2px solid ${phase.color}`,
        boxShadow: `0 0 16px ${phase.color}44`,
        minHeight: 160,
      }}
    >
      {/* Top color stripe */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: phase.color }} />

      {/* Checkpoint number badge */}
      <div
        className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black z-10"
        style={{ background: phase.color, color: '#fff', boxShadow: `0 0 8px ${phase.color}88` }}
      >
        {checkpointNumber}
      </div>

      {/* Phase header */}
      <div className="px-3 pt-2 pb-1 text-center">
        <div className="text-3xl mb-0.5">{phase.emoji}</div>
        <div className="font-black font-display text-xs tracking-wide uppercase leading-tight text-white">
          {phase.label}
        </div>
        <div className="text-[10px] leading-tight mt-0.5" style={{ color: `${phase.color}cc` }}>
          {phase.subtitle}
        </div>

        {/* Count badge */}
        <div
          className="inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: `${phase.color}22`,
            color: phase.color,
            border: `1px solid ${phase.color}44`,
          }}
        >
          {teams.length} {teams.length === 1 ? 'equipe' : 'equipes'}
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${phase.color}66, transparent)` }}
      />

      {/* Teams */}
      <div className="flex flex-wrap justify-center gap-1.5 p-2 flex-1">
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
          <div className="text-white/20 text-[10px] text-center self-center w-full italic">
            aguardando...
          </div>
        )}
      </div>

      {/* Final phase glow border */}
      {isFinal && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ border: `2px solid ${phase.color}`, boxShadow: `inset 0 0 20px ${phase.color}33` }}
        />
      )}
    </motion.div>
  );
}
