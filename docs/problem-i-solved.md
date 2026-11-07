# The problem I solved: Kasaysayan

## The problem

Most Philippine history online is either a dry list of dates or a set of long Wikipedia articles. I couldn't find a site that shows the history of the Philippines *as a place*: where things happened, island by island, with real photos, in a form a student would actually want to read.

The good material that exists is often unsourced or out of date. Popular sites repeat claims such as "the rice terraces are 2,000 years old" or "the Tabon skullcap is 47,000 years old," even after newer research has challenged them.

## What I built

Kasaysayan is a free, static website with 60 events from about 67,000 years ago to 2019.

- **Storyteller map:** as you scroll, each event is inked onto a vintage map of the islands at the place it happened. A Play button runs through the whole timeline, and you can filter by topic.
- **Long-read stories:** each event opens into a story in chapters, with a photo gallery, a map of the place and numbered sources.
- **Fair coverage:** 13 events are in the Visayas and Bohol, and 4 are in Mindanao, not only Manila.

## How it deals with accuracy

- **Fact-check rules in the build:** every event has `verified: true/false`, and only verified events are published.
- **Automatic checks:** the build refuses a disallowed photo license, a missing photo, a placeholder caption, a contested event with only one source, or a story that's too short.
- **Disagreements shown openly:** 20 contested events carry a "Sources differ" note that names who says what. Examples are the Pugad Lawin date and place, Bonifacio's trial, the Bataan death toll, Plaza Miranda and the 1973 ratification.
- **Errors corrected:** research corrected mistakes that show up in many popular sources. For example, the Tabon skullcap is about 16,500 years old; the 47,000-year date belongs to a shin-bone fragment.

## Technical choices

- **Fully static:** Next.js static export, so there's no backend or database, and hosting costs ₱0.
- **Map:** drawn as SVG from public-domain Natural Earth coastline data. I wrote my own zoom and pan, and the markers and labels keep a constant size at any zoom.
- **Content as Markdown:** each event is a Markdown file validated with a Zod schema, which makes the content easy to review in Git.
- **Tests:** more than 100 tests with Vitest and Testing Library, written before the code (TDD).
- **Licensed photos only:** about 190 public domain and Creative Commons photos from Wikimedia Commons, downloaded with scripts that check licenses and rate limits and convert to WebP.
- **Accessibility:** alt text is required, the map's markers can be reached with a keyboard, reduced motion is respected, and music never autoplays.

## What I'd do next

- A Filipino and Bisaya version
- "This day in history"
- Quizzes for students
- More events, with community corrections through GitHub issues
