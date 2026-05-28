# LogbookWrapped Roadmap

*Last updated: 2026-05-27* 
*Current Version: v1.0.8*

## Overview
This document tracks planned improvements, enhancements, and maintenance.

## Release Roadmap

### Release v1.0.9
- Bug: When viewing demo logbook, and you click create your own logbook, it goes to the configure screen, not the upload screen, and since you didnt upload it uses the demo logbook. It should go to the upload screen
- Bug: When viewing a shared link /s and you click create your own logbook, it goes to the home screen, it should go to the upload screen

### Release v1.1.0
- UI / Feature: Replaced "Autopilot's Default" (favorite route) on the Extremes page with "The Second Home" (most visited destination excluding home base) to eliminate redundant A-to-A local pattern flights.
- UX / Feature: Added a 0.5s delayed fade-in to the action buttons (and make sure the button is disabled for that .5 seconds) on Page 11 (Export / CTA) to prevent accidental route changes when rapidly tapping through the mobile story.

### Release v1.1.1
- **Advanced Referral Attribution (The Custom Event Way):** Set up a global background memory listener to capture and persist the URL `?source=xyz` parameter across the entire user session. Update key custom event triggers (e.g., "Generate Wrapped Clicked") to pass this saved referrer string directly to Umami as metadata, enabling a granular conversion funnel breakdown of where successful reports are coming from.

### Release v1.1.2
- **Partner API & Secure Tracking Infrastructure:** Enhance the upload API to accept a `partner_id` parameter, secured via server-side API key validation. When a 3rd-party app submits a logbook, the backend will return a tamper-proof session token and track the partner's specific traffic in Umami. This establishes the secure, spoof-proof groundwork for future UI white-labeling (e.g., co-branded watermarks) without making any immediate visual changes to the frontend.
- API documentation expand. I want all the options clearly laid out in great detail on /dev. This should be a tech doc page. 

### Release v1.1.3: The CFI Expansion
- **New CFI/Instructor Page (Page 7):** Create a dedicated "Flight Instructor" page that dynamically renders only if the parsed logbook contains >10 hours of `Dual Given`. The page will feature these exact instructor-specific metrics:
  - **The "Passing the Torch" Ratio:** Percentage of total time spent teaching (`(Dual Given / Total Time) * 100`).
  - **The Pattern Warrior:** "You survived [X] student landings this year." (Comparing landings to total flights when Dual Given > 0).
  - **The IMC Mentor:** Hours of instruction given under the hood or in actual clouds.
  - **The Night Shift:** Hours spent teaching in the dark.
- **Main Stats Update:** Inject "Dual Given" as a standard sub-metric under the "Total Time" row on the main Stats page so CFIs see their core instruction metric regardless of the dedicated page.
- **Component Renumbering:** Shift all components from Page 7 onward to maintain chronological file structure. Rename `Page7_Passport` to `Page8`, `Page8_Stats` to `Page9`, up through `Page12_Export`. Update all imports and Umami tracking arrays accordingly.
- **Desktop Grid Layout Protection (Max 3 Columns):** Update the `StoryContainer` masonry grid to prevent the new Page 7 from breaking the standard layout. Inject the CFI page into the dynamic "Row 3" container, but **cap the grid at a maximum of 3 columns**. If 4 items are present (Instructor, Growth, Community, Export), snap to a 2x2 grid (`md:grid-cols-2`) so the cards remain wide and legible.
- **Mobile Sequence Update:** Conditionally inject the new `p7` component into the mobile `pages` swipe array so it perfectly precedes the Passport and Stats pages during the mobile flow.

### Release v2.0.0
- Offline PWA