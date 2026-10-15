# LogbookWrapped Roadmap

*Last updated: 2026-06-04*  
*Current Version: v1.1.1*

## Overview
This document tracks planned improvements, enhancements, and maintenance.

## Release Roadmap

### Release v1.1.3
- **Partner API & Secure Tracking Infrastructure:** Enhance the upload API to accept a `partner_id` parameter, secured via server-side API key validation. When a 3rd-party app submits a logbook, the backend will return a tamper-proof session token and track the partner's specific traffic in Umami. This establishes the secure, spoof-proof groundwork for future UI white-labeling (e.g., co-branded watermarks) without making any immediate visual changes to the frontend.
- API documentation expand. I want all the options clearly laid out in great detail on /dev. This should be a tech doc page. 

### Release v1.1.4: The CFI Expansion
- **New CFI/Instructor Page (Page 7):** Create a dedicated "Flight Instructor" page that dynamically renders only if the parsed logbook contains >10 hours of `Dual Given`. The page will feature these exact instructor-specific metrics:
  - **The "Passing the Torch" Ratio:** Percentage of total time spent teaching (`(Dual Given / Total Time) * 100`).
  - **The Pattern Warrior:** "You survived [X] student landings this year." (Comparing landings to total flights when Dual Given > 0).
  - **The IMC Mentor:** Hours of instruction given under the hood or in actual clouds. (hide if 0)
- **Main Stats Update:** Inject "Dual Given" as a standard sub-metric under the "Total Time" row on the main Stats page so CFIs see their core instruction metric regardless of the dedicated page. Only show if greater than 0.
- **Component Renumbering:** Shift all components from Page 7 onward to maintain chronological file structure. Rename `Page7_Passport` to `Page8_Passport`, `Page8_Stats` to `Page9_Stats`, up through `Page12_Export`. Update all imports and Umami tracking arrays accordingly.
- **Desktop Grid Layout Protection (Max 3 Columns):** Update the `StoryContainer` masonry grid to prevent the new Page 7 from breaking the standard layout. Inject the CFI page into the dynamic "Row 3" container, but **cap the grid at a maximum of 3 columns**. If 4 items are present (Instructor, Growth, Community, Export), snap to a 2x2 grid (`md:grid-cols-2`) so the cards remain wide and legible.
- **Mobile Sequence Update:** Conditionally inject the new `p7` component into the mobile `pages` swipe array so it perfectly precedes the Passport and Stats pages during the mobile flow.

### Release v1.1.5
- Break Down Monolithic Functions
  - The Issue: calculateStats in MathEngine.ts is a massive, single function that calculates dozens of disparate metrics in one pass. AI loves generating giant blocks of procedural code because it lacks architectural foresight.
  - The Fix: Break this into smaller, pure sub-functions (e.g., calculateTimeStats(flights), calculateDistanceStats(flights), calculateSuperlatives(flights)). Compose them together at the end. This makes the math engine inherently testable and easier to maintain.

### Release v1.1.6
- Decouple Business Logic from State Management
  - The Issue: useLogbookStore.ts handles complex data transformations (applyFilterAndCalculate) and side effects (API calls with AbortController). AI often dumps everything into the store because it's the "easiest" context window to work in.
  - The Fix: Move the heavy data-crunching logic into dedicated service files (e.g., FilterEngine.ts). The Zustand store should only be responsible for storing the state, not computing it.

### Release v1.1.7
- Implement Route-Level Code Splitting (Lazy Loading)
  - The Issue: App.tsx imports every single page component synchronously. If a user just visits the homepage, they are downloading the heavy charting/mapping libraries required for the "Wrapped" and "Growth" pages.
  - The Fix: Use React.lazy() and <Suspense> for your heavy routes (e.g., const Wrapped = lazy(() => import('./components/pages/Wrapped'));). This is a fundamental React best practice for performance that AI rarely suggests proactively.

### Release v1.1.8
- Clean Up Inline Conditional Styling (Tailwind Spaghetti)
  - The Issue: In Page2_BigPicture.tsx, there are deeply nested ternaries for styling: className={`${exportFormat === 'post' ? (isLongLine1 ? 'text-2xl mb-6' : 'text-3xl mb-6') : ...}`}. AI generated code is notoriously bad at creating reusable CSS architectures.
  - The Fix: Use a utility library like clsx or tailwind-merge to construct class strings, or define variant objects at the top of the file. It makes the JSX much cleaner and easier for a human to read.

### Release v1.1.9
- Replace Custom Polyfills with Standard Libraries
  - The Issue: The generateId UUID fallback using Math.random().toString(16) in your store is a classic LLM hallucination/boilerplate snippet. It is not cryptographically secure and prone to collisions.
  - The Fix: Delete it and install the standard uuid npm package, or rely strictly on crypto.randomUUID() if your browser support matrix allows it.

### Release v1.2.0
- Eliminate any in Error Handling
  - The Issue: In useLogbookStore.ts, the catch block uses catch (error: any). AI relies heavily on any to bypass TypeScript compiler errors quickly.
  - The Fix: Type it as catch (error: unknown) and explicitly check if (error instanceof Error) before accessing error.message. This is standard strict TypeScript practice.

### Release v2.0.1
- Offline PWA