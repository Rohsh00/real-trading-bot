import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Alert, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

import { toggleThemeMode, setActiveTab, setTenant } from './store/appSlice';
import { clearErrorMsg, fetchPortfolioThunk, runBacktestThunk } from './store/tradingSlice';
import { TabEnum } from './types/enums';
import { getHeaderTitle, getHeaderSubtitle } from './utils/helpers';
import { useTradingData } from './hooks/useTradingData';

function AppContent() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // App Settings from Redux
  const themeMode = useAppSelector((state) => state.app.themeMode);
  const activeTab = useAppSelector((state) => state.app.activeTab);
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

  // Initialize data fetching and auto-refresh intervals
  useTradingData(activeTab);

  // Dynamic theme builder based on mode
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const renderActiveTabComponent = () => {
    switch (activeTab) {
      case TabEnum.OVERVIEW:
        return (
          <Overview 
            cashBalance={cashBalance}
            realizedPnl={realizedPnl}
            positions={positions}
            strategiesCount={strategies.length}
            tenant={tenant}
          />
        );
      case TabEnum.POSITIONS:
        return (
          <Positions 
            positions={positions} 
            onRefresh={() => dispatch(fetchPortfolioThunk())} 
          />
        );
      case TabEnum.STRATEGIES:
        return <StrategyHub strategies={strategies} />;
      case TabEnum.CANDLES:
        return <Candles />;
      case TabEnum.BACKTEST:
        return (
          <Backtesting 
            loading={loading} 
            backtest={backtest} 
            onExecute={() => dispatch(runBacktestThunk())} 
          />
        );
      case TabEnum.BILLING:
        return <Billing tenant={tenant} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => dispatch(setActiveTab(tab))} 
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
            title={t(getHeaderTitle(activeTab))}
            subtitle={t(getHeaderSubtitle(activeTab))}
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
            {renderActiveTabComponent()}
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
