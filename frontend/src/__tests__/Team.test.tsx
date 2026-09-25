import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Team from '@/pages/team';
import apiClient from '@/api/client';

jest.mock('next/head', () => ({ __esModule: true, default: ({ children }: any) => <>{children}</> }));
jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));

const mockGet = (apiClient as any).get as jest.Mock;

const members = [
  { id: 1, name: 'Ava Chen', role: 'Creative Director', bio: 'Leads creative vision.', photoUrl: null, linkedinUrl: 'https://linkedin.com/in/ava' },
  { id: 2, name: 'Marco Reyes', role: 'Head of Production', bio: null, photoUrl: 'https://example.com/m.jpg', linkedinUrl: null },
];

describe('Team page', () => {
  beforeEach(() => mockGet.mockReset());

  it('renders team members from /api/team', async () => {
    mockGet.mockResolvedValueOnce({ data: members });
    render(<Team />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('Ava Chen')).toBeInTheDocument();
    expect(screen.getByText('Head of Production')).toBeInTheDocument();
    expect(screen.getAllByTestId('team-card')).toHaveLength(2);
    expect(mockGet).toHaveBeenCalledWith('/api/team');
  });

  it('toggles bio expansion', async () => {
    mockGet.mockResolvedValueOnce({ data: members });
    render(<Team />);
    const btn = await screen.findByText('Read bio');
    fireEvent.click(btn);
    expect(screen.getByText('Show less')).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows error and retries', async () => {
    mockGet.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ data: members });
    render(<Team />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Try again'));
    await waitFor(() => expect(screen.getByText('Ava Chen')).toBeInTheDocument());
  });

  it('shows empty state', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });
    render(<Team />);
    expect(await screen.findByText('No team members to show yet.')).toBeInTheDocument();
  });
});