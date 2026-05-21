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
    case 'INIT':
      return { ...state, teams: action.teams };
    case 'TEAM_ADVANCED': {
      const updated = action.payload as Team;
      return {
        ...state,
        teams: state.teams.map((t) => (t.id === updated.id ? updated : t)),
        justAdvancedId: updated.id,
        celebrationTeam: updated,
        celebrationPhase: getPhase(updated.currentPhase),
      };
    }
    case 'TEAM_RETREATED':
    case 'TEAM_UPDATED': {
      const updated = action.payload as Team;
      return { ...state, teams: state.teams.map((t) => (t.id === updated.id ? updated : t)) };
    }
    case 'TEAM_CREATED': {
      const created = action.payload as Team;
      return { ...state, teams: [...state.teams, created] };
    }
    case 'TEAM_DELETED': {
      const { id } = action.payload as { id: string };
      return { ...state, teams: state.teams.filter((t) => t.id !== id) };
    }
    case 'CLEAR_CELEBRATION':
      return { ...state, justAdvancedId: null, celebrationTeam: null, celebrationPhase: null };
    case 'SELECT_TEAM':
      return { ...state, selectedTeam: action.team };
    default:
      return state;
  }
}

export default function DisplayPage() {
  const [state, dispatch] = useReducer(reducer, {
    teams: [],
    justAdvancedId: null,
    celebrationTeam: null,
    celebrationPhase: null,
    selectedTeam: null,
  });

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then(({ teams }) => dispatch({ type: 'INIT', teams }))
      .catch(console.error);

    const es = new EventSource('/api/sse');
    es.onmessage = (e) => {
      try { dispatch(JSON.parse(e.data)); } catch { /* ignore */ }
    };
    return () => es.close();
  }, []);

  const clearCelebration = useCallback(() => dispatch({ type: 'CLEAR_CELEBRATION' }), []);

  const totalTeams = state.teams.length;
  const advancedTeams = state.teams.filter((t) => t.currentPhase > 0).length;

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-body select-none"
      style={{ background: 'radial-gradient(ellipse at top, #001a5c 0%, #000d2e 60%, #000510 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(242,101,34,0.2)' }}
      >
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏎️</div>
          <div>
            <h1 className="font-bold font-display text-xl leading-tight"
              style={{ color: '#F26522' }}
            >
              Grand Prix SENAI de Inovação
            </h1>
            <p className="text-white/40 text-xs">Faculdade SENAI Roberto Mange · 22–29 de Maio de 2026</p>
          </div>
        </div>

        {/* Center: race progress bar */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-sm mx-8">
          <div className="text-white/40 text-xs mb-0.5">progresso geral</div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: totalTeams > 0 ? `${(advancedTeams / totalTeams) * 100}%` : '0%',
                background: 'linear-gradient(90deg, #F26522, #FFD700)',
              }}
            />
          </div>
          <div className="text-white/40 text-xs">{advancedTeams}/{totalTeams} avançaram</div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            ao vivo
          </div>
          <a href="/admin" className="text-white/20 hover:text-white/50 text-xs transition-colors">
            admin
          </a>
        </div>
      </header>

      {/* Race track title */}
      <div className="relative z-10 text-center pt-3 pb-1 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{ background: 'rgba(242,101,34,0.12)', border: '1px solid rgba(242,101,34,0.3)', color: '#F26522' }}
        >
          🏁 Circuito de Inovação · {totalTeams} equipes competindo
        </div>
      </div>

      {/* Board */}
      <main className="relative z-10 flex-1 min-h-0 flex overflow-hidden">
        <RaceTrackBoard
          teams={state.teams}
          justAdvancedId={state.justAdvancedId}
          onTeamClick={(team) => dispatch({ type: 'SELECT_TEAM', team })}
        />
      </main>

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
