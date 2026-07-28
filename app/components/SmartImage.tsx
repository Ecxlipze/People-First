"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/* SmartImage — next/image plus a fade-and-settle reveal once the bitmap is
   actually decoded, and an optional shimmer underneath while it isn't.

   Why this exists: photos across the site previously snapped in at full opacity
   the instant they decoded, which reads as a flicker on slower connections. The
   reveal is pure opacity/transform on the <img> (see `.pf-media` in globals.css)
   — the layout box is reserved by `fill`/width+height as before, so nothing
   moves and there is no CLS.

   Cached images are handled too: if the browser already has the bitmap the
   `onLoad` event can fire before React attaches its handler, so we check
   `img.complete` on mount and skip straight to the loaded state. Without that,
   a cached image would stay invisible forever. */
export default function SmartImage({
  className = "",
  /* Draws a shimmering placeholder behind the image until it loads. Only makes
     sense for images that fill a known box (i.e. `fill` or a fixed aspect
     ratio). */
  skeleton = false,
  onLoad,
  ...rest
}: ImageProps & { skeleton?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  /* Three states, and the distinction matters for no-JS safety:
       null  → not yet mounted; render NO data-loaded attribute, so the image is
               visible by default and a hydration failure can't hide it.
       false → mounted and still decoding; `.pf-media[data-loaded="false"]`
               hides it so it can fade up.
       true  → decoded; fade to visible. */
  const [loaded, setLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    const img = ref.current;
    // Already decoded (memory/disk cache, or loaded before hydration ran)?
    // `onLoad` will never fire for it, so go straight to the loaded state and
    // skip the fade rather than hiding an image that is already painted.
    setLoaded(img?.complete ? true : false);
  }, []);

  return (
    <>
      {/* Shimmer only while genuinely mid-decode (loaded === false). Never
          before mount, so it isn't server-rendered into pages that may not
          hydrate, and never after load. */}
      {skeleton && loaded === false && (
        <span
          aria-hidden
          className="pf-skeleton pointer-events-none absolute inset-0 z-0"
        />
      )}
      {/* `alt` is required by ImageProps and always arrives through {...rest};
          the lint rule can't see through the spread, so it is silenced here
          rather than weakened globally. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        ref={ref}
        {...rest}
        /* undefined omits the attribute entirely pre-mount — see the state
           comment above. */
        data-loaded={loaded === null ? undefined : loaded}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`pf-media ${className}`}
      />
    </>
  );
}
