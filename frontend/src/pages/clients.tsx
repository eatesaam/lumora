import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import apiClient from '@/api/client';
import type { Client } from '@/types';
import ClientsList from '@/components/ClientsList';
import styles from './clients.module.css';

type ClientItem = Pick<Client, 'id' | 'name' | 'logoUrl' | 'isFeatured'> & { websiteUrl?: string | null };
type Filter = 'all' | 'featured';

export default function Clients() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiClient.get('/api/clients');
        if (active) setClients(Array.isArray(res?.data) ? res.data : []);
      } catch {
        if (active) setError('Unable to load clients. Please try again later.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => (filter === 'featured' ? clients.filter((c) => c.isFeatured) : clients),
    [clients, filter]
  );

  return (
    <>
      <Head>
        <title>Clients | Lumora</title>
      </Head>
      <section className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Our Clients</span>
          <h1 className={styles.title}>Brands that trust Lumora</h1>
          <p className={styles.subtitle}>
            From ambitious startups to global names, we partner with teams who want stories that move people.
          </p>
        </header>

        <div className={styles.filters} role="tablist" aria-label="Filter clients">
          {(['all', 'featured'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All clients' : 'Featured'}
            </button>
          ))}
        </div>

        {loading && <p className={styles.state}>Loading clients…</p>}
        {!loading && error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {!loading && !error && visible.length === 0 && <p className={styles.state}>No clients to show yet.</p>}
        {!loading && !error && visible.length > 0 && <ClientsList clients={visible} />}
      </section>
    </>
  );
}