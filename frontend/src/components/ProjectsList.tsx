import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types';
import styles from './ProjectsList.module.css';

export type ProjectListItem = Pick<Project, 'id' | 'title' | 'slug' | 'category' | 'summary' | 'coverImageUrl' | 'isFeatured'> & {
  client?: { id: number; name: string } | null;
};

const CATEGORIES = ['all', 'video', 'branding', 'social', 'digital', 'photography', 'campaign'];

export default function ProjectsList({ projects }: { projects: ProjectListItem[] }) {
  const [category, setCategory] = useState('all');
  const filtered = useMemo(
    () => (category === 'all' ? projects : projects.filter((p) => p.category === category)),
    [projects, category]
  );

  return (
    <div>
      <div className={styles.filters} role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className={styles.empty}>No projects in this category yet.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <Link key={p.id} href={`/portfolio?project=${encodeURIComponent(p.slug)}`} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.coverImageUrl} alt={p.title} className={styles.cover} />
              <div className={styles.body}>
                <div className={styles.meta}>
                  <span className={styles.badge}>{p.category}</span>
                  {p.isFeatured && <span className={styles.featured}>★ Featured</span>}
                </div>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.summary}>{p.summary}</p>
                {p.client?.name && <span className={styles.client}>Client: {p.client.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}