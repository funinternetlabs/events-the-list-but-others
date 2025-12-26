import fs from 'fs-extra';
import path from 'path';
import { MarkdownAdapter } from '../src/adapters/MarkdownAdapter.js';
import type { NormalizedData } from '../src/types/index.js';

async function main() {
  console.log('🚀 Starting Event Scraper...');

  // 1. Initialize Adapters
  const markdownAdapter = new MarkdownAdapter();

  try {
    // 2. Fetch data
    console.log(`📦 Running ${markdownAdapter.name}...`);
    const { events, venues } = await markdownAdapter.fetchAndNormalize();

    // 3. Extract Dev Notes
    const rkEventsPath = path.resolve('docs/rk-events.md');
    const rkEventsContent = await fs.readFile(rkEventsPath, 'utf-8');
    const devNotesMatch = rkEventsContent.match(/## Dev Notes([\s\S]*)$/);
    const devNotes = devNotesMatch ? devNotesMatch[1].trim() : '';

    // 4. Filter and Normalize
    const today = new Date('2025-12-25'); // Use current date for filtering (hardcoded to local time provided)
    today.setHours(0, 0, 0, 0);

    const futureEvents = events.filter(event => {
      if (event.start_datetime === '9999-12-31') return true; // Keep ongoing
      const eventDate = new Date(event.start_datetime);
      return eventDate >= today;
    });

    // 5. Prepare Data for Eleventy
    const outputDir = path.resolve('_data');
    await fs.ensureDir(outputDir);

    await fs.writeJson(path.join(outputDir, 'events.json'), futureEvents, { spaces: 2 });
    await fs.writeJson(path.join(outputDir, 'venues.json'), venues, { spaces: 2 });
    await fs.writeJson(path.join(outputDir, 'site.json'), { 
      devNotes,
      lastUpdated: new Date().toISOString(),
      city: 'Portland'
    }, { spaces: 2 });

    console.log(`✅ Scrape complete!`);
    console.log(`   - Events found: ${events.length}`);
    console.log(`   - Future events: ${futureEvents.length}`);
    console.log(`   - Venues: ${venues.length}`);
    console.log(`   - Output directory: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error during scrape:', error);
    process.exit(1);
  }
}

main();
