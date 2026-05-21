'use client';

import { useRouter } from 'next/navigation';
import TeamForm from '@/components/admin/TeamForm';
import { TeamPayload } from '@/types';

export default function NewTeamPage() {
  const router = useRouter();

  async function handleSubmit(payload: TeamPayload) {
    const res = await fetch('/api/teams', {
      method: 'POST',
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold font-display">Nova equipe</h2>
        <p className="text-slate-400 text-sm mt-1">Preencha os dados da equipe</p>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <TeamForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
