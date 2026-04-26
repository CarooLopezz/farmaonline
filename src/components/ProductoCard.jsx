/**
 * ProductoCard - Muestra info de un producto con RENDERIZADO CONDICIONAL de alerta de stock.
 *
 * Props:
 *  - producto: { id, nombre, laboratorio, precio, stock, stockMinimo, categoria, presentacion }
 *  - onVender: función callback cuando se presiona "Vender"
 *  - mostrarAcciones: boolean → renderizado condicional de botones
 */
import {
  Card, CardContent, Typography, Chip, Box, Button, LinearProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ProductoCard({ producto, onVender, mostrarAcciones }) {
  const stockBajo = producto.stock <= producto.stockMinimo;
  const sinStock = producto.stock === 0;
  const porcentajeStock = Math.min((producto.stock / (producto.stockMinimo * 3)) * 100, 100);

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: stockBajo ? '2px solid #f59e0b' : '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        },
        bgcolor: sinStock ? '#fef2f2' : '#fff',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Header con nombre y categoría */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalPharmacyIcon sx={{ color: '#16a34a', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
              {producto.nombre}
            </Typography>
          </Box>
          <Chip
            label={producto.categoria}
            size="small"
            sx={{
              bgcolor: '#f0fdf4',
              color: '#15803d',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>

        {/* Lab y presentación */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {producto.laboratorio} · {producto.presentacion}
        </Typography>

        {/* Precio */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', my: 1 }}>
          ${producto.precio.toLocaleString('es-AR')}
        </Typography>

        {/* Barra de stock */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#6b7280' }}>
              Stock: {producto.stock} unidades
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              Mín: {producto.stockMinimo}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={porcentajeStock}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f3f4f6',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: sinStock ? '#ef4444' : stockBajo ? '#f59e0b' : '#16a34a',
              },
            }}
          />
        </Box>

        {/* RENDERIZADO CONDICIONAL: alerta de stock bajo */}
        {stockBajo && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: sinStock ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${sinStock ? '#fca5a5' : '#fde68a'}`,
              borderRadius: 2,
              px: 1.5,
              py: 0.8,
              mt: 1,
              mb: 1,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 16, color: sinStock ? '#ef4444' : '#f59e0b' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: sinStock ? '#ef4444' : '#b45309' }}>
              {sinStock ? '¡Sin stock!' : `Stock bajo (mín. ${producto.stockMinimo})`}
            </Typography>
          </Box>
        )}

        {/* RENDERIZADO CONDICIONAL: botón de vender solo si mostrarAcciones es true */}
        {mostrarAcciones && (
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartIcon />}
            disabled={sinStock}
            onClick={() => onVender(producto)}
            sx={{
              mt: 1,
              width: '100%',
              bgcolor: '#16a34a',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { bgcolor: '#15803d' },
              '&.Mui-disabled': { bgcolor: '#e5e7eb' },
            }}
          >
            {sinStock ? 'Sin stock' : 'Vender'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
