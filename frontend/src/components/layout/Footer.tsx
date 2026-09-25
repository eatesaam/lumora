import Link from 'next/link';
import { Aperture } from 'lucide-react';
import { NAV_ITEMS } from '../../theme/theme';

export default function Footer() {
  return (
    <footer className="bg-gradient-dark text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Aperture size={20} /> Lumora
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            A media agency crafting films, brands and campaigns that move people.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {NAV_ITEMS.map((i) => (
            <li key={i.href}><Link href={i.href} className="text-white/70 hover:text-white">{i.label}</Link></li>
          ))}
        </ul>
        <div className="text-sm text-white/60 md:text-right">
          <p>hello@lumora.studio</p>
          <p className="mt-4">© {new Date().getFullYear()} Lumora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}