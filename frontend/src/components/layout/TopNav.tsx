import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Aperture } from 'lucide-react';
import { NAV_ITEMS } from '../../theme/theme';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = router?.pathname || '/';

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-header text-white">
            <Aperture size={20} />
          </span>
          Lumora
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active ? 'bg-brand-light text-brand' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/contact" className="btn-primary hidden md:inline-flex">Start a project</Link>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <ul data-testid="mobile-menu" className="container-page flex flex-col gap-1 pb-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-surface-alt">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}