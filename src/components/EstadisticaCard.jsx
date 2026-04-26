/**
 * EstadisticaCard - Card de estadística reutilizable.
 *
 * Props:
 *  - titulo: string
 *  - valor: string | number
 *  - icono: React node (componente MUI Icon)
 *  - color: string (color del icono/acento)
 *  - subtexto: string (opcional)
 */
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function EstadisticaCard({ titulo, valor, icono, color, subtexto }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: color,
          }}
        >
          {icono}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.3 }}>
          {valor}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
          {titulo}
        </Typography>
        {/* RENDERIZADO CONDICIONAL: subtexto opcional */}
        {subtexto && (
          <Typography variant="caption" sx={{ color: color, fontWeight: 600, mt: 0.5, display: 'block' }}>
            {subtexto}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
