import { describe, it, expect } from 'vitest';
import { getHeaderTitle, getHeaderSubtitle } from './helpers';
import { TabEnum } from '../types/enums';

describe('Header Helpers', () => {
  it('should return correct title for OVERVIEW tab', () => {
    expect(getHeaderTitle(TabEnum.OVERVIEW)).toBe('header.title.overview');
  });

  it('should return correct subtitle for OVERVIEW tab', () => {
    expect(getHeaderSubtitle(TabEnum.OVERVIEW)).toBe('header.subtitle.overview');
  });

  it('should return correct title for CANDLES tab', () => {
    expect(getHeaderTitle(TabEnum.CANDLES)).toBe('header.title.candles');
  });

  it('should return correct title as default for unknown tab', () => {
    expect(getHeaderTitle('unknown' as TabEnum)).toBe('header.title.default');
  });
});
