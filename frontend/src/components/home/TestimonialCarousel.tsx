import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Testimonial, Client } from '@/types';
import styles from './Home.module.css';

export type TestimonialItem = Pick<Testimonial, 'id' | 'quote' | 'authorName' | 'authorTitle' | 'rating'> & {
  client: Pick<Client, 'id' | 'name' | 'logoUrl'> | null;
};

export default function TestimonialCarousel({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 8000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;
  const current = testimonials[index % count];

  return (
    <section className={styles.section}>
      <div className={styles.carousel}>
        <Quote size={32} />
        <p className={styles.quote}>&ldquo;{current.quote}&rdquo;</p>
        {current.rating ? (
          <div className={styles.stars} aria-label={`${current.rating} stars`}>
            {Array.from({ length: Math.min(5, current.rating) }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
        ) : null}
        <div className={styles.author} style={{ marginTop: 12 }}>{current.authorName}</div>
        <div className={styles.authorTitle}>
          {[current.authorTitle, current.client?.name].filter(Boolean).join(' · ')}
        </div>
        {count > 1 && (
          <div className={styles.carouselNav}>
            <button type="button" className={styles.navBtn} aria-label="Previous testimonial" onClick={() => setIndex((i) => (i - 1 + count) % count)}>
              <ChevronLeft size={18} />
            </button>
            {testimonials.map((t, i) => (
              <span key={t.id} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
            ))}
            <button type="button" className={styles.navBtn} aria-label="Next testimonial" onClick={() => setIndex((i) => (i + 1) % count)}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}