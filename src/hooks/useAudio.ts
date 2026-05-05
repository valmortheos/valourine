/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useAuthStore } from '../store/useAuthStore';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { FastAverageColor } from 'fast-average-color';
import { type Track } from '../types';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuthStore();
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    setIsPlaying, 
    setProgress, 
    setDuration, 
    setAccentColor,
    nextTrack,
    previousTrack
  } = usePlayerStore();

  const fac = new FastAverageColor();

  // Log activity to Supabase
  const logActivity = useCallback(async (track: Track) => {
    if (!user) return;
    await supabase.from('listening_stats').insert({
      user_id: user.id,
      track_id: track.id
    });
  }, [user]);

  // Initialize Audio Element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  // Handle Track Changes & Caching
  useEffect(() => {
    const loadAudio = async () => {
      if (!currentTrack || !audioRef.current) return;

      try {
        // Try to get from cache first
        const cached = await db.cachedAudio.get(currentTrack.id);
        let url = currentTrack.audioUrl;

        if (cached) {
          console.log('Loading from cache:', currentTrack.title);
          url = URL.createObjectURL(cached.blob);
        } else {
          // If not in cache, we'll download it when play starts
          // For now just use common URL
          // In a real app we might fetch and store it here
        }

        audioRef.current.src = url;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error('Play error:', e));
          logActivity(currentTrack);
        }

        // Color Extraction
        fac.getColorAsync(currentTrack.thumbnailUrl).then(color => {
          setAccentColor(color.hex);
        });

        // MediaSession API
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title,
            artist: currentTrack.artist,
            album: currentTrack.album || 'Unknown Album',
            artwork: [
              { src: currentTrack.thumbnailUrl, sizes: '512x512', type: 'image/png' }
            ]
          });

          navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
          navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
          navigator.mediaSession.setActionHandler('previoustrack', previousTrack);
          navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
          navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            const skipTime = details.seekOffset || 10;
            audioRef.current!.currentTime = Math.max(audioRef.current!.currentTime - skipTime, 0);
          });
          navigator.mediaSession.setActionHandler('seekforward', (details) => {
            const skipTime = details.seekOffset || 10;
            audioRef.current!.currentTime = Math.min(audioRef.current!.currentTime + skipTime, audioRef.current!.duration);
          });
        }
      } catch (err) {
        console.error('Error loading audio:', err);
      }
    };

    loadAudio();
  }, [currentTrack]);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error('Play error:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack, setDuration, setProgress]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const downloadAndCache = async (track: Track) => {
    try {
      const response = await fetch(track.audioUrl);
      const blob = await response.blob();
      await db.cachedAudio.put({
        id: track.id,
        blob,
        addedAt: Date.now()
      });
      console.log('Cached:', track.title);
    } catch (err) {
      console.error('Cache error:', err);
    }
  };

  return { seek, downloadAndCache };
}
