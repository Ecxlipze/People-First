/* Gallery photos for the "OUR GALLERY" carousel section.

   Two real event photos exist so far (gallery1 / gallery2, portrait SVGs with
   embedded raster). We alternate them to fill the coverflow so the carousel
   reads full — matching the design, where the flanking previews repeat a photo
   around a different centre one. Drop more files into public/images/ and add
   entries here; the carousel adapts to any count. */
export type GalleryPhoto = {
  src?: string;
  hasImage?: boolean;
  alt: string;
};

const A = {
  alt: "People First event",
  src: "/images/gallery/gallery1.webp",
  hasImage: true,
};
const B = {
  alt: "People First interview",
  src: "/images/gallery/gallery2.webp",
  hasImage: true,
};

// Alternated into a deeper ring so the coverflow reads as an endless stream of
// photos rather than an obvious "just a few" carousel. The carousel wraps
// seamlessly, so this loops forever in either direction.
export const GALLERY: GalleryPhoto[] = [A, B, A, B, A, B, A, B];
