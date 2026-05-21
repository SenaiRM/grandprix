'use client';

import { motion } from 'framer-motion';
import { Phase, Team } from '@/types';
import TeamBubble from './TeamBubble';

interface PhaseNodeProps {
  phase: Phase;
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
  checkpointNumber: number;
}

const isWinner = (p: Phase) => p.index === 5;

function CheckeredStripe() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
      style={{
        backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)',
        backgroundSize: '10px 10px',
        opacity: 0.9,
      }}
    />
  );
}

export default function PhaseNode({ phase, teams, justAdvancedId, onTeamClick, checkpointNumber }: PhaseNodeProps) {
  const winner = isWinner(phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: checkpointNumber * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative flex flex-col rounded-2xl overflow-hidden flex-1"
      style={{
        background: winner
          ? 'linear-gradient(160deg, #1a1200 0%, #2a1f00 100%)'
          : 'linear-gradient(160deg, #0d1117 0%, #131929 100%)',
        border: `2px solid ${winner ? '#FFD700' : phase.color}`,
        boxShadow: winner
          ? '0 0 40px #FFD70066, 0 0 80px #FFD70022'
          : `0 0 20px ${phase.color}44`,
        minHeight: 180,
      }}
    >
      {winner && <CheckeredStripe />}

      {/* Checkpoint number badge */}
      <div
        className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-10"
        style={{
          background: winner ? '#FFD700' : phase.color,
          color: winner ? '#000' : '#fff',
          boxShadow: `0 0 8px ${winner ? '#FFD700' : phase.color}88`,
        }}
      >
        {checkpointNumber}
      </div>

      {/* Phase header */}
      <div className={`px-3 pt-3 pb-2 text-center ${winner ? 'pt-5' : ''}`}>
        <motion.div
          className="text-4xl mb-1"
          animate={winner ? { rotate: [0, -8, 8, -8, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        >
          {phase.emoji}
        </motion.div>
        <div
          className="font-black font-display text-sm tracking-wide uppercase leading-tight"
          style={{ color: winner ? '#FFD700' : 'white' }}
        >
          {phase.label}
        </div>
        {winner && (
          <div className="text-yellow-400/70 text-[10px] font-bold tracking-widest mt-0.5 uppercase">
            🏁 Linha de chegada
          </div>
        )}

        {/* Count badge */}
        <div
          className="inline-flex items-center justify-center mt-2 px-3 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: `${winner ? '#FFD700' : phase.color}22`,
            color: winner ? '#FFD700' : phase.color,
            border: `1px solid ${winner ? '#FFD700' : phase.color}44`,
          }}
        >
          {teams.length} {teams.length === 1 ? 'equipe' : 'equipes'}
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${winner ? '#FFD700' : phase.color}66, transparent)` }}
      />

      {/* Teams */}
      <div className="flex flex-wrap justify-center gap-2 p-3 flex-1">
        {teams.map((team) => (
          <TeamBubble
            key={team.id}
            team={team}
            onClick={() => onTeamClick(team)}
            isJustAdvanced={justAdvancedId === team.id}
          />
        ))}
        {teams.length === 0 && (
          <div className="text-white/20 text-[11px] text-center self-center w-full">
            — aguardando —
          </div>
        )}
      </div>
    </motion.div>
  );
}
