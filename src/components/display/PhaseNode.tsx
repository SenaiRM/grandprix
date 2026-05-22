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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: checkpointNumber * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex flex-col flex-1 bg-white overflow-hidden"
      style={{
        border: `2px solid ${phase.color}`,
        borderRadius: 12,
        boxShadow: isFinal
          ? `0 0 18px ${phase.color}55, 0 2px 12px rgba(0,0,0,0.12)`
          : '0 2px 12px rgba(0,0,0,0.10)',
        minHeight: 140,
      }}
    >
      {/* Top color stripe */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: phase.color }} />

      {/* Phase header */}
      <div className="px-2 pt-2 pb-1 flex flex-col items-center">
        {/* Icon circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm mb-1"
          style={{ background: phase.color }}
        >
          {phase.emoji}
        </div>

        {/* Checkpoint number badge */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-white -mt-1 mb-1 shadow-sm"
          style={{ background: phase.color, border: '2px solid white' }}
        >
          {checkpointNumber}
        </div>

        {/* Phase name */}
        <div className="font-black font-display text-[11px] tracking-wide uppercase leading-tight text-gray-900 text-center">
          {phase.label}
        </div>

        {/* Subtitle */}
        <div className="text-[9px] leading-tight mt-0.5 text-center" style={{ color: phase.color }}>
          {phase.subtitle}
        </div>

        {/* Count badge */}
        <div
          className="inline-flex items-center justify-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: `${phase.color}18`,
            color: phase.color,
            border: `1px solid ${phase.color}44`,
          }}
        >
          {teams.length} {teams.length === 1 ? 'equipe' : 'equipes'}
        </div>
      </div>

      {/* EQUIPES divider */}
      <div className="mx-2 flex items-center gap-1.5 my-1">
        <div className="flex-1 h-px" style={{ background: `${phase.color}30` }} />
        <div
          className="text-[8px] font-black tracking-widest uppercase"
          style={{ color: `${phase.color}99` }}
        >
          equipes
        </div>
        <div className="flex-1 h-px" style={{ background: `${phase.color}30` }} />
      </div>

      {/* Teams */}
      <div className="flex flex-wrap justify-center gap-1.5 p-2 flex-1 content-start">
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
          <div className="text-gray-300 text-[10px] text-center self-center w-full italic pt-2">
            aguardando...
          </div>
        )}
      </div>

      {/* Final phase pulse border */}
      {isFinal && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 10, border: `2px solid ${phase.color}` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.div>
  );
}
