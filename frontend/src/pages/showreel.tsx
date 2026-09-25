import React, { useCallback, useEffect, useState } from 'react';
import apiClient from '@/api/client';
import type { Showreel as ShowreelType } from '@/types';
import ShowreelList from '@/components/ShowreelList';
import styles from './showreel.module.css';

type ShowreelResponse = Pick<ShowreelType, 'id' | 'title' | 'videoUrl'> & { posterUrl?: string | null };

export default function Showreel() {
  const [data, setData] = useState<ShowreelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/api/showreel');
      const d = res?.data;
      setData(d && d.videoUrl ? (d as ShowreelResponse) : null);
    } catch {
      setError('Unable to load the showreel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Our Work in Motion</span>
        <h1 className={styles.heading}>Showreel</h1>
        <p className={styles.sub}>A glimpse of the stories we craft for brands.</p>
      </header>
      {loading && <div className={styles.state}>Loading showreel…</div>}
      {!loading && error && (
        <div className={`${styles.state} ${styles.error}`}>
          <p>{error}</p>
          <button className={styles.retry} onClick={load}>Retry</button>
        </div>
      )}
      {!loading && !error && !data && <div className={styles.state}>No showreel available right now.</div>}
      {!loading && !error && data && <ShowreelList showreel={data} />}
    </section>
  );
}