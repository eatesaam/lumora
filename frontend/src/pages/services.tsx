import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import type { Service } from '@/types';
import ServicesPage from '@/components/ServicesPage';

type ServiceListItem = Pick<Service, 'id' | 'name' | 'slug' | 'summary' | 'sortOrder'> & { icon?: string | null };
type ServiceProject = { id: number; title: string; slug: string; coverImageUrl: string };
export type ServiceDetail = Pick<Service, 'id' | 'name' | 'slug' | 'summary'> & {
  description?: string | null;
  icon?: string | null;
  projects: ServiceProject[];
};

export default function Services() {
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiClient
      .get('/api/services')
      .then((res) => {
        if (!active) return;
        const data = Array.isArray(res?.data) ? res.data : [];
        setServices([...data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
      })
      .catch(() => active && setError('Unable to load services right now.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const openService = (slug: string) => {
    if (selected === slug) {
      setSelected(null);
      setDetail(null);
      return;
    }
    setSelected(slug);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    apiClient
      .get(`/api/services/${encodeURIComponent(slug)}`)
      .then((res) => setDetail(res?.data ? { ...res.data, projects: Array.isArray(res.data.projects) ? res.data.projects : [] } : null))
      .catch(() => setDetailError('Unable to load service details.'))
      .finally(() => setDetailLoading(false));
  };

  return (
    <ServicesPage
      services={services}
      loading={loading}
      error={error}
      selected={selected}
      detail={detail}
      detailLoading={detailLoading}
      detailError={detailError}
      onSelect={openService}
      footer={
        <div className="svc-cta">
          <h2>Have a project in mind?</h2>
          <p>Tell us about your goals and we will shape the right mix of services.</p>
          <Link href="/contact" className="svc-cta-btn">Start a project</Link>
        </div>
      }
    />
  );
}