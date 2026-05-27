import { 
  Grid, 
  Card, 
  Typography, 
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface BillingProps {
  tenant: string;
}

export default function Billing({ tenant }: BillingProps) {
  return (
    <Grid container spacing={3}>
      {/* Plan 1: Standard */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card 
          sx={{ 
            p: 4, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            borderColor: tenant === 'trader-standard' ? 'primary.main' : 'rgba(255,255,255,0.08)',
            boxShadow: tenant === 'trader-standard' ? '0 4px 30px rgba(99, 102, 241, 0.15)' : 'none',
          }}
        >
          {tenant === 'trader-standard' && (
            <Box 
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'primary.main',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              ACTIVE
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
            Standard Tier
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', my: 2 }}>
            $49<span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>/mo</span>
          </Typography>

          <List sx={{ mb: 4, flexGrow: 1 }}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Deployed 5 max strategies" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Basic Risk Manager" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="DB-Backed Positions" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Web API Access" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
          </List>

          <Button 
            variant={tenant === 'trader-standard' ? 'contained' : 'outlined'} 
            color="primary"
            fullWidth
            disabled={tenant === 'trader-standard'}
          >
            {tenant === 'trader-standard' ? 'Current Plan' : 'Select Plan'}
          </Button>
        </Card>
      </Grid>

      {/* Plan 2: Pro */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card 
          sx={{ 
            p: 4, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            borderColor: tenant === 'trader-pro' ? 'primary.main' : 'rgba(255,255,255,0.08)',
            boxShadow: tenant === 'trader-pro' ? '0 4px 30px rgba(99, 102, 241, 0.15)' : 'none',
          }}
        >
          {tenant === 'trader-pro' && (
            <Box 
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'primary.main',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              ACTIVE
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
            Pro Tier
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', my: 2 }}>
            $149<span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>/mo</span>
          </Typography>

          <List sx={{ mb: 4, flexGrow: 1 }}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Unlimited strategies" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="DB-Backed Positions" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Advanced Risk Manager" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="1-min Candle Charts" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Email / Discord Alerts" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
          </List>

          <Button 
            variant={tenant === 'trader-pro' ? 'contained' : 'outlined'} 
            color="primary"
            fullWidth
            disabled={tenant === 'trader-pro'}
          >
            {tenant === 'trader-pro' ? 'Current Plan' : 'Select Plan'}
          </Button>
        </Card>
      </Grid>

      {/* Plan 3: Institutional */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Card 
          sx={{ 
            p: 4, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            borderColor: tenant === 'trader-institution' ? 'primary.main' : 'rgba(255,255,255,0.08)',
            boxShadow: tenant === 'trader-institution' ? '0 4px 30px rgba(99, 102, 241, 0.15)' : 'none',
          }}
        >
          {tenant === 'trader-institution' && (
            <Box 
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'primary.main',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              ACTIVE
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
            Institutional
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', my: 2 }}>
            $999<span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>/mo</span>
          </Typography>

          <List sx={{ mb: 4, flexGrow: 1 }}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Multi-Broker routing" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Premium Risk Manager" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Dedicated DB server" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="Full Audit Trail logs" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28, color: 'success.main' }}><CheckIcon sx={{ fontSize: 16 }} /></ListItemIcon>
              <ListItemText primary="24/7 SLA Support" slotProps={{ primary: { variant: 'body2' } }} />
            </ListItem>
          </List>

          <Button 
            variant={tenant === 'trader-institution' ? 'contained' : 'outlined'} 
            color="primary"
            fullWidth
            disabled={tenant === 'trader-institution'}
          >
            {tenant === 'trader-institution' ? 'Current Plan' : 'Select Plan'}
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
}
