import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Projects from '@/pages/projects';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));

const mockGet = (apiClient as any).get as jest.Mock;

const data = [
  { category: 'video', client: { id: 1, name: 'Acme' }, coverImageUrl: '/a.jpg', id: 1, isFeatured: true, slug: 'film', summary: 'A film', title: 'Brand Film' },
  { category: 'branding', client: { id: 2, name: 'Nova' }, coverImageUrl: '/b.jpg', id: 2, isFeatured: false, slug: 'rebrand', summary: 'A rebrand', title: 'Nova Rebrand' },
];

describe('Projects page', () => {
  beforeEach(() => mockGet.mockReset());

  it('renders projects from API', async () => {
    mockGet.mockResolvedValue({ data });
    render(<Projects />);
    expect(await screen.findByText('Brand Film')).toBeInTheDocument();
    expect(screen.getByText('Nova Rebrand')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith('/api/projects');
  });

  it('filters by category on click', async () => {
    mockGet.mockResolvedValue({ data });
    render(<Projects />);
    await screen.findByText('Brand Film');
    fireEvent.click(screen.getByRole('button', { name: 'branding' }));
    expect(screen.queryByText('Brand Film')).not.toBeInTheDocument();
    expect(screen.getByText('Nova Rebrand')).toBeInTheDocument();
  });

  it('shows error and retries', async () => {
    mockGet.mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce({ data });
    render(<Projects />);
    expect(await screen.findByText(/Unable to load projects/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Retry'));
    await waitFor(() => expect(screen.getByText('Brand Film')).toBeInTheDocument());
  });
});