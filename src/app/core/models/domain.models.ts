// ─── Primitive types ─────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'fr' | 'de' | 'it';

export type UserType =
  | 'end_user'
  | 'owner'
  | 'agent'
  | 'agency_admin'
  | 'platform_admin'
  | 'super_admin';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type TransactionType = 'rent' | 'buy';

export type PropertyLocationPrecision = 'exact' | 'postal_code' | 'city' | 'canton' | 'unknown';

export type PropertyGeocodingSource =
  | 'manual'
  | 'provider'
  | 'city_centroid'
  | 'canton_centroid';

export type PropertySection = 'residential' | 'commercial' | 'land' | 'parking';

// Multilingual text field — stored as separate fields in MongoDB,
// populated based on Accept-Language header
export interface TranslatedField {
  en?: string;
  fr?: string;
  de?: string;
  it?: string;
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  user_type: UserType;
  preferred_language: SupportedLanguage;
  agency_id?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  email_verified: boolean;
  roles?: string[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_new_properties: boolean;
  email_price_changes: boolean;
  email_favorites_updates: boolean;
  email_newsletter: boolean;
  push_enabled: boolean;
}

// ─── Location ────────────────────────────────────────────────────────────────

export interface Canton {
  id: string;
  code: string; // e.g. 'VD', 'GE', 'ZH'
  name: TranslatedField;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

export interface City {
  id: string;
  canton_id: string;
  canton?: Canton;
  name: TranslatedField;
  postal_code: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  property_count?: number;
  is_active: boolean;
}

export interface PopularCity {
  id: string;
  name: TranslatedField | string;
  canton_code: string;
  canton_name: TranslatedField | string;
  image_url?: string;
  rent_count: number;
  buy_count: number;
  total_count: number;
}

// ─── Property ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: TranslatedField;
  slug: string;
  section: PropertySection;
  description?: TranslatedField;
  is_active: boolean;
}

export interface Amenity {
  id: string;
  name: TranslatedField;
  slug: string;
  group: string; // 'general' | 'kitchen' | 'bathroom' | 'outdoor' | 'security' | 'parking' | 'accessibility' | 'energy' | 'other'
  icon?: string;
  is_active: boolean;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  secure_url?: string;
  thumbnail_url?: string;
  thumbnail_secure_url?: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
  is_primary: boolean;
  width?: number;
  height?: number;
}

export interface PropertyTranslation {
  id: string;
  property_id: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PropertyGeneratedTranslation {
  title?: string;
  description?: string;
  source?: string;
  quality_score?: number;
}

export interface Property {
  id: string;
  external_id: string;
  source_language: SupportedLanguage;
  transaction_type: TransactionType;
  price: number;
  currency: string;
  additional_costs?: number;
  rooms?: number;
  surface?: number;
  surface_area?: number;
  latitude?: number;
  longitude?: number;
  location_precision?: PropertyLocationPrecision;
  geocoding_source?: PropertyGeocodingSource;
  geocoded_at?: string;
  address: string;
  postal_code?: string;
  status: PropertyStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;

  // Populated relations
  category_id: string;
  category?: Category;
  city_id: string;
  city?: City;
  canton_id: string;
  canton?: Canton;
  agency_id?: string;
  agency?: Agency;
  owner_id?: string;
  amenities?: Amenity[];
  images?: PropertyImage[];

  // Translation — title/description come from PropertyTranslation
  title?: string;
  description?: string;
  translation?: PropertyGeneratedTranslation | null;
  translations?: PropertyTranslation[];

  // Computed
  primary_image?: PropertyImage;
}

// ─── Agency ──────────────────────────────────────────────────────────────────

export interface Agency {
  id: string;
  name: string;
  slug: string;
  description?: TranslatedField;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address: string;
  city_id: string;
  city?: City;
  canton_id: string;
  canton?: Canton;
  postal_code?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  is_verified: boolean;
  verification_date?: string;
  total_properties: number;
  created_at: string;
  updated_at: string;
}

// ─── Lead / Inquiry ──────────────────────────────────────────────────────────

export type LeadInquiryType =
  | 'viewing'
  | 'information'
  | 'price_negotiation'
  | 'rental_application'
  | 'purchase_offer'
  | 'other';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'on_hold';

export interface Lead {
  id: string;
  property_id: string;
  property?: Property;
  agency_id?: string;
  user_id?: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone?: string;
  preferred_contact_method: 'email' | 'phone' | 'both';
  preferred_language: SupportedLanguage;
  inquiry_type: LeadInquiryType;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface SearchSuggestion {
  type: 'property' | 'city' | 'canton';
  id: string;
  label: string;
  sublabel?: string;
}

// ─── User dashboard ──────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  property?: Property;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  name: string;
  criteria: {
    transaction_type?: TransactionType;
    category_id?: string;
    canton_id?: string;
    city_id?: string;
    price_min?: number;
    price_max?: number;
    rooms_min?: number;
    rooms_max?: number;
    surface_min?: number;
    surface_max?: number;
    amenities?: string[];
  };
  frequency: 'instant' | 'daily' | 'weekly';
  is_active: boolean;
  last_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_properties: number;
  total_favorites: number;
  total_inquiries: number;
  active_alerts: number;
  total_alerts: number;
}

export interface PropertyStats {
  total: number;
  draft: number;
  pending_approval: number;
  published: number;
  rejected: number;
  archived: number;
}
