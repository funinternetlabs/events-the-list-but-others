# Nerd List Site Generator

## **1. Project Name**

**Nerd List Site Generator**

---

## **2. One-Sentence Summary**

A retro-styled static site generator that scrapes nerd-event data for [city], normalizes it, and produces a fast, The-List-style website.

City === Boulder
Maybe then Portland

http://www.foopee.com/punk/the-list/
https://seee.ee/

---

## **3. Problem / Goal**

Local nerd events (anime, comics, tabletop, video games, tech, general “nerd stuff”) are scattered across venue websites, Meetup, RSS feeds, and random calendars. There’s no single, fast, simple, or retro-styled directory for them.

The goal:  
Create a **centralized, ultra-fast, low-friction directory** of nerd events for a single city (**Boulder**) using automated scrapers + minimal human curation, presented in a nostalgic 90s-style UI that’s still mobile-friendly.

---

## **4. Core User Story**

**Primary user story**

> “As a **local nerd in Boulder**, I want to **see all upcoming nerd events in one simple list**, so I can **quickly find something to attend without checking a dozen sites.**”

**Additional user stories**

**Browsing / discovery**

- “As a **user**, I want to **view all upcoming events by date in a long scrolling list**, so I can **quickly scan what’s happening soon.**”
- “As a **user**, I want to **browse events by venue**, so I can **see what’s happening at my favorite local shops and spaces.**”
- “As a **user**, I want to **browse events by category** (Anime, Comics, Tabletop/Card, Video Games, Tech, General), so I can **jump straight to the kind of events I care about.**”
- “As a **user**, I want to **click through to the original event source**, so I can **get full details or RSVP if needed.**”

**Admin / curation**

- “As an **admin**, I want to **edit scraped events in a simple dashboard**, so I can **fix bad data and clean up event listings.**”
- “As an **admin**, I want to **hide or cancel events**, so I can **keep the public lists accurate.**”
- “As an **admin**, I want to **edit venue information**, so I can **keep names/URLs up to date.**”

**System / pipeline**

- “As a **maintainer**, I want the system to **regularly scrape known sources and normalize them**, so the **directory stays fresh without manual entry.**”
- “As a **maintainer**, I want a **static site build step that reads a canonical store and outputs simplified read-only data**, so the **frontend can stay extremely fast and simple.**”

---

## **5. Key Features (High-Level)**

- **By Date View (single page)**

  - One long retro-style page listing all upcoming events grouped by date.
  - Events are shown in a consistent textual format.

- **By Venue View (single page)**

  - All venues listed in **alphabetical order**, with each venue’s upcoming events listed inline beneath the venue name.

- **By Category View (single page)**

  - Six categories (Anime, Comics, Tabletop/Card, Video Games, Tech, General).
  - Each category has its own section with upcoming events listed.

- **Admin Dashboard**

  - Admin can create/edit/hide events.
  - Admin can edit venues.
  - Admin can mark events as manually edited so scrapers don’t override them.

- **Scraper System**

  - Scheduled process that fetches data from ~10 curated sources.
  - Normalizes scraped data into a canonical event + venue store.

- **Build + Static Frontend**
  - Build step reads canonical store, filters expired/hidden events, and generates a simplified “read store”.
  - Static frontend reads the simplified store and renders The-List-style pages.
  - Deployed as a static site for ridiculous speed.

---

## **6. User Flow (Happy Path)**

### Public User Flow (By Date example)

1. User lands on homepage (simple index linking to: By Date, By Venue, By Category).
2. User clicks **“Events by Date”**.
3. System loads the **By Date** page, which shows:

```text
   [Date]
   * [Venue] [Event Name] [category tag] (Age restriction) - [price] - [time] (source link)
```

Example:

```text
January 12, 2026
* X-Ray’s Tabletop Games MTG Commander Night [Tabletop/Card] (All ages) - $5 - 6:00 PM (source)
* Boulder Anime Club Weekly Meetup [Anime] (18+) - Free - 7:30 PM (source)
```

4. User scrolls to find an event of interest.
5. User clicks the **source link** to read more or RSVP on the original site.

