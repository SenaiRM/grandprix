'use client';

import { useEffect, useReducer, useCallback } from 'react';
import { Team, SSEEvent, Phase } from '@/types';
import { getPhase } from '@/lib/phases';
import RaceTrackBoard from '@/components/display/RaceTrackBoard';
import TeamMemberPopup from '@/components/display/TeamMemberPopup';
import CelebrationOverlay from '@/components/display/CelebrationOverlay';

interface State {
  teams: Team[];
  justAdvancedId: string | null;
  celebrationTeam: Team | null;
  celebrationPhase: Phase | null;
  selectedTeam: Team | null;
}

type Action =
  | { type: 'INIT'; teams: Team[] }
  | SSEEvent
  | { type: 'CLEAR_CELEBRATION' }
  | { type: 'SELECT_TEAM'; team: Team | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':         return { ...state, teams: action.teams };
    case 'TEAM_ADVANCED': {
      const updated = action.payload as Team;
      return { ...state, teams: state.teams.map(t => t.id === updated.id ? updated : t),
        justAdvancedId: updated.id, celebrationTeam: updated, celebrationPhase: getPhase(updated.currentPhase) };
    }
    case 'TEAM_RETREATED':
    case 'TEAM_UPDATED': {
      const updated = action.payload as Team;
      return { ...state, teams: state.teams.map(t => t.id === updated.id ? updated : t) };
    }
    case 'TEAM_CREATED': return { ...state, teams: [...state.teams, action.payload as Team] };
    case 'TEAM_DELETED': return { ...state, teams: state.teams.filter(t => t.id !== (action.payload as {id:string}).id) };
    case 'CLEAR_CELEBRATION': return { ...state, justAdvancedId: null, celebrationTeam: null, celebrationPhase: null };
    case 'SELECT_TEAM':  return { ...state, selectedTeam: action.team };
    default:             return state;
  }
}

export default function DisplayPage() {
  const [state, dispatch] = useReducer(reducer, {
    teams: [], justAdvancedId: null, celebrationTeam: null, celebrationPhase: null, selectedTeam: null,
  });

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).then(({ teams }) => dispatch({ type: 'INIT', teams })).catch(console.error);
    const es = new EventSource('/api/sse');
    es.onmessage = e => { try { dispatch(JSON.parse(e.data)); } catch { /* ignore */ } };
    return () => es.close();
  }, []);

  const clearCelebration = useCallback(() => dispatch({ type: 'CLEAR_CELEBRATION' }), []);

  const totalTeams   = state.teams.length;
  const maxPhase     = state.teams.reduce((m, t) => Math.max(m, t.currentPhase), 0);
  const winners      = state.teams.filter(t => t.currentPhase === 5);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-body select-none"
      style={{ background: '#050810' }}
    >
      {/* Speed lines background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent 0px, transparent 119px, rgba(242,101,34,0.03) 120px),
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,48,135,0.4) 0%, transparent 70%)
          `,
        }}
      />

      {/* Top checkered stripe */}
      <div
        className="h-2 w-full flex-shrink-0 relative z-10"
        style={{
          backgroundImage: 'repeating-conic-gradient(#F26522 0% 25%, #003087 0% 50%)',
          backgroundSize: '16px 8px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center px-6 py-3 flex-shrink-0 gap-6"
        style={{ borderBottom: '1px solid rgba(242,101,34,0.25)' }}
      >
        {/* Logo / title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-4xl">🏎️</span>
          <div>
            <div className="font-black font-display tracking-wider uppercase leading-none"
              style={{ fontSize: '1.5rem', color: '#F26522', textShadow: '0 0 20px #F2652266' }}
            >
              Grand Prix SENAI
            </div>
            <div className="text-white/40 text-xs tracking-widest uppercase mt-0.5">
              de Inovação · Fac. Roberto Mange · 22–29 Mai 2026
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-10 w-px bg-white/10 flex-shrink-0" />

        {/* Stats */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-white leading-none">{totalTeams}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest">equipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black leading-none" style={{ color: '#F26522' }}>{maxPhase}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest">fase máx.</div>
          </div>
          {winners.length > 0 && (
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-400 leading-none">{winners.length}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest">finalista{winners.length > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest">
            <span>largada</span>
            <span>progresso do circuito</span>
            <span>linha de chegada</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: totalTeams > 0 ? `${(state.teams.reduce((s,t) => s + t.currentPhase, 0) / (totalTeams * 5)) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #003087, #F26522, #FFD700)',
                boxShadow: '0 0 8px #F2652288',
              }}
            />
          </div>
        </div>

        {/* Live + admin */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#4ade80' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            ao vivo
          </div>
          <a href="/admin" className="text-white/20 hover:text-white/50 text-xs transition-colors">admin</a>
        </div>
      </header>

      {/* Race board */}
      <main className="relative z-10 flex-1 min-h-0 flex overflow-hidden">
        <RaceTrackBoard
          teams={state.teams}
          justAdvancedId={state.justAdvancedId}
          onTeamClick={(team) => dispatch({ type: 'SELECT_TEAM', team })}
        />
      </main>

      {/* Bottom checkered stripe */}
      <div
        className="h-1 w-full flex-shrink-0 relative z-10"
        style={{
          backgroundImage: 'repeating-conic-gradient(#F26522 0% 25%, #003087 0% 50%)',
          backgroundSize: '12px 4px',
          opacity: 0.6,
        }}
      />

      <TeamMemberPopup
        team={state.selectedTeam}
        onClose={() => dispatch({ type: 'SELECT_TEAM', team: null })}
      />
      <CelebrationOverlay
        teamName={state.celebrationTeam?.name ?? null}
        targetPhase={state.celebrationPhase}
        onComplete={clearCelebration}
      />
    </div>
  );
}
