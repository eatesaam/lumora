/**
 * @jest-environment node
 */
jest.mock('../../lib/repo', () => ({
  getActiveShowreel: jest.fn(),
  listServices: jest.fn(),
  getServiceBySlug: jest.fn(),
  listProjects: jest.fn(),
  getProjectBySlug: jest.fn(),
  listTeam: jest.fn(),
  listTestimonials: jest.fn(),
  listClients: jest.fn(),
  createInquiry: jest.fn(),
}));

import * as repo from '../../lib/repo';
import healthHandler from '../../pages/api/health';
import showreelHandler from '../../pages/api/showreel';
import servicesHandler from '../../pages/api/services/index';
import serviceSlugHandler from '../../pages/api/services/[slug]';
import projectsHandler from '../../pages/api/projects/index';
import projectSlugHandler from '../../pages/api/projects/[slug]';
import teamHandler from '../../pages/api/team';
import testimonialsHandler from '../../pages/api/testimonials';
import clientsHandler from '../../pages/api/clients';
import inquiriesHandler from '../../pages/api/inquiries';

const r = repo as jest.Mocked<typeof repo>;

function mockRes() {
  const res: any = { statusCode: 200, body: undefined, headers: {} };
  res.status = jest.fn((c: number) => { res.statusCode = c; return res; });
  res.json = jest.fn((b: any) => { res.body = b; return res; });
  res.setHeader = jest.fn((k: string, v: string) => { res.headers[k] = v; });
  return res;
}
const req = (o: any = {}) => ({ method: 'GET', query: {}, body: undefined, ...o }) as any;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/health', () => {
  it('returns ok', () => {
    const res = mockRes();
    healthHandler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/showreel', () => {
  it('returns active showreel', async () => {
    r.getActiveShowreel.mockResolvedValue({ id: 1, title: 'Reel', videoUrl: 'https://v.mp4', posterUrl: null });
    const res = mockRes();
    await showreelHandler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: 1, title: 'Reel', videoUrl: 'https://v.mp4', posterUrl: null });
  });
  it('404 when none', async () => {
    r.getActiveShowreel.mockResolvedValue(null);
    const res = mockRes();
    await showreelHandler(req(), res);
    expect(res.statusCode).toBe(404);
  });
  it('405 on POST', async () => {
    const res = mockRes();
    await showreelHandler(req({ method: 'POST' }), res);
    expect(res.statusCode).toBe(405);
  });
});

describe('GET /api/services', () => {
  it('lists services', async () => {
    r.listServices.mockResolvedValue([{ id: 1, name: 'Video', slug: 'video', summary: 's', icon: null, sortOrder: 1 }]);
    const res = mockRes();
    await servicesHandler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].slug).toBe('video');
  });
  it('500 on db error', async () => {
    r.listServices.mockRejectedValue(new Error('boom'));
    const res = mockRes();
    await servicesHandler(req(), res);
    expect(res.statusCode).toBe(500);
  });
});

