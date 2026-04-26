import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, ToggleButtonGroup, ToggleButton,
  Chip, Alert, AlertTitle, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { analgesicosIniciales } from '../../data/analgesicos';

export default function StockPage() {
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Cargar productos
  const productos = useMemo(() => {
    const saved = localStorage.getItem('farma_productos');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('farma_productos', JSON.stringify(analgesicosIniciales));
    return analgesicosIniciales;
  }, []);

  // Productos con stock bajo
  const productosStockBajo = productos.filter(p => p.stock <= p.stockMinimo);
  const productosSinStock = productos.filter(p => p.stock === 0);

  // Filtrado
  const productosFiltrados = useMemo(() => {
    let lista = [...productos];

    // Filtro por estado de stock
    if (filtro === 'bajo') lista = lista.filter(p => p.stock <= p.stockMinimo && p.stock > 0);
    if (filtro === 'sin') lista = lista.filter(p => p.stock === 0);
    if (filtro === 'ok') lista = lista.filter(p => p.stock > p.stockMinimo);

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.laboratorio.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      );
    }

    return lista;
  }, [productos, filtro, busqueda]);

  return (
    <Box sx={{ p: 1 }}>
      <div className="page-header">
        <h1>📦 Control de Stock — Analgésicos</h1>
        <p>Gestión de niveles críticos y reposición</p>
      </div>

      <div className="page-body">
        {/* Alerta de Stock Crítico */}
        {productosStockBajo.length > 0 ? (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon />}
            sx={{ mb: 3, borderRadius: 4, border: '1px solid #fbd38d' }}
          >
            <AlertTitle sx={{ fontWeight: 800 }}>
              Atención: {productosStockBajo.length} producto{productosStockBajo.length > 1 ? 's' : ''} requieren reposición
            </AlertTitle>
            {productosSinStock.length > 0 && (
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#c53030', mt: 0.5 }}>
                ⚠️ Hay {productosSinStock.length} producto{productosSinStock.length > 1 ? 's' : ''} totalmente sin stock.
              </Typography>
            )}
          </Alert>
        ) : (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 3, borderRadius: 4 }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Inventario Óptimo</AlertTitle>
            Todos los niveles de analgésicos están por encima del mínimo.
          </Alert>
        )}

        {/* Barra de Herramientas: Filtros y Búsqueda */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            mb: 3, 
            borderRadius: 4, 
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
            bgcolor: '#ffffff'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FilterListIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Filtrar por:
            </Typography>
            <ToggleButtonGroup
              value={filtro}
              exclusive
              onChange={(_, val) => val && setFiltro(val)}
              size="small"
              sx={{ 
                bgcolor: '#f9fafb',
                p: 0.5,
                borderRadius: 2.5,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 2,
                  px: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'white',
                    color: '#16a34a',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: 'white' }
                  }
                }
              }}
            >
              <ToggleButton value="todos">Todos</ToggleButton>
              <ToggleButton value="bajo" sx={{ color: '#f59e0b !important' }}>Bajo Stock</ToggleButton>
              <ToggleButton value="sin" sx={{ color: '#ef4444 !important' }}>Agotados</ToggleButton>
              <ToggleButton value="ok" sx={{ color: '#16a34a !important' }}>OK</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TextField
            size="small"
            placeholder="Nombre, lab o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              ml: 'auto',
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f9fafb' },
            }}
          />
        </Paper>

        {/* Tabla de Productos */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: 'none', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Producto</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Laboratorio / Categoría</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>Precio</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#374151' }}>Stock Actual</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#374151' }}>Mínimo</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#374151' }}>Vencimiento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#374151' }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      No se encontraron productos con los criterios seleccionados.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                productosFiltrados.map((producto) => {
                  const esBajo = producto.stock <= producto.stockMinimo;
                  const esAgotado = producto.stock === 0;
                  
                  // Lógica de vencimiento próximo (ej: menos de 6 meses)
                  const fechaVenc = new Date(producto.vencimiento);
                  const hoy = new Date();
                  const seisMesesDespues = new Date();
                  seisMesesDespues.setMonth(hoy.getMonth() + 6);
                  const proximoAVencer = fechaVenc < seisMesesDespues;

                  return (
                    <TableRow 
                      key={producto.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                          {producto.nombre}
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 12, ml: 0.5, color: '#9ca3af', verticalAlign: 'middle' }} />
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {producto.presentacion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#4b5563', mb: 0.5 }}>{producto.laboratorio}</Typography>
                        <Chip 
                          label={producto.categoria} 
                          size="small" 
                          sx={{ 
                            height: 18, 
                            fontSize: '0.6rem', 
                            fontWeight: 700, 
                            bgcolor: '#f3f4f6', 
                            color: '#4b5563'
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                          ${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: esAgotado ? '#fef2f2' : (esBajo ? '#fffbeb' : '#f0fdf4'),
                          border: '1px solid',
                          borderColor: esAgotado ? '#fecaca' : (esBajo ? '#fef3c7' : '#bbf7d0')
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 800, 
                              color: esAgotado ? '#ef4444' : (esBajo ? '#f59e0b' : '#16a34a') 
                            }}
                          >
                            {producto.stock}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {producto.stockMinimo}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 0.5,
                          fontWeight: 600,
                          color: proximoAVencer ? '#c53030' : 'text.secondary'
                        }}>
                          {proximoAVencer && <WarningAmberIcon sx={{ fontSize: 14 }} />}
                          {new Date(producto.vencimiento).toLocaleDateString('es-AR')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {esAgotado ? (
                          <Chip label="Agotado" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                        ) : esBajo ? (
                          <Chip label="Reponer" size="small" sx={{ fontWeight: 700, borderRadius: 1.5, bgcolor: '#fef3c7', color: '#92400e' }} />
                        ) : (
                          <Chip label="Óptimo" size="small" sx={{ fontWeight: 700, borderRadius: 1.5, bgcolor: '#dcfce7', color: '#166534' }} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar Datos">
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tarjeta de Resumen Final */}
        <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 4, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            📈 Resumen del Inventario de Analgésicos
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Total Skus</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#111827' }}>{productos.length}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Disponibilidad OK</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#16a34a' }}>{productos.length - productosStockBajo.length}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>En Alerta</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f59e0b' }}>{productosStockBajo.length - productosSinStock.length}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Quiebre de Stock</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#ef4444' }}>{productosSinStock.length}</Typography>
            </Box>
          </Box>
        </Paper>
      </div>
    </Box>
  );
}
