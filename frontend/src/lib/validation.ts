export const BUDGET_RANGES = ['under_10k', '10k_25k', '25k_50k', '50k_100k', '100k_plus'];
export const PROJECT_CATEGORIES = ['video', 'branding', 'social', 'digital', 'photography', 'campaign'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optStr(v: any, max: number, field: string, errors: Record<string, string>): string | null {
  if (v === undefined || v === null || v === '') return null;
  if (typeof v !== 'string') { errors[field] = `${field} must be a string`; return null; }
  const t = v.trim();
  if (t.length > max) errors[field] = `${field} must be at most ${max} characters`;
  return t || null;
}

export function validateInquiry(body: any) {
  const errors: Record<string, string> = {};
  const b = body && typeof body === 'object' ? body : {};
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';

  if (!name) errors.name = 'name is required';
  else if (name.length > 150) errors.name = 'name must be at most 150 characters';
  if (!email) errors.email = 'email is required';
  else if (email.length > 255 || !EMAIL_RE.test(email)) errors.email = 'email is invalid';
  if (!message) errors.message = 'message is required';
  else if (message.length > 5000) errors.message = 'message is too long';

  const company = optStr(b.company, 150, 'company', errors);
  const serviceInterest = optStr(b.serviceInterest, 150, 'serviceInterest', errors);
  const budgetRange = optStr(b.budgetRange, 30, 'budgetRange', errors);
  if (budgetRange && !BUDGET_RANGES.includes(budgetRange)) errors.budgetRange = 'budgetRange is invalid';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { name, email, message, company, serviceInterest, budgetRange },
  };
}

export function parseBoolQuery(v: any): boolean | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  if (s === 'true' || s === '1') return true;
  if (s === 'false' || s === '0') return false;
  return undefined;
}