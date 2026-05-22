'use client';

import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseNode from './PhaseNode';
import TeamBubble from './TeamBubble';
import { AnimatePresence, motion } from 'framer-motion';

interface RaceTrackBoardProps {
  teams: Team[];
  justAdvancedId: string | null;
  onTeamClick: (team: Team) => void;
}

// Chevron arrows showing direction of travel
function TrackArrows({ direction, color }: { direction: 'right' | 'left'; color: string }) {
  return (
    <div className={`flex items-center gap-0.5 flex-shrink-0 px-1 ${direction === 'left' ? 'flex-row-reverse' : ''}`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width="10" height="14" viewBox="0 0 10 14" style={{ opacity: 0.3 + i * 0.25 }}>
          {direction === 'right'
            ? <path d="M0 0L10 7L0 14Z" fill={color} />
            : <path d="M10 0L0 7L10 14Z" fill={color} />}
        </svg>
      ))}
    </div>
  );
}

// Vertical connector (PIT STOP side)
function PitStopConnector() {
  return (
    <div
      className="flex flex-col items-center justify-between py-2 px-1 rounded-lg flex-shrink-0"
      style={{ width: 48, background: '#0a0a0a', border: '1px solid #F2652244', minHeight: '100%' }}
    >
      <div className="text-[8px] font-black tracking-widest uppercase text-orange-500/60 rotate-90 whitespace-nowrap mt-4">
        PIT STOP
      </div>
      {/* Dashed line */}
      <div className="flex flex-col items-center gap-1 flex-1 py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-0.5 h-3 rounded" style={{ background: '#F2652244' }} />
        ))}
      </div>
      <div className="flex items-center gap-0.5 mb-2">
        <svg width="10" height="14" viewBox="0 0 10 14">
          <path d="M5 14L0 0H10L5 14Z" fill="#F26522" fillOpacity="0.7" />
        </svg>
      </div>
    </div>
  );
}

// LARGADA arch (left side)
function LargadaArch() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 flex-shrink-0 px-1 rounded-lg"
      style={{ width: 44, background: '#0a0a0a', border: '1px solid #1D4ED844' }}
    >
      {/* Semaphore lights */}
      <div className="flex flex-col gap-1">
        {['#ef4444', '#eab308', '#22c55e'].map((c, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ background: i === 2 ? c : '#333', boxShadow: i === 2 ? `0 0 6px ${c}` : 'none' }}
            animate={i === 2 ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
          />
        ))}
      </div>
      <div
        className="text-[7px] font-black tracking-widest uppercase text-center leading-tight"
        style={{ color: '#1D4ED8', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        LARGADA
      </div>
      {/* Checkered pattern */}
      <div
        className="w-full h-4 rounded"
        style={{
          backgroundImage: 'repeating-conic-gradient(#222 0% 25%, #eee 0% 50%)',
          backgroundSize: '6px 6px',
        }}
      />
    </div>
  );
}

