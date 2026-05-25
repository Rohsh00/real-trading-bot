import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { TabEnum } from '../types/enums';
import {
  fetchPortfolioThunk,
  fetchStrategiesThunk,
  fetchHealthThunk,
  fetchCandlesThunk,
  fetchSignalsThunk,
  fetchOrdersThunk,
  fetchBrokerStatusThunk,
} from '../store/tradingSlice';

export const useTradingData = (activeTab: TabEnum) => {
  const dispatch = useAppDispatch();

  // Sync active tab data on change
  useEffect(() => {
    dispatch(fetchHealthThunk());
    if (activeTab === TabEnum.OVERVIEW) {
      dispatch(fetchPortfolioThunk());
      dispatch(fetchStrategiesThunk());
    } else if (activeTab === TabEnum.POSITIONS) {
      dispatch(fetchPortfolioThunk());
    } else if (activeTab === TabEnum.STRATEGIES) {
      dispatch(fetchStrategiesThunk());
    } else if (activeTab === TabEnum.CANDLES) {
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
      if (activeTab === TabEnum.OVERVIEW) {
        dispatch(fetchPortfolioThunk());
      } else if (activeTab === TabEnum.POSITIONS) {
        dispatch(fetchPortfolioThunk());
      } else if (activeTab === TabEnum.CANDLES) {
        dispatch(fetchCandlesThunk({}));
      }
      dispatch(fetchSignalsThunk());
      dispatch(fetchOrdersThunk());
      dispatch(fetchBrokerStatusThunk());
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, dispatch]);
};
