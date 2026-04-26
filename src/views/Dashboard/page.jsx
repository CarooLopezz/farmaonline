/**
 * Dashboard - Vista principal.
 *
 * CONCEPTOS REACT IMPLEMENTADOS:
 * 1. RENDERIZADO CONDICIONAL → AlertaEstacional se muestra solo si es temporada alta
 * 2. RENDERIZADO DE LISTAS  → lista de ventas recientes con .map()
 * 3. PROPS                  → todos los componentes hijos reciben datos por props
 */
import { useMemo } from 'react';
import { Box, Typography, Paper, List, Divider } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import AlertaEstacional from '../../components/AlertaEstacional';
import EstadisticaCard from '../../components/EstadisticaCard';
import VentaItem from '../../components/VentaItem';

import { analgesicosIniciales, ventasIniciales, esTemporadaAlta, getInfoEstacional } from '../../data/analgesicos';

export default function DashboardPage() {
  const session = JSON.parse(localStorage.getItem('farma_session') || '{}');

  // Leer datos de localStorage o usar precargados
  const productos = useMemo(() => {
    const saved = localStorage.getItem('farma_productos');
    if (saved) return JSON.parse(saved);
    // Precargar datos iniciales
    localStorage.setItem('farma_productos', JSON.stringify(analgesicosIniciales));
    return analgesicosIniciales;
  }, []);

  const ventas = useMemo(() => {
    const saved = localStorage.getItem('farma_ventas');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('farma_ventas', JSON.stringify(ventasIniciales));
    return ventasIniciales;
  }, []);

  const users = JSON.parse(localStorage.getItem('farma_users') || '[]');

  // Estadísticas
  const totalProductos = productos.length;
  const stockBajoCount = productos.filter(p => p.stock <= p.stockMinimo).length;
  const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString());
  const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + (v.cantidad * v.precioUnit), 0);

  // Info estacional
  const infoEstacional = getInfoEstacional();
  const temporadaAlta = esTemporadaAlta();

  // Ventas recientes (últimas 5)
  const ventasRecientes = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  const hoyStr = new Date().toDateString();

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Bienvenido, <strong>{session.nombre || 'Usuario'}</strong> 👋</p>
      </div>

      <div className="page-body">
        {/* ═══════════════════════════════════════════
            RENDERIZADO CONDICIONAL: Alerta estacional
            Solo se muestra si es temporada alta
            ═══════════════════════════════════════════ */}
        <AlertaEstacional info={infoEstacional} visible={temporadaAlta} />

        {/* ═══════════════════════════════════════════
            RENDERIZADO CONDICIONAL: Alerta de stock bajo
            Solo aparece si hay productos con stock bajo
            ═══════════════════════════════════════════ */}
        {stockBajoCount > 0 && (
          <Box sx={{
            bgcolor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: 3,
            p: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
            <WarningAmberIcon sx={{ color: '#ef4444' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#991b1b' }}>
              ¡Atención! Hay <strong>{stockBajoCount} producto{stockBajoCount > 1 ? 's' : ''}</strong> con stock por debajo del mínimo.
            </Typography>
          </Box>
        )}

        {/* Estadísticas con PROPS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2.5, mb: 3 }}>
          <EstadisticaCard
            titulo="Productos en catálogo"
            valor={totalProductos}
            icono={<InventoryIcon />}
            color="#16a34a"
          />
          <EstadisticaCard
            titulo="Ventas hoy"
            valor={ventasHoy.length}
            icono={<PointOfSaleIcon />}
            color="#3b82f6"
            subtexto={totalVentasHoy > 0 ? `$${totalVentasHoy.toLocaleString('es-AR')} facturado` : undefined}
          />
          <EstadisticaCard
            titulo="Stock bajo"
            valor={stockBajoCount}
            icono={<WarningAmberIcon />}
            color={stockBajoCount > 0 ? '#ef4444' : '#16a34a'}
            subtexto={stockBajoCount > 0 ? 'Reponer urgente' : 'Todo OK'}
          />
          <EstadisticaCard
            titulo="Empleados"
            valor={users.length}
            icono={<PeopleIcon />}
            color="#8b5cf6"
          />
        </Box>

        {/* ═══════════════════════════════════════════
            RENDERIZADO DE LISTAS: Ventas recientes
            Usa .map() para renderizar cada VentaItem
            ═══════════════════════════════════════════ */}
        <Paper sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
              💊 Ventas recientes
            </Typography>
          </Box>

          {/* RENDERIZADO CONDICIONAL: lista vacía vs con datos */}
          {ventasRecientes.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#9ca3af' }}>
              <Typography variant="body2">No hay ventas registradas aún</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {/* RENDERIZADO DE LISTAS con .map() y PROPS */}
              {ventasRecientes.map((venta) => (
                <VentaItem
                  key={venta.id}
                  venta={venta}
                  esReciente={new Date(venta.fecha).toDateString() === hoyStr}
                />
              ))}
            </List>
          )}
        </Paper>

        {/* Info estacional (siempre visible) */}
        <Paper sx={{ borderRadius: 3, border: '1px solid #e5e7eb', p: 2.5, mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
            📅 Estacionalidad de Analgésicos
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            {infoEstacional.icono} <strong>{infoEstacional.temporada}</strong> — {infoEstacional.mensaje}
          </Typography>
          <Typography variant="caption" sx={{ color: infoEstacional.tendencia === 'alta' ? '#f59e0b' : '#6b7280', fontWeight: 600, mt: 1, display: 'block' }}>
            Tendencia de ventas: {infoEstacional.porcentaje} respecto al promedio anual
          </Typography>
        </Paper>
      </div>
    </>
  );
}
