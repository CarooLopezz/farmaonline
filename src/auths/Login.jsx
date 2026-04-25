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
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Tema personalizado con el verde de la farmacia
const pharmacyTheme = createTheme({
  palette: {
    primary: {
      main: '#16a34a',
      light: '#22c55e',
      dark: '#15803d',
      contrastText: '#fff',
    },
    background: {
      default: '#f0fdf4',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'El correo es obligatorio';
    if (!form.password.trim()) errs.password = 'La contraseña es obligatoria';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const adminEmail = 'admin@farmaonline.com';
      const adminPassword = 'admin123';
      
      if (form.email.toLowerCase() === adminEmail && form.password === adminPassword) {
        const session = {
          id: 'admin',
          nombre: 'Farmacéutico Admin',
          email: adminEmail,
          rol: 'admin',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('farma_session', JSON.stringify(session));
        setLoading(false);
        navigate('/dashboard');
        return;
      }

      const users = JSON.parse(localStorage.getItem('farma_users') || '[]');
      const user = users.find(
        u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
      );

      if (user) {
        if (!user.activo) {
          setLoginError('Tu cuenta fue desactivada. Contactá al administrador.');
          setLoading(false);
          return;
        }
        const session = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('farma_session', JSON.stringify(session));
        setLoading(false);
        navigate('/dashboard');
      } else {
        setLoginError('Correo o contraseña incorrectos');
        setLoading(false);
      }
    }, 600);
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (loginError) setLoginError('');
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
        <Container component="main" maxWidth="xs">
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
              boxShadow: '0 20px 40px rgba(22, 163, 74, 0.15)'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'primary.main', textAlign: 'center' }}>
              Farma<Box component="span" sx={{ color: '#1f2937' }}>Online</Box>
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Iniciá sesión para continuar al sistema
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                autoFocus
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
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  mb: 3, 
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
                {loading ? <CircularProgress size={26} color="inherit" /> : '🚀 Iniciar Sesión'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tenés cuenta todavía?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
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
                    Crear cuenta aquí <AddCircleIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  p: 2.5, 
                  bgcolor: '#f0fdf4', 
                  borderRadius: 4, 
                  border: '1px solid',
                  borderColor: '#bbf7d0',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d', display: 'block', mb: 1, textAlign: 'center', letterSpacing: 0.5 }}>
                  ACCESO ADMINISTRADOR (PRUEBA)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <strong>Email:</strong> admin@farmaonline.com
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <strong>Clave:</strong> admin123
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
