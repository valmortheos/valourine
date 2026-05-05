/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl: string;
  audioUrl: string;
  duration?: number;
}

export interface PlayHistory {
  id?: number;
  trackId: string;
  timestamp: number;
  durationPlayed: number;
}

export interface CachedAudio {
  id: string;
  blob: Blob;
  addedAt: number;
}
