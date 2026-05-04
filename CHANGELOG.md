# LogbookWrapped Changelog

*Last updated: 2026-05-03* 
*Current Version: v1.0.6*

## Overview
This document tracks past changes starting with v0.8.1.

## Changelog

### Release v1.0.6
- ShareLinkModal: title, icon badge, "What's in the link" heading, and ✓ checkmarks recolored to green; Generate button stays yellow
- ShareLinkModal: fixed background scroll-through when opened from ExportModal
- ShareLinkModal: added framer-motion scale+fade card entrance animation
- DonationModal: refactored from full-screen takeover to a centered card overlay with backdrop, scroll lock, and scroll stop propagation
- ExportModal, ShareLinkModal, DonationModal: X buttons now use yellow border accent consistent with the story close button

### Release v1.0.5
- Page 6 (Elements): Approach type breakdown chips (ILS / RNAV / VOR / LOC / NDB / Other) from ForeFlight typed descriptions
- Page 6 (Elements): Night flying % sub-line under The Night Owl
- Page 8 (Stats): Night hours shown as `X Hrs Night (Y%)` when night data is present
- Page 10 (Community): Percentile badge ("Top X% · More flight time than Y% of 2026 pilots")
- Page 10 (Community): VS layout swapped to Western reading order (Average on left, You on right); glow colors follow
- Page 10 (Community): Added `Community Page Viewed` and `Community Stats Error` Umami events for full funnel tracking
- Shareable hash link (`/s#...`): client-side encoded, no server storage, consent-gated, renders full read-only story carousel with "Create your own" CTA
- ExportModal: renamed header to **Share Your LogbookWrapped**, added inline yellow **Share as Link** button next to the Story/Post toggle, and reflowed the mobile header so the close (X) sits above the format slider with a full-width share button
- ShareLinkModal: recolored entirely to the site-standard yellow accent so it reads as a first-class primary action
- Page 11 & SharedView floating CTA: switched "Create Your Own LogbookWrapped" to yellow for visual consistency with the rest of the app
- Demo flow: when viewing a demo, Page 11 now swaps its Share/Donate/Growth buttons for the same "Create Your Own" pitch used on shared views, with a dedicated Demo sample footer note
- Demos page: redesigned the persona cards to show two visually distinct report slots (Yearly Wrapped vs Growth Report) with dedicated colors, eyebrow labels, and short descriptions instead of two near-identical buttons
- Privacy Policy: added Section 3 "Optional Shareable Link" explaining the client-side hash encoding (nothing uploaded, consent-gated, ~100 m rounded coords)
- FAQ: added a new "Can I share my LogbookWrapped with someone else?" entry
- About: added a sentence in "Why Privacy Matters" noting the optional share link also keeps data off our servers
- Code cleanup: trimmed verbose JSDoc / inline comments across ExportModal, ShareLinkModal, SharedView, Page11_Export, and Demos

### Release v1.0.4
- Fixed touch area issues for mobile stories
- Row 2/3 dyanamic areas on desktop
- Growth Page ui issues fixes
- Community Page fixes
- Dashboard Page Fixes

### Release v1.0.3
- Bug fixes

### Release v1.0.2
- Growth report over years
- Content updates
- Demo updates
- UI updates

### Release v1.0.1
- Bugfixes

### Release v1.0.0
- Added backend and db
- Added Community Stats Page
- Content Updates

### Release v0.9.9
- Reduced map sizes
- SEO/AEO Optimizations
- Content Updates
- NPM Updates
- Comment Cleanup
- Tech Debt Cleanup

### Release v0.9.8
- Performace tweaks and code cleanup
- Story Pages UI unification and updates
- Growth Page UI unification and updates
- Config page yellow highlight
- Screenshot Updates
- API Tests
- API documentation updates

### Release v0.9.7
- Security Updates
- SEO/AEO analysis
- Stats card (page 8) ui fixes
- Growth page monolithic breakup and restyling
- Demo file and UI updates
- Add growth report to year wrapped report.
- Scroll to top fixes

### Release v0.9.6
- Content Updates
- UI Updates
- Replace demo files
- Update screenshots

### Release v0.9.5
- Dev API updates
- Content Updates
- Backend Cleanup
- UI updates

### Release v0.9.4
- Growth wrapped updates
- Titles updates
- Config page updates
- My aviation dashboard 

### Release v0.9.3
- Dropzone UI Fixes
- Added API to footer
- New Homepage and UI Flow
- New Filters 
- New Compare Mode

### Release v0.9.2
- Added API endpoint and documentation
- Added data sources
- Added approach metrics

### Release v0.9.1
- Added experimental aicraft
- Updated asset manager
- Readme updates
- About us updates

### Release v0.9.0
- Added addtional umami tracking
- Change airport db

### Release v0.8.9
- Added umami tracking
- UI Updates and Tweaks
- New URL
- Updated Buy Me a Coffee / PayPal
- Contact Page UI
- Favicon

### Release v0.8.8
- Homepage demo files
- Aircraft profiles updates
- UI tweaks and bugfixes
- Code Cleanup
- Implemented a more consistent feel
- Domain name update

### Relase v0.8.7
- Bigfix: Page 7 map zoom on mobile
- Bugfix: Page 1 busiest month invalid date
- Page 8: Remove bottom table line on export
- Add unknown profile for logbook processing

### Release v0.8.6
- Switch to local assets for map generation
- Bigfix: Airport generation file
- Post and Story Tweaks
- Bugfix: Tiny black bar on the bottom of the export modal just on mobile

### Release v0.8.5
- Created two versions of the export in different aspect ratios for posts and stories
- Math Engine refactor into Map Builder, Navigation, and Superlatives 
- Export Modal Refactor into Export Engine, Preview Card and Export Pages

### Release v0.8.4
- Page 1 ui, content, metric and color updates
- Page 2 color updates to unify design
- Page 7 export bug fix
- Page 8 metrics and layout updates
- Page 9 touch area updates

### Release v0.8.3
- Screenshot Updates
- Swap pages 2 and 3
- Export page ui uppdates
- Refine support for ForeFlight and Garmin 
- Add support for LogTen and MyFlightbook

### Release v0.8.2
- Vertically center items in cell on Page 8
- Export page updates (Titles and Exports)
- Homepage ui fixes and content updates
- Contact page ui and content updates
- Added EFB format detector to console logs

### Release v0.8.1
- Max CSV 10MB upload
- Custom error pages
- Removed mapbox dependency 
- Bug fix with nginx conf
- Updated copywriter 
- UI updates
- Fleet page refactor
- Added Support Files