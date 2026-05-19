'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TeamForm from '@/components/admin/TeamForm';
import { Team, TeamPayload } from '@/types';

export default function EditTeamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teams/${id}`)
      .then((r) => r.json())
      .then(({ team }) => { setTeam(team); setLoading(false); });
  }, [id]);

  async function handleSubmit(payload: TeamPayload) {
    const res = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error);
    }
    router.push('/admin');
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-400">Carregando...</span>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Equipe não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold font-display">
          Editar equipe {team.emoji} {team.name}
        </h2>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <TeamForm
          initialData={team}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
