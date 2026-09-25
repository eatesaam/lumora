import type { NextApiRequest, NextApiResponse } from 'next';
import { listTeam } from '../../lib/repo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    return res.status(200).json(await listTeam());
  } catch (e: any) {
    console.error('GET /api/team failed', e?.message);
    return res.status(500).json({ error: 'Failed to load team' });
  }
}