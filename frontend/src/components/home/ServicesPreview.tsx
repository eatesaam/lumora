import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Service } from '@/types';
import styles from './Home.module.css';

type ServiceItem = Pick<Service, 'id' | 'name' | 'slug' | 'summary' | 'sortOrder' | 'icon'>;

export default function ServicesPreview({ services }: { services: ServiceItem[] }) {
  const sorted = [...services].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).slice(0, 6);
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>What we do</p>
          <h2 className={styles.h2}>Services</h2>
        </div>
        <Link href="/services" className={styles.link}>All services <ArrowRight size={14} /></Link>
      </div>
      {sorted.length === 0 ? (
        <p className={styles.empty}>No services listed yet.</p>
      ) : (
        <div className={styles.grid3}>
          {sorted.map((s) => (
            <Link key={s.id} href="/services" className={styles.card}>
              <div className={styles.iconWrap}><Sparkles size={20} /></div>
              <h3 className={styles.cardTitle}>{s.name}</h3>
              <p className={styles.muted}>{s.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}