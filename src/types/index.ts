export type EventCategory = 'Anime' | 'Comics' | 'Tabletop/Card' | 'Video Games' | 'Tech' | 'General';

export type EventStatus = 'published' | 'hidden' | 'cancelled';

export type SourceType = 'html' | 'rss' | 'meetup' | 'manual' | 'json' | 'ongoing';

export interface Venue {
  id: string; // Slugified name
  name: string;
  city: string;
  address?: string;
  website_url?: string;
  events_source_url?: string;
  notes?: string;
}

export interface Event {
  id: string; // Generated unique ID
  title: string;
  venue_id: string;
  start_datetime: string; // ISO format
  end_datetime?: string; // ISO format
  categories: EventCategory[];
  price_display: string; // e.g. "Free", "$5"
  age_restriction: string; // e.g. "All ages", "21+"
  source_url: string;
  source_type: SourceType;
  description?: string; // Derived from Notes and dev notes
  status: EventStatus;
  is_manual_override: boolean;
}

export interface NormalizedData {
  venues: Venue[];
  events: Event[];
}
