"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* Pulls the video id out of a YouTube watch / short / embed URL. */
function youTubeId(url?: string): string | null {
  const m = url?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* Episode still that survives a missing upload. The API can name a thumbnail
   file that is no longer on the media host (the file 404s), which left a broken
   image and alt text on the card. When the upload fails to load, fall back to
   the video's own YouTube thumbnail, and to the card's dark plate if even that
   is unavailable. */
export default function EpisodeThumb({
  src,
  alt,
  videoUrl,
  sizes,
  className,
}: {
  src?: string;
  alt: string;
  videoUrl?: string;
  sizes: string;
  className: string;
}) {
  const [uploadFailed, setUploadFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const id = youTubeId(videoUrl);
  const ref = useRef<HTMLImageElement>(null);

  /* The server-rendered <img> can fail before React attaches onError, and the
     event never fires again; catch an already-broken image on mount. */
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setUploadFailed(true);
  }, []);

  if (src && !uploadFailed) {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={() => setUploadFailed(true)}
      />
    );
  }
  if (id && !fallbackFailed) {
    return (
      // Plain <img>: a remote YouTube still is a last-resort fallback, so it
      // skips the optimizer and its host allow-list.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full ${className}`}
        onError={() => setFallbackFailed(true)}
      />
    );
  }
  return null;
}
