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
  metric_value: string | null;
  metric_label: string | null;
  badge: string;
  badge_colour: string;
  supporting_title: string | null;
  supporting_content: string | null;
  order: number;
  is_active: boolean;
};

export type ApiInsightCategory = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
};

export type ApiInsight = {
  id: number;
  /* Foreign key id, not a nested object — resolved against the category list. */
  category: number | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  metric: string | null;
  metric_label: string | null;
  card_value: string | null;
  card_label: string | null;
  thumbnail: string | null;
  thumbnail_alt: string | null;
  studio_thumbnail: string | null;
  studio_thumbnail_alt: string | null;
  video_url: string | null;
  order: number;
  publish_status: "draft" | "published";
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
