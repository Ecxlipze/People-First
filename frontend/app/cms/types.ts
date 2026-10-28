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
  /* Computed by the API for the signed-in editor. */
  editable?: boolean;
  is_mine?: boolean;
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
  display_order: number;
  is_active: boolean;
};

export type CmsProfile = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string;
  role: "staff" | "author";
};
