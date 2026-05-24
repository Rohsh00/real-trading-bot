import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export interface Position {
  quantity: number;
  average_price: number;
  stop_loss: number;
  take_profit: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

export interface Candle {
  symbol: string;
  timeframe: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestResults {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  starting_balance: number;
  final_balance: number;
  total_pnl: number;
  pnl_percentage: number;
}

export interface TradingState {
  cashBalance: number;
  realizedPnl: number;
  positions: Record<string, Position>;
  strategies: Strategy[];
  candles: Candle[];
  backtest: BacktestResults | null;
  isHealthOk: boolean;
  loading: boolean;
  errorMsg: string | null;
}

const initialState: TradingState = {
  cashBalance: 100000.0,
  realizedPnl: 0.0,
  positions: {},
  strategies: [],
  candles: [],
  backtest: null,
  isHealthOk: true,
  loading: false,
  errorMsg: null,
};

// Async Thunks
export const fetchPortfolioThunk = createAsyncThunk(
  'trading/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown portfolio connection error';
      return rejectWithValue(message);
    }
  }
);

export const fetchStrategiesThunk = createAsyncThunk(
  'trading/fetchStrategies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/strategies`);
      if (!res.ok) throw new Error('Failed to fetch strategies');
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown strategies connection error';
      return rejectWithValue(message);
    }
  }
);

export const fetchHealthThunk = createAsyncThunk(
  'trading/fetchHealth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return rejectWithValue(false);
    }
  }
);

export const fetchCandlesThunk = createAsyncThunk(
  'trading/fetchCandles',
  async (
    params: { symbol?: string; timeframe?: string } = {},
    { rejectWithValue }
  ) => {
    const symbol = params.symbol ?? 'BTCUSDT';
    const timeframe = params.timeframe ?? '1m';
    try {
      const res = await fetch(
        `${API_BASE}/candles?symbol=${symbol}&timeframe=${timeframe}&limit=50`
      );
      if (!res.ok) throw new Error('Failed to fetch candles');
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown candles connection error';
      return rejectWithValue(message);
    }
  }
);

export const runBacktestThunk = createAsyncThunk(
  'trading/runBacktest',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/backtest`);
      if (!res.ok) throw new Error('Failed to execute backtest. Ensure sample CSV is present.');
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Backtest server connection failed';
      return rejectWithValue(message);
    }
  }
);

interface DeployStrategyPayload {
  name: string;
  description: string;
  config: Record<string, unknown>;
}

export const deployStrategyThunk = createAsyncThunk(
  'trading/deployStrategy',
  async (payload: DeployStrategyPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/strategies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create strategy');
      }
      dispatch(fetchStrategiesThunk());
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Strategy deployment failed';
      return rejectWithValue(message);
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    clearErrorMsg(state) {
      state.errorMsg = null;
    },
    setErrorMsg(state, action: PayloadAction<string | null>) {
      state.errorMsg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Portfolio
      .addCase(fetchPortfolioThunk.fulfilled, (state, action) => {
        state.positions = action.payload.positions || {};
        state.cashBalance = action.payload.cash_balance ?? 100000.0;
        state.realizedPnl = action.payload.realized_pnl ?? 0.0;
      })
      // Strategies
      .addCase(fetchStrategiesThunk.fulfilled, (state, action) => {
        state.strategies = action.payload;
      })
      // Health
      .addCase(fetchHealthThunk.fulfilled, (state, action) => {
        state.isHealthOk = action.payload;
      })
      .addCase(fetchHealthThunk.rejected, (state) => {
        state.isHealthOk = false;
      })
      // Candles
      .addCase(fetchCandlesThunk.fulfilled, (state, action) => {
        state.candles = action.payload;
      })
      // Backtest
      .addCase(runBacktestThunk.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(runBacktestThunk.fulfilled, (state, action) => {
        state.backtest = action.payload;
        state.loading = false;
      })
      .addCase(runBacktestThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload as string;
      })
      // Deploy Strategy
      .addCase(deployStrategyThunk.pending, (state) => {
        state.errorMsg = null;
      })
      .addCase(deployStrategyThunk.rejected, (state, action) => {
        state.errorMsg = action.payload as string;
      });
  },
});

export const { clearErrorMsg, setErrorMsg } = tradingSlice.actions;
export default tradingSlice.reducer;
