import { useState, useEffect, useCallback } from 'react';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ nombre: '', dni: '', email: '', rol: 'empleado' });
  const [addErrors, setAddErrors] = useState({});
  const [generatedPass, setGeneratedPass] = useState(null);

  const session = JSON.parse(localStorage.getItem('farma_session') || '{}');
  const isAdmin = session.rol === 'admin';

  const loadUsers = useCallback(() => {
    const data = JSON.parse(localStorage.getItem('farma_users') || '[]');
    setUsers(data);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.dni && u.dni.includes(q))
    );
  });

  /* ---- AGREGAR USUARIO ---- */
  const handleOpenAdd = () => {
    setAddForm({ nombre: '', dni: '', email: '', rol: 'empleado' });
    setAddErrors({});
    setGeneratedPass(null);
    setShowAddModal(true);
  };

  const validateAdd = () => {
    const errs = {};
    if (!addForm.nombre.trim()) errs.nombre = 'Obligatorio';
    if (!addForm.dni.trim()) errs.dni = 'Obligatorio';
    else if (!/^\d{7,8}$/.test(addForm.dni.trim())) errs.dni = 'DNI inválido (7-8 dígitos)';
    if (!addForm.email.trim()) errs.email = 'Obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) errs.email = 'Email inválido';
    else {
      const exists = users.find(u => u.email.toLowerCase() === addForm.email.toLowerCase());
      if (exists) errs.email = 'Este email ya está registrado';
    }
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddUser = () => {
    if (!validateAdd()) return;
    const password = generatePassword();
    const newUser = {
      id: Date.now().toString(),
      nombre: addForm.nombre.trim(),
      dni: addForm.dni.trim(),
      email: addForm.email.trim().toLowerCase(),
      password,
      rol: addForm.rol,
      activo: true,
      fechaRegistro: new Date().toISOString()
    };
    const updated = [...users, newUser];
    localStorage.setItem('farma_users', JSON.stringify(updated));
    setUsers(updated);
    setGeneratedPass(password);
    showToast(`${newUser.nombre} fue agregado correctamente`);
  };

  const handleCloseAdd = () => {
    setShowAddModal(false);
    setGeneratedPass(null);
  };

  /* ---- EDITAR ---- */
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      nombre: user.nombre,
      dni: user.dni || '',
      email: user.email,
      rol: user.rol,
      activo: user.activo
    });
  };

  const handleSaveEdit = () => {
    const updated = users.map(u =>
      u.id === editingUser.id ? { ...u, ...editForm } : u
    );
    localStorage.setItem('farma_users', JSON.stringify(updated));
    setUsers(updated);
    setEditingUser(null);
    showToast(`Perfil de ${editForm.nombre} actualizado`);
  };

  /* ---- ELIMINAR ---- */
  const handleDelete = (userId) => {
    const user = users.find(u => u.id === userId);
    const updated = users.filter(u => u.id !== userId);
    localStorage.setItem('farma_users', JSON.stringify(updated));
    setUsers(updated);
    setDeleteConfirm(null);
    showToast(`${user?.nombre} fue eliminado`, 'error');
  };

  /* ---- RESTABLECER CONTRASEÑA ---- */
  const handleResetPassword = (userId) => {
    const newPass = generatePassword();
    const updated = users.map(u =>
      u.id === userId ? { ...u, password: newPass } : u
    );
    localStorage.setItem('farma_users', JSON.stringify(updated));
    setUsers(updated);
    const user = users.find(u => u.id === userId);
    alert(`Nueva contraseña para ${user.nombre}:\n\n${newPass}\n\n(En producción se enviaría por correo)`);
    showToast(`Contraseña de ${user.nombre} restablecida`);
  };

  return (
    <>
      {/* ---------- HEADER ---------- */}
      <div className="usuarios-header">
        <h1>Usuarios</h1>
        {isAdmin && (
          <button className="btn-add-user" onClick={handleOpenAdd}>
            + Agregar usuario
          </button>
        )}
      </div>

      {/* ---------- BODY ---------- */}
      <div className="usuarios-body">
        {/* Search */}
        {users.length > 0 && (
          <div className="usuarios-search-bar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre, DNI o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="usuarios-table-wrap">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>{search ? 'Sin resultados' : 'No hay usuarios registrados'}</h3>
              <p>
                {search
                  ? 'Probá con otro término de búsqueda'
                  : 'Usá el botón "+ Agregar usuario" para crear uno'}
              </p>
            </div>
          ) : (
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>DNI</th>
                  <th>EMAIL</th>
                  <th>ROL</th>
                  <th>ESTADO</th>
                  {isAdmin && <th>ACCIONES</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="td-nombre">{user.nombre}</td>
                    <td className="td-dni">{user.dni || '—'}</td>
                    <td className="td-email">{user.email}</td>
                    <td>
                      <span className={`rol-badge ${user.rol}`}>
                        {user.rol === 'admin' ? 'ADMINISTRADOR' : 'EMPLEADO'}
                      </span>
                    </td>
                    <td>
                      <span className={`estado-badge ${user.activo ? 'activo' : 'inactivo'}`}>
                        {user.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="acciones-cell">
                          <button className="btn-accion editar" onClick={() => handleEdit(user)}>
                            Editar
                          </button>
                          <button className="btn-accion eliminar" onClick={() => setDeleteConfirm(user)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ========== MODAL: AGREGAR USUARIO ========== */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseAdd}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            {!generatedPass ? (
              <>
                <h2>Agregar usuario</h2>
                <p style={{ marginBottom: '24px' }}>Completá los datos del nuevo empleado</p>

                <div className="edit-modal-body">
                  <div className="form-group">
                    <label>Nombre completo</label>
                    <input
                      type="text"
                      className={`form-input${addErrors.nombre ? ' error' : ''}`}
                      placeholder="Ej: Juan García"
                      value={addForm.nombre}
                      onChange={e => {
                        setAddForm(p => ({ ...p, nombre: e.target.value }));
                        if (addErrors.nombre) setAddErrors(p => ({ ...p, nombre: undefined }));
                      }}
                    />
                    {addErrors.nombre && <div className="form-error">⚠ {addErrors.nombre}</div>}
                  </div>

                  <div className="form-group">
                    <label>DNI</label>
                    <input
                      type="text"
                      className={`form-input${addErrors.dni ? ' error' : ''}`}
                      placeholder="Ej: 40919179"
                      value={addForm.dni}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                        setAddForm(p => ({ ...p, dni: val }));
                        if (addErrors.dni) setAddErrors(p => ({ ...p, dni: undefined }));
                      }}
                    />
                    {addErrors.dni && <div className="form-error">⚠ {addErrors.dni}</div>}
                  </div>

                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      className={`form-input${addErrors.email ? ' error' : ''}`}
                      placeholder="Ej: juan@email.com"
                      value={addForm.email}
                      onChange={e => {
                        setAddForm(p => ({ ...p, email: e.target.value }));
                        if (addErrors.email) setAddErrors(p => ({ ...p, email: undefined }));
                      }}
                    />
                    {addErrors.email && <div className="form-error">⚠ {addErrors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label>Rol</label>
                    <select
                      value={addForm.rol}
                      onChange={e => setAddForm(p => ({ ...p, rol: e.target.value }))}
                    >
                      <option value="empleado">Empleado</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: 'var(--gray-600)',
                  display: 'flex',
                  gap: '8px',
                  lineHeight: '1.5'
                }}>
                  <span>🔐</span>
                  <span>La contraseña se genera automáticamente</span>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={handleCloseAdd}>Cancelar</button>
                  <button className="btn btn-primary" onClick={handleAddUser}>
                    + Agregar usuario
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon success">✅</div>
                <h2>¡Usuario creado!</h2>
                <p>Esta es la contraseña generada. <strong>Guardala o enviala al empleado.</strong></p>

                <div className="password-display">
                  <div className="label">Contraseña generada</div>
                  <div className="password-value">{generatedPass}</div>
                </div>

                <div className="copy-hint">
                  💡 En producción esta contraseña se enviaría por correo electrónico
                </div>

                <button className="btn btn-primary" onClick={handleCloseAdd} style={{ width: '100%' }}>
                  Entendido
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========== MODAL: EDITAR ========== */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Editar perfil</h2>
            <p style={{ marginBottom: '24px' }}>Modificá los datos de <strong>{editingUser.nombre}</strong></p>

            <div className="edit-modal-body">
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.nombre}
                  onChange={e => setEditForm(p => ({ ...p, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>DNI</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.dni}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setEditForm(p => ({ ...p, dni: val }));
                  }}
                />
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  value={editForm.email}
                  onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={editForm.rol}
                  onChange={e => setEditForm(p => ({ ...p, rol: e.target.value }))}
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <div className="toggle-wrapper">
                  <label style={{ marginBottom: 0 }}>Cuenta activa</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={editForm.activo}
                      onChange={e => setEditForm(p => ({ ...p, activo: e.target.checked }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '4px' }}
                onClick={() => handleResetPassword(editingUser.id)}
              >
                🔑 Restablecer contraseña
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                💾 Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL: CONFIRMAR ELIMINAR ========== */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}>
              ⚠️
            </div>
            <h2>¿Eliminar usuario?</h2>
            <p>
              Estás por eliminar a <strong>{deleteConfirm.nombre}</strong> ({deleteConfirm.email}).
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== TOAST ========== */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
            <span className="toast-msg">{toast.msg}</span>
          </div>
        </div>
      )}
    </>
  );
}
