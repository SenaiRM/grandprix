'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, TeamMember } from '@/types';

interface TeamMemberPopupProps {
  team: Team | null;
  onClose: () => void;
}

function MemberAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center gap-2 relative">
      {member.isLeader && (
        <span className="absolute -top-3 text-xl z-10">👑</span>
      )}
      <div
        className="w-20 h-20 rounded-full overflow-hidden border-4 flex items-center justify-center text-3xl"
        style={{ borderColor: member.isLeader ? '#F26522' : '#334155' }}
      >
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center text-3xl">
            👤
          </div>
        )}
      </div>
      <span className="text-white text-sm font-medium text-center max-w-[80px] leading-tight">
        {member.name}
      </span>
      {member.isLeader && (
        <span className="text-xs text-orange-400 font-semibold">Líder</span>
      )}
    </div>
  );
}

export default function TeamMemberPopup({ team, onClose }: TeamMemberPopupProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {team && (
        <motion.div
          key="popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75"
          onClick={onClose}
        >
          <motion.div
            key="popup-card"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-slate-600"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">{team.emoji}</span>
              <div>
                <h2 className="text-white text-2xl font-bold font-display">{team.name}</h2>
                <p className="text-slate-400 text-sm">{team.members.length} membros</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto text-slate-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Members */}
            <div className="flex flex-wrap justify-center gap-6 mb-6 pt-4">
              {team.members.map((member) => (
                <MemberAvatar key={member.id} member={member} />
              ))}
            </div>

            {/* Padrinho */}
            {team.padrinho && (
              <div className="border-t border-slate-600 pt-5 mt-2">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 text-center">Padrinho</p>
                <div className="flex items-center gap-4 justify-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-500 flex-shrink-0">
                    {team.padrinho.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={team.padrinho.photoUrl} alt={team.padrinho.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xl">⭐</div>
                    )}
                  </div>
                  <span className="text-white font-semibold text-lg">{team.padrinho.name}</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
