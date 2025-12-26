import { DateTime } from 'luxon';

export default function (eleventyConfig) {
  // Pass through CSS
  eleventyConfig.addPassthroughCopy('css');

  // Date Filter
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    if (dateObj === '9999-12-31') return 'Ongoing';
    return DateTime.fromISO(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  // Slugify Filter
  eleventyConfig.addFilter('slugify', (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  // Group by Date Filter
  eleventyConfig.addFilter('groupByDate', (events) => {
    const groups = {};
    events.filter(e => e.start_datetime !== '9999-12-31').forEach(event => {
      const date = event.start_datetime;
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    // Sort dates
    return Object.keys(groups).sort().map(date => ({
      date,
      events: groups[date]
    }));
  });

  // Group by Category Filter
  eleventyConfig.addFilter('groupByCategory', (events) => {
    const groups = {};
    events.forEach(event => {
      event.categories.forEach(cat => {
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(event);
      });
    });
    return Object.keys(groups).sort().map(category => ({
      category,
      events: groups[category]
    }));
  });

  // Group by Venue Filter
  eleventyConfig.addFilter('groupByVenue', (events, venues) => {
    const venueMap = Object.fromEntries(venues.map(v => [v.id, v]));
    const groups = {};
    events.forEach(event => {
      const venueName = venueMap[event.venue_id]?.name || 'Unknown Venue';
      if (!groups[venueName]) groups[venueName] = [];
      groups[venueName].push(event);
    });
    return Object.keys(groups).sort().map(venueName => ({
      venueName,
      events: groups[venueName]
    }));
  });

  return {
    dir: {
      input: '.',
      output: '_site',
      data: '_data'
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || '/'
  };
}
