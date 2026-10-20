"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { FacebookIcon, LinkedinIcon, WhatsappIcon, XIcon } from "@/app/components/SocialIcons";

/* Share row for an article. The primary button opens the device's native share
   sheet where there is one (phones, Safari), and otherwise copies the link.
   WhatsApp / LinkedIn / X / Facebook are plain links, so they work without
   scripting and give desktop visitors a direct route. */

const pill =
  "pf-interactive inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 font-display text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950";

const noopSubscribe = () => () => {};

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  /* The absolute address and native-share support are only known in the
     browser; the server render falls back to the bare path and no Share button. */
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "");
  const canShare = useSyncExternalStore(noopSubscribe, () => typeof navigator.share === "function", () => false);
  const url = `${origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      /* dismissed the sheet — nothing to do */
    }
  };

  const enc = encodeURIComponent;
  const links = [
    { name: "WhatsApp", Icon: WhatsappIcon, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "LinkedIn", Icon: LinkedinIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "X", Icon: XIcon, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { name: "Facebook", Icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];

  return (
    <div className="mt-12 border-t border-zinc-200 pt-6">
      <p className="font-display text-sm font-extrabold uppercase tracking-wider text-zinc-500">Share this article</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {canShare && (
          <button type="button" onClick={share} className={`${pill} !border-transparent !bg-[#a02f52] !text-white hover:!bg-[#8c2946]`}>
            <Share2 className="h-4 w-4" aria-hidden /> Share
          </button>
        )}
        <button type="button" onClick={copy} className={pill}>
          {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${l.name}`}
            aria-label={`Share on ${l.name}`}
            className={`${pill} min-w-11 justify-center !px-3`}
          >
            <l.Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
      <span role="status" className="sr-only">{copied ? "Link copied to clipboard" : ""}</span>
    </div>
  );
}
