import { getDb, isSupabase } from './db';

const bool = (v: any) => v === true || v === 1 || v === '1' || v === 't';

function parseGallery(v: any): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string' && v) {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toIso(v: any): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function sbSelect(table: string, build?: (q: any) => any): Promise<any[]> {
  let q = getDb().from(table).select('*');
  if (build) q = build(q);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

async function allClients(): Promise<any[]> {
  if (isSupabase()) return sbSelect('clients');
  return getDb().prepare('SELECT * FROM clients').all();
}

export async function getActiveShowreel() {
  let row: any;
  if (isSupabase()) {
    const rows = await sbSelect('showreels', (q) => q.eq('isActive', true).order('id', { ascending: false }).limit(1));
    row = rows[0];
  } else {
    row = getDb().prepare('SELECT * FROM showreels WHERE isActive = 1 ORDER BY id DESC LIMIT 1').get();
  }
  if (!row) return null;
  return { id: row.id, title: row.title, videoUrl: row.videoUrl, posterUrl: row.posterUrl ?? null };
}

export async function listServices() {
  const rows = isSupabase()
    ? await sbSelect('services', (q) => q.order('sortOrder', { ascending: true }))
    : getDb().prepare('SELECT * FROM services ORDER BY sortOrder ASC, id ASC').all();
  return rows.map((r: any) => ({
    id: r.id, name: r.name, slug: r.slug, summary: r.summary, icon: r.icon ?? null, sortOrder: r.sortOrder ?? 0,
  }));
}

export async function getServiceBySlug(slug: string) {
  let svc: any;
  let projects: any[];
  if (isSupabase()) {
    svc = (await sbSelect('services', (q) => q.eq('slug', slug).limit(1)))[0];
    if (!svc) return null;
    projects = await sbSelect('projects', (q) => q.eq('serviceId', svc.id).order('id', { ascending: true }));
  } else {
    const d = getDb();
    svc = d.prepare('SELECT * FROM services WHERE slug = ?').get(slug);
    if (!svc) return null;
    projects = d.prepare('SELECT * FROM projects WHERE serviceId = ? ORDER BY id ASC').all(svc.id);
  }
  return {
    id: svc.id, name: svc.name, slug: svc.slug, summary: svc.summary,
    description: svc.description ?? null, icon: svc.icon ?? null,
    projects: projects.map((p: any) => ({ id: p.id, title: p.title, slug: p.slug, coverImageUrl: p.coverImageUrl })),
  };
}

export async function listProjects(filters: { category?: string; featured?: boolean }) {
  let rows: any[];
  if (isSupabase()) {
    rows = await sbSelect('projects', (q) => {
      let x = q;
      if (filters.category) x = x.eq('category', filters.category);
      if (filters.featured !== undefined) x = x.eq('isFeatured', filters.featured);
      return x.order('id', { ascending: true });
    });
  } else {
    const where: string[] = [];
    const params: any[] = [];
    if (filters.category) { where.push('category = ?'); params.push(filters.category); }
    if (filters.featured !== undefined) { where.push('isFeatured = ?'); params.push(filters.featured ? 1 : 0); }
    const sql = `SELECT * FROM projects${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY id ASC`;
    rows = getDb().prepare(sql).all(...params);
  }
  const clients = await allClients();
  const byId = new Map(clients.map((c: any) => [c.id, c]));
  return rows.map((p: any) => {
    const c: any = p.clientId != null ? byId.get(p.clientId) : null;
    return {
      id: p.id, title: p.title, slug: p.slug, category: p.category, summary: p.summary,
      coverImageUrl: p.coverImageUrl, isFeatured: bool(p.isFeatured),
      client: c ? { id: c.id, name: c.name } : null,
    };
  });
}

