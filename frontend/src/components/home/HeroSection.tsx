import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Showreel } from '@/types';
import ShowreelPlayer from './ShowreelPlayer';
import styles from './Home.module.css';

interface Props {
  showreel: Pick<Showreel, 'id' | 'title' | 'videoUrl' | 'posterUrl'> | null;
}

export default function HeroSection({ showreel }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div>
          <p className={styles.eyebrow} style={{ color: '#ffb4a9' }}>Lumora Media Agency</p>
          <h1 className={styles.heroTitle}>Stories that move brands forward.</h1>
          <p className={styles.heroText}>
            We craft film, branding, and digital campaigns that captivate audiences and deliver measurable results.
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.btnPrimary}>
              Start a project <ArrowRight size={16} />
            </Link>
            <Link href="/portfolio" className={styles.btnGhost}>View our work</Link>
          </div>
        </div>
        <ShowreelPlayer showreel={showreel} />
      </div>
    </section>
  );
}