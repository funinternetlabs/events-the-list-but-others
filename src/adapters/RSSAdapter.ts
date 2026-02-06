import Parser from 'rss-parser';
import type { BaseAdapter } from './BaseAdapter.js';
import type { Event, Venue, NormalizedData } from '../types/index.js';
import { generateEventId, inferCategory } from '../utils/normalize.js';

export interface RSSConfig {
  sourceName: string;
  sourceUrl: string;
  city: string;
  venueName?: string; // Optional: Force a venue name if the feed is specific to one
}

export class RSSAdapter implements BaseAdapter {
  name: string;
  sourceUrl: string;
  config: RSSConfig;
  parser: Parser;

  constructor(config: RSSConfig) {
    this.name = config.sourceName;
    this.sourceUrl = config.sourceUrl;
    this.config = config;
    this.parser = new Parser();
  }

  async fetchAndNormalize(): Promise<NormalizedData> {
    console.log(`Fetching RSS Feed: ${this.sourceUrl}...`);
    
    const events: Event[] = [];
    const venuesMap = new Map<string, Venue>();

    try {
      const { fetchWithCache } = await import('../utils/fetchUtils.js');
      // Fetch raw XML first with caching
      const xml = await fetchWithCache(this.sourceUrl, this.name, 'xml');

      const feed = await this.parser.parseString(xml);
      console.log(`   Found ${feed.items.length} items in feed: ${feed.title}`);

      for (const item of feed.items) {
        // 1. Basic Validation
        if (!item.title || !item.isoDate) {
             // Try pubDate if isoDate is missing, though rss-parser usually gives isoDate
             if (!item.pubDate) continue;
        }

        const title = item.title || 'Untitled Event';
        const link = item.link || this.sourceUrl;
        
        // 2. Date Parsing
        // RSS dates are usually reliable, but let's be safe
        let startDatetime = '9999-12-31';
        try {
            const d = new Date(item.isoDate || item.pubDate || '');
            if (!isNaN(d.getTime())) {
                startDatetime = d.toISOString();
            }
        } catch (e) {
            console.warn(`   ⚠️ Invalid date for item: ${title}`);
        }

        // 3. Venue Resolution
        // If config has a venue name, use it. 
        // Otherwise, some feeds might put venue in specific fields, but standard RSS doesn't have 'venue'.
        // We'll default to the feed title or config venue.
        const venueName = this.config.venueName || feed.title || 'Unknown Source';
        const venueId = this.slugify(venueName);

        if (!venuesMap.has(venueId)) {
          venuesMap.set(venueId, {
            id: venueId,
            name: venueName,
            city: this.config.city,
            events_source_url: this.sourceUrl
          });
        }

        // 4. Create Event
        const eventId = generateEventId(title, startDatetime);

        events.push({
          id: eventId,
          title,
          venue_id: venueId,
          start_datetime: startDatetime,
          categories: [inferCategory(title)], 
          price_display: 'See Link', // RSS usually doesn't have price
          age_restriction: 'See Link',
          source_url: link,
          source_type: 'rss',
          description: item.contentSnippet || item.content || '',
          status: 'published',
          is_manual_override: false
        });
      }

    } catch (error) {
      console.error(`   ❌ Failed to parse RSS feed: ${error}`);
      throw error;
    }

    return { 
      events, 
      venues: Array.from(venuesMap.values()) 
    };
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
  }
}
