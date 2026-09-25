import type { NextApiRequest, NextApiResponse } from 'next';
import { getServiceBySlug } from '../../../lib/repo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const slug = String(Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug || '');
  if (!slug || slug.length > 150) return res.status(400).json({ error: 'Invalid slug' });
  try {
    const svc = await getServiceBySlug(slug);
    if (!svc) return res.status(404).json({ error: 'Service not found' });
    return res.status(200).json(svc);
  } catch (e: any) {
    console.error('GET /api/services/[slug] failed', e?.message);
    return res.status(500).json({ error: 'Failed to load service' });
  }
}