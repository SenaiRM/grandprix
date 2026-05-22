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

function TrackArrows({ direction, colors }: { direction: 'right' | 'left'; colors: string[] }) {
  return (
    <div className={`flex items-center gap-2 flex-shrink-0 ${direction === 'left' ? 'flex-row-reverse' : ''}`}>
      {colors.map((color, gi) => (
        <div key={gi} className={`flex items-center gap-0.5 ${direction === 'left' ? 'flex-row-reverse' : ''}`}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width="9" height="13" viewBox="0 0 10 14" style={{ opacity: 0.35 + i * 0.2 }}>
              {direction === 'right'
                ? <path d="M0 0L10 7L0 14Z" fill={color} />
                : <path d="M10 0L0 7L10 14Z" fill={color} />}
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

// Left LARGADA column (inside top oval)
function LargadaColumn() {
  return (
    <div
      className="flex flex-col items-center justify-between py-2 px-1 flex-shrink-0"
      style={{ width: 44 }}
    >
      <div className="flex flex-col gap-1.5">
        {['#ef4444', '#eab308', '#22c55e'].map((c, i) => (
          <motion.div
            key={i}
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: i === 2 ? c : '#ccc', boxShadow: i === 2 ? `0 0 6px ${c}` : 'none' }}
            animate={i === 2 ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div
        className="text-[8px] font-black tracking-widest uppercase text-center"
        style={{ color: '#003087', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        LARGADA
      </div>

      <div
        className="w-full rounded"
        style={{
          height: 20,
          backgroundImage: 'repeating-conic-gradient(#444 0% 25%, #eee 0% 50%)',
          backgroundSize: '6px 6px',
        }}
      />
    </div>
  );
}

// Right PIT STOP banner (inside top oval, right side)
function PitStopBanner() {
  return (
    <div
      className="flex flex-col items-center justify-center flex-shrink-0 rounded-lg py-2 px-1"
      style={{ width: 28, background: '#1a56db', minHeight: '100%' }}
    >
      <div
        className="font-black tracking-widest uppercase text-white"
        style={{ fontSize: '0.5rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.15em' }}
      >
        PIT STOP
      </div>
    </div>
  );
}

// Podium for finalist teams
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
      className="flex flex-col rounded-xl overflow-hidden flex-shrink-0 flex-1"
      style={{
        width: 130,
        background: 'linear-gradient(160deg, #0d0d1a 0%, #1a1230 100%)',
        border: '2px solid #FFD700aa',
        boxShadow: '0 4px 24px #FFD70033',
      }}
    >
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FFD700, #F26522)' }} />
      <div className="px-2 pt-2 pb-1 text-center">
        <div className="text-2xl">🏆</div>
        <div className="text-[9px] font-black tracking-widest uppercase text-yellow-400 leading-tight">
          Pódio da Inovação
        </div>
        <div className="text-[8px] text-yellow-400/50 tracking-wider uppercase leading-tight mt-0.5">
          Equipes destaque do Grand Prix
        </div>
      </div>
      <div className="mx-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, #FFD70055, transparent)' }} />

      {teams.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[10px] text-yellow-400/30 italic px-2 text-center py-4">
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
                      style={{ height: slot.height * 0.38, background: slot.color + '33', color: slot.color, border: `1px solid ${slot.color}66` }}
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

// One oval track (road wrapper + white infield)
function OvalTrack({
  topArrowColors,
  bottomArrowColors,
  topLabel,
  bottomLabel,
  children,
}: {
  topArrowColors: string[];
  bottomArrowColors: string[];
  topLabel: React.ReactNode;
  bottomLabel: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col"
      style={{ background: '#1a1a2e', borderRadius: 64, padding: '10px 12px' }}
    >
      {/* Top road: label + arrows */}
      <div className="flex items-center justify-between px-3 py-1">
        {topLabel}
        <TrackArrows direction="right" colors={topArrowColors} />
      </div>

      {/* White infield */}
      <div
        className="flex gap-1.5 px-3 py-2"
        style={{ background: '#f5f7fb', borderRadius: 52, minHeight: 0 }}
      >
        {children}
      </div>

      {/* Bottom road: arrows + label */}
      <div className="flex items-center justify-between px-3 py-1">
        <TrackArrows direction="left" colors={bottomArrowColors} />
        {bottomLabel}
      </div>
    </div>
  );
}

export default function RaceTrackBoard({ teams, justAdvancedId, onTeamClick }: RaceTrackBoardProps) {
  const topPhases    = [PHASES[0], PHASES[1], PHASES[2]];
  const bottomPhases = [PHASES[3], PHASES[4], PHASES[5]];
  const finalists    = teams.filter((t) => t.currentPhase === 5);

  return (
    <div className="flex-1 flex gap-2 px-3 py-2 min-h-0 overflow-hidden">

      {/* Two ovals stacked */}
      <div className="flex-1 flex flex-col gap-2 min-w-0 min-h-0">

        {/* TOP OVAL: phases 0, 1, 2 */}
        <OvalTrack
          topLabel={
            <span className="text-[9px] font-black tracking-widest uppercase text-white/50">
              🏎️ pista principal
            </span>
          }
          topArrowColors={topPhases.map((p) => p.color)}
          bottomArrowColors={['#F26522', '#F26522', '#F26522']}
          bottomLabel={
            <span className="text-[9px] font-black tracking-widest uppercase text-white/30">
              retorno
            </span>
          }
        >
          <LargadaColumn />
          {topPhases.map((phase) => (
            <PhaseNode
              key={phase.key}
              phase={phase}
              teams={teams.filter((t) => t.currentPhase === phase.index)}
              justAdvancedId={justAdvancedId}
              onTeamClick={onTeamClick}
              checkpointNumber={phase.index + 1}
            />
          ))}
          <PitStopBanner />
        </OvalTrack>

        {/* BOTTOM OVAL: phases 3, 4, 5 */}
        <OvalTrack
          topLabel={
            <span className="text-[9px] font-black tracking-widest uppercase text-white/50">
              ⚡ segunda volta
            </span>
          }
          topArrowColors={bottomPhases.map((p) => p.color)}
          bottomArrowColors={['#F26522', '#F26522', '#F26522']}
          bottomLabel={
            <span className="text-[9px] font-black tracking-widest uppercase text-white/30">
              🏁 linha de chegada
            </span>
          }
        >
          {bottomPhases.map((phase) => (
            <PhaseNode
              key={phase.key}
              phase={phase}
              teams={teams.filter((t) => t.currentPhase === phase.index)}
              justAdvancedId={justAdvancedId}
              onTeamClick={onTeamClick}
              checkpointNumber={phase.index + 1}
            />
          ))}
        </OvalTrack>

      </div>

      {/* Right side: Pódio — altura equivalente às duas ovals */}
      <div className="self-stretch flex flex-col">
        <AnimatePresence>
          <Podium teams={finalists} onTeamClick={onTeamClick} />
        </AnimatePresence>
      </div>

    </div>
  );
}