### By Venue Page Flow

1. User clicks **“Events by Venue”** from the homepage.

2. System loads a single page listing venues alphabetically, for example:

```text
   Black Lotus Card Shop
   * [Date] [Event Name] [category tag] (Age restriction) - [price] - [time] (source link)

   Boulder Anime Club HQ
   * [Date] [Event Name] [category tag] (Age restriction) - [price] - [time] (source link)
```

3. User scrolls to their favorite venue and scans events.

### By Category Page Flow

1. User clicks **“Events by Category”** from the homepage.

2. System loads a single page grouped by category:

```text
   Anime
   * [Date] [Venue] [Event Name] (Age restriction) - [price] - [time] (source link)

   Comics
   * [Date] [Venue] [Event Name] (Age restriction) - [price] - [time] (source link)

   Tabletop/Card
   * ...

   Video Games
   * ...

   Tech
   * ...

   General
   * ...
```

3. User scrolls within their preferred category to find events.

4. If User likes an event, they can click on the (source link) to get to that page itself.

### Admin Flow (Happy Path)

1. Admin logs into the **admin dashboard**.

2. Admin sees a list of events (table) sourced from the **canonical event store**.

3. Admin clicks an event:

   - Edits title, date/time, venue, categories, price, age restriction, description, etc.
   - Can toggle `published/hidden/cancelled`.
   - Can mark event as **manually edited**.

4. Admin saves the event.

5. On the next build run:

   - Build system reads canonical store.
   - Filters expired/hidden events.
   - Generates simplified read-only structures (e.g. `events_by_date`, `events_by_venue`, `events_by_category`).
   - Static site is updated.

Optional: Add edge cases if they matter later.

---

## **7. Requirements**

**The user should be able to…**

- View events by date in a **single long page**.
- Browse venues in **alphabetical order** and see each venue’s events inline.
- Browse categories (Anime, Comics, Tabletop/Card, Video Games, Tech, General) on a **single page**.
- Click a **source link** to view the original event details.

**The system must…**

- Scrape ~10 curated venue/event sources for Boulder.
- Normalize data into a **canonical event + venue store**.
- Support six categories only:

  - Anime
  - Comics
  - Tabletop/Card
  - Video Games
  - Tech
  - General

- Provide an **admin dashboard** for CRUD operations on events and venues.
- Generate **simplified read-only data** for:

  - Events by Date
  - Events by Venue
  - Events by Category

- Exclude:
  - Expired events (past dates).
  - Events marked `hidden` or handled according to status.
- Output a **static site** that is mobile-responsive but keeps a **90s HTML look**.

**Data must…**

**Event model (canonical):**

- `id`
- `title`
- `venue_id`
- `start_datetime`
- `end_datetime` (optional)
- `categories` (array of 0–6 from: Anime, Comics, Tabletop/Card, Video Games, Tech, General)
- `price_display` (e.g., “Free”, “$5”, “$10–$20”)
- `age_restriction` (e.g., “All ages”, “18+”, “21+”)
- `source_url`
- `source_type` (e.g., `html`, `rss`, `meetup`, `manual`)
- `description` (optional)
- `status` (`published`, `hidden`, `cancelled`)
- `is_manual_override` (boolean indicating admin-edited / protected from scraper)

**Venue model (canonical):**

- `id`

- `name`

- `city` (Boulder for MVP)

- `address` (optional)

- `website_url` (optional)

- `events_source_url` (URL used by scraper)

- `notes` (optional)

- Preserve a clear distinction between **scraper-generated** and **manually edited** data.

---

## **8. Out of Scope (For Now)**

- Venue self-submission form (use a **placeholder contact email** for venue requests).
- Weekly breakdown of date pages (e.g., Dec 1–7 pages).
- Searching or filtering UI.
- Multi-city support (Boulder-only for MVP).
- Analytics dashboard beyond basic server logs.

---

## **9. Technical Complexity / Considerations (Separate Section)**

This project is **product-simple** but **pipeline-heavy**. Key complexities:

### Systems Overview

