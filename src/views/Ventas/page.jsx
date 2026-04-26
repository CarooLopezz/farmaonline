/**
 * VentasPage - Módulo de ventas de analgésicos.
 *
 * CONCEPTOS REACT:
 * 1. RENDERIZADO CONDICIONAL → modal de venta, mensaje de éxito, carrito vacío vs lleno
 * 2. RENDERIZADO DE LISTAS  → .map() sobre productos y sobre historial de ventas
 * 3. PROPS                  → ProductoCard y VentaItem reciben datos por props
 */
import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, List, Divider,
  Chip, Alert, Snackbar, IconButton, Tabs, Tab,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import ProductoCard from '../../components/ProductoCard';
import VentaItem from '../../components/VentaItem';
import { analgesicosIniciales, ventasIniciales } from '../../data/analgesicos';

export default function VentasPage() {
  const [tab, setTab] = useState(0);
  const [modalVenta, setModalVenta] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cliente, setCliente] = useState('');
  const [toast, setToast] = useState({ open: false, msg: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar productos
  const productos = useMemo(() => {
    const saved = localStorage.getItem('farma_productos');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('farma_productos', JSON.stringify(analgesicosIniciales));
    return analgesicosIniciales;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Cargar ventas
  const ventas = useMemo(() => {
    const saved = localStorage.getItem('farma_ventas');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('farma_ventas', JSON.stringify(ventasIniciales));
    return ventasIniciales;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Abrir modal de venta - recibe producto por PROPS desde ProductoCard
  const handleAbrirVenta = (producto) => {
    setModalVenta(producto);
    setCantidad(1);
    setCliente('');
  };

  // Confirmar venta
  const handleConfirmarVenta = () => {
    if (!modalVenta || cantidad < 1) return;

    const nuevaVenta = {
      id: Date.now(),
      productoId: modalVenta.id,
      producto: modalVenta.nombre,
      cantidad: cantidad,
      precioUnit: modalVenta.precio,
      fecha: new Date().toISOString(),
      cliente: cliente.trim() || 'Mostrador',
    };

    // Actualizar ventas
    const ventasActuales = JSON.parse(localStorage.getItem('farma_ventas') || '[]');
    ventasActuales.push(nuevaVenta);
    localStorage.setItem('farma_ventas', JSON.stringify(ventasActuales));

    // Actualizar stock del producto
    const productosActuales = JSON.parse(localStorage.getItem('farma_productos') || '[]');
    const idx = productosActuales.findIndex(p => p.id === modalVenta.id);
    if (idx !== -1) {
      productosActuales[idx].stock = Math.max(0, productosActuales[idx].stock - cantidad);
      localStorage.setItem('farma_productos', JSON.stringify(productosActuales));
    }

    setModalVenta(null);
    setRefreshKey(k => k + 1);
    setToast({
      open: true,
      msg: `✅ Venta registrada: ${cantidad}x ${modalVenta.nombre} — $${(cantidad * modalVenta.precio).toLocaleString('es-AR')}`,
    });
  };

  // Ordenar ventas: más recientes primero
  const ventasOrdenadas = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const hoyStr = new Date().toDateString();

  // Totales
  const totalVentasHoy = ventas
    .filter(v => new Date(v.fecha).toDateString() === hoyStr)
    .reduce((sum, v) => sum + v.cantidad * v.precioUnit, 0);

  return (
    <>
      <div className="page-header">
        <h1>💊 Ventas de Analgésicos</h1>
        <p>Registrá ventas y consultá el historial</p>
      </div>

      <div className="page-body">
        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            sx={{
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' },
              '& .Mui-selected': { color: '#16a34a' },
              '& .MuiTabs-indicator': { bgcolor: '#16a34a' },
            }}
          >
            <Tab icon={<AddShoppingCartIcon />} iconPosition="start" label="Nueva Venta" />
            <Tab
              icon={<HistoryIcon />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Historial
                  {/* RENDERIZADO CONDICIONAL: badge con cantidad */}
                  {ventas.length > 0 && (
                    <Chip label={ventas.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* ═══════════════════════════════════════════
            RENDERIZADO CONDICIONAL: Tab 0 = Nueva Venta, Tab 1 = Historial
            ═══════════════════════════════════════════ */}
        {tab === 0 ? (
          <>
            {/* Total del día - RENDERIZADO CONDICIONAL */}
            {totalVentasHoy > 0 && (
              <Alert
                severity="success"
                sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}
                icon={<ReceiptLongIcon />}
              >
                Ventas de hoy: <strong>${totalVentasHoy.toLocaleString('es-AR')}</strong>
              </Alert>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
              Seleccioná un producto para vender:
            </Typography>

            {/* ═══════════════════════════════════════════
                RENDERIZADO DE LISTAS: Grid de productos
                ProductoCard recibe PROPS: producto, onVender, mostrarAcciones
                ═══════════════════════════════════════════ */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2.5 }}>
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onVender={handleAbrirVenta}
                  mostrarAcciones={true}
                />
              ))}
            </Box>
          </>
        ) : (
          <>
            {/* ═══════════════════════════════════════════
                RENDERIZADO DE LISTAS: Historial de ventas
                VentaItem recibe PROPS: venta, esReciente
                ═══════════════════════════════════════════ */}
            <Paper sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                  📋 Historial de ventas
                </Typography>
                <Chip
                  label={`${ventas.length} ventas totales`}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* RENDERIZADO CONDICIONAL: vacío vs con datos */}
              {ventasOrdenadas.length === 0 ? (
                <Box sx={{ p: 5, textAlign: 'center', color: '#9ca3af' }}>
                  <ShoppingCartIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    No hay ventas registradas
                  </Typography>
                  <Typography variant="body2">
                    Las ventas que realices aparecerán aquí
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {/* RENDERIZADO DE LISTAS */}
                  {ventasOrdenadas.map((venta) => (
                    <VentaItem
                      key={venta.id}
                      venta={venta}
                      esReciente={new Date(venta.fecha).toDateString() === hoyStr}
                    />
                  ))}
                </List>
              )}
            </Paper>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          RENDERIZADO CONDICIONAL: Modal de venta
          Solo se muestra cuando modalVenta !== null
          ═══════════════════════════════════════════ */}
      {modalVenta !== null && (
        <Dialog
          open={true}
          onClose={() => setModalVenta(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Registrar venta
            <IconButton onClick={() => setModalVenta(null)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ bgcolor: '#f9fafb', borderRadius: 2, p: 2, mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>
                💊 {modalVenta.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {modalVenta.laboratorio} · {modalVenta.presentacion}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a', mt: 1 }}>
                ${modalVenta.precio.toLocaleString('es-AR')} c/u
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Stock disponible: {modalVenta.stock}
              </Typography>
            </Box>

            <TextField
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Math.min(modalVenta.stock, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: modalVenta.stock }}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              label="Cliente (opcional)"
              placeholder="Mostrador"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Total:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#16a34a' }}>
                ${(cantidad * modalVenta.precio).toLocaleString('es-AR')}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button onClick={() => setModalVenta(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmarVenta}
              startIcon={<ShoppingCartIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#16a34a',
                '&:hover': { bgcolor: '#15803d' },
              }}
            >
              Confirmar venta
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Toast de éxito */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ open: false, msg: '' })}
        message={toast.msg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
