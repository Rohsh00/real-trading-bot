import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Divider 
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';

interface Position {
  quantity: number;
  average_price: number;
  stop_loss: number;
  take_profit: number;
}

interface OverviewProps {
  cashBalance: number;
  realizedPnl: number;
  positions: Record<string, Position>;
  strategiesCount: number;
  tenant: string;
}

export default function Overview({ 
  cashBalance, 
  realizedPnl, 
  positions, 
  strategiesCount, 
  tenant 
}: OverviewProps) {
  const activePositionsCount = Object.keys(positions).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Overview Cards Grid */}
      <Grid container spacing={3}>
        {/* Card 1: Cash Balance */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                  CASH BALANCE
                </Typography>
                <CreditCardIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                +0.00% today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Realized PnL */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                  REALIZED PROFIT / LOSS
                </Typography>
                <TrendingUpIcon fontSize="small" />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  fontFamily: 'Outfit, sans-serif',
                  color: realizedPnl >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {realizedPnl >= 0 ? '+' : ''}${realizedPnl.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                Active Live Tracker
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Positions Count */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                  ACTIVE POSITIONS
                </Typography>
                <LayersIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                {activePositionsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                PostgreSQL Backed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Strategies Count */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                  ACTIVE STRATEGIES
                </Typography>
                <SettingsIcon fontSize="small" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                {strategiesCount}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                Deployable Strategy Hub
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid: Open Positions & SaaS Status */}
      <Grid container spacing={3}>
        {/* Open Positions Table Panel */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <LayersIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                Open Positions
              </Typography>
            </Box>
            
            {activePositionsCount === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                No active positions found in database. Run a signal to place a trade.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Average Price</TableCell>
                      <TableCell>Stop Loss</TableCell>
                      <TableCell>Take Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(positions).map(([symbol, pos]) => (
                      <TableRow key={symbol} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{symbol}</TableCell>
                        <TableCell>{pos.quantity}</TableCell>
                        <TableCell>${pos.average_price.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'error.main' }}>${pos.stop_loss.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'success.main' }}>${pos.take_profit.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </Grid>

        {/* SaaS Status list Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SettingsIcon color="success" />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                Active SaaS Status
              </Typography>
            </Box>
            
            <List disablePadding>
              <ListItem 
                disableGutters 
                secondaryAction={<Chip label="Online" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />}
              >
                <ListItemText primary="FastAPI Engine" slotProps={{ primary: { variant: 'body2', color: 'text.secondary' } }} />
              </ListItem>
              <Divider />
              <ListItem 
                disableGutters 
                secondaryAction={<Chip label="Connected" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />}
              >
                <ListItemText primary="PostgreSQL Database" slotProps={{ primary: { variant: 'body2', color: 'text.secondary' } }} />
              </ListItem>
              <Divider />
              <ListItem 
                disableGutters 
                secondaryAction={<Chip label="Operational" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />}
              >
                <ListItemText primary="Redis Event Pipeline" slotProps={{ primary: { variant: 'body2', color: 'text.secondary' } }} />
              </ListItem>
              <Divider />
              <ListItem 
                disableGutters 
                secondaryAction={
                  <Chip 
                    label={tenant.split('-')[1]} 
                    color="primary" 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }} 
                  />
                }
              >
                <ListItemText primary="SaaS User Plan" slotProps={{ primary: { variant: 'body2', color: 'text.secondary' } }} />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
