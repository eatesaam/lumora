import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import apiClient from '@/api/client';
import type { Testimonial, Client } from '@/types';
import styles from '@/components/TestimonialsPage.module.css';

type TestimonialItem = Pick<Testimonial, 'id' | 'quote' | 'authorName' | 'authorTitle' | 'rating'> & {
  client?: Pick<Client, 'id' | 'name' | 'logoUrl'> | null;
};

function Stars({ rating }: { rating?: number | null }) {
  if (!rating) return null;
  const r = Math.max(0, Math.min(5, rating));
  return (
    <div className={styles.stars} aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= r ? styles.starOn : styles.starOff}>★</span>
      ))}
    </div>
  );
}

export function TestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    apiClient
      .get('/api/testimonials')
      .then((res: any) => {
        if (!active) return;
        setItems(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => active && setError('Unable to load testimonials.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reload]);

  const filtered = useMemo(
    () => items.filter((t) => (minRating === 0 ? true : (t.rating ?? 0) >= minRating)),
    [items, minRating]
  );

  return (
    <div className={styles.page}>
      <Head>
        <title>Testimonials | Lumora</title>
      </Head>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Kind words</p>
        <h1 className={styles.title}>What our clients say</h1>
        <p className={styles.subtitle}>
          Brands trust Lumora to tell their stories. Here is what they have to say about working with us.
        </p>
      </header>

      <div className={styles.toolbar}>
        {[0, 4, 5].map((r) => (
          <button
            key={r}
            type="button"
            className={`${styles.chip} ${minRating === r ? styles.chipActive : ''}`}
            onClick={() => setMinRating(r)}
          >
            {r === 0 ? 'All' : `${r}+ stars`}
          </button>
        ))}
      </div>

      {loading && <div className={styles.state} role="status">Loading testimonials…</div>}
      {!loading && error && (
        <div className={styles.state} role="alert">
          <p>{error}</p>
          <button type="button" className={styles.retry} onClick={() => setReload((n) => n + 1)}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className={styles.state}>No testimonials to show yet.</div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((t) => (
            <article key={t.id} className={styles.card} data-testid="testimonial-card">
              <Stars rating={t.rating} />
              <blockquote className={styles.quote}>“{t.quote}”</blockquote>
              <footer className={styles.author}>
                {t.client?.logoUrl ? (
                  <img className={styles.logo} src={t.client.logoUrl} alt={t.client.name} />
                ) : (
                  <div className={styles.avatar}>{t.authorName?.charAt(0) ?? '?'}</div>
                )}
                <div>
                  <div className={styles.name}>{t.authorName}</div>
                  <div className={styles.meta}>
                    {[t.authorTitle, t.client?.name].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}

      <section className={styles.cta}>
        <h2>Ready to be our next success story?</h2>
        <Link href="/contact" className={styles.ctaBtn}>Start a project</Link>
      </section>
    </div>
  );
}

export default function Testimonials() {
  return <TestimonialsPage />;
}