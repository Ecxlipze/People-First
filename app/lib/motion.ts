/* Shared motion helpers for client components. Keeping the media-query check in
   one place avoids slightly different accessibility behaviour across sections. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type FrameSubscriber = () => void;

const scrollSubscribers = new Set<FrameSubscriber>();
let scrollFrame = 0;

function flushScrollFrame() {
  scrollFrame = 0;
  scrollSubscribers.forEach((subscriber) => subscriber());
}

function scheduleScrollFrame() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(flushScrollFrame);
}

/* Reveal instances previously installed one window scroll/resize listener and
   one RAF per element. A page can contain dozens of reveals, so they now share
   one listener pair and animation frame while retaining the same scrubbed motion. */
export function subscribeScrollFrame(subscriber: FrameSubscriber) {
  scrollSubscribers.add(subscriber);

  if (scrollSubscribers.size === 1) {
    window.addEventListener("scroll", scheduleScrollFrame, { passive: true });
    window.addEventListener("resize", scheduleScrollFrame);
  }

  subscriber();

  return () => {
    scrollSubscribers.delete(subscriber);
    if (scrollSubscribers.size === 0) {
      window.removeEventListener("scroll", scheduleScrollFrame);
      window.removeEventListener("resize", scheduleScrollFrame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
    }
  };
}
