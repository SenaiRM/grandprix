'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Team } from '@/types';
import { PHASES } from '@/lib/phases';
import PhaseControls from '@/components/admin/PhaseControls';

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data.teams);
    setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-400">Carregando equipes...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold font-display">Equipes</h2>
          <p className="text-slate-400 text-sm mt-1">{teams.length} / 12 equipes cadastradas</p>
        </div>
        <Link
          href="/admin/teams/new"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Nova equipe
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">🏎️</div>
          <p>Nenhuma equipe cadastrada ainda.</p>
          <Link href="/admin/teams/new" className="text-orange-400 hover:underline mt-2 inline-block">
            Cadastrar primeira equipe →
          </Link>
        </div>
      ) : (
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
    </div>
  );
}
