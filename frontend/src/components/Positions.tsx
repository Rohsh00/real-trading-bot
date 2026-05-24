import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LayersIcon from '@mui/icons-material/Layers';
import OrderLog from './OrderLog';

interface Position {
  quantity: number;
  average_price: number;
  stop_loss: number;
  take_profit: number;
}

interface PositionsProps {
  positions: Record<string, Position>;
  onRefresh: () => void;
}

export default function Positions({ positions, onRefresh }: PositionsProps) {
  const activePositions = Object.entries(positions);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Card sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LayersIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            Live Portfolio Exposure
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="secondary" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Box>

      {activePositions.length === 0 ? (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ py: 6 }}
        >
          No active exposure. The quantitative engine is awaiting market signals.
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
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
              {activePositions.map(([symbol, pos]) => (
                <TableRow key={symbol} hover>
                  <TableCell sx={{ fontWeight: 600, fontSize: '15px' }}>{symbol}</TableCell>
                  <TableCell>{pos.quantity}</TableCell>
                  <TableCell>${pos.average_price.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>${pos.stop_loss.toLocaleString()}</TableCell>
                  <TableCell sx={{ color: 'success.main', fontWeight: 500 }}>${pos.take_profit.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
    <OrderLog />
    </Box>
  );
}
