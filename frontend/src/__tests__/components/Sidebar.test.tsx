import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';
import { vi } from 'vitest';
import { TabEnum } from '../../types/enums';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

describe('Sidebar Component', () => {
  const mockSetActiveTab = vi.fn();
  const mockSetTenant = vi.fn();

  it('renders brand name and navigation items', () => {
    render(
      <Sidebar 
        activeTab={TabEnum.OVERVIEW}
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    expect(screen.getByText('brand.name')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.overview')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.positions')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.strategies')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.candles')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.backtest')).toBeInTheDocument();
    expect(screen.getByText('sidebar.tabs.billing')).toBeInTheDocument();
  });

  it('triggers setActiveTab callback when navigation buttons are clicked', () => {
    render(
      <Sidebar 
        activeTab={TabEnum.OVERVIEW}
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    const positionsButton = screen.getByText('sidebar.tabs.positions');
    fireEvent.click(positionsButton);

    expect(mockSetActiveTab).toHaveBeenCalledWith(TabEnum.POSITIONS);
  });

  it('renders tenant dropdown with standard active plan option text', () => {
    render(
      <Sidebar 
        activeTab={TabEnum.OVERVIEW} 
        setActiveTab={mockSetActiveTab} 
        tenant="trader-standard" 
        setTenant={mockSetTenant} 
      />
    );

    expect(screen.getByText('sidebar.tiers.standard')).toBeInTheDocument();
  });
});

