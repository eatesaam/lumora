import styles from './Home.module.css';

// Available for the shared layout; the Home page itself relies on AppLayout for its footer.
export default function Footer() {
  return (
    <footer className={styles.footer}>© {new Date().getFullYear()} Lumora Media Agency. All rights reserved.</footer>
  );
}