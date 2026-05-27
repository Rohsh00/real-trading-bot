import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('App Component', () => {
  it('renders without crashing and shows Sidebar and Header', () => {
    render(<App />);
    
    // Check for some main layout elements
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check if the brand name is in the sidebar (using translation key or text)
    expect(screen.getByText('brand.name')).toBeInTheDocument();
  });
});
