---
id: YEAR-SLUG
title: TITLE
date: { year: YEAR }          # or { year: 1898, month: 6, day: 12 } or { label: "c. 47,000 BP", sort: -45000, approx: true }
era: spanish                  # precolonial | spanish | revolution | american | japanese | third | martial | edsa | modern
topics: [politics]            # war | politics | culture | science | visayas
place:                        # delete this block for nationwide events
  name: PLACE, PROVINCE
  lat: 14.59
  lng: 120.98
summary: One or two sentences for the story card.
images: []                    # fill in with: npm run fetch-image -- YEAR-SLUG "File title 1" "File title 2"
sources:
  - { title: SOURCE TITLE, publisher: PUBLISHER, url: "https://example.org/", accessed: 2026-01-01 }
contested: false
contestedNote: ""             # required when contested: true; say where sources differ
verified: false               # set to true only after every fact is sourced (spec section 6)
---
## First chapter heading

Write 800–1,200 words in 4–5 chapters. Tie every name, date and number to a numbered source like this.[1]

To place a photo between paragraphs, put a line with only photo:N in double curly braces (for example photo 2 of the images list).

## Second chapter heading

Where historians disagree, say so and name who says what.[2]

## Third chapter heading

...