describe('GET /api/services/[slug]', () => {
  it('returns service with projects', async () => {
    r.getServiceBySlug.mockResolvedValue({
      id: 1, name: 'Video', slug: 'video', summary: 's', description: null, icon: null,
      projects: [{ id: 2, title: 'P', slug: 'p', coverImageUrl: 'https://c.jpg' }],
    });
    const res = mockRes();
    await serviceSlugHandler(req({ query: { slug: 'video' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.projects).toHaveLength(1);
    expect(r.getServiceBySlug).toHaveBeenCalledWith('video');
  });
  it('404 when missing', async () => {
    r.getServiceBySlug.mockResolvedValue(null);
    const res = mockRes();
    await serviceSlugHandler(req({ query: { slug: 'nope' } }), res);
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /api/projects', () => {
  it('lists with filters', async () => {
    r.listProjects.mockResolvedValue([{
      id: 1, title: 'T', slug: 't', category: 'video', summary: 's', coverImageUrl: 'c',
      isFeatured: true, client: { id: 1, name: 'N' },
    }]);
    const res = mockRes();
    await projectsHandler(req({ query: { category: 'video', featured: 'true' } }), res);
    expect(res.statusCode).toBe(200);
    expect(r.listProjects).toHaveBeenCalledWith({ category: 'video', featured: true });
    expect(res.body[0].client.name).toBe('N');
  });
  it('400 on invalid category', async () => {
    const res = mockRes();
    await projectsHandler(req({ query: { category: 'bogus' } }), res);
    expect(res.statusCode).toBe(400);
    expect(r.listProjects).not.toHaveBeenCalled();
  });
});

describe('GET /api/projects/[slug]', () => {
  it('returns case study', async () => {
    r.getProjectBySlug.mockResolvedValue({
      id: 1, title: 'T', slug: 't', category: 'video', summary: 's', challenge: null, solution: null,
      results: null, coverImageUrl: 'c', galleryUrls: ['g'], completedAt: null,
      client: { id: 1, name: 'N', logoUrl: 'l' }, service: { id: 1, name: 'V', slug: 'v' },
    });
    const res = mockRes();
    await projectSlugHandler(req({ query: { slug: 't' } }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.galleryUrls).toEqual(['g']);
  });
  it('404 when missing', async () => {
    r.getProjectBySlug.mockResolvedValue(null);
    const res = mockRes();
    await projectSlugHandler(req({ query: { slug: 'x' } }), res);
    expect(res.statusCode).toBe(404);
  });
});

describe('GET /api/team', () => {
  it('lists team', async () => {
    r.listTeam.mockResolvedValue([{ id: 1, name: 'M', role: 'CD', bio: null, photoUrl: null, linkedinUrl: null }]);
    const res = mockRes();
    await teamHandler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].role).toBe('CD');
  });
  it('405 on DELETE', async () => {
    const res = mockRes();
    await teamHandler(req({ method: 'DELETE' }), res);
    expect(res.statusCode).toBe(405);
  });
});

describe('GET /api/testimonials', () => {
  it('lists testimonials', async () => {
    r.listTestimonials.mockResolvedValue([{
      id: 1, quote: 'q', authorName: 'A', authorTitle: null, rating: 5, client: { id: 1, name: 'N', logoUrl: 'l' },
    }]);
    const res = mockRes();
    await testimonialsHandler(req(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body[0].client.logoUrl).toBe('l');
  });
  it('500 on error', async () => {
    r.listTestimonials.mockRejectedValue(new Error('x'));
    const res = mockRes();
    await testimonialsHandler(req(), res);
    expect(res.statusCode).toBe(500);
  });
});

describe('GET /api/clients', () => {
  it('lists featured clients', async () => {
    r.listClients.mockResolvedValue([{ id: 1, name: 'N', logoUrl: 'l', websiteUrl: null, isFeatured: true }]);
    const res = mockRes();
    await clientsHandler(req({ query: { featured: 'true' } }), res);
    expect(res.statusCode).toBe(200);
    expect(r.listClients).toHaveBeenCalledWith(true);
  });
  it('405 on POST', async () => {
    const res = mockRes();
    await clientsHandler(req({ method: 'POST' }), res);
    expect(res.statusCode).toBe(405);
  });
});

describe('POST /api/inquiries', () => {
  it('creates inquiry', async () => {
    r.createInquiry.mockResolvedValue({ id: 1, name: 'Jane', email: 'jane@acme.com', status: 'new', createdAt: '2025-01-01T00:00:00.000Z' });
    const res = mockRes();
    await inquiriesHandler(req({
      method: 'POST',
      body: { name: 'Jane', email: 'jane@acme.com', message: 'Hello', budgetRange: '25k_50k', company: 'Acme', serviceInterest: 'Video' },
    }), res);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('new');
    expect(r.createInquiry).toHaveBeenCalledWith({
      name: 'Jane', email: 'jane@acme.com', message: 'Hello', company: 'Acme', serviceInterest: 'Video', budgetRange: '25k_50k',
    });
  });
  it('400 on invalid body', async () => {
    const res = mockRes();
    await inquiriesHandler(req({ method: 'POST', body: { name: '', email: 'bad', message: '', budgetRange: 'huge' } }), res);
    expect(res.statusCode).toBe(400);
    expect(Object.keys(res.body.errors)).toEqual(expect.arrayContaining(['name', 'email', 'message', 'budgetRange']));
    expect(r.createInquiry).not.toHaveBeenCalled();
  });
  it('405 on GET', async () => {
    const res = mockRes();
    await inquiriesHandler(req(), res);
    expect(res.statusCode).toBe(405);
  });
});