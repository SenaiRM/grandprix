import { Phase } from '@/types';

export const PHASES: Phase[] = [
  {
    index: 0, key: 'largada', label: 'Largada', subtitle: 'Entendimento do Desafio',
    description: 'Compreender o problema e alinhar a equipe.',
    emoji: '🏁', color: '#003087',
  },
  {
    index: 1, key: 'aquecimento', label: 'Aquecimento', subtitle: 'Ideação da Solução',
    description: 'Gerar ideias, explorar possibilidades e escolher a melhor direção.',
    emoji: '👟', color: '#F26522',
  },
  {
    index: 2, key: 'pit-stop', label: 'Pit Stop Estratégico', subtitle: 'Estruturação da Proposta',
    description: 'Organizar a solução e definir a estratégia.',
    emoji: '🔧', color: '#1a56db',
  },
  {
    index: 3, key: 'aceleracao', label: 'Aceleração', subtitle: 'Desenvolvimento do Protótipo',
    description: 'Transformar a ideia em algo real: protótipo ou MVP.',
    emoji: '🚀', color: '#16a34a',
  },
  {
    index: 4, key: 'alta-perf', label: 'Alta Performance', subtitle: 'Refinamento da Solução',
    description: 'Ajustar, melhorar e deixar a solução ainda mais forte para a apresentação final.',
    emoji: '⏱️', color: '#7c3aed',
  },
  {
    index: 5, key: 'volta-final', label: 'Volta Final', subtitle: 'Pitch da Solução',
    description: 'Apresentar, convencer e mostrar o impacto da solução.',
    emoji: '🎤', color: '#dc2626',
  },
];

export const PHASE_COUNT = PHASES.length;

export function getPhase(index: number): Phase {
  const clamped = Math.max(0, Math.min(PHASE_COUNT - 1, index)) as Phase['index'];
  return PHASES[clamped];
}
