import React, { useMemo, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Alert, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../store';
import { getTheme } from '../theme';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import Positions from './Positions';
import StrategyHub from './StrategyHub';
import Candles from './Candles';
import Backtesting from './Backtesting';
import Billing from './Billing';

import { toggleThemeMode, setActiveTab, setTenant } from '../store/appSlice';
import { clearErrorMsg, fetchPortfolioThunk, runBacktestThunk } from '../store/tradingSlice';
import { TabEnum } from '../types/enums';
import { getHeaderTitle, getHeaderSubtitle } from '../utils/helpers';
import { useTradingData } from '../hooks/useTradingData';

const AppLayout: React.FC = React.memo(() => {
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

  // Memoized action handlers to prevent unnecessary re-renders of children
  const handleSetActiveTab = useCallback((tab: TabEnum) => {
    dispatch(setActiveTab(tab));
  }, [dispatch]);

  const handleSetTenant = useCallback((selectedTenant: string) => {
    dispatch(setTenant(selectedTenant));
  }, [dispatch]);

  const handleRefreshPositions = useCallback(() => {
    dispatch(fetchPortfolioThunk());
  }, [dispatch]);

  const handleExecuteBacktest = useCallback(() => {
    dispatch(runBacktestThunk());
  }, [dispatch]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleThemeMode());
  }, [dispatch]);

  const handleClearErrorMsg = useCallback(() => {
    dispatch(clearErrorMsg());
  }, [dispatch]);

  const activeTabComponent = useMemo(() => {
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
            onRefresh={handleRefreshPositions} 
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
            onExecute={handleExecuteBacktest} 
          />
        );
      case TabEnum.BILLING:
        return <Billing tenant={tenant} />;
      default:
        return null;
    }
  }, [
    activeTab, 
    cashBalance, 
    realizedPnl, 
    positions, 
    strategies, 
    tenant, 
    loading, 
    backtest, 
    handleRefreshPositions, 
    handleExecuteBacktest
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleSetActiveTab} 
          tenant={tenant} 
          setTenant={handleSetTenant} 
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
            onToggleTheme={handleToggleTheme}
          />

          {/* Error alerts banner */}
          {errorMsg && (
            <Alert severity="error" onClose={handleClearErrorMsg} sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Main Dashboard Pages */}
          <Container maxWidth="xl" disableGutters sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
            {activeTabComponent}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
});

export default AppLayout;
