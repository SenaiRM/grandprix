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
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all group-hover:shadow-orange-400/60 group-hover:shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ff8c42, #c94f12 70%, #8b2a00)',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 16px rgba(242,101,34,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {team.emoji}
      </div>
      <span className="text-gray-700 text-[11px] font-semibold text-center leading-tight max-w-[60px] truncate">
        {team.name.replace(/^Equipe\s+/i, '')}
      </span>
    </motion.button>
  );
}
