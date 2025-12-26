# Nerd List Site Generator Roadmap

This document outlines the phased development of the Nerd List Site Generator, transitioning from a local Boulder MVP to a scaleable, multi-city event platform.

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
  - [x] Home page + 3 core list views.
  - [x] Dark/Light mode theme toggle.

## Phase 2: Refinement & Admin Tools

**Goal:** Improve data quality and ease of management.

- [ ] **Admin Dashboard**
  - [ ] Simple UI for CSV/JSON imports (moving from script-only to UI).
  - [ ] Event CRUD (Create, Read, Update, Delete).
  - [ ] Venue management.
- [ ] **Pipeline Robustness**
  - [ ] Error reporting for broken scrapers.
  - [ ] Duplicate detection logic.
- [x] **Deployment**
  - [x] Deploy to Github pages via GitHub Actions.

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
- [x] **Deployment Automation**
  - [x] Automated build/scrape/deploy cycle on push (GitHub Actions).

## Phase 4: Long-Term Vision

**Goal:** Self-sustaining community tool.

- [ ] **Community Contributions**
  - [ ] Simple "Suggest a Venue/Event" submission flow.
- [ ] **Theming Engine**
  - [ ] Support for multiple retro themes beyond the 90s default.
- [ ] **API Access**
  - [ ] Provide a public JSON API for the normalized event data.
