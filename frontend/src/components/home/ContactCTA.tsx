import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './Home.module.css';

export default function ContactCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.cta}>
        <div>
          <p className={styles.eyebrow}>Let&apos;s work together</p>
          <h2 className={styles.h2}>Have a project in mind?</h2>
          <p className={styles.muted} style={{ margin: '8px 0 0' }}>Tell us about your goals and we&apos;ll get back within one business day.</p>
        </div>
        <Link href="/contact" className={styles.btnPrimary}>Send an inquiry <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}