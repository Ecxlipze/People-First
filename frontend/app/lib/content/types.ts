/* Row shapes returned by the Django content APIs.

   These mirror `fields = '__all__'` ModelSerializers, so every model column is
   present. Image fields serialise as ABSOLUTE urls (DRF builds them from the
   request), which is why next.config.ts derives its remotePatterns from
   API_BASE_URL.

   All list endpoints return a plain JSON array — there is no pagination
   envelope to unwrap. */

export type ApiGalleryItem = {
  id: number;
  image: string | null;
  hasimage: boolean;
  title: string;
  caption: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
};

export type GalleryItem = {
  id: number;
  src: string;
  title: string;
  caption: string;
  alt: string;
  displayOrder: number;
};

export type ApiTestimonial = {
  id: number;
  name: string;
  avatar: string | null;
  hasAvatar: boolean;
  handle: string | null;
  body: string;
  tags: string[];
  social_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type ApiVenture = {
  id: number;
  logo: string | null;
  name: string;
  subtitle: string | null;
  website_url: string | null;
  accent: string;
  border_gradient: string;
  display_order: number;
  is_active: boolean;
};

export type ApiPodcast = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  video_url: string | null;
  youtube_video_id: string | null;
  /* ISO timestamp from the YouTube sync; null for hand-made episodes. */
  published_at: string | null;
  metric_value: string | null;
  metric_label: string | null;
  badge: string;
  badge_colour: string;
  supporting_title: string | null;
  supporting_content: string | null;
  order: number;
  is_featured: boolean;
  is_active: boolean;
};

export type ApiFeaturedWork = {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  video_url: string | null;
  metric_value: string;
  metric_label: string;
  secondary_metric_value: string;
  secondary_metric_label: string;
  bullets: string[];
  order: number;
};

export type ApiBlogCategory = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
};

/* The list endpoint omits `content`; the detail endpoint includes it. */
export type ApiBlogPost = {
  id: number;
  title: string;
  slug: string;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  featured_image_alt: string;
  author_name: string;
  metric: string;
  metric_label: string;
  card_value: string;
  card_label: string;
  studio_image: string | null;
  studio_image_alt: string;
  video_url: string;
  order: number;
  status: "draft" | "published";
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  reading_minutes: number;
  updated_at: string;
};
