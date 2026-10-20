/* Shared by the CMS server actions and its client components. Kept free of
   "use server" so types and constants can be exported. */

export type CmsPost = {
  id: number;
  title: string;
  slug: string;
  category: number | null;
  category_name: string | null;
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
  updated_at: string;
};

export type CmsCategory = { id: number; name: string; slug: string };

export type CmsFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  /* field name -> message, from our own checks or DRF's field errors */
  errors?: Record<string, string>;
};

export const INITIAL_CMS_STATE: CmsFormState = { status: "idle" };

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CmsPodcast = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  video_url: string | null;
  youtube_video_id: string | null;
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
  updated_at: string;
};

export type CmsGalleryItem = {
  id: number;
  image: string | null;
  title: string;
  caption: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
};

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export type CmsInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  person_type: string;
  inquiry_type: string;
  inquiry_type_label: string;
  person_type_label: string;
  created_at: string;
  status: InquiryStatus;
  staff_notes: string;
};

export type CmsInquiryPage = { count: number; results: CmsInquiry[] };

export type CmsInquirySummary = { total: number } & Record<InquiryStatus, number>;

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

export const INQUIRY_TYPE_OPTIONS = [
  { value: "contact_us", label: "Contact Us" },
  { value: "partner_with_us", label: "Partner With Us" },
  { value: "book_consultation", label: "Book a Consultation" },
  { value: "join_training", label: "Join a Training Program" },
] as const;

export type CmsTestimonial = {
  id: number;
  name: string;
  avatar: string | null;
  handle: string | null;
  body: string;
  tags: string[];
  social_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type CmsVenture = {
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

/* The three design-approved venture colourways (mirrors backend/ventures/admin.py).
   Anything else is "custom". */
export const VENTURE_PRESETS = [
  { key: "crimson", label: "Crimson", accent: "#a00017", gradient: "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)" },
  { key: "teal", label: "Teal", accent: "#2c8e85", gradient: "radial-gradient(52.47% 174.19% at 50% 50%, #39CABD 0%, #246D67 100%)" },
  { key: "indigo", label: "Indigo", accent: "#2e21b6", gradient: "radial-gradient(109% 107% at 50% 50%, #FFFFFF 0%, #2E21B6 100%)" },
] as const;
