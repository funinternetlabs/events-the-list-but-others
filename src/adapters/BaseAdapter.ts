import type { Event, Venue } from '../types/index.js';

export interface BaseAdapter {
  name: string;
  sourceUrl: string;
  fetchAndNormalize(): Promise<{ events: Event[]; venues: Venue[] }>;
}
