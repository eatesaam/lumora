import type { NextApiRequest, NextApiResponse } from 'next';
import { createInquiry } from '../../lib/repo';
import { validateInquiry } from '../../lib/validation';

export const config = { api: { bodyParser: { sizeLimit: '100kb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const v = validateInquiry(req.body);
  if (!v.ok) return res.status(400).json({ error: 'Validation failed', errors: v.errors });
  try {
    const inquiry = await createInquiry(v.data);
    return res.status(201).json(inquiry);
  } catch (e: any) {
    console.error('POST /api/inquiries failed', e?.message);
    return res.status(500).json({ error: 'Failed to submit inquiry' });
  }
}