import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Portfolio from '@/pages/portfolio';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));

const mockData = [
  { id: 1, title: 'Aurora Film', slug: 'aurora-film', category: 'video', summary: 'A cinematic launch', coverImageUrl: '/a.jpg', isFeatured: true, client: { id: 1, name: 'Nova' } },
  { id: 2, title: 'Pulse Brand', slug: 'pulse-brand', category: 'branding', summary: 'Identity refresh', coverImageUrl: '/b.jpg', isFeatured: false, client: { id: 2, name: 'Pulse' } },
];

describe('Portfolio page', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders projects from API', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
    render(<Portfolio />);
    expect(await screen.findByText('Aurora Film')).toBeInTheDocument();
    expect(screen.getByText('Pulse Brand')).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith('/api/projects');
  });

  it('filters by category on click', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });
    render(<Portfolio />);
    await screen.findByText('Aurora Film');
    fireEvent.click(screen.getByRole('tab', { name: 'Branding' }));
    expect(screen.queryByText('Aurora Film')).not.toBeInTheDocument();
    expect(screen.getByText('Pulse Brand')).toBeInTheDocument();
  });

  it('shows error state on failure', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<Portfolio />);
    await waitFor(() => expect(screen.getByText(/Unable to load portfolio/)).toBeInTheDocument());
  });
});