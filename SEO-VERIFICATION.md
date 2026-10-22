# People First SEO verification

Checked on 22 October 2026 against https://peoplefirst.pk and the current local production build. This was a read-only audit: no deployment, hosting, DNS, CMS content, or application source changes were made during this check.

## Subsequent code remediation

After the audit, the user requested code fixes and chose to deploy them personally.
The frontend now overrides stale Insights API links with `/media-events`, supplies
absolute server-generated URLs to article sharing controls, and redirects the
exact www host permanently to the apex domain. Earlier metadata, structured-data,
canonical, and sitemap fixes are included in the working tree. These changes have
not been deployed by the agent. TLS certificate coverage and live webmaster
verification remain hosting/account tasks; see DEPLOYMENT.md. The findings below
describe the audited live snapshot, not a claim that the patched code is live.

Remediation verification: lint, TypeScript, production build, and
`git diff --check` passed. Local production HTTP checks confirmed that the
existing API record with the obsolete Insights domain renders `/media-events`;
all 104 local article pages include four absolute social destinations in the
initial HTML. The www-only redirect returned 308 for root, nested paths, assets,
and query strings; apex, localhost, and a lookalike hostname were not redirected.
Legacy redirects and canonical checks passed. Focused structured-data and
sitemap checks also passed after these changes.

Actual browser checks on `/home` and an article passed at 390×844, 768×1024,
1440×900, and 844×390: correct Insights/share destinations, no horizontal
overflow, and no completed-but-failed images. With reduced motion enabled,
keyboard activation of Insights navigated to `/media-events`; Tab moved between
the named article share links. Viewport and motion emulation were reset after
testing. These checks do not establish deployed behavior or external indexing.

## Findings requiring attention

1. **The www domain fails HTTPS certificate validation.** `https://www.peoplefirst.pk/` returns a hostname mismatch. The served certificate lists `peoplefirst.pk`, `mail.peoplefirst.pk`, and `webmail.peoplefirst.pk`, but not `www.peoplefirst.pk`. `http://www.peoplefirst.pk/` redirects to that failing HTTPS host. Configure valid TLS for www and a permanent redirect to https://peoplefirst.pk/ on the hosting server.
2. **One linked venture domain does not resolve.** The Insights venture link on `/home` points to `https://insights.peoplefirst.com`. DNS resolution failed. Confirm its intended destination before replacing the URL; this audit did not guess a replacement or change editorial data.
3. **The earlier local SEO changes are not live.** Live `/` still declares `/home` as canonical. The live sitemap lists 15 URLs, omits the existing `/` and `/gallery` routes, and assigns the same generated modification timestamp to static pages. The local build has self-canonicals for `/` and `/home`, includes `/gallery`, and omits unsupported static-page dates. Earlier metadata and structured-data changes also remain local.
4. **Article social share links need JavaScript for an absolute destination.** Server-rendered Facebook, LinkedIn, X, and WhatsApp share links contain a relative article path. `ShareButtons.tsx` adds the current origin after hydration. These links do not provide a complete share URL without JavaScript. Provider errors from automated share-dialog requests are not treated as confirmed broken destinations.

## Live checks passed

- **Page access:** All 20 checked routes returned HTTP 200: 15 sitemap destinations plus `/`, `/gallery`, `/partner`, `/training`, and `/cms/login`.
- **Technical indexability:** Public content has index/follow metadata. `/partner` and `/training` retain `noindex`; `/cms/login` has `noindex, nofollow`. No conflicting X-Robots-Tag header was observed on checked pages.
- **Robots:** `/robots.txt` returns HTTP 200, allows public crawling, and advertises `https://peoplefirst.pk/sitemap.xml`. Googlebot access to public routes and `/_next/image` is allowed. The CMS is excluded through noindex and authentication, rather than a robots disallow that would prevent reading noindex.
- **Sitemap:** XML parses successfully; all 15 listed destinations are reachable. The canonical and modification-date differences above remain outstanding on the live deployment.
- **Redirects:** HTTP apex redirects to HTTPS apex with 301. `/blog`, `/blog/example`, `/insights`, `/contact-us`, and `/home/` return permanent 308 redirects to their expected destinations. `/cms` leads to the login page. A deliberately nonexistent URL returns HTTP 404.
- **Links:** Extracted 45 unique HTTP(S) link destinations from checked pages. No failed internal destinations or broken internal fragments were found. Thirteen contact/share destinations were inspected as URLs rather than repeatedly requesting third-party share dialogs. The unresolved venture hostname is the confirmed external failure.
- **Delivered images:** All 560 unique rendered image URLs, including responsive srcset variants and Next.js optimization URLs, returned HTTP 200 with an image content type.
- **Original and background images:** All 118 checked original/inline-background/CSS image assets returned HTTP 200 with image content types. No Googlebot-Image robots block or X-Robots-Tag header was observed. An additional 37 CSS font assets also returned HTTP 200.
- **Image alternatives:** No rendered `<img>` element was missing an `alt` attribute. Empty alternatives occur on decorative assets; their presence alone is not a defect. This is not a claim that every editorial description is optimal.
- **Browser checks:** Actual browser inspection on live `/`, `/podcasts`, and `/gallery` found no completed-but-failed images or missing alt attributes. Local `/home` and `/gallery` also showed no failed images. Offscreen lazy-loaded images were distinguished from failures and their URLs were covered by HTTP checks.

## Local build checks

- Crawled 121 routes, including 118 sitemap destinations and three intentionally noindex routes: no failed page responses.
- Checked 569 delivered image URLs: no failures or missing alt attributes.
- No missing literal `/images/` references were found in public frontend TSX/CSS source.
- Local robots rules allow public crawling. Local canonical and sitemap origins use `http://localhost:3000`, matching the local environment; that is not the live site's configuration.
- Prior lint, TypeScript, production build, canonical, sitemap-date, and redirect checks passed in this chat. This audit did not modify application code or rerun unchanged build checks.

## Limits and unavailable proof

- Technical indexability does not establish that Google or Bing has indexed a page. Actual indexing, selected canonicals, crawl history, and sitemap ingestion require the domain's Search Console/Bing Webmaster Tools data, which was not available in this session. Public search returned no results for the tested domain queries; this is not proof of non-indexing.
- LinkedIn returned HTTP 999 to automated requests; its profile URL remains unverified rather than confirmed broken.
- The old Vercel hostname in DEPLOYMENT.md, `https://peoples-first.vercel.app`, returns `DEPLOYMENT_NOT_FOUND`. The saved Vercel project could not be found through the current CLI context. The user-confirmed live site is served through nginx/Plesk at https://peoplefirst.pk; hosting settings were not changed.
- HTTP asset checks establish reachability and content types; browser sampling establishes actual image loads on the inspected pages. This is not a complete accessibility or responsive visual audit.
