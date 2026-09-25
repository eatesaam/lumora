import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '@/pages/contact';
import apiClient from '@/api/client';

jest.mock('@/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const mockedPost = (apiClient as any).post as jest.Mock;

describe('Contact page', () => {
  beforeEach(() => mockedPost.mockReset());

  it('renders the inquiry form', () => {
    render(<Contact />);
    expect(screen.getByText('Let’s create something remarkable')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send inquiry/i })).toBeInTheDocument();
  });

  it('shows validation errors and does not submit when empty', async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it('submits and shows success', async () => {
    mockedPost.mockResolvedValue({
      data: { id: 1, name: 'Ada', email: 'ada@example.com', status: 'new', createdAt: '2024-01-01T00:00:00Z' },
    });
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Budget range'), { target: { value: '25k_50k' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'New brand film' } });
    fireEvent.click(screen.getByRole('button', { name: /send inquiry/i }));
    await waitFor(() => expect(mockedPost).toHaveBeenCalledWith('/api/inquiries', expect.objectContaining({
      name: 'Ada', email: 'ada@example.com', message: 'New brand film', budgetRange: '25k_50k',
    })));
    expect(await screen.findByText('Thanks, Ada!')).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    mockedPost.mockRejectedValue({ response: { data: { error: 'Server unavailable' } } });
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Server unavailable');
  });
});