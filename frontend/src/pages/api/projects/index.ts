import type { NextApiRequest, NextApiResponse } from 'next';
import { listProjects } from '../../../lib/repo';
import { PROJECT_CATEGORIES, parseBoolQuery } from '../../../lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const rawCat = Array.isArray(req.query.category) ? req.query.category[0] : req.query.category;
  const category = rawCat && rawCat !== 'all' ? String(rawCat) : undefined;
  if (category && !PROJECT_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  try {
    const projects = await listProjects({ category, featured: parseBoolQuery(req.query.featured) });
    return res.status(200).json(projects);
  } catch (e: any) {
    console.error('GET /api/projects failed', e?.message);
    return res.status(500).json({ error: 'Failed to load projects' });
  }
}