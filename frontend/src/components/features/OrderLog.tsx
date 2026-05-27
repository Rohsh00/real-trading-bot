import { Box, Card, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAppSelector } from "../../store";

export default function OrderLog() {
  const orders = useAppSelector((s) => s.trading.orders);

  return (
    <Card sx={{ p: 4, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ReceiptLongIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
          Execution & Order Log
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
          No recent orders found.
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 10).map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'text.secondary' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{order.symbol}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: order.side === 'BUY' ? 'success.main' : 'error.main' 
                      }}
                    >
                      {order.side}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.order_type}</TableCell>
                  <TableCell align="right">{order.quantity}</TableCell>
                  <TableCell align="right">${order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      color={order.status === 'FILLED' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontSize: '0.68rem', height: 20 }}
                    />
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
