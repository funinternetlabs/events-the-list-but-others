import fs from 'fs-extra';
import path from 'path';
import { MarkdownAdapter } from '../src/adapters/MarkdownAdapter.js';
import type { BaseAdapter } from '../src/adapters/BaseAdapter.js';
import { kilnScraper } from './scrapers/kiln.js';
import type { Event, Venue, NormalizedData } from '../src/types/index.js';
import { RSSAdapter } from '../src/adapters/RSSAdapter.js';
import { MeetupAdapter } from '../src/adapters/MeetupAdapter.js';

// Configuration
const ADAPTERS: BaseAdapter[] = [
  new MarkdownAdapter(),
  kilnScraper,
  new RSSAdapter({
    sourceName: 'PDX Pipeline',
    sourceUrl: 'https://pdxpipeline.com/feed',
    city: 'Portland'
  }),
  new MeetupAdapter({
    sourceName: 'Meetup Tech',
    sourceUrl: 'https://www.meetup.com/find/?location=us--or--portland&eventType=inPerson&source=EVENTS&categoryId=546',
    city: 'Portland'
  }),
];

const STAGING_DIR = path.resolve('data/scraped');
const LEGACY_OUTPUT_DIR = path.resolve('_data');

async function main() {
  console.log('🚀 Starting Scraper Pipeline...');
  
  // Ensure directories exist
  await fs.ensureDir(STAGING_DIR);
  await fs.ensureDir(LEGACY_OUTPUT_DIR);

  const allEvents: Event[] = [];
  const allVenues = new Map<string, Venue>();
  const scrapedTimestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. Run Adapters
  for (const adapter of ADAPTERS) {
    try {
      console.log(`📦 Running Adapter: ${adapter.name}...`);
      const data = await adapter.fetchAndNormalize();
      
      // 2. Save Snapshot to Staging
      // Naming Convention: {date}-{source}.json
      const snapshotFilename = `${scrapedTimestamp}-${adapter.name.toLowerCase()}.json`;
      const snapshotPath = path.join(STAGING_DIR, snapshotFilename);
      
      await fs.writeJson(snapshotPath, {
        meta: {
          adapter: adapter.name,
          scraped_at: new Date().toISOString(),
          source_url: adapter.sourceUrl
        },
        data: data
      }, { spaces: 2 });
      console.log(`   ↳ Saved snapshot to ${snapshotFilename}`);

      // 3. Collect for Legacy Build (Backward Compatibility)
      data.events.forEach(e => allEvents.push(e));
      data.venues.forEach(v => allVenues.set(v.id, v));

    } catch (error) {
      console.error(`❌ Adapter ${adapter.name} failed:`, error);
      // We don't exit process here, so other adapters can still run
    }
  }

  // 4. Legacy Processing (Filter & Write to _data for Eleventy)
  // This preserves the current site functionality until Phase 4
  console.log('⚙️  Processing for Legacy Site Build...');

  // Extract Dev Notes (Specific to Markdown logic - maybe move this eventually?)
  const rkEventsPath = path.resolve('docs/events/pdx-jan-2026-events.md');
  let devNotes = '';
  try {
    const rkEventsContent = await fs.readFile(rkEventsPath, 'utf-8');
    const devNotesMatch = rkEventsContent.match(/## Dev Notes([\s\S]*)$/);
    devNotes = devNotesMatch ? devNotesMatch[1].trim() : '';
  } catch (e) { /* ignore if missing */ }

  const today = new Date(); 
  today.setHours(0, 0, 0, 0);

  const futureEvents = allEvents.filter(event => {
    if (event.start_datetime === '9999-12-31') return true; // Keep ongoing
    const eventDate = new Date(event.start_datetime);
    return eventDate >= today;
  });

  await fs.writeJson(path.join(LEGACY_OUTPUT_DIR, 'events.json'), futureEvents, { spaces: 2 });
  await fs.writeJson(path.join(LEGACY_OUTPUT_DIR, 'venues.json'), Array.from(allVenues.values()), { spaces: 2 });
  await fs.writeJson(path.join(LEGACY_OUTPUT_DIR, 'site.json'), { 
    devNotes,
    lastUpdated: new Date().toISOString(),
    city: 'Portland'
  }, { spaces: 2 });

  console.log(`✅ Pipeline complete!`);
  console.log(`   - Snapshots saved: ${ADAPTERS.length}`);
  console.log(`   - Total Events (Legacy): ${futureEvents.length}`);
}

main();
