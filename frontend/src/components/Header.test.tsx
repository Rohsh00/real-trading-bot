import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('renders title and subtitle correctly', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" isHealthOk={true} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders green online chip when isHealthOk is true', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" isHealthOk={true} />);

    const onlineChip = screen.getByText('Backend API Online');
    expect(onlineChip).toBeInTheDocument();
  });

  it('renders red offline chip when isHealthOk is false', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" isHealthOk={false} />);

    const offlineChip = screen.getByText('Backend Offline');
    expect(offlineChip).toBeInTheDocument();
  });
});
