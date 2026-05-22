import { Phase } from '@/types';

export const PHASES: Phase[] = [
  { index: 0, key: 'largada',        label: 'Largada',               subtitle: 'Entendimento do Desafio',     emoji: '🏁', color: '#1D4ED8' },
  { index: 1, key: 'aquecimento',    label: 'Aquecimento',           subtitle: 'Ideação da Solução',           emoji: '👟', color: '#F26522' },
  { index: 2, key: 'pit-stop',       label: 'Pit Stop Estratégico',  subtitle: 'Estruturação da Proposta',     emoji: '🔧', color: '#0369a1' },
  { index: 3, key: 'aceleracao',     label: 'Aceleração',            subtitle: 'Desenvolvimento do Protótipo', emoji: '🚀', color: '#16a34a' },
  { index: 4, key: 'alta-perf',      label: 'Alta Performance',      subtitle: 'Refinamento da Solução',       emoji: '⏱️', color: '#7c3aed' },
  { index: 5, key: 'volta-final',    label: 'Volta Final',           subtitle: 'Pitch da Solução',             emoji: '🎤', color: '#dc2626' },
];

export const PHASE_COUNT = PHASES.length;

export function getPhase(index: number): Phase {
  const clamped = Math.max(0, Math.min(PHASE_COUNT - 1, index)) as Phase['index'];
  return PHASES[clamped];
}
