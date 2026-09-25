import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Clients from '@/pages/clients';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));

const mockGet = (apiClient as any).get as jest.Mock;

const data = [
  { id: 1, name: 'Northwind', logoUrl: 'https://example.com/a.png', websiteUrl: 'https://northwind.com', isFeatured: true },
  { id: 2, name: 'Globex', logoUrl: 'https://example.com/b.png', websiteUrl: null, isFeatured: false },
];

describe('Clients page', () => {
  beforeEach(() => mockGet.mockReset());

  it('renders clients from the API', async () => {
    mockGet.mockResolvedValue({ data });
    render(<Clients />);
    expect(screen.getByText(/Loading clients/)).toBeInTheDocument();
    expect(await screen.findByText('Northwind')).toBeInTheDocument();
    expect(screen.getByText('Globex')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith('/api/clients');
  });

  it('filters to featured clients on click', async () => {
    mockGet.mockResolvedValue({ data });
    render(<Clients />);
    await screen.findByText('Globex');
    fireEvent.click(screen.getByRole('tab', { name: 'Featured' }));
    await waitFor(() => expect(screen.queryByText('Globex')).not.toBeInTheDocument());
    expect(screen.getByText('Northwind')).toBeInTheDocument();
  });

  it('shows an error state when the request fails', async () => {
    mockGet.mockRejectedValue(new Error('fail'));
    render(<Clients />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/Unable to load clients/);
  });

  it('shows empty state', async () => {
    mockGet.mockResolvedValue({ data: [] });
    render(<Clients />);
    expect(await screen.findByText(/No clients to show yet/)).toBeInTheDocument();
  });
});