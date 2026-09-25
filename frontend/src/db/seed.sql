INSERT INTO showreels (title, "videoUrl", "posterUrl", "isActive") VALUES
  ('Lumora Showreel 2025', 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600', TRUE)
ON CONFLICT (title) DO NOTHING;

INSERT INTO services (name, slug, summary, description, icon, "sortOrder") VALUES
  ('Video Production', 'video-production', 'Cinematic storytelling from concept to final cut.', 'Full-service production: scripting, shooting, editing, color and sound.', 'video', 1),
  ('Brand Identity', 'brand-identity', 'Distinctive brands built to last.', 'Strategy, naming, logo systems and brand guidelines.', 'palette', 2),
  ('Social Media', 'social-media', 'Content that stops the scroll.', 'Always-on social content, community management and paid social.', 'share-2', 3),
  ('Digital Campaigns', 'digital-campaigns', 'Integrated campaigns that move metrics.', 'Multi-channel campaign planning, creative and performance optimisation.', 'megaphone', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clients (name, "logoUrl", "websiteUrl", "isFeatured") VALUES
  ('Northwind', 'https://dummyimage.com/200x80/111/fff&text=Northwind', 'https://example.com', TRUE),
  ('Aurora Labs', 'https://dummyimage.com/200x80/111/fff&text=Aurora+Labs', 'https://example.org', TRUE),
  ('Helios Energy', 'https://dummyimage.com/200x80/111/fff&text=Helios', NULL, TRUE),
  ('Vela Studio', 'https://dummyimage.com/200x80/111/fff&text=Vela', NULL, FALSE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO projects (title, slug, category, summary, challenge, solution, results, "coverImageUrl", "galleryUrls", "isFeatured", "completedAt", "clientId", "serviceId") VALUES
  ('Northwind Launch Film', 'northwind-launch-film', 'video', 'A launch film for Northwind’s flagship product.', 'Introduce a complex product in 60 seconds.', 'A cinematic, character-led narrative.', '4.2M views and 38% lift in signups.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200', '["https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200","https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200"]'::jsonb, TRUE, '2025-03-15T00:00:00Z', (SELECT id FROM clients WHERE name = 'Northwind'), (SELECT id FROM services WHERE slug = 'video-production')),
  ('Aurora Rebrand', 'aurora-rebrand', 'branding', 'A complete identity refresh for Aurora Labs.', 'An outdated brand for a modern biotech.', 'A luminous, modular identity system.', 'Brand recall up 52%.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200', '["https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200"]'::jsonb, TRUE, '2024-11-01T00:00:00Z', (SELECT id FROM clients WHERE name = 'Aurora Labs'), (SELECT id FROM services WHERE slug = 'brand-identity')),
  ('Helios Social Series', 'helios-social-series', 'social', 'An always-on social series for Helios Energy.', 'Make energy relatable to Gen Z.', 'Short-form, creator-led content.', '+120k followers in 6 months.', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200', '[]'::jsonb, TRUE, '2025-01-20T00:00:00Z', (SELECT id FROM clients WHERE name = 'Helios Energy'), (SELECT id FROM services WHERE slug = 'social-media')),
  ('Vela Summer Campaign', 'vela-summer-campaign', 'campaign', 'A summer campaign across digital and OOH.', 'Stand out in a crowded season.', 'Bold visuals and interactive digital.', 'ROAS of 5.1x.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200', '[]'::jsonb, FALSE, NULL, (SELECT id FROM clients WHERE name = 'Vela Studio'), (SELECT id FROM services WHERE slug = 'digital-campaigns'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_members (name, role, bio, "photoUrl", "linkedinUrl", "sortOrder") VALUES
  ('Maya Chen', 'Founder & Creative Director', 'Fifteen years crafting award-winning campaigns.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600', 'https://www.linkedin.com', 1),
  ('Leo Martins', 'Head of Production', 'Directs and produces every Lumora film.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 'https://www.linkedin.com', 2),
  ('Priya Nair', 'Brand Strategist', 'Turns insight into identity.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600', NULL, 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO testimonials (quote, "authorName", "authorTitle", rating, "clientId") VALUES
  ('Lumora made our launch unforgettable. The film did more than any ad we have ever run.', 'Sarah Olsen', 'CMO, Northwind', 5, (SELECT id FROM clients WHERE name = 'Northwind')),
  ('They understood our science and made it beautiful.', 'Dr. Ken Ito', 'CEO, Aurora Labs', 5, (SELECT id FROM clients WHERE name = 'Aurora Labs')),
  ('A true creative partner — fast, sharp and fun to work with.', 'Jonas Weber', 'Head of Brand, Helios Energy', 4, (SELECT id FROM clients WHERE name = 'Helios Energy'))
ON CONFLICT ("authorName") DO NOTHING;