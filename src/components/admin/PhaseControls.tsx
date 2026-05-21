'use client';

import { useState } from 'react';
import { Team } from '@/types';
import { PHASES } from '@/lib/phases';

interface PhaseControlsProps {
  team: Team;
  onUpdate: (updated: Team) => void;
}

export default function PhaseControls({ team, onUpdate }: PhaseControlsProps) {
  const [loading, setLoading] = useState<'advance' | 'retreat' | null>(null);
  const phase = PHASES[team.currentPhase];

  async function move(direction: 'advance' | 'retreat') {
    setLoading(direction);
    try {
      const res = await fetch(`/api/teams/${team.id}/${direction}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) onUpdate(data.team);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => move('retreat')}
        disabled={team.currentPhase <= 0 || loading !== null}
        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
        title="Retroceder fase"
      >
        ← Voltar
      </button>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 min-w-[140px] justify-center">
        <span>{phase.emoji}</span>
        <span className="text-sm text-white font-medium">{phase.label}</span>
      </div>

      <button
        onClick={() => move('advance')}
        disabled={team.currentPhase >= 5 || loading !== null}
        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
        title="Avançar fase"
      >
        Avançar →
      </button>
    </div>
  );
}
