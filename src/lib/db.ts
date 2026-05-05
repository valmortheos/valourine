/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Dexie, { type Table } from 'dexie';
import { type CachedAudio, type PlayHistory } from '../types';

export class ValourineDB extends Dexie {
  cachedAudio!: Table<CachedAudio>;
  history!: Table<PlayHistory>;

  constructor() {
    super('ValourineDB');
    this.version(1).stores({
      cachedAudio: 'id, addedAt',
      history: '++id, trackId, timestamp'
    });
  }
}

export const db = new ValourineDB();
