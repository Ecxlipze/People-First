# People First

People First is a design-led marketing website and venture ecosystem built on a highly visual, motion-heavy architecture. The platform introduces users to the brand’s focus areas, venture studios, and growth partnerships through a curated, interactive experience.

For a comprehensive technical handover, architectural deep-dive, and route reference, please see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## Tech Stack

- **Framework**: Next.js 16.3.0 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript

## Prerequisites

- **Node.js**: v20.9.0 or newer
- **npm**: v10+

## Installation

```bash
git clone <repository-url>
cd people-first
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` for local overrides. For a production build, configure the following variable in the build environment or hosting provider:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Required at production build time. The absolute public origin used for canonical tags, JSON-LD, the sitemap, and robots metadata. Trailing slashes are normalized. | `https://www.example.com` |

## Development

Start the local development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
*(Note: If `NEXT_PUBLIC_SITE_URL` is omitted in development, SEO utilities safely fall back to `http://localhost:3000`)*.

## Validation Commands

Run these scripts before committing changes to ensure code quality and build integrity:

- **Type Check**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

## Project Structure Summary

```text
├── app/                  # Next.js App Router root
│   ├── components/       # Shared cross-route UI components
│   ├── contact/          # Shared contact form state and server actions
│   ├── lib/              # Shared utilities (e.g., seo.ts)
│   ├── sitemap.ts        # Dynamic sitemap generator
│   ├── robots.ts         # Crawler directives
│   ├── globals.css       # Tailwind 4 theme, layout constraints, & tokens
│   ├── layout.tsx        # Global metadata, fonts, and layout wrappers
│   └── page.tsx          # Standalone radial landing experience
│
├── public/images/        # Static assets, graphics, and design mockups
├── package.json          # Project dependencies and scripts
└── next.config.ts        # Next.js configuration and route redirects
```

## Main Routes

- `/` (Landing Page)
- `/home` (Main Content Dashboard)
- `/about` (About Us)
- `/what-we-do` (Ventures & Impact)
- `/grow-with-us` (Partnerships)
- `/ideas-lab` (Studio Overview)
- `/insights` (Editorial Content)
- `/podcasts` (Media Content)
- `/contact` (Primary Contact Form)
- `/privacy` (Privacy Policy)
- `/terms` (Terms & Conditions)
- `/cookies` (Cookie Policy)
- `/partner` (Contact form with partner preselection; `noindex`)
- `/training` (Contact form with training preselection; `noindex`)

`/contact-us` permanently redirects to `/contact` with HTTP 308.

## Deployment Basics

The project can run on a standard Next.js-compatible Node.js production host. Vercel can detect it automatically, but no Vercel-only runtime feature is required.

1. Install dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_SITE_URL` to the final public origin.
3. Run `npm run build`.
4. Run the production server with `npm run start`, or use the equivalent workflow provided by the Next.js-compatible host.

The contact form currently validates submissions and writes them to server logs; it does not deliver enquiries to email or a CRM. Add and verify a delivery integration before launch if receiving enquiries is required.

---
*For more extensive engineering context, including responsive constraints, animation architecture, and SEO setup, read the [Detailed Project Documentation](./PROJECT_DOCUMENTATION.md).*
