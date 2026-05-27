import { render, screen } from '@testing-library/react';
import Billing from '../../components/features/Billing';

describe('Billing Component', () => {
  it('renders all subscription tier headers', () => {
    render(<Billing tenant="trader-standard" />);

    expect(screen.getByText('Standard Tier')).toBeInTheDocument();
    expect(screen.getByText('Pro Tier')).toBeInTheDocument();
    expect(screen.getByText('Institutional')).toBeInTheDocument();
  });

  it('highlights standard tier when tenant is trader-standard', () => {
    render(<Billing tenant="trader-standard" />);

    // Standard card should show ACTIVE and Current Plan
    const activeIndicators = screen.getAllByText('ACTIVE');
    expect(activeIndicators.length).toBe(1);
    expect(activeIndicators[0]).toBeInTheDocument();

    const currentPlanButtons = screen.getAllByText('Current Plan');
    expect(currentPlanButtons.length).toBe(1);
    expect(currentPlanButtons[0]).toBeInTheDocument();
  });

  it('highlights pro tier when tenant is trader-pro', () => {
    render(<Billing tenant="trader-pro" />);

    // Pro card should show ACTIVE and Current Plan
    const activeIndicators = screen.getAllByText('ACTIVE');
    expect(activeIndicators.length).toBe(1);
    expect(activeIndicators[0]).toBeInTheDocument();

    const currentPlanButtons = screen.getAllByText('Current Plan');
    expect(currentPlanButtons.length).toBe(1);
    expect(currentPlanButtons[0]).toBeInTheDocument();
  });
});