// Podium for finalist teams (phase 5)
function Podium({ teams, onTeamClick }: { teams: Team[]; onTeamClick: (team: Team) => void }) {
  const podiumSlots = [
    { pos: 1, height: 60, color: '#FFD700', label: '1º' },
    { pos: 2, height: 40, color: '#C0C0C0', label: '2º' },
    { pos: 3, height: 28, color: '#CD7F32', label: '3º' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: 140,
        background: 'linear-gradient(160deg, #1a1200 0%, #0d0d00 100%)',
        border: '2px solid #FFD700aa',
        boxShadow: '0 0 30px #FFD70044',
      }}
    >
      {/* Header */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FFD700, #F26522)' }} />
      <div className="px-2 pt-2 pb-1 text-center">
        <div className="text-2xl">🏆</div>
        <div className="text-[9px] font-black tracking-widest uppercase text-yellow-400 leading-tight">
          Pódio da Inovação
        </div>
        <div className="text-[8px] text-yellow-400/50 tracking-wider uppercase leading-tight mt-0.5">
          Equipes destaque
        </div>
      </div>
      <div className="mx-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, #FFD70066, transparent)' }} />

      {teams.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[10px] text-yellow-400/30 italic px-2 text-center py-4">
          aguardando finalistas...
        </div>
      ) : (
        <div className="flex flex-col gap-1 p-2 flex-1">
          {/* Podium visual - first 3 */}
          {teams.length >= 1 && (
            <div className="flex items-end justify-center gap-1 mb-1">
              {[
                { idx: 1, slot: podiumSlots[1] },
                { idx: 0, slot: podiumSlots[0] },
                { idx: 2, slot: podiumSlots[2] },
              ]
                .filter(({ idx }) => teams[idx])
                .map(({ idx, slot }) => (
                  <div key={slot.pos} className="flex flex-col items-center gap-0.5">
                    <TeamBubble
                      team={teams[idx]}
                      onClick={() => onTeamClick(teams[idx])}
                      isJustAdvanced={false}
                    />
                    <div
                      className="w-10 rounded-sm flex items-center justify-center text-[9px] font-black"
                      style={{ height: slot.height * 0.4, background: slot.color + '33', color: slot.color, border: `1px solid ${slot.color}66` }}
                    >
                      {slot.label}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {/* Extra teams beyond 3 */}
          {teams.slice(3).map((team) => (
            <div key={team.id} className="flex items-center gap-1">
              <TeamBubble team={team} onClick={() => onTeamClick(team)} isJustAdvanced={false} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function RaceTrackBoard({ teams, justAdvancedId, onTeamClick }: RaceTrackBoardProps) {
  // Top row: phases 0 → 1 → 2 (left to right)
  // Bottom row: phases 5 ← 4 ← 3 (displayed as [5][4][3], snake right-to-left)
  const topPhases    = [PHASES[0], PHASES[1], PHASES[2]];
  const bottomPhases = [PHASES[5], PHASES[4], PHASES[3]];
  const finalists    = teams.filter((t) => t.currentPhase === 5);

  return (
    <div className="flex-1 flex gap-2 px-3 py-2 min-h-0 overflow-hidden">

      {/* LARGADA arch */}
      <LargadaArch />

      {/* Main circuit */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">

        {/* Top row label */}
        <div className="flex items-center gap-1 px-1">
          <div className="text-[9px] font-black tracking-widest uppercase text-blue-400/60">
            🏎️ pista principal
          </div>
          <div className="flex items-center gap-0.5 ml-1">
            {topPhases.map((p) => (
              <TrackArrows key={p.key} direction="right" color={p.color} />
            ))}
          </div>
        </div>

        {/* Top row: phases 0 → 1 → 2 */}
        <div className="flex gap-2 flex-1 min-h-0" style={{ flex: '1 1 0' }}>
          {topPhases.map((phase, i) => (
            <div key={phase.key} className="flex-1 flex min-w-0">
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                checkpointNumber={i + 1}
              />
            </div>
          ))}
        </div>

        {/* Bottom row label */}
        <div className="flex items-center gap-1 px-1 flex-row-reverse">
          <div className="text-[9px] font-black tracking-widest uppercase text-orange-400/60">
            🏁 volta final
          </div>
          <div className="flex items-center gap-0.5 mr-1">
            {bottomPhases.map((p) => (
              <TrackArrows key={p.key} direction="left" color={p.color} />
            ))}
          </div>
        </div>

        {/* Bottom row: phases 5 ← 4 ← 3 */}
        <div className="flex gap-2 flex-1 min-h-0" style={{ flex: '1 1 0' }}>
          {bottomPhases.map((phase, i) => (
            <div key={phase.key} className="flex-1 flex min-w-0">
              <PhaseNode
                phase={phase}
                teams={teams.filter((t) => t.currentPhase === phase.index)}
                justAdvancedId={justAdvancedId}
                onTeamClick={onTeamClick}
                checkpointNumber={6 - i}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right side: PIT STOP connector + Pódio */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <PitStopConnector />
        <AnimatePresence>
          <Podium teams={finalists} onTeamClick={onTeamClick} />
        </AnimatePresence>
      </div>
    </div>
  );
}
