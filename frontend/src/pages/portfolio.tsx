import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import type { Project } from '@/types';
import styles from '@/components/PortfolioPage.module.css';

type ProjectListItem = Pick<Project, 'id' | 'title' | 'slug' | 'category' | 'summary' | 'coverImageUrl' | 'isFeatured'> & {
  client?: { id: number; name: string } | null;
};

const CATEGORIES = ['all', 'video', 'branding', 'social', 'digital', 'photography', 'campaign'];

export default function Portfolio() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .get('/api/projects')
      .then((res: any) => {
        if (!active) return;
        const data = res?.data;
        setProjects(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => active && setError('Unable to load portfolio. Please try again.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => (category === 'all' ? projects : projects.filter((p) => p.category === category)),
    [projects, category]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Our Work</p>
        <h1 className={styles.title}>Portfolio</h1>
        <p className={styles.subtitle}>Case studies across film, brand, social and digital.</p>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
            onClick={() => setCategory(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className={styles.state}>Loading projects…</p>}
      {!loading && error && <p className={`${styles.state} ${styles.error}`}>{error}</p>}
      {!loading && !error && filtered.length === 0 && <p className={styles.state}>No projects found.</p>}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <Link key={p.id} href={`/projects?slug=${encodeURIComponent(p.slug)}`} className={styles.card}>
              <div className={styles.media}>
                <img src={p.coverImageUrl} alt={p.title} className={styles.img} />
                {p.isFeatured && <span className={styles.badge}>Featured</span>}
              </div>
              <div className={styles.body}>
                <span className={styles.category}>{p.category}</span>
                <h2 className={styles.cardTitle}>{p.title}</h2>
                {p.client?.name && <p className={styles.client}>{p.client.name}</p>}
                <p className={styles.summary}>{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}