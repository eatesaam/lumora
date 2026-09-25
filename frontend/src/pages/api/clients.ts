import type { NextApiRequest, NextApiResponse } from 'next';
import { listClients } from '../../lib/repo';
import { parseBoolQuery } from '../../lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    return res.status(200).json(await listClients(parseBoolQuery(req.query.featured)));
  } catch (e: any) {
    console.error('GET /api/clients failed', e?.message);
    return res.status(500).json({ error: 'Failed to load clients' });
  }
}