1. **Scraper System**

   - Responsibilities:

     - Maintain a config of ~10 venues/sources.
     - Fetch raw data (HTML, RSS, Meetup pages, etc.).
     - Parse and normalize into the canonical event + venue models.

   - Runs as a **scheduled job** (daily or every 2 days).
   - Writes only to the **canonical store**, not the simplified read store.

2. **Admin System**

   - Reads/writes the canonical store.
   - Provides CRUD UI for events and venues.
   - Supports marking events as manual overrides so the scraper does not overwrite them.
   - Simple, single-user auth for MVP.

3. **Build System**

   - Runs after scraper + admin updates.
   - Reads canonical store and:

     - Filters out expired events.
     - Filters or flags `hidden` / `cancelled` appropriately.
     - Generates simplified, read-optimized data:

       - `events_by_date`
       - `events_by_venue`
       - `events_by_category`

   - Outputs small static JSON blobs or similar structures used by frontend.

4. **Frontend**

   - Pure static site (e.g., built assets + JSON).
   - Reads simplified data and renders:

     - By Date page
     - By Venue page
     - By Category page

   - Styled to look like late-90s HTML but mobile-friendly.

### Specific Technical Considerations

- **Scraping challenges:**

  - Some sites may be **JavaScript-heavy**, requiring a headless browser.
  - Risk of **HTML structure changes** breaking scrapers.
  - **Rate limiting** or anti-bot protections.
  - We are effectively “ask forgiveness” on ToS/robots.txt.

- **Scheduled workers:**

  - Lambda or cloud functions might have outbound limitations or timeouts.
  - May require a container/VM environment more tolerant of heavy scraping.

- **Data normalization:**

  - Different event formats per venue (dates, times, price formats) must be standardized.

- **Admin overrides vs scraper updates:**

  - Must define logic such that manually edited events are not overridden.
  - Possibly track last-scraped time and treat certain fields as locked.

- **Static site generation:**

  - Build should always complete to a valid state (no half-built outputs).
  - Might need to ensure build falls back to last good artifact on failure.

- **Performance:**

  - Static site + small JSON = very fast.
  - Must keep simplified read store small and lean.

---

## **10. Unknowns & Open Questions**

- Are there any **APIs or RSS feeds** that certain venues offer that could reduce scraping complexity?
- Which 10 venues will be chosen for MVP, and how stable are their websites?
- What is the ideal **build cadence** in practice: once daily vs every 2 days?
- How strict should we be about robots.txt and ToS (do we ever skip a venue because of this)? Answer: Ask for forgiveness.
- Do we need to keep an **archive of past events**, or only show future ones?
- How should “manual override” behave long-term (e.g., can it ever be reset to scraper-managed)?
- Should the static build be:

  - Only on a schedule, or
  - Also triggered manually after major admin edits?

---

## **11. Feasibility & Risks**

**Feasibility:**

- Very feasible given a small number of curated sources (~10 venues).
- Frontend is trivial compared to pipeline.
- Scraping + normalization logic is straightforward for static or RSS-based sites; more complex for JS-driven ones.

**Risks:**

- **Scraping fragility**: changes in venue site HTML can silently break parsers.
- **Worker execution limits**: timeouts or blocked outbound connections when running in serverless environments.
- **Manual burden**: if scrapers are unreliable, admin might need to do more manual edits than expected.
- **Sparse data**: if Boulder doesn’t have enough nerd events, the site may feel underwhelming initially.

---

## **12. T-Shirt Size (Rough Estimate)**

**L** — multiple coordinated systems (Scraper, Admin, Build, Static Frontend), custom data models, scraping complexity, admin UI, and handling unknowns around web scraping reliability and infra.

---

---

## **14. Notes**

- City = **Portland** for MVP, but the system should be city-agnostic in design.
- Exactly six categories:

  - Anime
  - Comics
  - Tabletop/Card
  - Video Games
  - Tech
  - General

- Pages are intentionally **simple, text-heavy, and retro**, but layout should still be **legible on mobile**.
- The core philosophy: **“Nostalgic but not painful”** — vintage aesthetics with modern data hygiene.
