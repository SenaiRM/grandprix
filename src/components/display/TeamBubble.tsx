'use client';

import { motion } from 'framer-motion';
import { Team } from '@/types';

interface TeamBubbleProps {
  team: Team;
  onClick: () => void;
  isJustAdvanced?: boolean;
}

export default function TeamBubble({ team, onClick, isJustAdvanced }: TeamBubbleProps) {
  return (
    <motion.button
      layout
      initial={{ scale: 0, opacity: 0, y: -16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 16 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 cursor-pointer group ${isJustAdvanced ? 'animate-pulse-ring' : ''}`}
      title={`Ver equipe ${team.name}`}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-shadow group-hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #F26522, #c94f12)' }}
      >
        {team.emoji}
      </div>
      <span className="text-white text-xs font-medium text-center leading-tight max-w-[64px] truncate">
        {team.name}
      </span>
    </motion.button>
  );
}
