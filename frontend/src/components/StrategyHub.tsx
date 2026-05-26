import { FormEvent, useState, useMemo } from 'react';
import { 
  Grid, Card, Typography, Box, TextField, Button, Table, TableHead, 
  TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, Dialog, 
  DialogTitle, DialogContent, DialogContentText, DialogActions, 
  Checkbox, Toolbar, alpha, useTheme
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlusIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';

import { useAppDispatch } from '../store';
import { 
  deployStrategyThunk, 
  updateStrategyThunk, 
  deleteStrategyThunk 
} from '../store/tradingSlice';

interface Strategy {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  is_active: boolean;
}

interface StrategyHubProps {
  strategies: Strategy[];
}

export default function StrategyHub({ strategies }: StrategyHubProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Form State
  const [stratName, setStratName] = useState('');
  const [stratDesc, setStratDesc] = useState('');
  const [stratConfig, setStratConfig] = useState('{\n  "ema_short": 12,\n  "ema_long": 26\n}');

  // Sort strategies: active on top
  const sortedStrategies = useMemo(() => {
    return [...strategies].sort((a, b) => {
      if (a.is_active === b.is_active) return 0;
      return a.is_active ? -1 : 1;
    });
  }, [strategies]);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isAllSelected = sortedStrategies.length > 0 && selectedIds.length === sortedStrategies.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < sortedStrategies.length;

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'toggle' | 'delete' | 'bulk_activate' | 'bulk_deactivate' | 'bulk_delete' | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  // Snackbar State
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (msg: string) => {
    enqueueSnackbar(msg, { variant: 'success' });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedStrategies.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenDialog = (action: 'toggle' | 'delete', strategy: Strategy) => {
    setDialogAction(action);
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const handleOpenBulkDialog = (action: 'bulk_activate' | 'bulk_deactivate' | 'bulk_delete') => {
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogAction(null);
    setSelectedStrategy(null);
  };

  const handleConfirmAction = async () => {
    if (!dialogAction) return;

    try {
      if (dialogAction === 'toggle' && selectedStrategy) {
        await dispatch(updateStrategyThunk({ id: selectedStrategy.id, data: { is_active: !selectedStrategy.is_active } })).unwrap();
        showToast(`Strategy ${selectedStrategy.name} successfully ${selectedStrategy.is_active ? 'deactivated' : 'activated'}.`);
      } else if (dialogAction === 'delete' && selectedStrategy) {
        await dispatch(deleteStrategyThunk(selectedStrategy.id)).unwrap();
        showToast(`Strategy "${selectedStrategy.name}" successfully deleted.`);
        setSelectedIds(prev => prev.filter(id => id !== selectedStrategy.id));
      } else if (dialogAction === 'bulk_activate') {
        await Promise.all(selectedIds.map(id => dispatch(updateStrategyThunk({ id, data: { is_active: true } })).unwrap()));
        showToast(`Successfully activated ${selectedIds.length} strategies.`);
        setSelectedIds([]);
      } else if (dialogAction === 'bulk_deactivate') {
        await Promise.all(selectedIds.map(id => dispatch(updateStrategyThunk({ id, data: { is_active: false } })).unwrap()));
        showToast(`Successfully deactivated ${selectedIds.length} strategies.`);
        setSelectedIds([]);
      } else if (dialogAction === 'bulk_delete') {
        await Promise.all(selectedIds.map(id => dispatch(deleteStrategyThunk(id)).unwrap()));
        showToast(`Successfully deleted ${selectedIds.length} strategies.`);
        setSelectedIds([]);
      }
    } catch (err: unknown) {
      console.error("Action failed:", err);
      const message = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Action failed');
      enqueueSnackbar(message, { variant: 'error' });
    }
    handleCloseDialog();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedConfig = JSON.parse(stratConfig);
      await dispatch(
        deployStrategyThunk({
          name: stratName,
          description: stratDesc,
          config: parsedConfig,
        })
      ).unwrap();
      setStratName('');
      setStratDesc('');
      showToast('Quantitative Model deployed successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Deployment failed');
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Strategies List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SettingsIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
                  Active Algorithmic Strategies
                </Typography>
              </Box>
            </Box>

            {/* Bulk Actions Toolbar */}
            {selectedIds.length > 0 && (
              <Toolbar
                sx={{
                  px: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderTop: `1px solid ${theme.palette.divider}`,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Typography color="primary" variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                  {selectedIds.length} selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleOpenBulkDialog('bulk_activate')}
                  >
                    Activate
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="warning"
                    startIcon={<CancelIcon />}
                    onClick={() => handleOpenBulkDialog('bulk_deactivate')}
                  >
                    Deactivate
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenBulkDialog('bulk_delete')}
                  >
                    Delete
                  </Button>
                </Box>
              </Toolbar>
            )}

            {sortedStrategies.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 3, pt: 1 }}>
                No active strategies found in the quantitative engine.
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto', px: 3, pb: 3, flexGrow: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={isIndeterminate}
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Config</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedStrategies.map((strategy) => {
                      const isSelected = selectedIds.includes(strategy.id);
                      return (
                        <TableRow 
                          key={strategy.id} 
                          hover
                          selected={isSelected}
                          onClick={() => {
                            setStratName(strategy.name);
                            setStratDesc(strategy.description);
                            setStratConfig(JSON.stringify(strategy.config, null, 2));
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectOne(strategy.id);
                              }}
                            />
                          </TableCell>
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
                          <TableCell align="right">
                            <Tooltip title={strategy.is_active ? "Deactivate" : "Activate"}>
                              <IconButton
                                size="small"
                                color={strategy.is_active ? "success" : "default"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog('toggle', strategy);
                                }}
                              >
                                <PowerSettingsNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDialog('delete', strategy);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                Deploy Quantitative Model
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Model Name"
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

                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5 }}>
                    Use Built-in Preset:
                  </Typography>
                  <Chip 
                    label="EMA Crossover" 
                    size="small" 
                    onClick={() => {
                      setStratName('EMA Trend Follower');
                      setStratDesc('Standard EMA Crossover (5/10)');
                      setStratConfig(JSON.stringify({ fast_period: 5, slow_period: 10 }, null, 2));
                    }} 
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip 
                    label="MACD" 
                    size="small" 
                    onClick={() => {
                      setStratName('MACD Oscillator');
                      setStratDesc('MACD default settings');
                      setStratConfig(JSON.stringify({ fast: 12, slow: 26, signal: 9 }, null, 2));
                    }} 
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip 
                    label="RSI" 
                    size="small" 
                    onClick={() => {
                      setStratName('RSI Reversion');
                      setStratDesc('RSI oversold/overbought (14)');
                      setStratConfig(JSON.stringify({ period: 14, overbought: 70, oversold: 30 }, null, 2));
                    }} 
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  startIcon={<PlusIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Deploy Quantitative Model
                </Button>
              </Box>
            </form>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'toggle' 
            ? (selectedStrategy?.is_active ? 'Deactivate Strategy?' : 'Activate Strategy?') 
            : dialogAction === 'delete' ? 'Delete Strategy?'
            : dialogAction === 'bulk_activate' ? `Activate ${selectedIds.length} Strategies?`
            : dialogAction === 'bulk_deactivate' ? `Deactivate ${selectedIds.length} Strategies?`
            : `Delete ${selectedIds.length} Strategies?`
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'toggle'
              ? `Are you sure you want to ${selectedStrategy?.is_active ? 'deactivate' : 'activate'} the strategy "${selectedStrategy?.name}"?`
              : dialogAction === 'delete' 
              ? `Are you sure you want to permanently delete the strategy "${selectedStrategy?.name}"? This action cannot be undone.`
              : dialogAction === 'bulk_activate'
              ? `Are you sure you want to activate ${selectedIds.length} strategies concurrently?`
              : dialogAction === 'bulk_deactivate'
              ? `Are you sure you want to deactivate ${selectedIds.length} strategies concurrently?`
              : `Are you sure you want to permanently delete ${selectedIds.length} strategies? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            color={dialogAction?.includes('delete') ? 'error' : 'primary'}
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
