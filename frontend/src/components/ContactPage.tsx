import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import apiClient from '@/api/client';
import type { Inquiry } from '@/types';
import styles from './ContactPage.module.css';

type InquiryResponse = Pick<Inquiry, 'id' | 'name' | 'email' | 'status' | 'createdAt'>;

interface FormState {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  budgetRange: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', company: '', serviceInterest: '', budgetRange: '', message: '' };

export const BUDGET_OPTIONS = [
  { value: 'under_10k', label: 'Under $10k' },
  { value: '10k_25k', label: '$10k – $25k' },
  { value: '25k_50k', label: '$25k – $50k' },
  { value: '50k_100k', label: '$50k – $100k' },
  { value: '100k_plus', label: '$100k+' },
];

const SERVICE_OPTIONS = ['Video Production', 'Branding', 'Social Media', 'Digital Marketing', 'Photography', 'Campaigns'];

export function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (!f.name.trim()) e.name = 'Name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email';
  if (!f.message.trim()) e.message = 'Message is required';
  return e;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<InquiryResponse | null>(null);

  const update = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        company: form.company.trim() || undefined,
        serviceInterest: form.serviceInterest || undefined,
        budgetRange: form.budgetRange || undefined,
      };
      const res = await apiClient.post<InquiryResponse>('/api/inquiries', payload);
      setResult(res?.data ?? null);
      setForm(EMPTY);
    } catch (err: any) {
      setApiError(err?.response?.data?.error || err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Contact</span>
        <h1 className={styles.title}>Let’s create something remarkable</h1>
        <p className={styles.subtitle}>
          Tell us about your project and our team will get back to you within two business days.
        </p>
      </header>

      <div className={styles.grid}>
        <aside className={styles.infoCard}>
          <h2>Get in touch</h2>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><Mail size={16} /></span>
            <div><div className={styles.infoLabel}>Email</div>hello@lumora.studio</div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><Phone size={16} /></span>
            <div><div className={styles.infoLabel}>Phone</div>+1 (555) 014-2290</div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}><MapPin size={16} /></span>
            <div><div className={styles.infoLabel}>Studio</div>210 Mercer St, New York, NY</div>
          </div>
        </aside>

        <section className={styles.formCard}>
          {result ? (
            <div className={styles.success} role="status">
              <div className={styles.successIcon}><CheckCircle2 size={28} /></div>
              <h2>Thanks, {result.name}!</h2>
              <p>We received your inquiry and will reply to {result.email} soon.</p>
              <button type="button" className={styles.secondary} onClick={() => setResult(null)}>
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-label="Project inquiry form">
              <h2>Project inquiry</h2>
              {apiError && <div className={styles.alertError} role="alert">{apiError}</div>}
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">Name *</label>
                  <input id="name" className={styles.input} value={form.name} onChange={update('name')} maxLength={150} />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input id="email" type="email" className={styles.input} value={form.email} onChange={update('email')} maxLength={255} />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="company">Company</label>
                  <input id="company" className={styles.input} value={form.company} onChange={update('company')} maxLength={150} />
                </div>
                <div className={styles.field}>
                  <label htmlFor="serviceInterest">Service interest</label>
                  <select id="serviceInterest" className={styles.select} value={form.serviceInterest} onChange={update('serviceInterest')}>
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="budgetRange">Budget range</label>
                <select id="budgetRange" className={styles.select} value={form.budgetRange} onChange={update('budgetRange')}>
                  <option value="">Select a budget</option>
                  {BUDGET_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="message">Message *</label>
                <textarea id="message" className={styles.textarea} value={form.message} onChange={update('message')} />
                {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
              </div>
              <button type="submit" className={styles.submit} disabled={submitting}>
                <Send size={16} /> {submitting ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}