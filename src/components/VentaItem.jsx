/**
 * VentaItem - Renderiza un item de venta en una lista.
 *
 * Props:
 *  - venta: { id, producto, cantidad, precioUnit, fecha, cliente }
 *  - esReciente: boolean → renderizado condicional: resalta si es reciente
 *
 * Se usa con RENDERIZADO DE LISTAS:
 *   {ventas.map(v => <VentaItem key={v.id} venta={v} esReciente={...} />)}
 */
import { ListItem, ListItemIcon, ListItemText, Chip, Typography, Box } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

export default function VentaItem({ venta, esReciente }) {
  const total = venta.cantidad * venta.precioUnit;

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid #f3f4f6',
        py: 1.5,
        // RENDERIZADO CONDICIONAL: fondo distinto si es reciente
        bgcolor: esReciente ? '#f0fdf4' : 'transparent',
        borderLeft: esReciente ? '3px solid #16a34a' : '3px solid transparent',
        transition: 'background 0.2s',
        '&:hover': { bgcolor: '#f9fafb' },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {/* RENDERIZADO CONDICIONAL: icono diferente si es reciente */}
        {esReciente ? (
          <NewReleasesIcon sx={{ color: '#16a34a' }} />
        ) : (
          <ReceiptIcon sx={{ color: '#9ca3af' }} />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
              {venta.producto}
            </Typography>
            <Chip
              label={`x${venta.cantidad}`}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
            />
            {/* RENDERIZADO CONDICIONAL: badge "Nueva" solo si es reciente */}
            {esReciente && (
              <Chip
                label="Nueva"
                size="small"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
              />
            )}
          </Box>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {venta.cliente} · {new Date(venta.fecha).toLocaleString('es-AR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </Typography>
        }
      />
      <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a', minWidth: 80, textAlign: 'right' }}>
        ${total.toLocaleString('es-AR')}
      </Typography>
    </ListItem>
  );
}
