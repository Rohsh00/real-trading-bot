import { Box, Typography, Chip, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface HeaderProps {
  title: string;
  subtitle: string;
  isHealthOk: boolean;
}

export default function Header({ title, subtitle, isHealthOk }: HeaderProps) {
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
  );
}
