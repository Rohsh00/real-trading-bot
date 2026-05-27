import { render, screen } from '@testing-library/react';
import Header from '../../components/layout/Header';

const defaultProps = {
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  isHealthOk: true as const,
  brokerStatus: null,
  themeMode: 'dark' as const,
  onToggleTheme: () => {},
};

describe('Header Component', () => {
  it('renders title and subtitle correctly', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders green online chip when isHealthOk is true', () => {
    render(<Header {...defaultProps} isHealthOk={true} />);

    const onlineChip = screen.getByText('Backend API Online');
    expect(onlineChip).toBeInTheDocument();
  });

  it('renders red offline chip when isHealthOk is false', () => {
    render(<Header {...defaultProps} isHealthOk={false} />);

    const offlineChip = screen.getByText('Backend Offline');
    expect(offlineChip).toBeInTheDocument();
  });
});
