import { Box, Card, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAppSelector } from "../../store";

export default function SignalsFeed() {
  const signals = useAppSelector((s) => s.trading.signals);

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <TimelineIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
          Real-Time Trading Signals
        </Typography>
      </Box>

      {signals.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
          No recent signals generated. Waiting for strategy engine...
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Signal</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signals.slice(0, 10).map((sig, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'text.secondary' }}>
                    {new Date(sig.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{sig.strategy}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{sig.symbol}</TableCell>
                  <TableCell>
                    <Chip
                      label={sig.signal}
                      size="small"
                      color={sig.signal === 'BUY' ? 'success' : 'error'}
                      variant="filled"
                      sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    ${sig.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
