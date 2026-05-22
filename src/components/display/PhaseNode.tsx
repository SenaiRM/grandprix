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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: checkpointNumber * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
      className="relative flex flex-col flex-1 bg-white overflow-hidden"
      style={{
        border: `2px solid ${phase.color}`,
        borderRadius: 10,
        boxShadow: isFinal
          ? `0 0 16px ${phase.color}44, 0 2px 10px rgba(0,0,0,0.10)`
          : '0 2px 10px rgba(0,0,0,0.08)',
        minHeight: 120,
      }}
    >
      {/* Top color stripe */}
      <div className="h-1 w-full flex-shrink-0" style={{ background: phase.color }} />

      {/* Header row: number + name + icon */}
      <div className="flex items-start justify-between px-2 pt-2 gap-1">
        {/* Left: number + name block */}
        <div className="flex items-start gap-1.5 min-w-0">
          {/* Checkpoint number */}
          <span
            className="font-black leading-none flex-shrink-0"
            style={{ fontSize: '1.75rem', color: phase.color, lineHeight: 1 }}
          >
            {checkpointNumber}
          </span>
          <div className="min-w-0 pt-0.5">
            <div
              className="font-black font-display uppercase leading-tight"
              style={{ fontSize: '0.72rem', color: phase.color, letterSpacing: '0.04em' }}
            >
              {phase.label}
            </div>
            <div className="text-gray-600 uppercase font-semibold leading-tight" style={{ fontSize: '0.6rem', letterSpacing: '0.03em' }}>
              {phase.subtitle}
            </div>
          </div>
        </div>

        {/* Right: icon circle */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-4xl flex-shrink-0 shadow-sm"
          style={{ background: phase.color }}
        >
          {phase.emoji}
        </div>
      </div>

      {/* Description */}
      <p className="px-2 pt-1 pb-1 text-gray-500 leading-snug" style={{ fontSize: '0.62rem' }}>
        {phase.description}
      </p>

      {/* EQUIPES divider */}
      <div className="mx-2 flex items-center gap-1.5 mb-1">
        <div className="flex-1 h-px" style={{ background: `${phase.color}40` }} />
        <div
          className="font-black tracking-widest uppercase"
          style={{ fontSize: '0.6rem', color: phase.color }}
        >
          equipes
        </div>
        <div className="flex-1 h-px" style={{ background: `${phase.color}40` }} />
      </div>

      {/* Teams */}
      <div className="flex flex-wrap justify-center gap-1.5 px-2 pb-2 flex-1 content-start">
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
          <div className="text-gray-300 text-[10px] text-center self-center w-full italic pt-1">
            aguardando...
          </div>
        )}
      </div>

      {/* Final phase pulse border */}
      {isFinal && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 8, border: `2px solid ${phase.color}` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.div>
  );
}
