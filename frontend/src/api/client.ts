import axios from 'axios';
import type {
  ShowreelResponse, ServiceListItem, ServiceDetailResponse, ProjectListItem,
  ProjectDetailResponse, TeamMemberResponse, TestimonialResponse, ClientResponse,
  CreateInquiryDto, InquiryResponse,
} from '../types';

// Same-origin: all calls use /api/* handled by Next.js API routes.
export const apiClient = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const e = err as any;
  return e?.response?.data?.error || e?.response?.data?.message || e?.message || fallback;
}

export const api = {
  getShowreel: () => apiClient.get<ShowreelResponse>('/api/showreel').then((r) => r.data),
  getServices: () => apiClient.get<ServiceListItem[]>('/api/services').then((r) => r.data ?? []),
  getService: (slug: string) =>
    apiClient.get<ServiceDetailResponse>(`/api/services/${encodeURIComponent(slug)}`).then((r) => r.data),
  getProjects: (params?: { category?: string; featured?: boolean }) =>
    apiClient.get<ProjectListItem[]>('/api/projects', { params }).then((r) => r.data ?? []),
  getProject: (slug: string) =>
    apiClient.get<ProjectDetailResponse>(`/api/projects/${encodeURIComponent(slug)}`).then((r) => r.data),
  getTeam: () => apiClient.get<TeamMemberResponse[]>('/api/team').then((r) => r.data ?? []),
  getTestimonials: () => apiClient.get<TestimonialResponse[]>('/api/testimonials').then((r) => r.data ?? []),
  getClients: (params?: { featured?: boolean }) =>
    apiClient.get<ClientResponse[]>('/api/clients', { params }).then((r) => r.data ?? []),
  createInquiry: (body: CreateInquiryDto) =>
    apiClient.post<InquiryResponse>('/api/inquiries', body).then((r) => r.data),
};

export default apiClient;