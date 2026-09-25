export type ProjectCategory = 'video' | 'branding' | 'social' | 'digital' | 'photography' | 'campaign';
export type BudgetRange = 'under_10k' | '10k_25k' | '25k_50k' | '50k_100k' | '100k_plus';
export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface Showreel {
  id: number;
  title: string;
  videoUrl: string;
  posterUrl?: string | null;
  isActive: boolean;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  isFeatured: boolean;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: ProjectCategory;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  coverImageUrl: string;
  galleryUrls?: string[] | null;
  isFeatured: boolean;
  completedAt?: string | null;
  clientId?: number | null;
  serviceId?: number | null;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  sortOrder: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorTitle?: string | null;
  rating?: number | null;
  clientId?: number | null;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  serviceInterest?: string | null;
  budgetRange?: BudgetRange | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

/* ---------- API response shapes ---------- */

export interface ShowreelResponse {
  id: number;
  title: string;
  videoUrl: string;
  posterUrl?: string | null;
}

export interface ServiceListItem {
  id: number;
  name: string;
  slug: string;
  summary: string;
  icon?: string | null;
  sortOrder: number;
}

export interface ServiceDetailResponse {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description?: string | null;
  icon?: string | null;
  projects: { id: number; slug: string; title: string; coverImageUrl: string }[];
}

export interface ProjectListItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImageUrl: string;
  isFeatured: boolean;
  client: { id: number; name: string } | null;
}

export interface ProjectDetailResponse {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  coverImageUrl: string;
  galleryUrls: string[];
  completedAt?: string | null;
  client: { id: number; name: string; logoUrl: string } | null;
  service: { id: number; name: string; slug: string } | null;
}

export interface TeamMemberResponse {
  id: number;
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface TestimonialResponse {
  id: number;
  quote: string;
  authorName: string;
  authorTitle?: string | null;
  rating?: number | null;
  client: { id: number; name: string; logoUrl: string } | null;
}

export interface ClientResponse {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  isFeatured: boolean;
}

export interface CreateInquiryDto {
  name: string;
  email: string;
  message: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
}

export interface InquiryResponse {
  id: number;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}