"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, ExternalLink } from "lucide-react";

type VideoModalProps = {
  video: { url: string; title: string } | null;
  onClose: () => void;
};

function getEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    // Standard YouTube: youtube.com/watch?v=ID
    if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
      const id = url.searchParams.get("v");
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    // Shortened YouTube: youtu.be/ID
    if (url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be")) {
      const id = url.pathname.replace(/^\//, "");
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    // Vimeo: vimeo.com/ID
    if (url.hostname.includes("vimeo.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!video) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus close button on mount
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [video, handleKeyDown]);

  if (!video) return null;

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="animate-modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Dialog Panel */}
      <div
        ref={dialogRef}
        className="animate-modal-panel relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#140522] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 className="max-w-[75%] truncate font-display text-sm font-semibold text-white sm:text-base">
            {video.title}
          </h2>
          <div className="flex items-center gap-2">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pf-interactive flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Open in new tab"
              aria-label="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="pf-interactive flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close video dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player 16:9 */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="grid h-full place-items-center p-6 text-center text-white/70">
              <p>Video URL cannot be previewed inline.</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Open video directly <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
