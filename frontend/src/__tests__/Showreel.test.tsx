import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Showreel from '@/pages/showreel';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({ __esModule: true, default: { get: jest.fn() } }));
const mockGet = (apiClient as any).get as jest.Mock;

const sample = { id: 1, title: 'Lumora Reel 2024', videoUrl: 'https://example.com/reel.mp4', posterUrl: 'https://example.com/p.jpg' };

describe('Showreel page', () => {
  beforeEach(() => mockGet.mockReset());

  it('renders showreel from API', async () => {
    mockGet.mockResolvedValueOnce({ data: sample });
    render(<Showreel />);
    expect(screen.getByText(/Loading showreel/)).toBeInTheDocument();
    expect(await screen.findByText('Lumora Reel 2024')).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith('/api/showreel');
  });

  it('toggles play and mute buttons', async () => {
    mockGet.mockResolvedValueOnce({ data: sample });
    render(<Showreel />);
    fireEvent.click(await screen.findByLabelText('Play showreel'));
    expect(screen.getByLabelText('Pause showreel')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Unmute'));
    expect(screen.getByLabelText('Mute')).toBeInTheDocument();
  });

  it('shows error and retries', async () => {
    mockGet.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ data: sample });
    render(<Showreel />);
    fireEvent.click(await screen.findByText('Retry'));
    await waitFor(() => expect(screen.getByText('Lumora Reel 2024')).toBeInTheDocument());
  });

  it('shows empty state', async () => {
    mockGet.mockResolvedValueOnce({ data: null });
    render(<Showreel />);
    expect(await screen.findByText(/No showreel available/)).toBeInTheDocument();
  });
});