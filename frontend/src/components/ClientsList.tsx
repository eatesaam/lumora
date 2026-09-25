import React from 'react';
import type { Client } from '@/types';
import styles from './ClientsList.module.css';

type ClientItem = Pick<Client, 'id' | 'name' | 'logoUrl' | 'isFeatured'> & { websiteUrl?: string | null };

export default function ClientsList({ clients }: { clients: ClientItem[] }) {
  return (
    <ul className={styles.grid} data-testid="clients-list">
      {clients.map((c) => (
        <li key={c.id} className={styles.card}>
          {c.isFeatured && <span className={styles.badge}>Featured</span>}
          <div className={styles.logoWrap}>
            <img src={c.logoUrl} alt={`${c.name} logo`} className={styles.logo} loading="lazy" />
          </div>
          <span className={styles.name}>{c.name}</span>
          {c.websiteUrl && (
            <span className={styles.site}>{c.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
          )}
        </li>
      ))}
    </ul>
  );
}