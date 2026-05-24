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

interface SidebarProps {
  activeTab: 'overview' | 'positions' | 'strategies' | 'candles' | 'backtest' | 'billing';
  setActiveTab: (tab: 'overview' | 'positions' | 'strategies' | 'candles' | 'backtest' | 'billing') => void;
  tenant: string;
  setTenant: (tenant: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab, tenant, setTenant }: SidebarProps) {
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
          Antigravity SaaS
        </Typography>
      </Box>

      {/* Navigation List */}
      <List component="nav" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <ListItemButton
          selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'overview' ? 'primary.main' : 'text.secondary' }}>
            <ActivityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'positions'}
          onClick={() => setActiveTab('positions')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'positions' ? 'primary.main' : 'text.secondary' }}>
            <LayersIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Open Positions" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'strategies'}
          onClick={() => setActiveTab('strategies')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'strategies' ? 'primary.main' : 'text.secondary' }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Strategy Hub" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'candles'}
          onClick={() => setActiveTab('candles')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'candles' ? 'primary.main' : 'text.secondary' }}>
            <LineChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Live Charts" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'backtest'}
          onClick={() => setActiveTab('backtest')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'backtest' ? 'primary.main' : 'text.secondary' }}>
            <PlayIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Backtesting" />
        </ListItemButton>

        <ListItemButton
          selected={activeTab === 'billing'}
          onClick={() => setActiveTab('billing')}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: activeTab === 'billing' ? 'primary.main' : 'text.secondary' }}>
            <CreditCardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="SaaS Billing" />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />

      {/* User Selector (SaaS Tenants) */}
      <Box sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <UsersIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }} color="text.secondary">
            TENANT ACCOUNT
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
            <MenuItem value="trader-standard">Standard Tier (User #104)</MenuItem>
            <MenuItem value="trader-pro">Pro Tier (User #022)</MenuItem>
            <MenuItem value="trader-institution">Institutional (User #001)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
