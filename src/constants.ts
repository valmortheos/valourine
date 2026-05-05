/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Track } from './types';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
