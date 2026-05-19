import { Phase } from '@/types';

export const PHASES: Phase[] = [
  { index: 0, key: 'ponto-de-partida', label: 'Ponto de Partida', emoji: '🚀', color: '#6B7280' },
  { index: 1, key: 'ideacao',          label: 'Ideação',          emoji: '💡', color: '#F59E0B' },
  { index: 2, key: 'in-canvas',        label: 'In-Canvas',        emoji: '🗺️', color: '#3B82F6' },
  { index: 3, key: 'prototipo',        label: 'Protótipo',        emoji: '🔨', color: '#8B5CF6' },
  { index: 4, key: 'pitch',            label: 'Pitch',            emoji: '🎤', color: '#EC4899' },
  { index: 5, key: 'vencedor',         label: 'Vencedor',         emoji: '🏆', color: '#F59E0B' },
];

export const PHASE_COUNT = PHASES.length;

export function getPhase(index: number): Phase {
  const clamped = Math.max(0, Math.min(PHASE_COUNT - 1, index)) as Phase['index'];
  return PHASES[clamped];
}
