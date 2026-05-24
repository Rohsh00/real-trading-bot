import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { vi } from 'vitest';

describe('Sidebar Component', () => {
  const mockSetActiveTab = vi.fn();
  const mockSetTenant = vi.fn();

  it('renders brand name and navigation items', () => {
    render(
      <Sidebar 
        activeTab="overview" 
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    expect(screen.getByText('Antigravity SaaS')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Open Positions')).toBeInTheDocument();
    expect(screen.getByText('Strategy Hub')).toBeInTheDocument();
    expect(screen.getByText('Live Charts')).toBeInTheDocument();
    expect(screen.getByText('Backtesting')).toBeInTheDocument();
    expect(screen.getByText('SaaS Billing')).toBeInTheDocument();
  });

  it('triggers setActiveTab callback when navigation buttons are clicked', () => {
    render(
      <Sidebar 
        activeTab="overview" 
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    const positionsButton = screen.getByText('Open Positions');
    fireEvent.click(positionsButton);

    expect(mockSetActiveTab).toHaveBeenCalledWith('positions');
  });

  it('renders tenant dropdown with standard active plan option text', () => {
    render(
      <Sidebar 
        activeTab="overview" 
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    expect(screen.getByText('Standard Tier (User #104)')).toBeInTheDocument();
  });
});
