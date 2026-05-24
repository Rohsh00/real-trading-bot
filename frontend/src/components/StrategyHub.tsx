import { FormEvent } from 'react';
import { 
  Grid, 
  Card, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Chip 
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlusIcon from '@mui/icons-material/Add';

interface Strategy {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

interface StrategyHubProps {
  strategies: Strategy[];
  stratName: string;
  setStratName: (name: string) => void;
  stratDesc: string;
  setStratDesc: (desc: string) => void;
  stratConfig: string;
  setStratConfig: (config: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function StrategyHub({
  strategies,
  stratName,
  setStratName,
  stratDesc,
  setStratDesc,
  stratConfig,
  setStratConfig,
  onSubmit
}: StrategyHubProps) {
  return (
    <Grid container spacing={3}>
      {/* Strategies List */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <SettingsIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
              Deployed Algorithmic Strategies
            </Typography>
          </Box>

          {strategies.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
              No strategy classes found in database.
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Config</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {strategies.map((strategy) => (
                    <TableRow key={strategy.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{strategy.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{strategy.description}</TableCell>
                      <TableCell>
                        <code style={{ fontSize: '11px', background: 'rgba(0,0,0,0.3)', padding: '4px 6px', borderRadius: '4px' }}>
                          {JSON.stringify(strategy.config)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={strategy.is_active ? "Active" : "Inactive"} 
                          color={strategy.is_active ? "success" : "default"} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Card>
      </Grid>

      {/* Deploy Strategy Form */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <PlusIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
              Deploy Strategy
            </Typography>
          </Box>

          <form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Strategy Name"
                variant="outlined"
                size="small"
                fullWidth
                required
                placeholder="e.g. BTC Trend Follower"
                value={stratName}
                onChange={(e) => setStratName(e.target.value)}
              />

              <TextField
                label="Description"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="e.g. EMA crossover trading strategy"
                value={stratDesc}
                onChange={(e) => setStratDesc(e.target.value)}
              />

              <TextField
                label="JSON Config Parameters"
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={4}
                required
                value={stratConfig}
                onChange={(e) => setStratConfig(e.target.value)}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  }
                }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={<PlusIcon />}
                fullWidth
                sx={{ mt: 1 }}
              >
                Deploy Strategy
              </Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
}
