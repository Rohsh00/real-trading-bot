import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TabEnum } from '../types/enums';

export interface AppState {
  themeMode: 'light' | 'dark';
  activeTab: TabEnum;
  tenant: string;
}

const initialState: AppState = {
  themeMode: 'dark',
  activeTab: TabEnum.OVERVIEW,
  tenant: 'trader-standard',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
    },
    setActiveTab(state, action: PayloadAction<TabEnum>) {
      state.activeTab = action.payload;
    },
    setTenant(state, action: PayloadAction<string>) {
      state.tenant = action.payload;
    },
  },
});

export const { toggleThemeMode, setThemeMode, setActiveTab, setTenant } = appSlice.actions;
export default appSlice.reducer;
