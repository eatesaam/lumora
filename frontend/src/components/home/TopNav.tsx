import Link from 'next/link';
import styles from './Home.module.css';

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Team', href: '/team' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

// Available for the shared layout; the Home page itself relies on AppLayout for navigation.
export default function TopNav() {
  return (
    <nav className={styles.topNav} aria-label="Primary">
      <Link href="/" className={styles.author}>Lumora</Link>
      <div className={styles.navLinks}>
        {NAV_ITEMS.map((n) => (
          <Link key={n.href} href={n.href}>{n.label}</Link>
        ))}
      </div>
    </nav>
  );
}