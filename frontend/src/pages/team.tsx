import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import apiClient from '@/api/client';
import type { TeamMember } from '@/types';
import TeamPage from '@/components/TeamPage';

type TeamMemberItem = Pick<TeamMember, 'id' | 'name' | 'role'> & {
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
};

export default function Team() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/api/team');
      setMembers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError('Unable to load the team right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Team | Lumora</title>
      </Head>
      <TeamPage members={members} loading={loading} error={error} onRetry={load} />
    </>
  );
}