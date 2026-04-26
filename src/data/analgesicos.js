/**
 * Datos precargados de analgésicos.
 * Los analgésicos son productos estacionales: las ventas aumentan
 * en cambios de temperatura (otoño/invierno).
 */

export const analgesicosIniciales = [
  {
    id: 1,
    nombre: 'Ibuprofeno 400mg',
    laboratorio: 'Bayer',
    precio: 2500.00,
    stock: 45,
    stockMinimo: 10,
    categoria: 'AINE',
    presentacion: 'Caja x 20 comp.',
    vencimiento: '2027-05-15',
  },
  {
    id: 2,
    nombre: 'Paracetamol 500mg',
    laboratorio: 'GSK',
    precio: 1800.50,
    stock: 8,
    stockMinimo: 15,
    categoria: 'No opiáceo',
    presentacion: 'Caja x 16 comp.',
    vencimiento: '2026-11-20',
  },
  {
    id: 3,
    nombre: 'Aspirina 500mg',
    laboratorio: 'Bayer',
    precio: 1500.00,
    stock: 30,
    stockMinimo: 10,
    categoria: 'AINE',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2027-01-10',
  },
  {
    id: 4,
    nombre: 'Diclofenac 50mg',
    laboratorio: 'Novartis',
    precio: 3200.75,
    stock: 5,
    stockMinimo: 12,
    categoria: 'AINE',
    presentacion: 'Caja x 20 comp.',
    vencimiento: '2026-08-30',
  },
  {
    id: 5,
    nombre: 'Naproxeno 550mg',
    laboratorio: 'Raffo',
    precio: 4100.00,
    stock: 22,
    stockMinimo: 8,
    categoria: 'AINE',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2028-02-14',
  },
  {
    id: 6,
    nombre: 'Ketorolac 10mg',
    laboratorio: 'Roche',
    precio: 5500.25,
    stock: 3,
    stockMinimo: 10,
    categoria: 'AINE',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2026-06-22',
  },
  {
    id: 7,
    nombre: 'Tramadol 50mg',
    laboratorio: 'Gador',
    precio: 7200.00,
    stock: 18,
    stockMinimo: 5,
    categoria: 'Opioide débil',
    presentacion: 'Caja x 20 comp.',
    vencimiento: '2027-12-01',
  },
  {
    id: 8,
    nombre: 'Meloxicam 15mg',
    laboratorio: 'Boehringer',
    precio: 3800.50,
    stock: 12,
    stockMinimo: 10,
    categoria: 'AINE',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2027-09-18',
  },
  {
    id: 9,
    nombre: 'Dipirona 500mg',
    laboratorio: 'Sanofi',
    precio: 1200.20,
    stock: 50,
    stockMinimo: 20,
    categoria: 'No opiáceo',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2028-04-05',
  },
  {
    id: 10,
    nombre: 'Clonixinato de Lisina',
    laboratorio: 'Bagó',
    precio: 4600.00,
    stock: 7,
    stockMinimo: 8,
    categoria: 'No opiáceo',
    presentacion: 'Caja x 10 comp.',
    vencimiento: '2026-10-31',
  },
];

/**
 * Ventas precargadas de ejemplo para mostrar datos estacionales.
 */
export const ventasIniciales = [
  { id: 1, productoId: 1, producto: 'Ibuprofeno 400mg', cantidad: 3, precioUnit: 2500, fecha: '2026-04-22T10:30:00', cliente: 'Mostrador' },
  { id: 2, productoId: 2, producto: 'Paracetamol 500mg', cantidad: 2, precioUnit: 1800, fecha: '2026-04-22T11:15:00', cliente: 'María López' },
  { id: 3, productoId: 3, producto: 'Aspirina 500mg', cantidad: 1, precioUnit: 1500, fecha: '2026-04-21T09:00:00', cliente: 'Mostrador' },
  { id: 4, productoId: 6, producto: 'Ketorolac 10mg', cantidad: 1, precioUnit: 5500, fecha: '2026-04-21T14:20:00', cliente: 'Juan Pérez' },
  { id: 5, productoId: 9, producto: 'Dipirona 500mg', cantidad: 5, precioUnit: 1200, fecha: '2026-04-20T16:45:00', cliente: 'Mostrador' },
];

/**
 * Determina si es temporada alta de analgésicos.
 * Otoño (marzo-mayo) e invierno (junio-agosto) en hemisferio sur = temporada alta.
 */
export function esTemporadaAlta() {
  const mes = new Date().getMonth(); // 0-11
  // Marzo(2) a Agosto(7) = cambios de temperatura / frío
  return mes >= 2 && mes <= 7;
}

/**
 * Devuelve info estacional según el mes actual.
 */
export function getInfoEstacional() {
  const mes = new Date().getMonth();
  if (mes >= 2 && mes <= 4) {
    return {
      temporada: 'Otoño',
      icono: '🍂',
      mensaje: 'Los cambios de temperatura aumentan la demanda de analgésicos. Recomendamos reforzar stock.',
      tendencia: 'alta',
      porcentaje: '+35%',
    };
  }
  if (mes >= 5 && mes <= 7) {
    return {
      temporada: 'Invierno',
      icono: '❄️',
      mensaje: 'Temporada pico de ventas de analgésicos por gripes y dolores articulares.',
      tendencia: 'alta',
      porcentaje: '+60%',
    };
  }
  if (mes >= 8 && mes <= 10) {
    return {
      temporada: 'Primavera',
      icono: '🌸',
      mensaje: 'La demanda de analgésicos se estabiliza progresivamente.',
      tendencia: 'media',
      porcentaje: '+10%',
    };
  }
  return {
    temporada: 'Verano',
    icono: '☀️',
    mensaje: 'Temporada baja de analgésicos. Buen momento para revisar vencimientos.',
    tendencia: 'baja',
    porcentaje: '-15%',
  };
}
