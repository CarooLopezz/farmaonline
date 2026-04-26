import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('farma_session');
    if (!data) {
      navigate('/login');
      return;
    }
    setSession(JSON.parse(data));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('farma_session');
    navigate('/login');
  };

  if (!session) return null;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="pill-icon"></div>
            <span>Farma<em>Online</em></span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">General</div>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>

          {session.rol === 'admin' && (
            <>
              <div className="nav-label">Administración</div>
              <NavLink
                to="/dashboard/usuarios"
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">👥</span>
                Usuarios
              </NavLink>
            </>
          )}

          <div className="nav-label">Operaciones</div>
          <NavLink
            to="/dashboard/stock"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            Stock Mínimo
          </NavLink>
          <NavLink
            to="/dashboard/ventas"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">💊</span>
            Ventas
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{getInitials(session.nombre)}</div>
            <div className="user-info">
              <div className="user-name">{session.nombre}</div>
              <div className="user-role">
                {session.rol === 'admin' ? '⭐ Farmacéutico' : '👤 Empleado'}
              </div>
            </div>
          </div>
          <button
            className="nav-item"
            onClick={handleLogout}
            style={{ marginTop: '4px', color: '#ef4444' }}
          >
            <span className="nav-icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
