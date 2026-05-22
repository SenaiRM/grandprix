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

// Chevron arrows showing direction
function TrackArrows({ direction, color }: { direction: 'right' | 'left'; color: string }) {
  return (
    <div className={`flex items-center gap-0.5 flex-shrink-0 ${direction === 'left' ? 'flex-row-reverse' : ''}`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width="8" height="12" viewBox="0 0 10 14" style={{ opacity: 0.3 + i * 0.25 }}>
          {direction === 'right'
            ? <path d="M0 0L10 7L0 14Z" fill={color} />
            : <path d="M10 0L0 7L10 14Z" fill={color} />}
        </svg>
      ))}
    </div>
  );
}

// Left LARGADA column
function LargadaColumn() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 flex-shrink-0 px-1"
      style={{ width: 52 }}
    >
      {/* Semaphore lights */}
      <div className="flex flex-col gap-1.5">
        {['#ef4444', '#eab308', '#22c55e'].map((c, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{
              background: i === 2 ? c : '#ccc',
              boxShadow: i === 2 ? `0 0 8px ${c}` : 'none',
            }}
            animate={i === 2 ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* LARGADA label */}
      <div
        className="text-[9px] font-black tracking-widest uppercase leading-tight text-center"
        style={{ color: '#003087', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        LARGADA
      </div>

      {/* Checkered flag pattern */}
      <div
        className="w-full rounded"
        style={{
          height: 24,
          backgroundImage: 'repeating-conic-gradient(#333 0% 25%, #eee 0% 50%)',
          backgroundSize: '6px 6px',
        }}
      />
    </div>
  );
}

// Right Podium column
function Podium({ teams, onTeamClick }: { teams: Team[]; onTeamClick: (team: Team) => void }) {
  const podiumSlots = [
    { pos: 1, height: 52, color: '#FFD700', label: '1º' },
    { pos: 2, height: 36, color: '#C0C0C0', label: '2º' },
    { pos: 3, height: 26, color: '#CD7F32', label: '3º' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: 130,
        background: 'linear-gradient(160deg, #fffbea 0%, #fff8e1 100%)',
        border: '2px solid #FFD700aa',
        boxShadow: '0 4px 20px #FFD70033',
      }}
    >
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FFD700, #F26522)' }} />
      <div className="px-2 pt-2 pb-1 text-center">
        <div className="text-2xl">🏆</div>
        <div className="text-[9px] font-black tracking-widest uppercase text-yellow-700 leading-tight">
          Pódio da Inovação
        </div>
        <div className="text-[8px] text-yellow-600/70 tracking-wider uppercase leading-tight mt-0.5">
          Equipes destaque
        </div>
      </div>
      <div className="mx-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, #FFD70066, transparent)' }} />

      {teams.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[10px] text-yellow-600/40 italic px-2 text-center py-4">
          aguardando finalistas...
        </div>
      ) : (
        <div className="flex flex-col gap-1 p-2 flex-1">
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
                      style={{
                        height: slot.height * 0.4,
                        background: slot.color + '33',
                        color: slot.color,
                        border: `1px solid ${slot.color}66`,
                      }}
                    >
                      {slot.label}
                    </div>
                  </div>
                ))}
            </div>
          )}
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
  const finalists = teams.filter((t) => t.currentPhase === 5);

  return (
    // Outer track road (dark rounded rectangle)
    <div
      className="flex-1 flex flex-col min-h-0 mx-3 my-2"
      style={{
        background: '#1a1a2e',
        borderRadius: 72,
        padding: '12px 14px',
      }}
    >
      {/* Inner infield (white content area) */}
      <div
        className="flex-1 flex flex-col min-h-0"
        style={{
          background: '#f5f7fb',
          borderRadius: 60,
          border: '2px dashed rgba(255,255,255,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Direction labels row */}
        <div className="flex items-center justify-between px-6 pt-2 pb-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-blue-800/50">
              🏎️ pista principal
            </span>
            <div className="flex gap-0.5">
              {PHASES.slice(0, 3).map((p) => (
                <TrackArrows key={p.key} direction="right" color={p.color} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {PHASES.slice(3).map((p) => (
                <TrackArrows key={p.key} direction="left" color={p.color} />
              ))}
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-orange-600/50">
              volta final 🏁
            </span>
          </div>
        </div>

        {/* Main phases row */}
        <div className="flex flex-1 min-h-0 gap-2 px-4 pb-4 pt-1">
          <LargadaColumn />

          {PHASES.map((phase) => (
            <PhaseNode
              key={phase.key}
              phase={phase}
              teams={teams.filter((t) => t.currentPhase === phase.index)}
              justAdvancedId={justAdvancedId}
              onTeamClick={onTeamClick}
              checkpointNumber={phase.index + 1}
            />
          ))}

          <AnimatePresence>
            <Podium teams={finalists} onTeamClick={onTeamClick} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
