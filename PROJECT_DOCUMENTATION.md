# People First: Technical Handover & Project Documentation

This document serves as the comprehensive technical handover for the People First website. It details the precise implementation, architecture, and constraints of the codebase as currently verified.

---

## Project Overview
People First is a design-led marketing website and venture ecosystem built on Next.js. The site heavily emphasizes visual aesthetics, typography, and motion to communicate the brand's identity, ventures, and partnership opportunities.

## Technology Stack
- **Framework**: Next.js 16.2.11 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript

## Application Architecture
The application leverages the Next.js App Router. Pages and layouts default to React Server Components. Interactive sections (e.g., animations, forms, stateful UI) use `"use client"` at the lowest possible boundaries in `app/components/` and route-specific `sections/`. Forms are backed by Next.js Server Actions.

## Directory Structure
```text
├── app/
│   ├── components/       # Shared UI (SideNav, Footers, Image wrappers, Modals)
│   ├── contact/          # Contact page and shared Server Actions/State
│   ├── lib/              # Core utilities (e.g., seo.ts)
│   ├── [routes]/         # Individual page directories (e.g., home, about)
│   │   └── sections/     # Route-specific UI components
│   ├── globals.css       # Source of truth for Tailwind 4 theme, layout, & motion
│   ├── layout.tsx        # Global fonts, metadata, and providers
│   ├── page.tsx          # Root landing page
│   ├── robots.ts         # Dynamic robots configuration
│   └── sitemap.ts        # Dynamic sitemap configuration
├── public/images/        # Deployed graphical assets and reference mockups
├── next.config.ts        # Next configuration and redirects
└── package.json          # Dependency definitions
```

## Route Reference

### `/`
A standalone, immersive radial landing page containing purely graphic entryways into the brand. It has no visible text (using an `sr-only` `<h1>`), canonicalizes to `/home`, and uses a unique `absolute` metadata title to avoid template duplication.

### `/home`
The primary scrolling dashboard serving as the substantive homepage. Displays featured work, ventures, testimonials, and ecosystem metrics. It relies heavily on swipe panels and custom scroll effects (`Recede`).

### `/about`
The organizational backstory route. Features scroll-triggered impact metrics, timeline interactions, and core values.

### `/contact`
The dedicated contact route rendering `ContactPageBody`. Shares the same form component and validation logic as the global side modal.

### `/contact-us`
**Redirect Behavior**: The physical route folder was removed. A 308 Permanent Redirect in `next.config.ts` forwards `/contact-us` strictly to `/contact` to consolidate link equity and prevent duplicate React rendering.

### `/grow-with-us`
Focuses on partnership opportunities, targeting investors, collaborators, and ecosystem participants. Connects directly to the global Contact modal.

### `/ideas-lab`
Details the internal venture studio pipeline and methodology.

### `/insights`
An editorial content board for articles and updates. Lacks top-level textual headings (relies on an `sr-only` `<h1>`).

### `/what-we-do`
Highlights the operational scope, active venture domains, and core problem areas. Features horizontal scrolling panels (`PainPoints`) and impact data.

### `/podcasts`
A media-centric route embedding or linking to featured podcast episodes, speaker highlights, and audio content.

### `/privacy`, `/terms`, `/cookies`
Legal content routes relying on `LegalPageLayout`. Shared brand, effective-date, and contact values are centralized; the current legal contact email was sourced from the project-provided Contact Us reference and still requires company/legal confirmation before launch.

### `/partner` & `/training`
Utility routes that share `ContactPageBody` but pre-select specific "roles" in the form. They are fully crawlable by bots to verify their explicitly configured `noindex` metadata directives.

## Shared Components
- **`SideNav`**: A persistent right-aligned vertical navigation bar. Anchored outside standard page wrappers to maintain fixed positioning.
- **`SiteFooter`**: Global footer utilized by standard scrolling routes (excluding the radial landing page).
- **`ContactModal` / `ContactTrigger`**: A context-aware overlay system enabling users to reach out from any page.
- **`SmartImage`**: A wrapper optimizing `next/image` with skeleton loaders and consistent `fill`/`sizes` logic.
- **`ScrollFx` / `TallSwipePanel`**: High-performance scrolling and transformation wrappers built for complex responsive layouts.

