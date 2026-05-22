import { Phase } from '@/types';

export const PHASES: Phase[] = [
  { index: 0, key: 'largada',        label: 'Largada',               subtitle: 'Entendimento do Desafio',     emoji: '🏁', color: '#003087' },
  { index: 1, key: 'aquecimento',    label: 'Aquecimento',           subtitle: 'Ideação da Solução',           emoji: '👟', color: '#F26522' },
  { index: 2, key: 'pit-stop',       label: 'Pit Stop Estratégico',  subtitle: 'Estruturação da Proposta',     emoji: '🔧', color: '#003087' },
  { index: 3, key: 'aceleracao',     label: 'Aceleração',            subtitle: 'Desenvolvimento do Protótipo', emoji: '🚀', color: '#F26522' },
  { index: 4, key: 'alta-perf',      label: 'Alta Performance',      subtitle: 'Refinamento da Solução',       emoji: '⏱️', color: '#003087' },
  { index: 5, key: 'volta-final',    label: 'Volta Final',           subtitle: 'Pitch da Solução',             emoji: '🎤', color: '#F26522' },
];

export const PHASE_COUNT = PHASES.length;

export function getPhase(index: number): Phase {
  const clamped = Math.max(0, Math.min(PHASE_COUNT - 1, index)) as Phase['index'];
  return PHASES[clamped];
}
