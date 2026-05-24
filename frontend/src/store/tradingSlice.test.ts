import tradingReducer, { clearErrorMsg, setErrorMsg, TradingState } from './tradingSlice';

const initialState: TradingState = {
  cashBalance: 100000.0,
  realizedPnl: 0.0,
  positions: {},
  strategies: [],
  candles: [],
  backtest: null,
  signals: [],
  orders: [],
  brokerStatus: null,
  isHealthOk: true,
  loading: false,
  errorMsg: null,
};

describe('tradingSlice', () => {
  it('should return initial state', () => {
    expect(tradingReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setErrorMsg sets error message', () => {
    const state = tradingReducer(initialState, setErrorMsg('Something went wrong'));
    expect(state.errorMsg).toBe('Something went wrong');
  });

  it('clearErrorMsg clears error message', () => {
    const stateWithError: TradingState = { ...initialState, errorMsg: 'Some error' };
    const state = tradingReducer(stateWithError, clearErrorMsg());
    expect(state.errorMsg).toBeNull();
  });

  it('fetchPortfolioThunk.fulfilled updates portfolio data', () => {
    const fakeAction = {
      type: 'trading/fetchPortfolio/fulfilled',
      payload: { positions: { BTCUSDT: { quantity: 1, average_price: 40000, stop_loss: 38000, take_profit: 45000 } }, cash_balance: 95000, realized_pnl: 500 },
    };
    const state = tradingReducer(initialState, fakeAction);
    expect(state.cashBalance).toBe(95000);
    expect(state.realizedPnl).toBe(500);
    expect(state.positions).toHaveProperty('BTCUSDT');
  });

  it('runBacktestThunk.pending sets loading to true', () => {
    const pendingAction = { type: 'trading/runBacktest/pending', payload: undefined };
    const state = tradingReducer(initialState, pendingAction);
    expect(state.loading).toBe(true);
    expect(state.errorMsg).toBeNull();
  });

  it('runBacktestThunk.fulfilled sets backtest results', () => {
    const fulfilledAction = {
      type: 'trading/runBacktest/fulfilled',
      payload: { total_trades: 10, winning_trades: 6, losing_trades: 4, win_rate: 0.6, starting_balance: 100000, final_balance: 115000, total_pnl: 15000, pnl_percentage: 15 },
    };
    const state = tradingReducer({ ...initialState, loading: true }, fulfilledAction);
    expect(state.loading).toBe(false);
    expect(state.backtest).not.toBeNull();
    expect(state.backtest?.total_pnl).toBe(15000);
  });
});
