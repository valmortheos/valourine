/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface DebugLog {
  id: string;
  type: 'DIR_MISSING' | 'THUMB_MISSING' | 'AUDIO_MISSING' | 'GENERAL_ERROR';
  file?: string;
  path?: string;
  message: string;
  timestamp: string;
}

interface DebugState {
  isAdminMode: boolean;
  logs: DebugLog[];
  scanTime: string | null;
  versionClicks: number;
  
  // Actions
  setIsAdminMode: (isAdmin: boolean) => void;
  setLogs: (logs: DebugLog[]) => void;
  addLog: (log: Omit<DebugLog, 'id' | 'timestamp'>) => void;
  setScanTime: (time: string) => void;
  incrementVersionClicks: () => void;
  resetVersionClicks: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  isAdminMode: false,
  logs: [],
  scanTime: null,
  versionClicks: 0,

  setIsAdminMode: (isAdminMode) => set({ isAdminMode }),
  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({
    logs: [
      { 
        ...log, 
        id: Math.random().toString(36).substr(2, 9), 
        timestamp: new Date().toISOString() 
      },
      ...state.logs
    ]
  })),
  setScanTime: (scanTime) => set({ scanTime }),
  incrementVersionClicks: () => set((state) => ({ versionClicks: state.versionClicks + 1 })),
  resetVersionClicks: () => set({ versionClicks: 0 }),
}));
