import { JSDOM } from 'jsdom';
import type { BaseAdapter } from './BaseAdapter.js';
import type { Event, Venue, EventCategory, SourceType } from '../types/index.js';
import { generateEventId, inferCategory, normalizePrice } from '../utils/normalize.js';

export interface ScraperSelectors {
  container: string;
  title: string;
  date: string;
  time?: string;
  venue?: string; // If venue name is scraped
  price?: string;
  description?: string;
  link?: string;
}

export interface ScraperConfig {
  sourceName: string;
  sourceUrl: string;
  selectors: ScraperSelectors;
  city: string; // Default city for venues
  venueName?: string; // Hardcoded venue name if this scraper is single-venue
}

export class HTMLScraperAdapter implements BaseAdapter {
  name: string;
  sourceUrl: string;
  config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.name = config.sourceName;
    this.sourceUrl = config.sourceUrl;
    this.config = config;
  }

  async fetchAndNormalize(): Promise<{ events: Event[]; venues: Venue[] }> {
    console.log(`Fetching ${this.sourceUrl}...`);
    
    // 1. Fetch HTML (with Cache)
    const { fetchWithCache } = await import('../utils/fetchUtils.js');
    const html = await fetchWithCache(this.sourceUrl, this.name, 'html');

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const events: Event[] = [];
    const venuesMap = new Map<string, Venue>();

    // 2. Select Containers
    const containers = doc.querySelectorAll(this.config.selectors.container);
    
    console.log(`Found ${containers.length} event containers.`);

    containers.forEach((container) => {
      // Helper to get text
      const getText = (selector?: string): string => {
        if (!selector) return '';
        const el = container.querySelector(selector);
        return el ? el.textContent?.trim() || '' : '';
      };

      // Helper to get attribute
      const getAttr = (selector?: string, attr: string = 'href'): string => {
        if (!selector) return '';
        const el = container.querySelector(selector);
        return el ? el.getAttribute(attr)?.trim() || '' : '';
      };

      // 3. Extract Fields
      const title = getText(this.config.selectors.title);
      const dateStr = getText(this.config.selectors.date);
      const timeStr = getText(this.config.selectors.time);
      const priceStr = getText(this.config.selectors.price);
      const descStr = getText(this.config.selectors.description);
      
      let link = getAttr(this.config.selectors.link, 'href');
      // Handle relative links
      if (link && !link.startsWith('http')) {
        const urlObj = new URL(this.sourceUrl);
        link = `${urlObj.origin}${link}`;
      }

      // 4. Resolve Venue
      // If config.venueName is set, use it. Otherwise scrape it.
      let venueName = this.config.venueName || getText(this.config.selectors.venue) || 'Unknown Venue';
      const venueId = this.slugify(venueName);

      if (!venuesMap.has(venueId)) {
        venuesMap.set(venueId, {
          id: venueId,
          name: venueName,
          city: this.config.city,
          events_source_url: this.sourceUrl
        });
      }

      // 5. Build Event Object
      // TODO: Better Date Parsing (needs a real library like chrono-node or just robust regex)
      // For now, assuming ISO or basic string we let manual review fix
      const startDatetime = this.parseDate(dateStr, timeStr); 

      // Skip invalid dates or empty titles
      if (!title || !startDatetime) return;

      const eventId = generateEventId(title, startDatetime);

      events.push({
        id: eventId,
        title,
        venue_id: venueId,
        start_datetime: startDatetime,
        categories: [inferCategory(title)], // Initial inference
        price_display: normalizePrice(priceStr),
        age_restriction: 'See Source', // Scrapers rarely get this right automatically
        source_url: link || this.sourceUrl,
        source_type: 'html',
        description: descStr,
        status: 'published',
        is_manual_override: false
      });
    });

    return { events, venues: Array.from(venuesMap.values()) };
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
  }

  // Very basic Date Parser placeholder
  // In a real app we'd use 'chrono-node' or Date.parse logic tailored to the site
  private parseDate(dateStr: string, timeStr: string): string {
    // This is essentially a stub. Real scraping needs robust date logic.
    // We return the raw string if we can't parse, or try native Date
    try {
        // Simple case: ISO date available in text
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          // If time is separate, we need to merge it (complex without library)
          // For now, returning the date object
          return d.toISOString();
        }

        // Just return the raw string if we can't parse it, manual review will fix it
        // OR return a future date to ensure it's seen
    } catch (e) {}
    
    // Fallback: If we can't parse, we simply return the string 
    // BUT the type requires ISO string. 
    // For MVP, we'll return 9999-01-01 and put the real date in description if it fails?
    // Let's stick to returning a valid ISO if possible, or 9999-12-31 (Ongoing/Check)
    
    return '9999-12-31'; 
  }
}
