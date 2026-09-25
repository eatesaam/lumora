import Link from 'next/link';
import type { Client } from '@/types';
import styles from './Home.module.css';

type ClientItem = Pick<Client, 'id' | 'name' | 'logoUrl' | 'websiteUrl' | 'isFeatured'>;

export default function ClientLogoStrip({ clients }: { clients: ClientItem[] }) {
  if (clients.length === 0) return null;
  const featured = clients.filter((c) => c.isFeatured);
  const list = (featured.length ? featured : clients).slice(0, 8);
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Trusted by</p>
          <h2 className={styles.h2}>Brands we&apos;ve partnered with</h2>
        </div>
        <Link href="/clients" className={styles.link}>All clients</Link>
      </div>
      <div className={styles.logoStrip}>
        {list.map((c) => (
          <div key={c.id} className={styles.logoItem} title={c.name}>
            <img src={c.logoUrl} alt={c.name} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}