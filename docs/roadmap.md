# Nerd List Site Generator Roadmap

This document outlines the phased development of the Nerd List Site Generator, transitioning from a local Boulder MVP to a scaleable, multi-city event platform.

## Phase 1: Core Architecture & Boulder MVP

**Goal:** Establish the pipeline and a working prototype for a single city.

- [ ] **Infrastructure Setup**
  - [x] TypeScript project structure.
  - [x] Canonical data models (Event, Venue).
  - [ ] Eleventy setup with Nunjucks templates.
  - [ ] Base adapter architecture for extensibility.
- [ ] **MVP Pipeline (The "Adapter" Engine)**
  - [ ] Basic normalization logic (Date/Time formatting, price normalization).
  - [ ] Markdown Adapter (rk-events.md)
  - [ ] Manual override system (protecting hand-edited data).
- [ ] **Content System**
  - [ ] Organize events into a canonical store.
  - [ ] Filter events (only events from today forward) for Eleventy's data files.
- [ ] **Eleventy Configuration**
  - [ ] Configure data directory to consume canonical JSON.
  - [ ] Create Nunjucks templates for "By Date", "By Venue", and "By Category" pages.
  - [ ] Setup collections and filters for event grouping/sorting.
- [ ] **Minimalist Retro Frontend**
  - [ ] 90s-inspired CSS (monospaced, high contrast, mobile-friendly).
  - [ ] Home page + 3 core list views.

## Phase 2: Refinement & Admin Tools

**Goal:** Improve data quality and ease of management.

- [ ] **Admin Dashboard**
  - [ ] Simple UI for CSV/JSON imports (moving from script-only to UI).
  - [ ] Event CRUD (Create, Read, Update, Delete).
  - [ ] Venue management.
- [ ] **Pipeline Robustness**
  - [ ] Error reporting for broken scrapers.
  - [ ] Duplicate detection logic.
- [ ] **Deployment**
  - [ ] Deploy to Github pages

## Phase 3: Scaling & Multi-City Support

**Goal:** Transition from "Boulder only" to a general-purpose engine.

- [ ] **Event Pipeline**
  - [ ] RSS Adapter (for stable feeds).
  - [ ] JSDOM/Scraper Adapter (for HTML sources).
- [ ] **Multi-City Architecture**
  - [ ] Parameterize the build system to support multiple output directories/domains.
  - [ ] Shared venue/source configuration.
- [ ] **Advanced Adapters**
  - [ ] CSV Adapter (for manual data dumps or partner feeds).
  - [ ] Headless browser support (Playwright/Puppeteer) for JS-heavy sites.
- [ ] **Enhanced Discovery**
  - [ ] Simple search (client-side).
  - [ ] Archive/Historical event views.
- [ ] **Deployment Automation**
  - [ ] Automated daily build/scrape/deploy cycle (GitHub Actions or similar).

## Phase 4: Long-Term Vision

**Goal:** Self-sustaining community tool.

- [ ] **Community Contributions**
  - [ ] Simple "Suggest a Venue/Event" submission flow.
- [ ] **Theming Engine**
  - [ ] Support for multiple retro themes beyond the 90s default.
- [ ] **API Access**
  - [ ] Provide a public JSON API for the normalized event data.
