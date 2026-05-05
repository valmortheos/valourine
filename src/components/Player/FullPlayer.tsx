/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, SkipForward, SkipBack, X, Volume2, Heart, Share2, Repeat, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatTime } from '../../lib/utils';

export default function FullPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    progress, 
    duration, 
    setIsFullPlayerOpen,
    accentColor,
    nextTrack,
    previousTrack
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progressPercent = (progress / duration) * 100 || 0;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* Background with accent flare */}
      <div 
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 40%, ${accentColor}, transparent 70%)`,
        }}
      />

      <div className="relative h-full flex flex-col p-8 max-w-lg mx-auto z-10">
        <header className="flex items-center justify-between z-20">
          <button 
            onClick={() => setIsFullPlayerOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:scale-90 transition-transform"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Now Playing</p>
            <p className="text-sm font-semibold text-zinc-900 truncate max-w-[150px]">{currentTrack.album}</p>
          </div>
          <button className="w-10 h-10 flex items-center justify-center">
            <Share2 size={20} className="text-zinc-400" />
          </button>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center mt-8">
          <motion.div 
            className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img 
              src={currentTrack.thumbnailUrl} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <footer className="w-full mt-12 space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-base font-medium text-zinc-500 uppercase tracking-wider">
                  {currentTrack.artist}
                </p>
              </div>
              <button className="text-zinc-300 hover:text-red-500 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden cursor-pointer">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-zinc-900"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 tracking-wider">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4">
              <button className="text-zinc-300"><Shuffle size={20} /></button>
              
              <div className="flex items-center gap-8">
                <button 
                  onClick={previousTrack}
                  className="text-zinc-900 active:scale-90 transition-transform"
                >
                  <SkipBack size={32} fill="currentColor" />
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 flex items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl active:scale-90 transition-all"
                >
                  {isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                  ) : (
                    <Play size={32} fill="currentColor" className="ml-1" />
                  )}
                </button>

                <button 
                  onClick={nextTrack}
                  className="text-zinc-900 active:scale-90 transition-transform"
                >
                  <SkipForward size={32} fill="currentColor" />
                </button>
              </div>

              <button className="text-zinc-300"><Repeat size={20} /></button>
            </div>

            <div className="flex items-center gap-3 pt-6 text-zinc-400">
               <Volume2 size={16} />
               <div className="flex-grow h-1 bg-zinc-100 rounded-full relative">
                 <div className="absolute inset-y-0 left-0 w-3/4 bg-zinc-300 rounded-full" />
               </div>
            </div>
          </footer>
        </main>
      </div>
    </motion.div>
  );
}
