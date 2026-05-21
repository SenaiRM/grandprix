'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Phase } from '@/types';

interface CelebrationOverlayProps {
  teamName: string | null;
  targetPhase: Phase | null;
  onComplete: () => void;
}

function fireConfetti(isWinner: boolean) {
  const colors = ['#F26522', '#003087', '#FFFFFF'];
  confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
  confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
  if (isWinner) {
    setTimeout(() => {
      confetti({ particleCount: 200, spread: 160, origin: { y: 0.4 }, colors: ['#FFD700', '#F26522', '#003087'] });
    }, 400);
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 100, origin: { x: 0.3, y: 0.5 }, colors: ['#FFD700', '#FFFFFF'] });
      confetti({ particleCount: 150, spread: 100, origin: { x: 0.7, y: 0.5 }, colors: ['#FFD700', '#FFFFFF'] });
    }, 800);
  }
}

export default function CelebrationOverlay({ teamName, targetPhase, onComplete }: CelebrationOverlayProps) {
  const active = teamName !== null && targetPhase !== null;

  useEffect(() => {
    if (!active || !targetPhase) return;
    fireConfetti(targetPhase.index === 5);
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [active, targetPhase, onComplete]);

  return (
    <AnimatePresence>
      {active && targetPhase && (
        <motion.div
          key="celebration"
          initial={{ y: -140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -140, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div
            className="mx-4 mt-2 px-10 py-5 rounded-b-3xl shadow-2xl text-white text-center"
            style={{ background: 'linear-gradient(135deg, #F26522, #c94f12)' }}
          >
            <div className="text-4xl mb-1">🏁</div>
            <div className="text-2xl font-bold font-display tracking-wide">
              {teamName}
            </div>
            <div className="text-lg opacity-90 mt-1">
              avançou para {targetPhase.emoji} <strong>{targetPhase.label}</strong>!
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
