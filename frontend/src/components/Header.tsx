import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface HeaderProps {
  title: string;
  subtitle: string;
  isHealthOk: boolean;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  isHealthOk, 
  themeMode, 
  onToggleTheme 
}: HeaderProps) {
  return (
    <Box 
      sx={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ letterSpacing: '-0.5px', fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 0.5 }}
        >
          {subtitle}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton onClick={onToggleTheme} color="inherit" sx={{ border: '1px solid', borderColor: 'divider' }}>
            {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isHealthOk ? "FastAPI connection active" : "FastAPI connection offline"}>
          <Chip
            icon={isHealthOk ? <CheckCircleIcon /> : <WarningAmberIcon />}
            label={isHealthOk ? "Backend API Online" : "Backend Offline"}
            color={isHealthOk ? "success" : "error"}
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderRadius: '20px',
              backgroundColor: isHealthOk ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderColor: isHealthOk ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              '& .MuiChip-icon': {
                color: isHealthOk ? 'var(--success)' : 'var(--danger)',
              }
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}
