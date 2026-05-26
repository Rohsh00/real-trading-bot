import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAppDispatch, useAppSelector } from '../store';
import { fetchRiskSettingsThunk, updateRiskSettingsThunk, RiskSettings } from '../store/tradingSlice';

const RiskManagement: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const { riskSettings, loading } = useAppSelector((state) => state.trading);

  const [formData, setFormData] = useState<RiskSettings>({
    max_position_size: 10000,
    max_open_positions: 5,
    max_daily_loss: -5000,
    restricted_symbols: [],
  });

  const [newSymbol, setNewSymbol] = useState('');

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchRiskSettingsThunk());
  }, [dispatch]);

  // Sync form data when riskSettings arrive from Redux
  useEffect(() => {
    if (riskSettings) {
      setFormData(riskSettings);
    }
  }, [riskSettings]);

  const handleChange = (field: keyof RiskSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleAddSymbol = () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (symbol && !formData.restricted_symbols.includes(symbol)) {
      setFormData((prev) => ({
        ...prev,
        restricted_symbols: [...prev.restricted_symbols, symbol],
      }));
    }
    setNewSymbol('');
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      restricted_symbols: prev.restricted_symbols.filter((sym) => sym !== symbolToRemove),
    }));
  };

  const handleSave = () => {
    dispatch(updateRiskSettingsThunk(formData));
  };

  const handleRefresh = () => {
    dispatch(fetchRiskSettingsThunk());
  };

  if (!riskSettings && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SecurityIcon color="primary" fontSize="medium" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            Risk Controls
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
          >
            Discard Changes
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            size="small"
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage capital allocation limits and dynamic trading constraints. Changes are immediately cached and enforce pre-trade validations.
      </Typography>

      <Stack spacing={4} sx={{ maxWidth: 600 }}>
        {/* Exposure Limits */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Global Exposure Limits
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              label="Max Position Size"
              type="number"
              fullWidth
              value={formData.max_position_size}
              onChange={handleChange('max_position_size')}
              helperText="Maximum allowed allocation per symbol"
            />
            <TextField
              label="Max Open Positions"
              type="number"
              fullWidth
              value={formData.max_open_positions}
              onChange={handleChange('max_open_positions')}
              helperText="Maximum concurrent positions allowed"
            />
          </Box>
        </Box>

        <Divider />

        {/* Drawdown Limits */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Drawdown Controls
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              label="Max Daily Loss"
              type="number"
              fullWidth
              value={formData.max_daily_loss}
              onChange={handleChange('max_daily_loss')}
              helperText="Halt trading if daily loss exceeds this value (negative number)"
            />
          </Box>
        </Box>

        <Divider />

        {/* Restricted Symbols */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Restricted Symbols (Blacklist)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <TextField
              label="Add Symbol (e.g. DOGEUSDT)"
              variant="outlined"
              size="small"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSymbol();
                }
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<AddCircleIcon />}
              onClick={handleAddSymbol}
              sx={{ height: 40 }}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.restricted_symbols.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No symbols are currently restricted.
              </Typography>
            ) : (
              formData.restricted_symbols.map((symbol) => (
                <Chip
                  key={symbol}
                  label={symbol}
                  onDelete={() => handleRemoveSymbol(symbol)}
                  color="error"
                  variant="outlined"
                />
              ))
            )}
          </Box>
        </Box>
      </Stack>
    </Card>
  );
});

export default RiskManagement;