export async function getProjectBySlug(slug: string) {
  let p: any; let c: any = null; let s: any = null;
  if (isSupabase()) {
    p = (await sbSelect('projects', (q) => q.eq('slug', slug).limit(1)))[0];
    if (!p) return null;
    if (p.clientId != null) c = (await sbSelect('clients', (q) => q.eq('id', p.clientId).limit(1)))[0];
    if (p.serviceId != null) s = (await sbSelect('services', (q) => q.eq('id', p.serviceId).limit(1)))[0];
  } else {
    const d = getDb();
    p = d.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);
    if (!p) return null;
    if (p.clientId != null) c = d.prepare('SELECT * FROM clients WHERE id = ?').get(p.clientId);
    if (p.serviceId != null) s = d.prepare('SELECT * FROM services WHERE id = ?').get(p.serviceId);
  }
  return {
    id: p.id, title: p.title, slug: p.slug, category: p.category, summary: p.summary,
    challenge: p.challenge ?? null, solution: p.solution ?? null, results: p.results ?? null,
    coverImageUrl: p.coverImageUrl, galleryUrls: parseGallery(p.galleryUrls),
    completedAt: toIso(p.completedAt),
    client: c ? { id: c.id, name: c.name, logoUrl: c.logoUrl } : null,
    service: s ? { id: s.id, name: s.name, slug: s.slug } : null,
  };
}

export async function listTeam() {
  const rows = isSupabase()
    ? await sbSelect('team_members', (q) => q.order('sortOrder', { ascending: true }))
    : getDb().prepare('SELECT * FROM team_members ORDER BY sortOrder ASC, id ASC').all();
  return rows.map((r: any) => ({
    id: r.id, name: r.name, role: r.role, bio: r.bio ?? null, photoUrl: r.photoUrl ?? null, linkedinUrl: r.linkedinUrl ?? null,
  }));
}

export async function listTestimonials() {
  const rows = isSupabase()
    ? await sbSelect('testimonials', (q) => q.order('id', { ascending: true }))
    : getDb().prepare('SELECT * FROM testimonials ORDER BY id ASC').all();
  const clients = await allClients();
  const byId = new Map(clients.map((c: any) => [c.id, c]));
  return rows.map((t: any) => {
    const c: any = t.clientId != null ? byId.get(t.clientId) : null;
    return {
      id: t.id, quote: t.quote, authorName: t.authorName, authorTitle: t.authorTitle ?? null,
      rating: t.rating ?? null, client: c ? { id: c.id, name: c.name, logoUrl: c.logoUrl } : null,
    };
  });
}

export async function listClients(featured?: boolean) {
  let rows: any[];
  if (isSupabase()) {
    rows = await sbSelect('clients', (q) => {
      const x = featured !== undefined ? q.eq('isFeatured', featured) : q;
      return x.order('id', { ascending: true });
    });
  } else {
    rows = featured !== undefined
      ? getDb().prepare('SELECT * FROM clients WHERE isFeatured = ? ORDER BY id ASC').all(featured ? 1 : 0)
      : getDb().prepare('SELECT * FROM clients ORDER BY id ASC').all();
  }
  return rows.map((c: any) => ({
    id: c.id, name: c.name, logoUrl: c.logoUrl, websiteUrl: c.websiteUrl ?? null, isFeatured: bool(c.isFeatured),
  }));
}

export interface CreateInquiryInput {
  name: string; email: string; message: string;
  company: string | null; serviceInterest: string | null; budgetRange: string | null;
}

export async function createInquiry(input: CreateInquiryInput) {
  const createdAt = new Date().toISOString();
  let row: any;
  if (isSupabase()) {
    const { data, error } = await getDb()
      .from('inquiries')
      .insert({ ...input, status: 'new', createdAt })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    row = data;
  } else {
    const d = getDb();
    const info = d.prepare(
      'INSERT INTO inquiries (name, email, company, serviceInterest, budgetRange, message, status, createdAt) VALUES (?,?,?,?,?,?,?,?)'
    ).run(input.name, input.email, input.company, input.serviceInterest, input.budgetRange, input.message, 'new', createdAt);
    row = d.prepare('SELECT * FROM inquiries WHERE id = ?').get(info.lastInsertRowid);
  }
  return { id: row.id, name: row.name, email: row.email, status: row.status, createdAt: toIso(row.createdAt) || createdAt };
}