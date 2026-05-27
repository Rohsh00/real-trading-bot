import { 
  Box, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Select, 
  MenuItem, 
  FormControl 
} from '@mui/material';
import ActivityIcon from '@mui/icons-material/ElectricBolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import LineChartIcon from '@mui/icons-material/ShowChart';
import LayersIcon from '@mui/icons-material/Layers';
import PlayIcon from '@mui/icons-material/PlayArrow';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UsersIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import { useTranslation } from 'react-i18next';
import { TabEnum } from "../../types/enums";

import React from 'react';

interface SidebarProps {
  activeTab: TabEnum;
  setActiveTab: (tab: TabEnum) => void;
  tenant: string;
  setTenant: (tenant: string) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ activeTab, setActiveTab, tenant, setTenant }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        // ✅ Theme-aware: uses MUI divider color token instead of hardcoded dark rgba
        borderRight: '1px solid',
        borderColor: 'divider',
        // ✅ Theme-aware: uses MUI paper background so it switches with light/dark
        backgroundColor: 'background.paper',
        padding: '24px',
      }}
    >
      {/* Brand Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)',
            width: 38,
            height: 38,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
          }}
        >
          <TrendingUpIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            letterSpacing: '-0.5px',
            // ✅ Theme-aware: primary text color instead of hardcoded dark gradient
            color: 'text.primary',
          }}
        >
          {t('brand.name')}
        </Typography>
      </Box>

      {/* Navigation List */}
      <List component="nav" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ListItemButton
          selected={activeTab === TabEnum.OVERVIEW}
          onClick={() => setActiveTab(TabEnum.OVERVIEW)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.OVERVIEW ? 'primary.main' : 'text.secondary' }}>
            <ActivityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.overview')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.POSITIONS}
          onClick={() => setActiveTab(TabEnum.POSITIONS)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.POSITIONS ? 'primary.main' : 'text.secondary' }}>
            <LayersIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.positions')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.STRATEGIES}
          onClick={() => setActiveTab(TabEnum.STRATEGIES)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.STRATEGIES ? 'primary.main' : 'text.secondary' }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.strategies')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.CANDLES}
          onClick={() => setActiveTab(TabEnum.CANDLES)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.CANDLES ? 'primary.main' : 'text.secondary' }}>
            <LineChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.candles')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.BACKTEST}
          onClick={() => setActiveTab(TabEnum.BACKTEST)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.BACKTEST ? 'primary.main' : 'text.secondary' }}>
            <PlayIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.backtest')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.BILLING}
          onClick={() => setActiveTab(TabEnum.BILLING)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.BILLING ? 'primary.main' : 'text.secondary' }}>
            <CreditCardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.billing')} />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === TabEnum.RISK}
          onClick={() => setActiveTab(TabEnum.RISK)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === TabEnum.RISK ? 'primary.main' : 'text.secondary' }}>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('sidebar.tabs.risk', 'Risk Controls')} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />

      {/* User Selector (SaaS Tenants) */}
      <Box sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <UsersIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }} color="text.secondary">
            {t('sidebar.tenant')}
          </Typography>
        </Box>
        <FormControl fullWidth size="small">
          <Select
            value={tenant}
            onChange={(e) => setTenant(e.target.value as string)}
            sx={{
              // ✅ Theme-aware: uses theme action hover alpha instead of hardcoded dark rgba
              backgroundColor: 'action.hover',
              fontSize: '13px',
              borderRadius: 2,
            }}
          >
            <MenuItem value="trader-standard">{t('sidebar.tiers.standard')}</MenuItem>
            <MenuItem value="trader-pro">{t('sidebar.tiers.pro')}</MenuItem>
            <MenuItem value="trader-institution">{t('sidebar.tiers.institutional')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
});

export default Sidebar;
