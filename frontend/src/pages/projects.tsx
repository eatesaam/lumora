import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import apiClient from '@/api/client';
import ProjectsList, { ProjectListItem } from '@/components/ProjectsList';
import styles from './projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/api/projects');
      setProjects(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError('Unable to load projects right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Head><title>Projects | Lumora</title></Head>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Explore the campaigns, films and brands we have brought to life.</p>
        </header>
        {loading ? (
          <div className={styles.state}>Loading projects…</div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button type="button" className={styles.retry} onClick={load}>Retry</button>
          </div>
        ) : (
          <ProjectsList projects={projects} />
        )}
      </div>
    </>
  );
}