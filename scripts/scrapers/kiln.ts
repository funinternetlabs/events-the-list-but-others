import { HTMLScraperAdapter, ScraperConfig } from '../../src/adapters/HTMLScraperAdapter.js';

// Based on the user's finding:
// "Upcoming Member Events at Kiln Portland"
// Event: Squats Club / Kiln Portland, Theater / February 2, 2026 / 12:15pm - 12:35pm PST

// Note: Selectors here are guesses based on standard web structure. 
// Ideally we would inspect the HTML class names, but since I can only see text chunks, 
// I will try to target generic structure or assume a list. 

const kilnConfig: ScraperConfig = {
  sourceName: 'Kiln',
  sourceUrl: 'https://kiln.com/communities/portland/',
  city: 'Portland',
  venueName: 'Kiln Portland',
  selectors: {
    container: '.kiln-event-feed', 
    title: '.title',
    date: '.date',
    time: '.time',
    description: '.description',
    venue: '.location',
    link: '.links a' // Some events have specific links, otherwise fallback to source
  }
};

export const kilnScraper = new HTMLScraperAdapter(kilnConfig);
