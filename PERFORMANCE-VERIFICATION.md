# Loading performance verification — 22 October 2026

## Changes

- Kept every font family, weight, style, and display strategy. Disabled global preloading for Poppins (radial labels) and Cormorant Garamond (footer CTA); the browser still loads the faces when used.
- Matched landing-logo and home-hero image `sizes` to their existing CSS geometry. No dimensions, artwork, copy, animation timing, or layout classes were changed.
- Encoded the landing background as lossless WebP: 116,250 → 51,234 bytes. Decoding both files to RGBA produced byte-identical pixels. The original PNG is retained.
- Kept the home hero's decorative pattern eagerly loaded but at low fetch priority, so it does not compete with critical text/logo resources. Removed the below-the-fold gallery's forced image preload; its carousel, placeholders and image fade effects are unchanged.
- Reused the existing shared scroll-frame queue for Stagger's geometry fallback. Scroll/resize bursts now share one frame instead of running a synchronous sweep for each event. Kept observer thresholds, easing, durations, stagger spacing, font/resize fallbacks, and reduced-motion behavior.

## Measured loading weight

Three before/after navigations per route in the local production build, 390×844 viewport, DPR 1, browser cache disabled and CPU throttled 4×. Network transfer data was collected through browser DevTools events. Values below are rounded KiB and medians of three samples.

| Route | Font transfers before → after | Image transfers before → after | Font preloads before → after |
| --- | ---: | ---: | ---: |
| `/` | 254 → 170 | 253 → 84 | 7 → 4 |
| `/home` | 254 → 170 | 121 → 121 | 7 → 4 |
| `/podcasts` | 254 → 170 | 107 → 107 | 7 → 4 |

Landing image transfers fell approximately 67%, and font transfers approximately 33% on all three measured routes. The mobile landing logo's delivered response fell from 128,237 to 19,920 bytes after selecting an appropriate source width. On higher-DPR screens the browser can still select larger sources.

Other requests vary because Next.js prefetches visible links. This report does not treat fluctuating total requests or local DOM-ready timings as a reliable Core Web Vitals improvement.

## Verification

- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `git diff --check` passed.
- Browser route checklist: `/`, `/home`, `/about`, `/what-we-do`, `/grow-with-us`, `/ideas-lab`, `/podcasts`, `/media-events`, `/gallery`, `/kissan-veer`, `/contact`, `/partner`, `/training`, `/privacy`, `/terms`, `/cookies`, and an article detail page.
- Checked all 17 routes at 390×844, 768×1024, 1440×900, and 844×390: no horizontal overflow. A hidden desktop-only illustration on narrow `/what-we-do` layouts had no decoded bitmap while hidden; its optimized URL returned HTTP 200. This is not classified as a visible image failure.
- Repeated all 68 route/viewport checks with reduced motion: no overflow, no visible image failures, and ambient/entrance CSS animations disabled as expected.
- Normal-motion browser scroll checks confirmed changing perspective/scale transforms and completed reveals. A full desktop landing screenshot was visually inspected.
- Contact trigger keyboard activation opened the modal, focus moved inside, Escape closed it, and focus returned to the trigger. No inquiry was submitted.
- A focused frame-queue check verified that a burst of 20 scroll events plus resize schedules one frame; each subscriber updates once, and unsubscribing removes listeners and cancels pending work.

## Scope and limits

These are local source, build, browser, and transfer measurements. No production deployment, hosting change, Git commit or push was performed. No field LCP, INP, or CLS result is claimed: production user data must be evaluated after deployment. Browser performance-timeline collection was unavailable in this environment, so no Lighthouse score or fabricated vital timing is reported.

Deploy the complete frontend changes, including `public/images/bg-landing.webp`, and rebuild/restart through the existing Plesk process. Preserve the production environment, uploaded media, and API configuration.
