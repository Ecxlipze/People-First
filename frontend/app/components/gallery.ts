/* Gallery photos for the "OUR GALLERY" carousel section.

   THREE distinct photos exist — and that is all the design has too. HOME4.pdf
   embeds only three bitmaps of its own (two 589×590 squares and one 2268×4032
   portrait) and repeats them around the ring, so the mockup's "lots of photos"
   impression comes from repetition, not from a large library.

   Note gallery1/gallery2 were already here and gallery3 came out of HOME4.pdf;
   the mockup's other two bitmaps turned out to be the SAME shots as gallery1 and
   gallery2, so importing them would have added duplicates, not variety.

   All three are cropped to the design's centre-slide aspect: 399×675 on the 1920
   frame → 0.591 portrait. gallery1's source is landscape (590×393), where a
   portrait window keeps only 232px of width and cannot hold both seated men, so
   it frames the right-hand one instead of slicing both.

   Drop more files into public/images/gallery/ and add entries here; the carousel
   adapts to any count. */
export type GalleryPhoto = {
  src?: string;
  hasImage?: boolean;
  alt: string;
};

const PHOTOS: GalleryPhoto[] = [
  {
    alt: "Guest seated for a studio interview in the People First podcast space",
    src: "/images/gallery/gallery1.webp",
    hasImage: true,
  },
  {
    alt: "Rai Salahuddin Ahmad at a People First partner event",
    src: "/images/gallery/gallery2.webp",
    hasImage: true,
  },
  {
    alt: "Panel discussion at a People First roundtable",
    src: "/images/gallery/gallery3.webp",
    hasImage: true,
  },
  {
    alt: "Panel discussion at a People First roundtable (duplicate for layout)",
    src: "/images/gallery/gallery3.webp",
    hasImage: true,
  },
  {
    alt: "Rai Salahuddin Ahmad at a People First partner event (duplicate for layout)",
    src: "/images/gallery/gallery2.webp",
    hasImage: true,
  },
];

/* Repeated so the coverflow reads as a continuous stream and both flanking
   previews are always filled at any active index — the same trick the mockup
   uses. The carousel wraps, so this loops forever in either direction. Three
   copies give 15 slides: enough that the repeat is not obvious while scrolling
   through, without inventing photos we do not have. */
export const GALLERY: GalleryPhoto[] = [...PHOTOS, ...PHOTOS, ...PHOTOS];
