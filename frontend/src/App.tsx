import { useState, useEffect, FormEvent, useMemo } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Alert, Container } from '@mui/material';

import { store, useAppDispatch, useAppSelector } from './store';
import { getTheme } from './theme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Positions from './components/Positions';
import StrategyHub from './components/StrategyHub';
import Candles from './components/Candles';
import Backtesting from './components/Backtesting';
import Billing from './components/Billing';

import { toggleThemeMode, setActiveTab, setTenant, TabType } from './store/appSlice';
import {
  fetchPortfolioThunk,
  fetchStrategiesThunk,
  fetchHealthThunk,
  fetchCandlesThunk,
  runBacktestThunk,
  deployStrategyThunk,
  fetchSignalsThunk,
  fetchOrdersThunk,
  fetchBrokerStatusThunk,
  clearErrorMsg
} from './store/tradingSlice';

function AppContent() {
  const dispatch = useAppDispatch();

  // App Settings from Redux
  const themeMode = useAppSelector((state) => state.app.themeMode);
  const activeTab = useAppSelector((state) => state.app.activeTab) as TabType;
  const tenant = useAppSelector((state) => state.app.tenant);

  // Trading States from Redux
  const {
    cashBalance,
    realizedPnl,
    positions,
    strategies,
    backtest,
    brokerStatus,
    isHealthOk,
    loading,
    errorMsg,
  } = useAppSelector((state) => state.trading);

  // Form State
  const [stratName, setStratName] = useState('');
  const [stratDesc, setStratDesc] = useState('');
  const [stratConfig, setStratConfig] = useState('{\n  "ema_short": 12,\n  "ema_long": 26\n}');

  // Sync active tab data on change
  useEffect(() => {
    dispatch(fetchHealthThunk());
    if (activeTab === 'overview') {
      dispatch(fetchPortfolioThunk());
      dispatch(fetchStrategiesThunk());
    } else if (activeTab === 'positions') {
      dispatch(fetchPortfolioThunk());
    } else if (activeTab === 'strategies') {
      dispatch(fetchStrategiesThunk());
    } else if (activeTab === 'candles') {
      dispatch(fetchCandlesThunk({}));
    }
    dispatch(fetchSignalsThunk());
    dispatch(fetchOrdersThunk());
    dispatch(fetchBrokerStatusThunk());
  }, [activeTab, dispatch]);

  // Auto refresh active data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchHealthThunk());
      if (activeTab === 'overview') {
        dispatch(fetchPortfolioThunk());
      } else if (activeTab === 'positions') {
        dispatch(fetchPortfolioThunk());
      } else if (activeTab === 'candles') {
        dispatch(fetchCandlesThunk({}));
      }
      dispatch(fetchSignalsThunk());
      dispatch(fetchOrdersThunk());
      dispatch(fetchBrokerStatusThunk());
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, dispatch]);

  // Dynamic theme builder based on mode
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  // Create Strategy
  const handleCreateStrategy = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedConfig = JSON.parse(stratConfig);
      await dispatch(
        deployStrategyThunk({
          name: stratName,
          description: stratDesc,
          config: parsedConfig,
        })
      ).unwrap();

      setStratName('');
      setStratDesc('');
    } catch {
      // Errors are set to Redux errorMsg automatically by the extraReducer
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => dispatch(setActiveTab(tab as TabType))} 
          tenant={tenant} 
          setTenant={(t) => dispatch(setTenant(t))} 
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
            brokerStatus={brokerStatus}
            themeMode={themeMode}
            onToggleTheme={() => dispatch(toggleThemeMode())}
          />

          {/* Error alerts banner */}
          {errorMsg && (
            <Alert severity="error" onClose={() => dispatch(clearErrorMsg())} sx={{ borderRadius: 2 }}>
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
                onRefresh={() => dispatch(fetchPortfolioThunk())} 
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
              <Candles />
            )}

            {activeTab === 'backtest' && (
              <Backtesting 
                loading={loading} 
                backtest={backtest} 
                onExecute={() => dispatch(runBacktestThunk())} 
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

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
