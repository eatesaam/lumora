import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Services from '@/pages/services';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
const mockGet = (apiClient as unknown as { get: jest.Mock }).get;

const list = [
  { icon: 'video', id: 1, name: 'Video Production', slug: 'video-production', sortOrder: 1, summary: 'Films that move' },
  { icon: null, id: 2, name: 'Branding', slug: 'branding', sortOrder: 2, summary: 'Identity systems' },
];
const detail = {
  description: 'Full-service video', icon: 'video', id: 1, name: 'Video Production',
  projects: [{ coverImageUrl: 'https://example.com/a.jpg', id: 5, slug: 'aurora', title: 'Aurora Launch' }],
  slug: 'video-production', summary: 'Films that move',
};

describe('Services page', () => {
  beforeEach(() => mockGet.mockReset());

  it('renders services from the API', async () => {
    mockGet.mockResolvedValueOnce({ data: list });
    render(<Services />);
    expect(screen.getByText(/Loading services/)).toBeInTheDocument();
    expect(await screen.findByText('Video Production')).toBeInTheDocument();
    expect(screen.getByText('Branding')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith('/api/services');
  });

  it('loads detail on click', async () => {
    mockGet.mockResolvedValueOnce({ data: list }).mockResolvedValueOnce({ data: detail });
    render(<Services />);
    await screen.findByText('Video Production');
    fireEvent.click(screen.getAllByText('View details')[0]);
    expect(await screen.findByText('Aurora Launch')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith('/api/services/video-production');
  });

  it('shows error state', async () => {
    mockGet.mockRejectedValueOnce(new Error('fail'));
    render(<Services />);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Unable to load services'));
  });
});