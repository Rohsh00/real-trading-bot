import { TabEnum } from '../types/enums';

export const getHeaderTitle = (tab: TabEnum): string => {
  switch (tab) {
    case TabEnum.OVERVIEW:
      return 'header.title.overview';
    case TabEnum.POSITIONS:
      return 'header.title.positions';
    case TabEnum.STRATEGIES:
      return 'header.title.strategies';
    case TabEnum.CANDLES:
      return 'header.title.candles';
    case TabEnum.BACKTEST:
      return 'header.title.backtest';
    case TabEnum.BILLING:
      return 'header.title.billing';
    default:
      return 'header.title.default';
  }
};

export const getHeaderSubtitle = (tab: TabEnum): string => {
  switch (tab) {
    case TabEnum.OVERVIEW:
      return 'header.subtitle.overview';
    case TabEnum.POSITIONS:
      return 'header.subtitle.positions';
    case TabEnum.STRATEGIES:
      return 'header.subtitle.strategies';
    case TabEnum.CANDLES:
      return 'header.subtitle.candles';
    case TabEnum.BACKTEST:
      return 'header.subtitle.backtest';
    case TabEnum.BILLING:
      return 'header.subtitle.billing';
    default:
      return 'header.subtitle.default';
  }
};

