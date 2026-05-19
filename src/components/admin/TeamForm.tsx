'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Team, TeamPayload } from '@/types';
import PhotoUpload from './PhotoUpload';

interface TeamFormProps {
  initialData?: Team;
  onSubmit: (payload: TeamPayload) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  name: string;
  emoji: string;
  leaderIndex: number;
  members: { name: string; photoUrl: string }[];
  padrinhoName: string;
  padrinhoPhoto: string;
}

export default function TeamForm({ initialData, onSubmit, onCancel }: TeamFormProps) {
  const defaultMembers = Array.from({ length: 5 }, (_, i) => ({
    name: initialData?.members[i]?.name ?? '',
    photoUrl: initialData?.members[i]?.photoUrl ?? '',
  }));

  const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name ?? '',
      emoji: initialData?.emoji ?? '',
      leaderIndex: initialData?.members.findIndex((m) => m.isLeader) ?? 0,
      members: defaultMembers,
      padrinhoName: initialData?.padrinho?.name ?? '',
      padrinhoPhoto: initialData?.padrinho?.photoUrl ?? '',
    },
  });

  const { fields } = useFieldArray({ control, name: 'members' } as never);
  const memberValues = watch('members');
  const leaderIndex = watch('leaderIndex');

  async function submit(values: FormValues) {
    const payload: TeamPayload = {
      name: values.name,
      emoji: values.emoji,
      members: values.members.map((m, i) => ({
        name: m.name,
        photoUrl: m.photoUrl || null,
        isLeader: Number(values.leaderIndex) === i,
        order: i,
      })),
      padrinho: values.padrinhoName
        ? { name: values.padrinhoName, photoUrl: values.padrinhoPhoto || null }
        : null,
    };
    await onSubmit(payload);
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500';
  const labelCls = 'block text-sm text-slate-300 mb-1';

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Team info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nome da equipe *</label>
          <input {...register('name', { required: true })} className={inputCls} placeholder="Ex: Equipe Alpha" />
        </div>
        <div>
          <label className={labelCls}>Emoji *</label>
          <input {...register('emoji', { required: true })} className={inputCls} placeholder="🚀" />
        </div>
      </div>

      {/* Members */}
      <div>
        <h3 className="text-white font-semibold mb-3">Membros (5)</h3>
        <div className="space-y-4">
          {(fields as unknown[]).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="radio"
                  id={`leader-${i}`}
                  {...register('leaderIndex')}
                  value={i}
                  checked={Number(leaderIndex) === i}
                  onChange={() => setValue('leaderIndex', i)}
                  className="accent-orange-500"
                />
                <label htmlFor={`leader-${i}`} className="text-sm text-slate-300">
                  {Number(leaderIndex) === i ? '👑 Líder' : `Membro ${i + 1}`}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nome</label>
                  <input
                    {...register(`members.${i}.name`)}
                    className={inputCls}
                    placeholder={`Nome do membro ${i + 1}`}
                  />
                </div>
                <PhotoUpload
                  value={memberValues[i]?.photoUrl || null}
                  onChange={(url) => setValue(`members.${i}.photoUrl`, url)}
                  label="Foto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Padrinho */}
      <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-700/40">
        <h3 className="text-yellow-300 font-semibold mb-3">⭐ Padrinho</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nome do padrinho</label>
            <input {...register('padrinhoName')} className={inputCls} placeholder="Nome" />
          </div>
          <PhotoUpload
            value={watch('padrinhoPhoto') || null}
            onChange={(url) => setValue('padrinhoPhoto', url)}
            label="Foto do padrinho"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar equipe'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
