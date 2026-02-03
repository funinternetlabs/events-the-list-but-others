# Nerd List Site Generator Roadmap

This document outlines the phased development of the Nerd List Site Generator, transitioning from a single-city MVP to a scalable, community-driven event platform.

## Phase 1: Core Architecture & Portland MVP [x]

**Goal:** Establish the pipeline and a working prototype for a single city.

- [x] **Infrastructure Setup**
  - [x] TypeScript project structure.
  - [x] Canonical data models (Event, Venue).
  - [x] Eleventy setup with Nunjucks templates.
  - [x] Base adapter architecture for extensibility.
- [x] **MVP Pipeline (The "Adapter" Engine)**
  - [x] Basic normalization logic (Date/Time formatting, price normalization).
  - [x] Markdown Adapter (pdx-jan-2026-events.md)
  - [x] Manual override system (protecting hand-edited data).
- [x] **Content System**
  - [x] Organize events into a canonical store.
  - [x] Filter events (only events from today forward) for Eleventy's data files.
- [x] **Eleventy Configuration**
  - [x] Configure data directory to consume canonical JSON.
  - [x] Create Nunjucks templates for "By Date", "By Venue", and "By Category" pages.
  - [x] Setup collections and filters for event grouping/sorting.
- [x] **Minimalist Retro Frontend**
  - [x] 90s-inspired CSS (monospaced, high contrast, mobile-friendly).
  - [x] Home page + 3 core list views (By Date, Venue, Category).
  - [x] Dark/Light mode theme toggle.
- [x] **Initial Deployment**
  - [x] Deploy to Github pages via GitHub Actions.

## Phase 2: Data Collection & Staging Infrastructure [/]

**Goal:** Build a robust, automated system to grab data from multiple sources.

- [ ] **Adapter Expansion**
  - [ ] RSS Adapter for stable feeds.
  - [ ] JSDOM/Scraper Adapter for HTML sources.
- [ ] **Staging Storage (The "Review Queue")**
  - [ ] Implement `data/scraped/` directory for raw, unverified data.
  - [ ] Standardize scraping output: `source-name-YYYY-MM-DD.json`.
- [ ] **Scraper Automation**
  - [ ] Command line tool to run all/specific scrapers.
  - [ ] Setup Cron Job (GitHub Actions) for automatic nightly scrapes.
  - [ ] Basic error reporting for broken scrapers.

## Phase 3: Admin UI & Data Cleanup

**Goal:** A web interface to review scraped data and manage the "Clean" store.

- [ ] **Admin Dashboard (Local Tool)**
  - [ ] Initialize `admin/` workspace (Vite + Vue + Tailwind).
  - [ ] Lightweight API server (`scripts/admin-server.ts`) to manage local JSON files.
- [ ] **Review Queue Workflow**
  - [ ] UI to browse events in `data/scraped/`.
  - [ ] **Actions:** Approve (move to Clean), Reject (ignore), or Edit then Approve.
- [ ] **Clean Data Store**
  - [ ] Establish `data/clean/` as the single source of truth for the site.
  - [ ] Manual CRUD: Directly add/edit events/venues (bypasses queue).
- [ ] **Duplicate Management**
  - [ ] Implement simple duplicate detection (Fuzzy vs Venue/Date) after gathering initial data.

## Phase 4: Production Pipeline & Notifications

**Goal:** Automate publishing and keep the admin informed.

- [ ] **Publishing Flow**
  - [ ] Update Eleventy to build exclusively from `data/clean/`.
  - [ ] Integrated build: Merging approved data into the site build.
- [ ] **Email Notification System**
  - [ ] Generic `EmailService` class for various alerts.
  - [ ] Trigger: Notifying the admin when a scraper finds new events for review.
- [ ] **Sharding & Archiving**
  - [ ] Archive events older than 6 months into separate history files to keep main store lean.

## Phase 5: Scaling & City Portability

**Goal:** Make the project easy for others to use for their own cities.

- [ ] **Portability**
  - [ ] Finalize "Fork Model": Clone repo -> edit `config.json` -> deploy.
  - [ ] Parameterize city name, timezone, and source lists.
- [ ] **Documentation**
  - [ ] Setup guide for local development and deployment.
  - [ ] Best practices for writing new scrapers.

## Phase 6: Community Features

**Goal:** Transition to a self-sustaining community tool.

- [ ] **Submissions**
  - [ ] "Suggest a Venue/Event" flow.
- [ ] **Theming Engine**
  - [ ] Support for multiple retro themes beyond the 90s default.
