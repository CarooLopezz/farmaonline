import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Tema personalizado con el verde de la farmacia
const pharmacyTheme = createTheme({
  palette: {
    primary: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f97316', // El naranja de acento para el registro
    }
  },
  shape: {
    borderRadius: 12,
  },
});

function generatePassword(length = 8) {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const all = uppercase + lowercase + numbers;
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  for (let i = 3; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', dni: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.dni.trim()) errs.dni = 'El DNI es obligatorio';
    else if (!/^\d{7,8}$/.test(form.dni.trim())) errs.dni = 'DNI inválido (7-8 dígitos)';
    if (!form.email.trim()) {
      errs.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Ingresá un correo válido';
    } else {
      const users = JSON.parse(localStorage.getItem('farma_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
        errs.email = 'Este correo ya está registrado';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const password = generatePassword();
      const newUser = {
        id: Date.now().toString(),
        nombre: form.nombre.trim(),
        dni: form.dni.trim(),
        email: form.email.trim().toLowerCase(),
        password,
        rol: 'empleado',
        activo: true,
        fechaRegistro: new Date().toISOString()
      };

      const users = JSON.parse(localStorage.getItem('farma_users') || '[]');
      users.push(newUser);
      localStorage.setItem('farma_users', JSON.stringify(users));

      setGeneratedPassword(password);
      setLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGoToLogin = () => {
    setGeneratedPassword(null);
    navigate('/login');
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ThemeProvider theme={pharmacyTheme}>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
          py: 4
        }}
      >
        <Container component="main" maxWidth="sm">
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRadius: 5,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(22, 163, 74, 0.1)',
              boxShadow: '0 20px 40px rgba(22, 163, 74, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Adorno superior */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, bgcolor: 'primary.main' }} />

            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64, mb: 1.5 }}>
              <PersonAddOutlinedIcon fontSize="large" />
            </Avatar>
            
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: 'primary.main' }}>
              Farma<Box component="span" sx={{ color: '#1f2937' }}>Online</Box>
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
              Registro de nuevo empleado
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre completo"
                placeholder="Ej: Juan García"
                autoFocus
                value={form.nombre}
                onChange={handleChange('nombre')}
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="dni"
                label="DNI"
                placeholder="Ej: 40919179"
                value={form.dni}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setForm(prev => ({ ...prev, dni: val }));
                  if (errors.dni) setErrors(prev => ({ ...prev, dni: undefined }));
                }}
                error={!!errors.dni}
                helperText={errors.dni}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                placeholder="Ej: juan@email.com"
                value={form.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />

              <Box 
                sx={{ 
                  mt: 3, 
                  mb: 4, 
                  p: 2, 
                  bgcolor: '#f0fdf4', 
                  borderRadius: 4, 
                  border: '1px solid',
                  borderColor: '#bbf7d0',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start'
                }}
              >
                <InfoOutlinedIcon sx={{ mt: 0.2, color: '#16a34a' }} />
                <Typography variant="body2" color="#166534" sx={{ fontWeight: 500 }}>
                  La contraseña se generará automáticamente y se te mostrará una sola vez. 
                  <strong> Anotala en un lugar seguro.</strong>
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ 
                  py: 1.8, 
                  borderRadius: 4,
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(22, 163, 74, 0.25)',
                  '&:hover': {
                    boxShadow: '0 12px 20px rgba(22, 163, 74, 0.35)',
                  }
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : '✨ Registrarme'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tenés una cuenta activada?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.main',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 16 }} /> Volver a Iniciar Sesión
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Dialog de éxito con contraseña */}
        <Dialog 
          open={Boolean(generatedPassword)} 
          onClose={handleGoToLogin}
          PaperProps={{
            sx: { borderRadius: 5, p: 2, maxWidth: 440 }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Box sx={{ color: 'primary.main', fontSize: 72, mb: 1.5 }}>
              <CheckCircleIcon fontSize="inherit" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1f2937' }}>¡Registro exitoso!</Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tu cuenta fue creada correctamente. Guardá tu contraseña ahora, no se volverá a mostrar.
            </Typography>
            
            <Box 
              sx={{ 
                p: 2.5, 
                bgcolor: '#f9fafb', 
                borderRadius: 4, 
                mb: 2,
                position: 'relative',
                border: '2px dashed #e5e7eb'
              }}
            >
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1, fontWeight: 800, letterSpacing: 1 }}>
                TU CONTRASEÑA DE ACCESO
              </Typography>
              <Typography variant="h4" sx={{ letterSpacing: 4, fontWeight: 800, color: 'primary.main', mb: 1 }}>
                {generatedPassword}
              </Typography>
              <Tooltip title={copied ? "¡Copiado!" : "Copiar al portapapeles"}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleCopy}
                  startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                  color={copied ? "success" : "primary"}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {copied ? "Copiado" : "Copiar clave"}
                </Button>
              </Tooltip>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
              💡 Por seguridad, te recomendamos cambiarla luego de tu primer ingreso.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleGoToLogin}
              sx={{ borderRadius: 4, py: 1.5, fontWeight: 700 }}
            >
              Ir a Iniciar Sesión →
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
