import React from 'react';
import Link from 'next/link';
import styles from './ServicesPage.module.css';
import type { ServiceDetail } from '@/pages/services';

type Item = { id: number; name: string; slug: string; summary: string; sortOrder: number; icon?: string | null };

interface Props {
  services: Item[];
  loading: boolean;
  error: string | null;
  selected: string | null;
  detail: ServiceDetail | null;
  detailLoading: boolean;
  detailError: string | null;
  onSelect: (slug: string) => void;
  footer?: React.ReactNode;
}

export default function ServicesPage(p: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>What we do</span>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.subtitle}>Strategy, story and craft — end-to-end media services built to move audiences.</p>
      </header>

      {p.loading && <p className={styles.state} role="status">Loading services…</p>}
      {p.error && <p className={styles.error} role="alert">{p.error}</p>}
      {!p.loading && !p.error && p.services.length === 0 && <p className={styles.state}>No services available yet.</p>}

      <div className={styles.grid}>
        {p.services.map((s, i) => (
          <article key={s.id} className={`${styles.card} ${p.selected === s.slug ? styles.active : ''}`}>
            <div className={styles.icon} aria-hidden>{s.icon ? s.icon.slice(0, 2).toUpperCase() : String(i + 1).padStart(2, '0')}</div>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.summary}>{s.summary}</p>
            <button type="button" className={styles.more} onClick={() => p.onSelect(s.slug)} aria-expanded={p.selected === s.slug}>
              {p.selected === s.slug ? 'Hide details' : 'View details'}
            </button>
          </article>
        ))}
      </div>

      {p.selected && (
        <section className={styles.detail} aria-label="Service details">
          {p.detailLoading && <p className={styles.state} role="status">Loading details…</p>}
          {p.detailError && <p className={styles.error} role="alert">{p.detailError}</p>}
          {p.detail && (
            <>
              <h2 className={styles.detailTitle}>{p.detail.name}</h2>
              <p className={styles.detailText}>{p.detail.description || p.detail.summary}</p>
              <h4 className={styles.relatedHead}>Related work</h4>
              {p.detail.projects.length === 0 ? (
                <p className={styles.state}>No related projects yet.</p>
              ) : (
                <div className={styles.projects}>
                  {p.detail.projects.map((pr) => (
                    <Link key={pr.id} href="/portfolio" className={styles.project}>
                      <img src={pr.coverImageUrl} alt={pr.title} className={styles.cover} />
                      <span className={styles.projectTitle}>{pr.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      <div className={styles.footer}>{p.footer}</div>
    </div>
  );
}