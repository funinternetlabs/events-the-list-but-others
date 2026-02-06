
import { JSDOM } from 'jsdom';
import type { BaseAdapter } from './BaseAdapter.js';
import type { Event, Venue, NormalizedData } from '../types/index.js';
import { generateEventId, inferCategory } from '../utils/normalize.js';

export interface MeetupConfig {
  sourceName: string;
  sourceUrl: string;
  city: string;
}

export class MeetupAdapter implements BaseAdapter {
  name: string;
  sourceUrl: string;
  config: MeetupConfig;

  constructor(config: MeetupConfig) {
    this.name = config.sourceName;
    this.sourceUrl = config.sourceUrl;
    this.config = config;
  }

  async fetchAndNormalize(): Promise<NormalizedData> {
    console.log(`Fetching Meetup: ${this.sourceUrl}...`);
    
    // 1. Fetch HTML
    // Note: detailed caching logic omitted for brevity, but could be added like in HTMLScraper
    const response = await fetch(this.sourceUrl);
    const html = await response.text();
    
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const events: Event[] = [];
    const venuesMap = new Map<string, Venue>();

    // 2. Find LD+JSON scripts
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
      try {
        const json = JSON.parse(script.textContent || '[]');
        
        // Meetup often returns an array of events in one script tag
        const items = Array.isArray(json) ? json : [json];
        
        items.forEach((item: any) => {
          if (item['@type'] !== 'Event') return;

          // 3. Extract Fields
          const title = item.name;
          const startDatetime = item.startDate;
          const endDatetime = item.endDate;
          const link = item.url;
          const description = item.description;
          
          if (!title || !startDatetime) return;

          // 4. Resolve Venue
          const venueName = item.location?.name || item.location?.address?.streetAddress || item.organizer?.name || 'Meetup Venue';
          const venueId = this.slugify(venueName);

          if (!venuesMap.has(venueId)) {
            venuesMap.set(venueId, {
              id: venueId,
              name: venueName,
              city: this.config.city,
              events_source_url: this.sourceUrl
            });
          }

          // 5. Build Event
          const eventId = generateEventId(title, startDatetime);
          
          // Price often in 'offers'
          let price = 'See Link';
          if (item.offers && item.offers.price) {
             price = item.offers.priceCurrency ? `${item.offers.price} ${item.offers.priceCurrency}` : `${item.offers.price}`;
          }

          events.push({
            id: eventId,
            title,
            venue_id: venueId,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            categories: [inferCategory(title)],
            price_display: price,
            age_restriction: 'See Link',
            source_url: link || this.sourceUrl,
            source_type: 'meetup',
            description: description,
            status: 'published',
            is_manual_override: false
          });
        });
        
      } catch (e) {
        console.warn('Failed to parse LD+JSON block', e);
      }
    });
    
    console.log(`   Found ${events.length} Meetup events.`);

    return { events, venues: Array.from(venuesMap.values()) };
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
  }
}
