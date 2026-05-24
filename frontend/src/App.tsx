import { useState, useEffect, FormEvent } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Alert, Container } from '@mui/material';

import { theme } from './theme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Positions from './components/Positions';
import StrategyHub from './components/StrategyHub';
import Candles from './components/Candles';
import Backtesting from './components/Backtesting';
import Billing from './components/Billing';

// API Base URL
const API_BASE = 'http://localhost:8000/api/v1';

// Interfaces
interface Position {
  quantity: number;
  average_price: number;
  stop_loss: number;
  take_profit: number;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

interface Candle {
  symbol: string;
  timeframe: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BacktestResults {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  starting_balance: number;
  final_balance: number;
  total_pnl: number;
  pnl_percentage: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'strategies' | 'candles' | 'backtest' | 'billing'>('overview');
  const [tenant, setTenant] = useState<string>('trader-standard');
  const [cashBalance, setCashBalance] = useState<number>(100000.0);
  const [realizedPnl, setRealizedPnl] = useState<number>(0.0);
  
  // Data States
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [backtest, setBacktest] = useState<BacktestResults | null>(null);
  
  // Status States
  const [isHealthOk, setIsHealthOk] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [stratName, setStratName] = useState('');
  const [stratDesc, setStratDesc] = useState('');
  const [stratConfig, setStratConfig] = useState('{\n  "ema_short": 12,\n  "ema_long": 26\n}');

  // Fetch Core Portfolio Details
  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (res.ok) {
        const data = await res.json();
        setPositions(data.positions || {});
        setCashBalance(data.cash_balance ?? 100000.0);
        setRealizedPnl(data.realized_pnl ?? 0.0);
      }
    } catch (err) {
      console.error("Error fetching portfolio: ", err);
    }
  };

  // Fetch Strategies
  const fetchStrategies = async () => {
    try {
      const res = await fetch(`${API_BASE}/strategies`);
      if (res.ok) {
        const data = await res.json();
        setStrategies(data);
      }
    } catch (err) {
      console.error("Error fetching strategies: ", err);
    }
  };

  // Fetch Health Status
  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      setIsHealthOk(res.ok);
    } catch (err) {
      setIsHealthOk(false);
    }
  };

  // Run Backtest
  const runBacktestEngine = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/backtest`);
      if (res.ok) {
        const data = await res.json();
        setBacktest(data);
      } else {
        setErrorMsg("Failed to run backtest. Ensure sample CSV data is present.");
      }
    } catch (err) {
      setErrorMsg("Connection to backtest server failed.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Candles
  const fetchCandles = async () => {
    try {
      const res = await fetch(`${API_BASE}/candles?symbol=BTCUSDT&timeframe=1m&limit=15`);
      if (res.ok) {
        const data = await res.json();
        setCandles(data);
      }
    } catch (err) {
      console.error("Error fetching candles: ", err);
    }
  };

  // Create Strategy
  const handleCreateStrategy = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const parsedConfig = JSON.parse(stratConfig);
      const res = await fetch(`${API_BASE}/strategies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: stratName,
          description: stratDesc,
          config: parsedConfig
        })
      });
      if (res.ok) {
        setStratName('');
        setStratDesc('');
        fetchStrategies();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to create strategy.");
      }
    } catch (err) {
      setErrorMsg("Invalid JSON config format or network error.");
    }
  };

  // On Load Sync
  useEffect(() => {
    fetchPortfolio();
    fetchStrategies();
    fetchHealth();
    fetchCandles();
    
    // Auto refresh every 5 seconds
    const interval = setInterval(() => {
      fetchPortfolio();
      fetchHealth();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tenant={tenant} 
          setTenant={setTenant} 
        />

        {/* Main Panel Content Container */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 4, 
            height: '100vh', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* Header section */}
          <Header 
            title={
              activeTab === 'overview' ? 'SaaS Dashboard' :
              activeTab === 'positions' ? 'Open Positions' :
              activeTab === 'strategies' ? 'Strategy Hub' :
              activeTab === 'candles' ? 'Live Candles' :
              activeTab === 'backtest' ? 'Backtesting Lab' :
              'Premium SaaS Plans'
            }
            subtitle={
              activeTab === 'overview' ? 'Real-time multi-user trading platform metrics.' :
              activeTab === 'positions' ? 'Inspect active, database-persisted trades.' :
              activeTab === 'strategies' ? 'Manage and deploy algorithmic trading strategies.' :
              activeTab === 'candles' ? 'View websocket stream timeframe candles.' :
              activeTab === 'backtest' ? 'Evaluate strategy historical performance.' :
              'Billing subscription portals and user levels.'
            }
            isHealthOk={isHealthOk}
          />

          {/* Error alerts banner */}
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Main Dashboard Pages */}
          <Container maxWidth="xl" disableGutters sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
            {activeTab === 'overview' && (
              <Overview 
                cashBalance={cashBalance}
                realizedPnl={realizedPnl}
                positions={positions}
                strategiesCount={strategies.length}
                tenant={tenant}
              />
            )}

            {activeTab === 'positions' && (
              <Positions 
                positions={positions} 
                onRefresh={fetchPortfolio} 
              />
            )}

            {activeTab === 'strategies' && (
              <StrategyHub 
                strategies={strategies}
                stratName={stratName}
                setStratName={setStratName}
                stratDesc={stratDesc}
                setStratDesc={setStratDesc}
                stratConfig={stratConfig}
                setStratConfig={setStratConfig}
                onSubmit={handleCreateStrategy}
              />
            )}

            {activeTab === 'candles' && (
              <Candles candles={candles} />
            )}

            {activeTab === 'backtest' && (
              <Backtesting 
                loading={loading} 
                backtest={backtest} 
                onExecute={runBacktestEngine} 
              />
            )}

            {activeTab === 'billing' && (
              <Billing tenant={tenant} />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