## Typography System
The primary site typography uses two typefaces declared in `app/layout.tsx` with `next/font`:
1. **Montserrat**: Reserved for prominent text—headings, primary stats, stylistic labels, and CTA typography.
2. **Inter**: Reserved for dense readability—body copy, detailed paragraphs, and supporting structural text.
Poppins is also loaded intentionally and is restricted to the measured radial-navigation labels on the `/` landing page.

## Design / Mockup Implementation Notes
- Numerous spacing values, aspect ratios, and grid configurations are manually hardcoded in CSS or inline classes (e.g., `aspect-[1.03/1]`, specific `px` translations).
- **WARNING**: Do not casually normalize "weird" fractional layout values. They were directly mathematically extracted from original Figma/PDF mockups (`public/images/mockups/`) to ensure exact brand parity. 

## Responsive Architecture
The site does not rely exclusively on traditional width breakpoints. Due to full-height swipe panels and immersive media:
- **`svh` / `dvh`** units are aggressively used to handle mobile browser toolbars.
- **Short-landscape** viewports (tablets/phones on their side) possess specific `[@media(max-height:...)]` overrides in `globals.css` to prevent UI overlap in constrained vertical spaces.
- Validation requires testing on physical/simulated device dimensions, not just dragging browser width.

## Side Navigation Architecture
The `SideNav` component is injected inside `app/home/page.tsx` and other root page levels. It must remain *outside* of container divs utilizing `overflow-x-clip` to ensure its fixed `z-[100]` positioning maps correctly relative to the viewport.

## Route Architecture Details

### Home Page Architecture
Combines multiple disparate "Showcase" components. Heavily relies on `overflow-x-clip` to hide off-canvas animations and requires the `Recede` scroll effect to transition smoothly into the `HeroCTA`.

### About Page Architecture
Linear narrative flow relying on high-contrast background transitions (often relying on intersection observers or sticky positioning).

### Grow With Us Architecture
Utilizes large typography blocks and multi-column grid layouts to separate partnership tiers, terminating in a prominent `ContactTrigger` integration.

### Ideas Lab Architecture
Features timeline-based or step-by-step pipeline visualizations. Mobile implementations stack these vertically, while desktop implementations rely on lateral flow.

### Insights / Studio Architecture
Grid-based layout utilizing masonry or uniform card grids. Article images use tight aspect ratios. An accessibility `sr-only` heading ensures screen readers announce the page context properly.

### What We Do Architecture
Contains the `PainPoints` layout which relies on horizontal swipe mechanics on mobile, transitioning to a dense grid on large desktops.

### Podcasts Architecture
Highlights large featured episodes at the top (`Hero` banner) followed by secondary grids.

### Contact Form Architecture
- **Validation**: Server-side validation is enforced in `app/contact/actions.ts`; the form also supplies field constraints and accessible inline error state.
- **Honeypot**: Employs a hidden `company` input field to trap bots.
- **Routing**: `app/contact/page.tsx` and the modal utilize the same state flow.
- **Preselection**: `/partner` and `/training` routes pass default values to pre-populate dropdown selections.
- **Delivery**: Currently configured to validate and `console.log` submissions only. Email/CRM dependencies have not been integrated.

### Legal Pages
Wrapped in a unified `LegalPageLayout`. Variables like the Brand Name and effective dates are centralized here to maintain one source of truth.

## SEO Architecture
The SEO configuration adheres to modern Next.js metadata API standards:

