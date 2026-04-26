import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './auths/Login';
import Register from './auths/Register';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './views/Dashboard/page';
import UsuariosPage from './views/Usuarios/page';
import VentasPage from './views/Ventas/page';
import StockPage from './views/Stock/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="stock" element={<StockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
