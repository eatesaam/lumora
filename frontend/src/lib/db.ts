import path from 'path';

let db: any = null;

const SQLITE_SCHEMA = `
CREATE TABLE IF NOT EXISTS showreels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  videoUrl TEXT NOT NULL,
  posterUrl TEXT,
  isActive INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  logoUrl TEXT NOT NULL,
  websiteUrl TEXT,
  isFeatured INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  coverImageUrl TEXT NOT NULL,
  galleryUrls TEXT,
  isFeatured INTEGER NOT NULL DEFAULT 0,
  completedAt TEXT,
  clientId INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  serviceId INTEGER REFERENCES services(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  bio TEXT,
  photoUrl TEXT,
  linkedinUrl TEXT,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote TEXT NOT NULL,
  authorName TEXT NOT NULL UNIQUE,
  authorTitle TEXT,
  rating INTEGER,
  clientId INTEGER REFERENCES clients(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  serviceInterest TEXT,
  budgetRange TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

function seedSqlite(d: any) {
  const count = d.prepare('SELECT COUNT(*) as c FROM services').get();
  if (count.c > 0) return;

  const tx = d.transaction(() => {
    d.prepare('INSERT OR IGNORE INTO showreels (title, videoUrl, posterUrl, isActive) VALUES (?,?,?,?)').run(
      'Lumora Showreel 2025',
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600',
      1
    );

    const svc = d.prepare('INSERT OR IGNORE INTO services (name, slug, summary, description, icon, sortOrder) VALUES (?,?,?,?,?,?)');
    svc.run('Video Production', 'video-production', 'Cinematic storytelling from concept to final cut.', 'Full-service production: scripting, shooting, editing, color and sound.', 'video', 1);
    svc.run('Brand Identity', 'brand-identity', 'Distinctive brands built to last.', 'Strategy, naming, logo systems and brand guidelines.', 'palette', 2);
    svc.run('Social Media', 'social-media', 'Content that stops the scroll.', 'Always-on social content, community management and paid social.', 'share-2', 3);
    svc.run('Digital Campaigns', 'digital-campaigns', 'Integrated campaigns that move metrics.', 'Multi-channel campaign planning, creative and performance optimisation.', 'megaphone', 4);

    const cl = d.prepare('INSERT OR IGNORE INTO clients (name, logoUrl, websiteUrl, isFeatured) VALUES (?,?,?,?)');
    cl.run('Northwind', 'https://dummyimage.com/200x80/111/fff&text=Northwind', 'https://example.com', 1);
    cl.run('Aurora Labs', 'https://dummyimage.com/200x80/111/fff&text=Aurora+Labs', 'https://example.org', 1);
    cl.run('Helios Energy', 'https://dummyimage.com/200x80/111/fff&text=Helios', null, 1);
    cl.run('Vela Studio', 'https://dummyimage.com/200x80/111/fff&text=Vela', null, 0);

    const pr = d.prepare(`INSERT OR IGNORE INTO projects (title, slug, category, summary, challenge, solution, results, coverImageUrl, galleryUrls, isFeatured, completedAt, clientId, serviceId)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,(SELECT id FROM clients WHERE name=?),(SELECT id FROM services WHERE slug=?))`);
    pr.run('Northwind Launch Film', 'northwind-launch-film', 'video', 'A launch film for Northwind’s flagship product.', 'Introduce a complex product in 60 seconds.', 'A cinematic, character-led narrative.', '4.2M views and 38% lift in signups.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200', JSON.stringify(['https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200']), 1, '2025-03-15T00:00:00.000Z', 'Northwind', 'video-production');
    pr.run('Aurora Rebrand', 'aurora-rebrand', 'branding', 'A complete identity refresh for Aurora Labs.', 'An outdated brand for a modern biotech.', 'A luminous, modular identity system.', 'Brand recall up 52%.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200', JSON.stringify(['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200']), 1, '2024-11-01T00:00:00.000Z', 'Aurora Labs', 'brand-identity');
    pr.run('Helios Social Series', 'helios-social-series', 'social', 'An always-on social series for Helios Energy.', 'Make energy relatable to Gen Z.', 'Short-form, creator-led content.', '+120k followers in 6 months.', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200', JSON.stringify([]), 1, '2025-01-20T00:00:00.000Z', 'Helios Energy', 'social-media');
    pr.run('Vela Summer Campaign', 'vela-summer-campaign', 'campaign', 'A summer campaign across digital and OOH.', 'Stand out in a crowded season.', 'Bold visuals and interactive digital.', 'ROAS of 5.1x.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200', JSON.stringify([]), 0, null, 'Vela Studio', 'digital-campaigns');

    const tm = d.prepare('INSERT OR IGNORE INTO team_members (name, role, bio, photoUrl, linkedinUrl, sortOrder) VALUES (?,?,?,?,?,?)');
    tm.run('Maya Chen', 'Founder & Creative Director', 'Fifteen years crafting award-winning campaigns.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600', 'https://www.linkedin.com', 1);
    tm.run('Leo Martins', 'Head of Production', 'Directs and produces every Lumora film.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 'https://www.linkedin.com', 2);
    tm.run('Priya Nair', 'Brand Strategist', 'Turns insight into identity.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600', null, 3);

    const ts = d.prepare('INSERT OR IGNORE INTO testimonials (quote, authorName, authorTitle, rating, clientId) VALUES (?,?,?,?,(SELECT id FROM clients WHERE name=?))');
    ts.run('Lumora made our launch unforgettable. The film did more than any ad we have ever run.', 'Sarah Olsen', 'CMO, Northwind', 5, 'Northwind');
    ts.run('They understood our science and made it beautiful.', 'Dr. Ken Ito', 'CEO, Aurora Labs', 5, 'Aurora Labs');
    ts.run('A true creative partner — fast, sharp and fun to work with.', 'Jonas Weber', 'Head of Brand, Helios Energy', 4, 'Helios Energy');
  });
  tx();
}

export function getDb() {
  if (db) return db;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { createClient } = require('@supabase/supabase-js');
    db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return db;
  }

  // VMSS preview only — Supabase env vars are absent.
  const Database = require('better-sqlite3');
  db = new Database(path.join('/tmp', 'app.db'));
  db.pragma('journal_mode = WAL');
  db.exec(SQLITE_SCHEMA);
  seedSqlite(db);
  return db;
}

export function isSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}