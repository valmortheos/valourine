/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { type Track } from '../../types';

interface HomeContentProps {
  tracks: Track[];
}

export default function HomeContent({ tracks }: HomeContentProps) {
  const { setCurrentTrack, setIsPlaying, setQueue, currentTrack } = usePlayerStore();

  const handlePlay = (track: Track) => {
    setQueue(tracks);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Good Afternoon,
        </h1>
        <p className="text-zinc-500 font-medium">Discover your rhythm today.</p>
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
        <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-widest text-[11px] mb-4">
          Your Library
        </h2>
        <div className="space-y-3">
          {tracks.map((track) => (
            <div 
              key={track.id}
              onClick={() => handlePlay(track)}
              className="glass-card flex items-center group active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={track.thumbnailUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{track.title}</h3>
                <p className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">{track.artist}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Play fill="currentColor" size={16} className="text-zinc-900" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
