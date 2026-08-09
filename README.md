# People First

People First is a design-led marketing website and venture ecosystem built on a highly visual, motion-heavy architecture. The platform introduces users to the brand’s focus areas, venture studios, and growth partnerships through a curated, interactive experience.

For a comprehensive technical handover, architectural deep-dive, and route reference, please see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

## Tech Stack

- **Framework**: Next.js 16.2.11 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript

## Prerequisites

- **Node.js**: v20+ recommended
- **npm**: v10+

## Installation

```bash
git clone <repository-url>
cd people-first
npm install
```

## Environment Variables

To run the project in production, you must configure the following variable in your `.env.local` or hosting provider:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | The absolute base URL of the production deployment. Used for canonical tags, JSON-LD, and the sitemap. | `https://peoplefirst.com` |

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

*(Additional legal and sub-routes are documented in the main project docs).*

## Deployment Basics

The project is built for zero-config deployment on Vercel.

1. Import the repository in your Vercel dashboard.
2. Ensure the framework preset is **Next.js**.
3. Set the `NEXT_PUBLIC_SITE_URL` environment variable to your exact production domain (e.g., `https://example.com` without a trailing slash).
4. Deploy.

---
*For more extensive engineering context, including responsive constraints, animation architecture, and SEO setup, read the [Detailed Project Documentation](./PROJECT_DOCUMENTATION.md).*
