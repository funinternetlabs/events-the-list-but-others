import fs from 'fs-extra';
import path from 'path';
import type { BaseAdapter } from './BaseAdapter.js';
import type { Event, Venue, EventCategory } from '../types/index.js';
import { slugify, generateEventId, normalizePrice, inferCategory } from '../utils/normalize.js';

export class MarkdownAdapter implements BaseAdapter {
  name = 'MarkdownAdapter';
  sourceUrl = 'docs/rk-events.md';

  async fetchAndNormalize(): Promise<{ events: Event[]; venues: Venue[] }> {
    const filePath = path.resolve(this.sourceUrl);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    const events: Event[] = [];
    const venuesMap = new Map<string, Venue>();

    let currentDates: string[] = [];
    let currentEvent: Partial<Event> | null = null;
    let isOngoing = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Parse Week/Section headers
      if (trimmedLine.startsWith('# ')) {
        if (trimmedLine.includes('NON-EVENTS')) {
          isOngoing = true;
          currentDates = [];
        } else {
          isOngoing = false;
        }
        continue;
      }

      // Parse Date headers
      if (trimmedLine.startsWith('## ')) {
        const dateText = trimmedLine.replace('## ', '').trim();
        if (dateText.toLowerCase().includes('dev notes')) continue;
        
        currentDates = this.parseDateHeader(dateText);
        continue;
      }

      // Parse Event headers
      if (trimmedLine.startsWith('### ')) {
        // Save previous event if it exists
        if (currentEvent) {
          this.finalizeEvents(currentEvent, currentDates, isOngoing, events);
        }

        const title = trimmedLine.replace('### ', '').trim();
        currentEvent = {
          title,
          categories: [inferCategory(title)],
          status: 'published',
          source_type: isOngoing ? 'ongoing' : 'manual',
          is_manual_override: true
        };
        continue;
      }

      // Parse Metadata lines
      if (currentEvent && trimmedLine.startsWith('- ')) {
        const [key, ...valueParts] = trimmedLine.replace('- ', '').split(':');
        const value = valueParts.join(':').trim();

        switch (key.trim()) {
          case 'Venue':
            currentEvent.venue_id = slugify(value);
            if (!venuesMap.has(currentEvent.venue_id)) {
              venuesMap.set(currentEvent.venue_id, {
                id: currentEvent.venue_id,
                name: value,
                city: 'Portland'
              });
            }
            break;
          case 'Time':
            // We'll store time in notes/description for now as start_datetime is ISO
            if (value && value !== 'all' && value !== 'all day') {
              currentEvent.description = (currentEvent.description || '') + `Time: ${value}. `;
            }
            break;
          case 'Price':
            currentEvent.price_display = normalizePrice(value);
            break;
          case 'Age':
            currentEvent.age_restriction = value || 'all ages';
            break;
          case 'Category':
            if (value && value !== 'General') {
              currentEvent.categories = [value as EventCategory];
            }
            break;
          case 'URL':
            currentEvent.source_url = value;
            break;
          case 'Notes':
            currentEvent.description = (currentEvent.description || '') + value;
            break;
        }
      }
    }

    // Finalize last event
    if (currentEvent) {
      this.finalizeEvents(currentEvent, currentDates, isOngoing, events);
    }

    return { events, venues: Array.from(venuesMap.values()) };
  }

  private parseDateHeader(header: string): string[] {
    // Expected formats: 
    // "Sun, Dec 28, 2025"
    // "Weekend Sat, Jan 10 - Sun, Jan 11, 2026"
    // "Thurs, Jan 8, 2026"

    const dates: string[] = [];
    
    // Heuristic: Check for year in string, otherwise use logic (Dec -> 2025, Jan -> 2026)
    const getYear = (text: string) => {
      if (text.includes('2025')) return '2025';
      if (text.includes('2026')) return '2026';
      if (text.includes('Dec')) return '2025';
      return '2026';
    };

    const year = getYear(header);

    // Regex for Month Day
    const datePattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)/g;
    let match;
    while ((match = datePattern.exec(header)) !== null) {
      const monthStr = match[1];
      const day = match[2].padStart(2, '0');
      const monthMap: Record<string, string> = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
      };
      dates.push(`${year}-${monthMap[monthStr]}-${day}`);
    }

    return dates;
  }

  private finalizeEvents(
    eventData: Partial<Event>, 
    dates: string[], 
    isOngoing: boolean, 
    events: Event[]
  ) {
    const baseEvent = {
      price_display: 'Free',
      age_restriction: 'all ages',
      source_url: '',
      ...eventData
    } as Event;

    if (isOngoing) {
      baseEvent.start_datetime = '9999-12-31'; // Mark as ongoing for sorting
      baseEvent.id = generateEventId(baseEvent.title, 'ongoing');
      events.push({ ...baseEvent });
    } else {
      for (const date of dates) {
        // Special check for specific date in title (manual overrides for weekend split)
        // e.g. "Jan 11th: O-Shogatsu Festival"
        const dateInTitle = baseEvent.title.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)/i);
        if (dateInTitle) {
          const titleDate = this.parseDateHeader(dateInTitle[0])[0];
          if (titleDate !== date) continue; // Skip if this instance is for the wrong day
        }

        const instance = { ...baseEvent };
        instance.start_datetime = date;
        instance.id = generateEventId(baseEvent.title, date);
        events.push(instance);
      }
    }
  }
}
