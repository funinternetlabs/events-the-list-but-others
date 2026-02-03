# Project Doc V2

## Thoughts:

Phase 1: Basic setup

Phase 2: Figure out a system to be able to grab events and store it in a way that we can use.

Maybe you can feed it RSS feeds. Or Scrape data. The scraping code should be something I can run on my computer, as well as on a linux server (with a cron job)

Phase 3: Create a tooling/web app where I have admin tools. I can fix the scapped data and add it to the 'clean data'. Or edit data.

Phase 4: The clean data then runs and converts it into the static data. It's a CI/CD project and It sends emails for notification.

Phase 5: Scaling. Other people can use this for their own city, with instructions and a config.

Phase 6: Add a suggest a venue/event.

## Questions

> 1. Email Notifications (Phase 4): What triggers an email?

For now, just new events were scrapped. It should be a email class that lets me fire it for a bunch of different events.

> Cron Job Scraping: Do you want the scraper to run automatically (e.g., daily at 3am), or do you still want manual trigger control from the Admin UI?

Ideally I want it run automatically. But I'll have to run it manually in the beginning. It does not have to be from a Admin UI. But if that's possible, that would be neat.

> Phase 5 Scaling: When you say "other people can use this for their own city," do you envision:
> Fork Model: They clone the repo, edit a config.json with their city name and sources, and deploy their own site?
> Multi-Tenant: One site hosts Portland, Seattle, Denver, etc., with a city selector?

They can clone the repo.

## Questions part 2

> Manual Override System: Right now, the Markdown file has is_manual_override: true for hand-edited events. Should those bypass the review queue (always go straight to data/clean/)?

We don't have proper data schema or structure yet to even explain what this means.
That `is_manual_override` is meaningless to me right now.

> Duplicate Detection: If a scraper finds "Portland Comic Con" and it's already in data/clean/, should the admin UI:
> Show it as a duplicate and skip it?
> Show it side-by-side for you to compare (maybe the date changed)?

Show it as a duplicate and let me decide.

This one is going to be difficult because there will be scenarios like:

- A local event site calls it Portland Comic Con
- Another event site calls it PDX Comic Con
- Another site will also call it Portland's Comic Con (like Wizard World)

So we need to be able to handle this.

> Data Migration: We currently have events in pdx-jan-2026-events.md. When we build Phase 3, should those be:
> Imported into data/clean/ as the initial dataset?
> Or keep running the
> MarkdownAdapter
> and treating them as "scraped" data?

Ignore it. We'll start fresh with a clean slate of grabbing data.

## Questions Part 3

> When you use the Admin UI to manually create a new event (not from a scraper), does it:

> A) Go directly to data/clean/ (trusted immediately because you created it)?
> B) Still go through the staging/review queue like scraped events?

> I'm assuming A (manual additions are trusted), and only scraped data goes through the review queue. Correct?

It should go to data/clean/ immediately.

The staging/review queue is only for scrapped events.

> Bonus question (optional, can decide later):
> For the duplicate detection system you described (Portland Comic Con vs PDX Comic Con), I see two approaches:

> Option 1: Fuzzy Matching

> System flags events as "possible duplicates" based on similar titles + same date
> You review and manually mark "these are the same event"
> Future scrapes of that pair automatically merge

> Option 2: Venue+Date Matching

> System flags duplicates based on: same venue + same start date/time
> Assumes if it's at the same place at the same time, it's the same event
> Still lets you review and override

Let's gather data before trying to solve it.
