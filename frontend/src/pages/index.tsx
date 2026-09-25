import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import type { Showreel, Service, Project, Client, Testimonial } from '@/types';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import FeaturedCaseStudies, { FeaturedProject } from '@/components/home/FeaturedCaseStudies';
import ClientLogoStrip from '@/components/home/ClientLogoStrip';
import TestimonialCarousel, { TestimonialItem } from '@/components/home/TestimonialCarousel';
import ContactCTA from '@/components/home/ContactCTA';
import styles from '@/components/home/Home.module.css';

type ShowreelData = Pick<Showreel, 'id' | 'title' | 'videoUrl' | 'posterUrl'>;
type ServiceItem = Pick<Service, 'id' | 'name' | 'slug' | 'summary' | 'sortOrder' | 'icon'>;
type ClientItem = Pick<Client, 'id' | 'name' | 'logoUrl' | 'websiteUrl' | 'isFeatured'>;

export default function Home() {
  const [showreel, setShowreel] = useState<ShowreelData | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const results = await Promise.allSettled([
        apiClient.get('/api/showreel'),
        apiClient.get('/api/services'),
        apiClient.get('/api/projects', { params: { featured: true } }),
        apiClient.get('/api/clients'),
        apiClient.get('/api/testimonials'),
      ]);
      if (!active) return;
      const val = (i: number) => (results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<any>).value?.data : null);
      setShowreel(val(0) && val(0).videoUrl ? val(0) : null);
      setServices(Array.isArray(val(1)) ? val(1) : []);
      const p: FeaturedProject[] = Array.isArray(val(2)) ? val(2) : [];
      setProjects(p.filter((x) => x.isFeatured).length ? p.filter((x) => x.isFeatured) : p);
      setClients(Array.isArray(val(3)) ? val(3) : []);
      setTestimonials(Array.isArray(val(4)) ? val(4) : []);
      if (results.every((r) => r.status === 'rejected')) setError('We could not load content right now. Please try again later.');
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <HeroSection showreel={showreel} />
      {loading && <div className={styles.status} role="status">Loading…</div>}
      {error && <div className={styles.error} role="alert">{error}</div>}
      {!loading && !error && (
        <>
          <ServicesPreview services={services} />
          <FeaturedCaseStudies projects={projects} />
          <ClientLogoStrip clients={clients} />
          <TestimonialCarousel testimonials={testimonials} />
        </>
      )}
      <ContactCTA />
    </div>
  );
}