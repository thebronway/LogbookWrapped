# Logbook Wrapped

![Version](https://img.shields.io/badge/version-v0.7.4-blue.svg)
![Privacy](https://img.shields.io/badge/privacy-100%25_client--side-green.svg)

### A privacy-first web app that transforms EFB logbook exports into shareable aviation stories.

**LogbookWrapped** is "Spotify Wrapped for Pilots." It transforms CSV exports from an EFBs (like ForeFlight, Garmin Pilot, or MyFlightbook) into a “passport” of a pilot’s flying history. Pilots get a shareable, story-format breakdown of their flight hours, routes, aircraft, and aviation extremes, which are all ready to be exported directly to social media or aviation forums.

> **Note:** All processing happens entirely in the web browser and not sent to our server. Meaning personal flight logs and data remain 100% private.

## Try it yourself: [Live Site](https://logbookwrapped.conway.im/)
**GitHub:** [thebronway/LogbookWrapped](https://github.com/thebronway/LogbookWrapped)  

## Screenshots

<details>
<summary><strong>Mobile (Story Mode)</strong></summary>
<br>
<p float="left">
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page1.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page2.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page3.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page4.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page5.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page6.webp?raw=true" width="200" />
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/page7.webp?raw=true" width="200" />
</p>
</details>

<details>
<summary><strong>Desktop (Dashboard)</strong></summary>
<br>
  <img src="https://github.com/thebronway/LogbookWrapped/blob/main/frontend/public/screenshots/desktop.webp?raw=true" width="800" />
</details>

## Features

* **Story Mode Interface:** A 7-page animated experience detailing total hours, sorties, and home base status.
* **The Footprint Map:** Flight path visualization that auto-scales from local practice areas to global dark-mode world maps.
* **Fleet Diversity Tracking:** Analytical breakdown of most used airframes, unique tail numbers, and aircraft normalization.
* **Aviation Extremes:** Automatic identification of favorite routes, shortest flights, and longest distances.
* **Superlative Logic:** Fun, data-driven milestones including Landing-to-Hour ratios, most visited states, and unique airports.
* **Privacy-First Processing:** 100% client-side JavaScript parsing. No FAA numbers, names, or routes ever touch a server.
* **Smart Column Mapping:** Advanced normalization engine that auto-detects EFB providers based on CSV headers and cleans messy aircraft inputs.
* **One-Click Social Export:** HTML5 Canvas integration to generate 9:16 vertical infographics for Instagram and TikTok.

## The Passport Experience

* **The Aviator:** Total hours and sorties with dynamic copywriting based on experience level.
* **The Footprint:** Geographic coverage area analysis and furthest distance comparisons.
* **The Fleet:** Most used airframe and unique tail number count.
* **The Big Picture:** Monumental time and distance conversions (e.g., Laps around the Earth).
* **The Extremes:** Analysis of favorite routes and the shortest/longest hops in the logbook.
* **Superlatives:** Landing frequency, most visited state, and unique airport "Nomad" status.
* **In The Elements:** Breakdown of night hours, actual IMC time, and estimated AvGas fuel burn.

## Bug Reports & Edge Cases

Pilots find crazy edge cases every day. If a logbook rule isn't working right, a flight is parsed incorrectly, or an aircraft profile is missing, please [open a GitHub issue](https://github.com/thebronway/LogbookWrapped/issues) with the details so we can improve the parser.

## Monetization & Integration

* **AvGas Tip Jar:** Integrated low-friction micro-transaction gateway for user support.
* **Print-on-Demand Posters:** Direct integration with Printful/Printify APIs to turn flight path maps into 24x36 matte posters.
  * **Note:** Users that choose to use the Printful/Printify service will be alerted that only the data being printed will be sent through our server for processing.