import { render, screen, fireEvent } from '@testing-library/react';
import AppLayout from '../components/layout/AppLayout';

jest.mock('next/router', () => ({ useRouter: () => ({ pathname: '/' }) }));

describe('AppLayout', () => {
  it('renders brand, nav links and children', () => {
    render(<AppLayout><p>Page body</p></AppLayout>);
    expect(screen.getAllByText('Lumora').length).toBeGreaterThan(0);
    expect(screen.getByText('Page body')).toBeInTheDocument();
    ['Services', 'Portfolio', 'Team', 'Testimonials', 'Contact'].forEach((l) =>
      expect(screen.getAllByText(l).length).toBeGreaterThan(0)
    );
  });

  it('toggles the mobile menu', () => {
    render(<AppLayout><p>x</p></AppLayout>);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
});