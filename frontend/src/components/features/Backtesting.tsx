import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  CircularProgress 
} from '@mui/material';
import PlayIcon from '@mui/icons-material/PlayArrow';

interface BacktestResults {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  starting_balance: number;
  final_balance: number;
  total_pnl: number;
  pnl_percentage: number;
}

interface BacktestingProps {
  loading: boolean;
  backtest: BacktestResults | null;
  onExecute: () => void;
}

export default function Backtesting({ loading, backtest, onExecute }: BacktestingProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PlayIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            EMA Crossover Backtesting Lab
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          disabled={loading} 
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayIcon />}
          onClick={onExecute}
        >
          {loading ? 'Running Backtest...' : 'Execute Backtest'}
        </Button>
      </Box>

      {backtest ? (
        <Grid container spacing={3}>
          {/* Win Rate */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  WIN RATE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                  {(backtest.win_rate * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {backtest.winning_trades} Win / {backtest.losing_trades} Loss
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Trades */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  TRADES EXECUTED
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                  {backtest.total_trades}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Standard EMA Crossover
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Net Profit */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card sx={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                  FINAL PORTFOLIO VALUE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'success.main' }}>
                  ${backtest.final_balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block', fontWeight: 500 }}>
                  Net Profit: +{backtest.pnl_percentage.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box 
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, color: 'text.secondary', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 2 }}
        >
          <Typography variant="body2">
            Click "Execute Backtest" to trigger the backtesting engine on the historical CSV sample dataset.
          </Typography>
        </Box>
      )}
    </Card>
  );
}
