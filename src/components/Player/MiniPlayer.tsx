/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatTime } from '../../lib/utils';

export default function MiniPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    progress, 
    duration, 
    setIsFullPlayerOpen,
    nextTrack
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progressPercent = (progress / duration) * 100 || 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="liquid-glass rounded-2xl h-16 flex items-center px-3 overflow-hidden cursor-pointer border-white/40 shadow-2xl shadow-zinc-200"
      onClick={() => setIsFullPlayerOpen(true)}
    >
      <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200 shadow-sm">
        <img 
          src={currentTrack.thumbnailUrl} 
          alt={currentTrack.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-3 flex-grow min-w-0 pr-2">
        <h3 className="text-sm font-black text-zinc-900 truncate tracking-tight">
          {currentTrack.title}
        </h3>
        <p className="text-[9px] font-black text-zinc-400 truncate uppercase tracking-[0.1em] mt-0.5">
          {currentTrack.artist}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors active:scale-90"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isPlaying ? 'pause' : 'play'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-0.5" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            nextTrack();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors active:scale-90 text-zinc-400"
        >
          <SkipForward size={22} fill="currentColor" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-100/50">
        <motion.div 
          className="h-full bg-zinc-900" 
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
