import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveShowreel } from '../../lib/repo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const reel = await getActiveShowreel();
    if (!reel) return res.status(404).json({ error: 'No active showreel' });
    return res.status(200).json(reel);
  } catch (e: any) {
    console.error('GET /api/showreel failed', e?.message);
    return res.status(500).json({ error: 'Failed to load showreel' });
  }
}