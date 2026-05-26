import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Overview from '../../components/Overview';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe('Overview Component', () => {
  const mockPositions = {
    AAPL: {
      quantity: 10,
      average_price: 150,
      stop_loss: 140,
      take_profit: 170,
      unrealized_pnl: 150,
    },
    GOOGL: {
      quantity: -5,
      average_price: 2800,
      stop_loss: 2900,
      take_profit: 2600,
      unrealized_pnl: -200,
    },
  };

  const defaultProps = {
    cashBalance: 10000,
    realizedPnl: 500,
    positions: mockPositions,
    strategiesCount: 3,
    tenant: 'trader-pro',
  };

  it('renders summary cards correctly', () => {
    render(
      <Provider store={store}>
        <Overview {...defaultProps} />
      </Provider>
    );

    // Cash Balance
    expect(screen.getByText('$10,000.00')).toBeInTheDocument();
    
    // Realized PnL
    expect(screen.getByText('+$500.00')).toBeInTheDocument();

    // Active Positions Count
    expect(screen.getByText('2')).toBeInTheDocument(); // AAPL and GOOGL

    // Strategies Count
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders positions table correctly', () => {
    render(
      <Provider store={store}>
        <Overview {...defaultProps} />
      </Provider>
    );

    // Check symbols
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();

    // Check PnLs
    expect(screen.getByText('+$150.00')).toBeInTheDocument();
    expect(screen.getByText('$-200.00')).toBeInTheDocument();
  });

  it('displays empty message when no positions exist', () => {
    render(
      <Provider store={store}>
        <Overview {...defaultProps} positions={{}} />
      </Provider>
    );

    expect(screen.getByText('No active exposure. The quantitative engine is awaiting market signals.')).toBeInTheDocument();
    // Position count should be 0
    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
  });
});
