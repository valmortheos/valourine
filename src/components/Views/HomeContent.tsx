/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { type Track } from '../../types';
import { cn } from '../../lib/utils';

interface HomeContentProps {
  tracks: Track[];
}

export default function HomeContent({ tracks }: HomeContentProps) {
  const { setCurrentTrack, setIsPlaying, setQueue, currentTrack } = usePlayerStore();
  const { profile } = useAuthStore();

  const handlePlay = (track: Track) => {
    setQueue(tracks);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
          Good {getGreeting()},
        </h1>
        <p className="text-zinc-400 text-sm font-black uppercase tracking-[0.2em] mt-1">
          {profile?.username || 'Valourine User'}
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest text-[11px]">
            New Releases
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {tracks.slice(0, 2).map((track) => (
            <div 
              key={track.id}
              onClick={() => handlePlay(track)}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-200 relative shadow-sm transition-transform active:scale-95">
                <img 
                  src={track.thumbnailUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                {currentTrack?.id === track.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl">
                      <Play fill="currentColor" size={20} className="ml-1" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-zinc-900 text-sm">{track.title}</h3>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-10">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-1">
          Internal Collection
        </h2>
        <div className="space-y-3">
          {tracks.map((track) => (
            <div 
              key={track.id}
              onClick={() => handlePlay(track)}
              className="glass-card flex items-center group active:scale-[0.98] transition-transform border-white/50"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img src={track.thumbnailUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{track.title}</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{track.artist}</p>
              </div>
              <div className={cn(
                "transition-all duration-300",
                currentTrack?.id === track.id ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                  <Play fill="currentColor" size={12} className="ml-0.5" />
                </div>
              </div>
            </div>
          ))}
          {tracks.length === 0 && (
            <div className="text-center py-20 bg-zinc-50/50 rounded-3xl border-2 border-dashed border-zinc-100">
              <p className="text-zinc-400 font-bold text-sm">No music files detected in public/music</p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-2">Scan system active</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
