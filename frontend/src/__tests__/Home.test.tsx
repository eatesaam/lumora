import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/pages/index';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
const mockGet = (apiClient as any).get as jest.Mock;

const data: Record<string, any> = {
  '/api/showreel': { id: 1, title: 'Lumora Reel 2024', videoUrl: 'https://cdn.example.com/reel.mp4', posterUrl: null },
  '/api/services': [{ id: 1, name: 'Video Production', slug: 'video-production', summary: 'Cinematic films', sortOrder: 0, icon: null }],
  '/api/projects': [{ id: 1, title: 'Aurora Launch', slug: 'aurora-launch', category: 'campaign', summary: 'Launch film', coverImageUrl: 'https://img/1.jpg', isFeatured: true, client: { id: 1, name: 'Aurora Co' } }],
  '/api/clients': [{ id: 1, name: 'Aurora Co', logoUrl: 'https://img/logo.png', websiteUrl: null, isFeatured: true }],
  '/api/testimonials': [
    { id: 1, quote: 'Outstanding work', authorName: 'Jane Doe', authorTitle: 'CMO', rating: 5, client: { id: 1, name: 'Aurora Co', logoUrl: 'https://img/logo.png' } },
    { id: 2, quote: 'Truly creative team', authorName: 'John Roe', authorTitle: null, rating: null, client: { id: 1, name: 'Aurora Co', logoUrl: 'https://img/logo.png' } },
  ],
};

describe('Home page', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('renders sections with API data', async () => {
    mockGet.mockImplementation((url: string) => Promise.resolve({ data: data[url] }));
    render(<Home />);
    expect(await screen.findByText('Video Production')).toBeInTheDocument();
    expect(screen.getByText('Aurora Launch')).toBeInTheDocument();
    expect(screen.getByText('Lumora Reel 2024')).toBeInTheDocument();
    expect(screen.getByText(/Outstanding work/)).toBeInTheDocument();
  });

  it('advances testimonial carousel and plays showreel', async () => {
    mockGet.mockImplementation((url: string) => Promise.resolve({ data: data[url] }));
    render(<Home />);
    await screen.findByText(/Outstanding work/);
    fireEvent.click(screen.getByLabelText('Next testimonial'));
    expect(screen.getByText(/Truly creative team/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Play showreel'));
    expect(screen.queryByLabelText('Play showreel')).not.toBeInTheDocument();
  });

  it('shows error when all requests fail', async () => {
    mockGet.mockRejectedValue(new Error('boom'));
    render(<Home />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText('Showreel coming soon')).toBeInTheDocument();
  });
});