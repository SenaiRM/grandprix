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
      return {
        ...state,
        teams: state.teams.map((t) => (t.id === updated.id ? updated : t)),
      };
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
      try {
        dispatch(JSON.parse(e.data));
      } catch {
        // ignore malformed events
      }
    };
    es.onerror = () => {
      // EventSource auto-reconnects on error
    };
    return () => es.close();
  }, []);

  const clearCelebration = useCallback(() => dispatch({ type: 'CLEAR_CELEBRATION' }), []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-body"
      style={{ background: 'linear-gradient(180deg, #001a4d 0%, #003087 100%)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏎️</span>
          <div>
            <h1 className="text-white font-bold font-display text-xl leading-tight">
              Grand Prix SENAI de Inovação
            </h1>
            <p className="text-white/50 text-xs">Faculdade SENAI Roberto Mange · 22–29 de Maio de 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white/60 text-sm">{state.teams.length} equipes</div>
          <a
            href="/admin"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            admin
          </a>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 min-h-0 pt-4 overflow-hidden">
        <RaceTrackBoard
          teams={state.teams}
          justAdvancedId={state.justAdvancedId}
          onTeamClick={(team) => dispatch({ type: 'SELECT_TEAM', team })}
        />
      </main>

      {/* Popups & overlays */}
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
