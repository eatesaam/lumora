import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project, Client } from '@/types';
import styles from './Home.module.css';

export type FeaturedProject = Pick<
  Project,
  'id' | 'title' | 'slug' | 'category' | 'summary' | 'coverImageUrl' | 'isFeatured'
> & { client: Pick<Client, 'id' | 'name'> | null };

export default function FeaturedCaseStudies({ projects }: { projects: FeaturedProject[] }) {
  const list = projects.slice(0, 3);
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 className={styles.h2}>Featured case studies</h2>
        </div>
        <Link href="/portfolio" className={styles.link}>Full portfolio <ArrowRight size={14} /></Link>
      </div>
      {list.length === 0 ? (
        <p className={styles.empty}>Case studies coming soon.</p>
      ) : (
        <div className={styles.grid3}>
          {list.map((p) => (
            <Link key={p.id} href="/projects" className={styles.caseCard}>
              <img src={p.coverImageUrl} alt={p.title} loading="lazy" />
              <div className={styles.caseBody}>
                <span className={styles.chip}>{p.category}</span>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                {p.client?.name && <p className={styles.muted} style={{ margin: '0 0 6px' }}>{p.client.name}</p>}
                <p className={styles.muted} style={{ margin: 0 }}>{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}