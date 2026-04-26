/**
 * AlertaEstacional - Componente con RENDERIZADO CONDICIONAL.
 *
 * Props:
 *  - info: objeto con { temporada, icono, mensaje, tendencia, porcentaje }
 *  - visible: boolean → si es false no renderiza nada (renderizado condicional)
 *
 * Ejemplo de renderizado condicional:
 *   {esTemporadaAlta && <AlertaEstacional info={info} visible={true} />}
 */
import { Alert, AlertTitle, Chip, Box } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function AlertaEstacional({ info, visible }) {
  // RENDERIZADO CONDICIONAL: si no es visible, no renderiza nada
  if (!visible || !info) {
    return null;
  }

  // RENDERIZADO CONDICIONAL: severidad según tendencia
  const severidad =
    info.tendencia === 'alta' ? 'warning' :
    info.tendencia === 'media' ? 'info' : 'success';

  return (
    <Alert
      severity={severidad}
      icon={<ThermostatIcon />}
      sx={{
        mb: 3,
        borderRadius: 3,
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <AlertTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        {info.icono} Temporada: {info.temporada}
        <Chip
          label={info.porcentaje}
          size="small"
          color={info.tendencia === 'alta' ? 'warning' : info.tendencia === 'media' ? 'info' : 'success'}
          icon={info.tendencia === 'baja' ? <TrendingDownIcon /> : <TrendingUpIcon />}
          sx={{ ml: 1, fontWeight: 700 }}
        />
      </AlertTitle>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {info.mensaje}
      </Box>
    </Alert>
  );
}
