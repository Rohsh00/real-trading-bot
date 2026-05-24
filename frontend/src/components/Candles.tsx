import { 
  Card, 
  Typography, 
  Box, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface Candle {
  symbol: string;
  timeframe: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlesProps {
  candles: Candle[];
}

export default function Candles({ candles }: CandlesProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ShowChartIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
          Websocket Real-Time Candlestick Feed (1m Timeframe)
        </Typography>
      </Box>

      {candles.length === 0 ? (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ py: 8 }}
        >
          No active timeframe candles found in database. Ensure the candle persistence runner task is running.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Custom CSS Candlestick Chart */}
          <Box className="candle-chart-container">
            {candles.map((candle, idx) => {
              const isUp = candle.close >= candle.open;
              const highLowDiff = candle.high - candle.low;
              
              // Simple height percentages calculations
              const bodyHeightPct = Math.max(10, Math.min(90, (Math.abs(candle.close - candle.open) / (highLowDiff || 1)) * 100));
              
              return (
                <Box 
                  key={idx} 
                  className="candle-bar" 
                  title={`O: ${candle.open} H: ${candle.high} L: ${candle.low} C: ${candle.close}`}
                >
                  <Box className="candle-wick"></Box>
                  <Box 
                    className={`candle-body ${isUp ? 'up' : 'down'}`}
                    sx={{ height: `${bodyHeightPct}%` }}
                  ></Box>
                </Box>
              );
            })}
          </Box>

          {/* Table representation */}
          <Box sx={{ overflowX: 'auto', mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Open</TableCell>
                  <TableCell>High</TableCell>
                  <TableCell>Low</TableCell>
                  <TableCell>Close</TableCell>
                  <TableCell>Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candles.slice(0, 5).map((candle, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{new Date(candle.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>${candle.open.toLocaleString()}</TableCell>
                    <TableCell>${candle.high.toLocaleString()}</TableCell>
                    <TableCell>${candle.low.toLocaleString()}</TableCell>
                    <TableCell 
                      sx={{ 
                        color: candle.close >= candle.open ? 'success.main' : 'error.main', 
                        fontWeight: 600 
                      }}
                    >
                      ${candle.close.toLocaleString()}
                    </TableCell>
                    <TableCell>{candle.volume.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </Card>
  );
}
