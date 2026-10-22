# Search and AI crawler access — 22 October 2026

Live target: https://peoplefirst.pk. Read-only verification; no website, robots,
hosting, account, or source configuration was changed.

## Outcome

Public crawling is allowed by robots.txt. All 17 sitemap URLs returned HTTP 200
and server-rendered, indexable content for the Googlebot, bingbot, OAI-SearchBot,
ChatGPT-User, and GPTBot user-agent-token tests. Claude-SearchBot returned 16 of
17 pages before connection failures began. Later agents could not be fully
verified, because connections timed out or were refused. Ordinary requests
without a crawler user agent also failed afterward.

This is **not a complete all-crawler pass**, and the failed requests are not
classified as robots exclusions or confirmed crawler-specific blocks.

## Robots rules observed

`https://peoplefirst.pk/robots.txt` returned HTTP 200 at the start of the audit:

```text
User-Agent: *
Allow: /

Sitemap: https://peoplefirst.pk/sitemap.xml
```

The wildcard allows all tested agents. There is no need to add redundant
per-agent allow rules based on the observed configuration.

## Public HTML test matrix

Ten user-agent tokens × 17 public sitemap URLs, five concurrent requests maximum:

| User agent token | robots.txt policy | HTTP 200 pages | Result |
| --- | --- | ---: | --- |
| `Googlebot` | Allowed | 17/17 | Passed |
| `bingbot` | Allowed | 17/17 | Passed |
| `OAI-SearchBot` | Allowed | 17/17 | Passed |
| `ChatGPT-User` | Allowed | 17/17 | Passed |
| `GPTBot` | Allowed | 17/17 | Passed |
| `Claude-SearchBot` | Allowed | 16/17 | Incomplete: connection failures |
| `Claude-User` | Allowed | 0/17 | Incomplete: connection failures |
| `ClaudeBot` | Allowed | 0/17 | Incomplete: connection failures |
| `PerplexityBot` | Allowed | 0/17 | Incomplete: connection failures |
| `Perplexity-User` | Allowed | 0/17 | Incomplete: connection failures |

The 101 successful public page responses contained rendered HTML text, with no
observed public `noindex`, login wall, or challenge page. This confirms content
can be read without executing the site's animations or client-side JavaScript.
The homepage's intentionally small branding/navigation content was also present.
One article's text hash varied across successful requests; exact content identity
is not claimed.

The web retrieval tool independently fetched and read `/home` and `/about`
successfully during the audit. A later fresh request through that tool also
failed, so uninterrupted availability is not established.

## Additional probes and limitations

- Representative full Googlebot, bingbot, OAI-SearchBot, and PerplexityBot user-agent
  strings were tested on four routes each after the interruption began. These
  requests timed out or were refused, including Googlebot, which had succeeded
  on all pages earlier.
- Later robots/sitemap/image probes and checks of intentionally noindex routes
  could not be reverified during this run because of the same connection failure.
- The ordinary control request to `/about` failed to establish a TCP connection.
  There was no HTTP 403, 429, challenge body, or robots disallow proving a specific
  bot block. Possible causes include transient hosting/network unavailability or
  an IP-based firewall/rate limit; server logs are needed to distinguish them.
- Changing a User-Agent header does not originate a request from Google's,
  OpenAI's, Anthropic's, or Perplexity's actual crawler networks. Provider-IP
  access and actual crawl visits require host/WAF logs or webmaster reports.
- Technical access does not prove indexing, AI citations, or ranking.

## Required follow-up

The owner or hosting administrator should check nginx/Plesk availability and
firewall/rate-limit logs for this audit window. Once ordinary requests are
reliably accessible again, repeat the incomplete crawler checks. Do not weaken
security rules or add broad IP allowlists merely on the basis of a user-agent
string.

Crawler identities were checked against official documentation:

- [OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- [Anthropic crawlers](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
