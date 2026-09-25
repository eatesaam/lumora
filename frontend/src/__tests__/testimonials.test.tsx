import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Testimonials from '@/pages/testimonials';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));

const mocked = apiClient as unknown as { get: jest.Mock };

const data = [
  { id: 1, quote: 'Amazing work', authorName: 'Jane Doe', authorTitle: 'CMO', rating: 5, client: { id: 1, name: 'Acme', logoUrl: '/acme.png' } },
  { id: 2, quote: 'Solid partner', authorName: 'Bob Roe', authorTitle: null, rating: 3, client: { id: 2, name: 'Globex', logoUrl: '/globex.png' } },
];

describe('Testimonials page', () => {
  beforeEach(() => mocked.get.mockReset());

  it('renders testimonials from the API', async () => {
    mocked.get.mockResolvedValueOnce({ data });
    render(<Testimonials />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Bob Roe')).toBeInTheDocument();
    expect(mocked.get).toHaveBeenCalledWith('/api/testimonials');
  });

  it('filters by rating when a chip is clicked', async () => {
    mocked.get.mockResolvedValueOnce({ data });
    render(<Testimonials />);
    await screen.findByText('Jane Doe');
    fireEvent.click(screen.getByText('4+ stars'));
    expect(screen.getAllByTestId('testimonial-card')).toHaveLength(1);
    expect(screen.queryByText('Bob Roe')).not.toBeInTheDocument();
  });

  it('shows error and retries', async () => {
    mocked.get.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ data });
    render(<Testimonials />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load testimonials.');
    fireEvent.click(screen.getByText('Try again'));
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());
  });

  it('shows empty state', async () => {
    mocked.get.mockResolvedValueOnce({ data: [] });
    render(<Testimonials />);
    expect(await screen.findByText('No testimonials to show yet.')).toBeInTheDocument();
  });
});