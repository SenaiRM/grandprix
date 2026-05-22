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

  const totalTeams = state.teams.length;
  const maxPhase   = state.teams.reduce((m, t) => Math.max(m, t.currentPhase), 0);
  const winners    = state.teams.filter(t => t.currentPhase === 5);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-body select-none"
      style={{ background: '#eef1f8' }}
    >
      {/* Top checkered stripe */}
      <div
        className="h-2 w-full flex-shrink-0"
        style={{
          backgroundImage: 'repeating-conic-gradient(#F26522 0% 25%, #003087 0% 50%)',
          backgroundSize: '16px 8px',
        }}
      />

      {/* Header */}
      <header
        className="relative flex items-center px-6 py-2 flex-shrink-0 gap-6 bg-white"
        style={{ borderBottom: '2px solid #003087' }}
      >
        {/* Logo / title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-3xl">🏎️</span>
          <div>
            <div className="font-black font-display tracking-wider uppercase leading-none"
              style={{ fontSize: '1.35rem', color: '#003087' }}
            >
              Grand Prix <span style={{ color: '#F26522' }}>SENAI</span>
            </div>
            <div className="text-gray-400 text-xs tracking-widest uppercase mt-0.5">
              de Inovação · Fac. Roberto Mange · 22–29 Mai 2026
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-10 w-px bg-gray-200 flex-shrink-0" />

        {/* Stats */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900 leading-none">{totalTeams}</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-widest">equipes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black leading-none" style={{ color: '#F26522' }}>{maxPhase}</div>
            <div className="text-gray-400 text-[10px] uppercase tracking-widest">fase máx.</div>
          </div>
          {winners.length > 0 && (
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-500 leading-none">{winners.length}</div>
              <div className="text-gray-400 text-[10px] uppercase tracking-widest">finalista{winners.length > 1 ? 's' : ''}</div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest">
            <span>largada</span>
            <span>progresso do circuito</span>
            <span>linha de chegada</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: totalTeams > 0 ? `${(state.teams.reduce((s, t) => s + t.currentPhase, 0) / (totalTeams * 5)) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #003087, #F26522, #FFD700)',
                boxShadow: '0 0 6px #F2652266',
              }}
            />
          </div>
        </div>

        {/* Live + admin */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ao vivo
          </div>
          <a href="/admin" className="text-gray-300 hover:text-gray-500 text-xs transition-colors">admin</a>
        </div>
      </header>

      {/* Race board */}
      <main className="relative flex-1 min-h-0 flex overflow-hidden">
        <RaceTrackBoard
          teams={state.teams}
          justAdvancedId={state.justAdvancedId}
          onTeamClick={(team) => dispatch({ type: 'SELECT_TEAM', team })}
        />
      </main>

      {/* "CORRA. INOVE. TRANSFORME." banner */}
      <div
        className="flex-shrink-0 flex items-center justify-center py-1.5 bg-white"
        style={{ borderTop: '3px solid #F26522' }}
      >
        <p className="font-black font-display tracking-[0.2em] uppercase text-sm text-gray-900">
          CORRA.{' '}
          <span style={{ color: '#F26522', fontStyle: 'italic' }}>INOVE.</span>
          {' '}TRANSFORME.
        </p>
      </div>

      {/* Sponsors bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-8 py-1.5 bg-white"
        style={{ borderTop: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Apoio:</span>
          <span className="font-black text-sm tracking-wide" style={{ color: '#003087' }}>VITAMEDIC</span>
          <span className="text-gray-300">|</span>
          <span className="font-black text-sm tracking-wide" style={{ color: '#003087' }}>SEBRAE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Realização:</span>
          <span className="font-black text-base tracking-wider" style={{ color: '#003087' }}>
            SENAI<span style={{ color: '#F26522' }}>.</span>
          </span>
        </div>
      </div>

      {/* Bottom checkered stripe */}
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{
          backgroundImage: 'repeating-conic-gradient(#F26522 0% 25%, #003087 0% 50%)',
          backgroundSize: '12px 6px',
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
