import type { BaseAdapter } from './BaseAdapter.js';
import type { Event, Venue, NormalizedData } from '../types/index.js';

export interface JSONScraperConfig {
  sourceName: string;
  sourceUrl: string;
  headers?: Record<string, string>;
  // The transformer function takes the raw JSON and returns our NormalizedData
  // We can't define the raw JSON type easily, so using 'any'
  transform: (json: any) => NormalizedData;
}

export class JSONAdapter implements BaseAdapter {
  name: string;
  sourceUrl: string;
  config: JSONScraperConfig;

  constructor(config: JSONScraperConfig) {
    this.name = config.sourceName;
    this.sourceUrl = config.sourceUrl;
    this.config = config;
  }

  async fetchAndNormalize(): Promise<NormalizedData> {
    console.log(`Fetching API ${this.sourceUrl}...`);
    
    try {
      const response = await fetch(this.sourceUrl, {
        headers: this.config.headers
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return this.config.transform(json);

    } catch (error) {
      console.error(`JSON Adapter ${this.name} failed:`, error);
      // Return empty data on failure so other adapters can proceed
      return { events: [], venues: [] }; 
    }
  }
}
