import appReducer, {
  toggleThemeMode,
  setThemeMode,
  setActiveTab,
  setTenant,
  AppState,
} from './appSlice';

const initialState: AppState = {
  themeMode: 'dark',
  activeTab: 'overview',
  tenant: 'trader-standard',
};

describe('appSlice', () => {
  it('should return initial state', () => {
    expect(appReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('toggleThemeMode: dark -> light', () => {
    const state = appReducer(initialState, toggleThemeMode());
    expect(state.themeMode).toBe('light');
  });

  it('toggleThemeMode: light -> dark', () => {
    const lightState: AppState = { ...initialState, themeMode: 'light' };
    const state = appReducer(lightState, toggleThemeMode());
    expect(state.themeMode).toBe('dark');
  });

  it('setThemeMode sets to light', () => {
    const state = appReducer(initialState, setThemeMode('light'));
    expect(state.themeMode).toBe('light');
  });

  it('setActiveTab changes active tab', () => {
    const state = appReducer(initialState, setActiveTab('positions'));
    expect(state.activeTab).toBe('positions');
  });

  it('setTenant changes tenant string', () => {
    const state = appReducer(initialState, setTenant('trader-pro'));
    expect(state.tenant).toBe('trader-pro');
  });
});
