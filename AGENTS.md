<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# People First repository guide

## Project overview

People First is a design-led marketing website built with Next.js 16.2.11,
React 19, TypeScript, Tailwind CSS 4, and the App Router. It is intended for
Vercel and currently has no database, authentication layer, or automated test
suite.

The site is deliberately visual and motion-heavy. Preserve the existing brand,
copy, typography, color palette, artwork, animation language, and page behavior.
Do not redesign the site while fixing a bug or adding content.

## Source map

- `app/layout.tsx` owns global metadata, the three `next/font` declarations, and
  the site-wide `ContactModalProvider`.
- `app/globals.css` is the Tailwind 4 CSS-first theme and the source of truth for
  brand tokens, typography, interaction utilities, animations, and reduced-motion
  fallbacks. There is intentionally no `tailwind.config` file.
- `app/page.tsx` is the standalone radial landing page; `/home` is the main
  long-form homepage.
- The primary content routes are `/about`, `/grow-with-us`, `/ideas-lab`,
  `/insights`, `/podcasts`, and `/what-we-do`.
- `/contact`, `/partner`, and `/training` share `ContactPageBody` and the same
  contact form, with route-specific headings or default roles.
- `/privacy`, `/terms`, and `/cookies` use the shared `LegalPageLayout` with
  route-local policy sections.
- `app/components/` contains cross-route UI. `SideNav`, `SiteFooter`,
  `TallSwipePanel`, `ScrollFx`, `SmartImage`, and the contact components have
  behavior that affects multiple pages; audit all consumers before changing
  them.
- Route-specific presentation components live in each route's `sections/`
  directory. Route-local content arrays stay beside their route; shared content
  arrays live in `app/components/`.
- `public/images/` contains production assets as well as PDF/JPG design
  references and mockups. Do not delete or replace reference assets unless the
  task explicitly calls for it.

## Implementation rules

### Next.js and React

- Read the relevant version-matched App Router guide under
  `node_modules/next/dist/docs/01-app/` before changing Next.js behavior. The
  bundled docs, not remembered APIs, are authoritative.
- Keep pages and layouts as Server Components by default. Add `"use client"`
  only at the smallest boundary that needs state, effects, event handlers, or
  browser APIs.
- Keep `"use server"` modules limited to async function exports. Shared types
  and constants for the contact action belong in `app/contact/state.ts`.
- Use the `@/*` alias for project-root imports. Use `next/link` for internal
  navigation and `next/image` for shipped images; provide accurate `alt`,
  intrinsic dimensions or `fill`, and responsive `sizes` where applicable.
- Define route metadata with typed `Metadata` exports. Load site fonts only in
  `app/layout.tsx`; do not create duplicate `next/font` instances.
- Do not add middleware for new Next.js work without checking the v16 docs;
  Next.js 16 uses the `proxy` convention.

### Design and styling

- Extend the existing Tailwind 4 theme in `app/globals.css` instead of creating
  a Tailwind config or scattering duplicate global tokens.
- Reuse the `pf-*` interaction, card, media, typography, and motion utilities
  before inventing a parallel style. New body text should inherit Inter;
  headings and display text use Montserrat. Poppins is reserved for the landing
  page radial-nav labels.
- Treat the detailed measurement comments in components and CSS as constraints,
  not noise. Many positions, aspect ratios, and breakpoints were derived from
  the supplied mockups. Update the explanation when intentionally changing the
  corresponding behavior.
- Keep `SideNav` outside page wrappers that use `overflow-x-clip`; fixed
  positioning and the swipe-over layouts depend on that structure. Do not add
  `transform`, `perspective`, or `transform-style` to `body`.
- Do not put `.pf-card` or `.pf-lift` on an element whose transform is controlled
  by `Reveal`, `Recede`, `PinnedRecede`, or another scroll effect; apply it to a
  child so the transforms do not compete.
- Preserve `prefers-reduced-motion` behavior for every new animation. Motion
  must not leave content hidden, clipped, or separated by empty scroll tracks
  when animations are disabled.

### Responsive and accessible UI

- Fix genuine responsive defects without changing the visual direction. Check
  phones, tablets, desktop, and short landscape viewports; width-only testing is
  insufficient for this project.
- Preserve the existing `svh`/`dvh` sizing, safe-area padding, scrollable mobile
  drawer, and `[@media(max-height:...)]` fallbacks when editing full-height
  sections, navigation, or the contact modal.
- Interactive controls should generally provide an approximately 44px target
  (`min-h-11`, `h-11`, or `min-w-11`) and a visible keyboard focus state.
- Maintain semantic headings, useful alternative text, labels and field errors,
  `aria-current`, dialog focus trapping/restoration, Escape handling, and
  keyboard parity for hover interactions.
- For responsive or shared-component changes, use a route/component checklist;
  do not validate only `/` or `/home`.

### Contact flow

- `ContactTrigger` must remain a real link with a direct-navigation/no-JavaScript
  fallback while intercepting ordinary left-clicks to open the modal.
- Both the modal and standalone contact routes submit through
  `app/contact/actions.ts`. Keep server-side validation and the honeypot even if
  adding client-side validation.
- The current action only logs the validated submission and returns success. Do
  not claim messages are delivered until a real email or CRM integration is
  implemented and verified.

## Working practice

- Inspect `git status` before editing and preserve unrelated or in-progress user
  changes. Keep patches focused; do not perform broad cleanup during a scoped
  task.
- Prefer existing components and data structures over duplicated markup. Keep
  TypeScript strict and avoid `any` unless there is a documented boundary that
  cannot be typed more narrowly.
- Do not add dependencies, change deployment configuration, or modify external
  services unless the task requires it.
- Use comments for non-obvious layout math, browser behavior, or architectural
  constraints. Avoid comments that merely restate the JSX.

## Verification

For code changes, run the checks proportional to the affected scope:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

There are no automated tests configured. For UI work, also inspect every
affected route in a real browser at representative mobile, tablet, desktop, and
short-landscape sizes. Exercise keyboard navigation and reduced-motion when the
change touches interaction or animation.

Report verification precisely: lint, type checking, build output, HTTP checks,
and source inspection are not substitutes for browser visual or interaction
testing. Never claim browser verification without actual browser output or
screenshots.
