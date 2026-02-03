import { NormalizedData } from '../types/index.js';

export interface BaseAdapter {
  name: string;
  sourceUrl: string;
  fetchAndNormalize(): Promise<NormalizedData>;
}
