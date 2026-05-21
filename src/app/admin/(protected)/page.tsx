'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseControls from '@/components/admin/PhaseControls';

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTeams(data.teams ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar equipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  function handleTeamUpdate(updated: Team) {
    setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover a equipe "${name}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(id);
    await fetch(`/api/teams/${id}`, { method: 'DELETE' });
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setDeleting(null);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header — always visible */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold font-display">Equipes</h2>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'Carregando...' : `${teams.length} / 12 equipes cadastradas`}
          </p>
        </div>
        <Link
          href="/admin/teams/new"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          + Nova equipe
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-red-300 text-sm">{error}</span>
          <button
            onClick={fetchTeams}
            className="text-red-300 hover:text-white text-sm underline ml-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl h-20 animate-pulse border border-slate-700" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && teams.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <div className="text-6xl mb-4">🏎️</div>
          <p className="text-lg mb-2">Nenhuma equipe cadastrada ainda.</p>
          <Link href="/admin/teams/new" className="text-orange-400 hover:underline">
            Cadastrar primeira equipe →
          </Link>
        </div>
      )}

      {/* Team list */}
      {!loading && teams.length > 0 && (
        <div className="space-y-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl">{team.emoji}</span>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{team.name}</p>
                  <p className="text-slate-400 text-xs">
                    {team.members.length} membros
                    {team.padrinho ? ` · Padrinho: ${team.padrinho.name}` : ''}
                  </p>
                </div>
              </div>

              <PhaseControls team={team} onUpdate={handleTeamUpdate} />

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/admin/teams/${team.id}`}
                  className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(team.id, team.name)}
                  disabled={deleting === team.id}
                  className="px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-800 disabled:opacity-50 text-red-300 rounded-lg transition-colors"
                >
                  {deleting === team.id ? '...' : 'Remover'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase summary */}
      {!loading && teams.length > 0 && (
        <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PHASES.map((phase) => {
            const count = teams.filter((t) => t.currentPhase === phase.index).length;
            return (
              <div key={phase.key} className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
                <div className="text-xl mb-1">{phase.emoji}</div>
                <div className="text-white text-lg font-bold">{count}</div>
                <div className="text-slate-400 text-xs leading-tight">{phase.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
