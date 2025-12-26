import type { EventCategory } from '../types/index.js';

/**
 * Creates a URL-friendly slug from a string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a stable unique ID for an event.
 */
export function generateEventId(title: string, date: string): string {
  return `${slugify(title)}-${date}`;
}

/**
 * Normalizes price strings.
 */
export function normalizePrice(priceStr: string): string {
  if (!priceStr) return 'See Source';
  const price = priceStr.toLowerCase().trim();
  if (price === 'free' || price === '0' || price === '$0') return 'Free';
  return priceStr.trim();
}

/**
 * Basic heuristic to infer category from text.
 */
export function inferCategory(text: string): EventCategory {
  const lower = text.toLowerCase();
  if (lower.includes('anime') || lower.includes('manga')) return 'Anime';
  if (lower.includes('comic') || lower.includes('graphic novel')) return 'Comics';
  if (lower.includes('tabletop') || lower.includes('board game') || lower.includes('mtg') || lower.includes('d&d')) return 'Tabletop/Card';
  if (lower.includes('video game') || lower.includes('arcade') || lower.includes('pinball')) return 'Video Games';
  if (lower.includes('tech') || lower.includes('coding') || lower.includes('software')) return 'Tech';
  return 'General';
}
