export const themeTokens = {
  colors: {
    primary: '#7C5CFF',
    primaryDark: '#5B3FE0',
    coral: '#FF6B5B',
    teal: '#14B8A6',
    ink: '#0B0B12',
    muted: '#6B6B80',
    background: '#FFFFFF',
    surfaceAlt: '#F7F6FB',
    border: '#E7E5F0',
  },
  gradients: {
    headerPrimary: 'var(--gradient-header-primary)',
    panelDark: 'var(--gradient-panel-dark)',
    softSurface: 'var(--gradient-soft-surface)',
  },
  typography: {
    display: '"Space Grotesk", Inter, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  radius: { md: '12px', lg: '16px' },
};

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Team', href: '/team' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
] as const;

export default themeTokens;