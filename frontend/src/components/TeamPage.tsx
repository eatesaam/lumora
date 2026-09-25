import React, { useState } from 'react';
import type { TeamMember } from '@/types';
import styles from './TeamPage.module.css';

export type TeamMemberItem = Pick<TeamMember, 'id' | 'name' | 'role'> & {
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
};

interface Props {
  members: TeamMemberItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export default function TeamPage({ members, loading, error, onRetry }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Our people</span>
        <h1 className={styles.title}>Meet the team behind Lumora</h1>
        <p className={styles.subtitle}>
          Directors, strategists, designers and storytellers crafting work that moves audiences.
        </p>
      </header>

      {loading && <p className={styles.state} role="status">Loading team…</p>}

      {!loading && error && (
        <div className={styles.state} role="alert">
          <p>{error}</p>
          <button className={styles.button} onClick={onRetry}>Try again</button>
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <p className={styles.state}>No team members to show yet.</p>
      )}

      {!loading && !error && members.length > 0 && (
        <div className={styles.grid}>
          {members.map((m) => {
            const open = expanded === m.id;
            return (
              <article key={m.id} className={styles.card} data-testid="team-card">
                <div className={styles.photoWrap}>
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} className={styles.photo} />
                  ) : (
                    <div className={styles.placeholder} aria-hidden="true">{initials(m.name)}</div>
                  )}
                </div>
                <div className={styles.body}>
                  <h2 className={styles.name}>{m.name}</h2>
                  <p className={styles.role}>{m.role}</p>
                  {m.bio && (
                    <>
                      <p className={open ? styles.bioOpen : styles.bio}>{m.bio}</p>
                      <button
                        className={styles.link}
                        onClick={() => setExpanded(open ? null : m.id)}
                        aria-expanded={open}
                      >
                        {open ? 'Show less' : 'Read bio'}
                      </button>
                    </>
                  )}
                  {m.linkedinUrl && (
                    <button
                      className={styles.linkedin}
                      onClick={() => window.open(m.linkedinUrl as string, '_blank', 'noopener,noreferrer')}
                    >
                      LinkedIn ↗
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}