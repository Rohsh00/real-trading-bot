import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Card,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import {
  createChart,
  CandlestickSeries,
  ColorType,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import { useAppSelector } from '../store';

const WS_BASE = 'ws://127.0.0.1:8000/api/v1/ws/candles';
const API_BASE = 'http://127.0.0.1:8000/api/v1';
const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const TIMEFRAMES = ['1m', '5m', '15m'];

interface CandleData {
  symbol: string;
  timeframe: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  is_live?: boolean;
}

function getChartColors(isDark: boolean) {
  return {
    text: isDark ? '#9ca3af' : '#374151',
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)',
    border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
  };
}

function toUTC(ts: string): UTCTimestamp {
  return Math.floor(new Date(ts).getTime() / 1000) as UTCTimestamp;
}

export default function Candles() {
  const themeMode = useAppSelector((s) => s.app.themeMode);

  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('1m');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [tableRows, setTableRows] = useState<CandleData[]>([]);
  const [liveCandle, setLiveCandle] = useState<CandleData | null>(null);
  const [hasData, setHasData] = useState(false);

  // Chart refs — chart is NEVER destroyed except on unmount
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── 1. Create chart once on mount ────────────────────────────────────────
  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    const isDark = themeMode === 'dark';
    const c = getChartColors(isDark);

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: c.text,
        fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: c.grid },
        horzLines: { color: c.grid },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: c.border },
      timeScale: {
        borderColor: c.border,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
      width: chartContainerRef.current.clientWidth,
      height: 380,
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const onResize = () => {
      chartContainerRef.current &&
        chartRef.current?.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 2. Update theme colours (never recreate chart) ───────────────────────
  useEffect(() => {
    if (!chartRef.current) return;
    const c = getChartColors(themeMode === 'dark');
    chartRef.current.applyOptions({
      layout: { textColor: c.text },
      grid: { vertLines: { color: c.grid }, horzLines: { color: c.grid } },
      rightPriceScale: { borderColor: c.border },
      timeScale: { borderColor: c.border },
    });
  }, [themeMode]);

  // ─── 3. Load historical candles from REST (once per symbol/timeframe) ─────
  const loadHistorical = useCallback(async () => {
    if (!seriesRef.current) return;
    try {
      const res = await fetch(`${API_BASE}/candles?symbol=${symbol}&timeframe=${timeframe}&limit=100`);
      if (!res.ok) return;
      const data: CandleData[] = await res.json();

      const sorted = [...data]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      seriesRef.current.setData(
        sorted.map((c) => ({
          time: toUTC(c.timestamp),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      );

      chartRef.current?.timeScale().fitContent();
      setTableRows(data.slice(0, 10));
      setHasData(data.length > 0);
    } catch {
      // silent — WS will still connect
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    loadHistorical();
  }, [loadHistorical]);

  // ─── 4. WebSocket for live candle updates — series.update() only ──────────
  const connectWS = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    setWsStatus('connecting');

    const url = `${WS_BASE}?symbol=${symbol}&timeframe=${timeframe}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('live');

    ws.onmessage = (event) => {
      try {
        const candle: CandleData = JSON.parse(event.data);
        setLiveCandle(candle);
        setHasData(true);

        // Update the forming (last) bar only — zero flicker
        seriesRef.current?.update({
          time: toUTC(candle.timestamp),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        });
      } catch {
        // skip malformed
      }
    };

    ws.onerror = () => setWsStatus('offline');

    ws.onclose = () => {
      setWsStatus('offline');
      // Auto-reconnect in 5s
      reconnectTimer.current = setTimeout(() => connectWS(), 5000);
    };
  }, [symbol, timeframe]);

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connectWS]);

  // ─── Derived values ───────────────────────────────────────────────────────
  const displayCandle = liveCandle ?? tableRows[0] ?? null;
  const isUp = displayCandle ? displayCandle.close >= displayCandle.open : true;
  const pctChange = displayCandle
    ? (((displayCandle.close - displayCandle.open) / displayCandle.open) * 100).toFixed(2)
    : '0.00';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

      {/* ── Controls bar ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Symbol</InputLabel>
          <Select value={symbol} label="Symbol" onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={(_, val) => { if (val) setTimeframe(val); }}
          size="small"
        >
          {TIMEFRAMES.map((t) => (
            <ToggleButton key={t} value={t} sx={{ px: 2.5, fontWeight: 600, fontSize: '0.78rem' }}>
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* WS connection badge */}
        <Chip
          icon={wsStatus === 'live'
            ? <SignalWifiStatusbar4BarIcon sx={{ fontSize: '14px !important' }} />
            : <SignalWifiOffIcon sx={{ fontSize: '14px !important' }} />}
          label={wsStatus === 'live' ? 'Live WebSocket' : wsStatus === 'connecting' ? 'Connecting…' : 'Reconnecting…'}
          size="small"
          variant="outlined"
          color={wsStatus === 'live' ? 'success' : 'warning'}
          sx={{ fontSize: '0.72rem' }}
        />

        {/* Live price ticker */}
        {displayCandle && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
              ${displayCandle.close.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
            <Chip
              icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${isUp ? '+' : ''}${pctChange}%`}
              color={isUp ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
            {liveCandle && (
              <Chip
                label="LIVE"
                size="small"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.68rem', animation: 'pulse 2s infinite' }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* WS connecting progress bar */}
      {wsStatus === 'connecting' && (
        <LinearProgress sx={{ borderRadius: 1, height: 2 }} />
      )}

      {/* ── Chart card — always mounted, never toggled ── */}
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <ShowChartIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>
            {symbol} · {timeframe} — Real-time Candlestick
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            {wsStatus === 'live' && (
              <Box
                sx={{
                  width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main',
                  boxShadow: '0 0 0 3px rgba(16,185,129,0.3)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Chart container — ALWAYS mounted */}
        <Box
          ref={chartContainerRef}
          sx={{ width: '100%', height: 380, borderRadius: 1.5, overflow: 'hidden' }}
        />

        {!hasData && wsStatus !== 'connecting' && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            No candles yet for <strong>{symbol}</strong> / <strong>{timeframe}</strong>.{' '}
            {timeframe !== '1m'
              ? `${timeframe} candles complete every ${timeframe === '5m' ? '5 min' : '15 min'}.`
              : 'Make sure stream_runner is active.'}
          </Alert>
        )}
      </Card>

      {/* ── Data table — from historical REST ── */}
      {tableRows.length > 0 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Recent Completed Candles · {symbol} {timeframe}
          </Typography>
          <Box sx={{ overflowX: 'auto', mt: 1.5 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Open</TableCell>
                  <TableCell align="right">High</TableCell>
                  <TableCell align="right">Low</TableCell>
                  <TableCell align="right">Close</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="center">Δ%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((candle, idx) => {
                  const up = candle.close >= candle.open;
                  const chg = (((candle.close - candle.open) / candle.open) * 100).toFixed(2);
                  return (
                    <TableRow key={idx} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.76rem', color: 'text.secondary' }}>
                        {new Date(candle.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell align="right">${candle.open.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                        ${candle.high.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'error.main', fontWeight: 500 }}>
                        ${candle.low.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: up ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        ${candle.close.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.76rem' }}>
                        {candle.volume.toFixed(4)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${up ? '+' : ''}${chg}%`}
                          size="small"
                          color={up ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ fontSize: '0.68rem', height: 20 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}
    </Box>
  );
}