- **Centralized Helper**: `app/lib/seo.ts` exports `getBaseUrl()`.
- **Production URL Requirement**: `getBaseUrl()` defaults to localhost in dev, but strictly requires `NEXT_PUBLIC_SITE_URL` in production. It will throw an error if missing during a production build to prevent silently publishing fake domains to live metadata.
- **MetadataBase**: Implemented in `layout.tsx` using the centralized helper.
- **Page Metadata**: Each page exports semantic `title` and `description` objects. The root `/` route overrides the `template` with an `absolute` title to prevent `People First | People First`.
- **Canonical Strategy**: `/` explicitly canonicalizes to `/home`. Each other indexable route exports an explicit self-referencing canonical path.
- **Noindex Routes**: `/partner` and `/training` export explicit `robots: { index: false }` directives. They are deliberately omitted from `robots.ts`'s `disallow` list so crawlers can access them and register the `noindex`.
- **Sitemap**: Generated dynamically via `app/sitemap.ts`, explicitly excluding the non-canonical root and utility routes.
- **Structured Data**: `Organization` and `WebSite` JSON-LD are injected in `app/layout.tsx`. Unverified placeholders (like mock addresses or placeholder emails) have been aggressively scrubbed.
- **Open Graph / Twitter**: Baseline title, description, site, locale, type, and card metadata is configured in `layout.tsx`. A shared `og:url` is intentionally not emitted because it would incorrectly identify every route as the same page; explicit canonical URLs remain route-specific. Images are pending.

## Environment Variables
- `NEXT_PUBLIC_SITE_URL`: **Mandatory at Production Build Time.** Set it to the absolute public origin (e.g., `https://www.example.com`). Whitespace and trailing slashes are normalized. It is used for absolute metadata resolution, JSON-LD, sitemap entries, and the robots sitemap URL.

## Asset Management
Graphical assets, SVGs, and legacy mockup PDFs reside in `public/images/`. `next/image` is utilized strictly for responsive intrinsic sizing. Unverified/placeholder OG assets have not been implemented.

## Accessibility
- Focus states and keyboard-navigable links are preserved.
- Semantic HTML5 structure is enforced.
- Missing visible headings on graphical layouts (like `/` and `/insights`) are supplemented with `<h1>` tags bearing `className="sr-only"`.

## Animation / Reduced Motion
Animations are driven largely by Tailwind CSS transitions and custom utility classes. 
All complex scaling, scrolling, or opacity animations must respect the system-level `prefers-reduced-motion` media queries defined in `app/globals.css` to ensure content is accessible when animations are disabled.

## Development Workflow
- Follow the standard `npm run dev` flow.
- Do not introduce arbitrary dependencies or libraries for styling; extend `globals.css` using native Tailwind 4 variables.

## QA / Validation Commands
Execute prior to any commit:
- `npx tsc --noEmit` (Validates TS strictness)
- `npm run lint` (Next.js ESLint execution)
- `git diff --check` (Whitespace and conflict marker check)

## Production Build
Executed via `npm run build`. Note: Because Next.js Turbopack is employed, external font fetching (`fonts.googleapis.com`) must be accessible to the build server. Network firewalls blocking Google Fonts will cause the build to fail.

## Deployment Checklist
1. Use Node.js 20.9.0 or newer on a standard Next.js-compatible production host.
2. Supply `NEXT_PUBLIC_SITE_URL` in the production build environment.
3. Run `npm ci`, `npm run build`, and `npm run start` (or the host's equivalent Next.js workflow).
4. If the website must receive enquiries, obtain approval for a delivery provider and implement and verify it before launch.

## Known Limitations / Pending Items
- **Contact Form Delivery**: The form validates but only writes submissions to server logs. No email or CRM delivery mechanism is active. This is a launch blocker if receiving enquiries is an intended production function, and the handling/retention of submitted personal information in host logs must be reviewed.
- **Open Graph Image**: `layout.tsx` is prepared for Open Graph sharing, but the asset (`/public/images/og/people-first-og.png`) is missing.
- **Build-Time Font Dependency**: Google Fonts must be reachable during the `npm run build` step; offline/sandboxed builds will fail.

## Maintenance Guidelines
When modifying the site:
1. Do not use Tailwind utility strings blindly for custom colors; rely on established brand tokens.
2. Verify cross-device layouts (specifically horizontal landscape on mobile) due to the heavy usage of viewport-relative heights.
3. Keep server components as the default. Only client-render small interactive islands.
