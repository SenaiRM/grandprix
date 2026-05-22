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
      initial={{ scale: 0, opacity: 0, y: -12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 cursor-pointer group relative ${isJustAdvanced ? 'animate-pulse-ring' : ''}`}
      title={`Ver ${team.name}`}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-shadow group-hover:shadow-orange-500/40 group-hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #F26522 0%, #c94f12 100%)' }}
      >
        {team.emoji}
      </div>
      <span className="text-gray-700 text-[10px] font-medium text-center leading-tight max-w-[52px] truncate">
        {team.name.replace(/^Equipe\s+/i, '')}
      </span>
    </motion.button>
  );
}
