import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjectBySlug } from '../../../lib/repo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const slug = String(Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug || '');
  if (!slug || slug.length > 255) return res.status(400).json({ error: 'Invalid slug' });
  try {
    const project = await getProjectBySlug(slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json(project);
  } catch (e: any) {
    console.error('GET /api/projects/[slug] failed', e?.message);
    return res.status(500).json({ error: 'Failed to load project' });
  }
}