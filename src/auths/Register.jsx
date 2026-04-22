import { useState } from "react";

const ROLES = {
  owner: { label: "Dueño / Admin", icon: "👑", color: "#2dbe6c", dimColor: "#0e3d25" },
  seller: { label: "Vendedor", icon: "🧑‍💼", color: "#6ee7a0", dimColor: "#0a2e1a" },
};

const SUCURSALES = ["Casa Central", "Sucursal Norte", "Sucursal Sur", "Sucursal Centro"];

function validate(fields, role) {
  const e = {};
  if (!fields.nombre.trim()) e.nombre = "Requerido.";
  if (!fields.apellido.trim()) e.apellido = "Requerido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "Email inválido.";
  if (!/^\d{7,8}$/.test(fields.dni)) e.dni = "7-8 dígitos.";
  if (role === "seller" && !fields.sucursal) e.sucursal = "Seleccioná una sucursal.";
  if (fields.password.length < 8) e.password = "Mínimo 8 caracteres.";
  if (fields.password !== fields.confirm) e.confirm = "No coinciden.";
  return e;
}

function Field({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#5a8a6a", letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: "#2dbe6c", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11.5, color: "#e05555" }}>{error}</span>}
    </div>
  );
}

function StyledInput({ value, onChange, type = "text", placeholder, hasError, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        height: 44, padding: "0 13px",
        background: "#0d2218",
        border: `1.5px solid ${hasError ? "#e05555" : focused ? "#2dbe6c" : "#1a3d28"}`,
        borderRadius: 9, color: "#d4f0e0",
        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
        outline: "none", width: "100%", boxSizing: "border-box",
        boxShadow: focused ? "0 0 0 3px rgba(45,190,108,0.13)" : hasError ? "0 0 0 3px rgba(224,85,85,0.1)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}

function PasswordInput({ value, onChange, placeholder, hasError }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: 44, padding: "0 42px 0 13px",
          background: "#0d2218",
          border: `1.5px solid ${hasError ? "#e05555" : focused ? "#2dbe6c" : "#1a3d28"}`,
          borderRadius: 9, color: "#d4f0e0",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          outline: "none", width: "100%", boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(45,190,108,0.13)" : hasError ? "0 0 0 3px rgba(224,85,85,0.1)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#5a8a6a", fontSize: 15, padding: 3 }}>
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

function StrengthBar({ password }) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const colors = ["#1a3d28", "#e05555", "#f5a623", "#facc15", "#2dbe6c"];
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 5 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "#1a3d28", transition: "background 0.3s" }} />
      ))}
    </div>
  );
}

export default function FarmaOnline() {
  const [step, setStep] = useState("role");
  const [role, setRole] = useState(null);
  const [fields, setFields] = useState({ nombre: "", apellido: "", email: "", dni: "", sucursal: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);

  const set = (key) => (e) => {
    setFields(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: null }));
  };

  const handleSubmit = () => {
    const errs = validate(fields, role);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 1600);
  };

  const reset = () => {
    setStep("role"); setRole(null);
    setFields({ nombre:"", apellido:"", email:"", dni:"", sucursal:"", password:"", confirm:"" });
    setErrors({});
  };

  const roleInfo = role ? ROLES[role] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #0d2218 inset !important; -webkit-text-fill-color: #d4f0e0 !important; }
        select option { background: #0d2218; color: #d4f0e0; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: "#061510", fontFamily: "'DM Sans', sans-serif", color: "#d4f0e0" }}>

        {/* ── PANEL IZQUIERDO ── */}
        <div style={{
          width: 340, flexShrink: 0,
          background: "linear-gradient(160deg,#0a2218,#061510)",
          borderRight: "1px solid #1a3d28",
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "52px 36px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,190,108,0.1),transparent 70%)", top: -60, right: -60, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,190,108,0.06),transparent 70%)", bottom: 40, left: -30, pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,190,108,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>💊</div>
            <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: "#d4f0e0" }}>FarmaOnline</span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 34, lineHeight: 1.2, color: "#d4f0e0", marginBottom: 14 }}>
            Sistema de<br /><em style={{ fontStyle: "italic", color: "#2dbe6c" }}>gestión</em><br />de ventas
          </h1>
          <p style={{ color: "#5a8a6a", fontSize: 13, lineHeight: 1.7, marginBottom: 32 }}>
            Plataforma interna para el equipo de trabajo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {["Registro de ventas", "Control de stock", "Reportes y métricas", "Gestión por roles"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(212,240,224,0.65)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dbe6c", flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px", overflowY: "auto" }}>

          {/* PASO 1 — ROL */}
          {step === "role" && (
            <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.4s ease both" }}>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 5 }}>¿Quién sos?</h2>
              <p style={{ color: "#5a8a6a", fontSize: 13, marginBottom: 26 }}>Elegí tu rol para crear tu cuenta.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(ROLES).map(([key, r]) => (
                  <div key={key}
                    onClick={() => { setRole(key); setStep("form"); }}
                    onMouseEnter={() => setHoveredRole(key)}
                    onMouseLeave={() => setHoveredRole(null)}
                    style={{
                      background: hoveredRole === key ? "#0d2218" : "#091c12",
                      border: `1.5px solid ${hoveredRole === key ? r.color + "55" : "#1a3d28"}`,
                      borderRadius: 13, padding: "18px 22px",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                      transform: hoveredRole === key ? "translateX(5px)" : "translateX(0)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 46, height: 46, borderRadius: 11, background: r.dimColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 17, color: r.color, marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: "#5a8a6a" }}>
                        {key === "owner" ? "Acceso completo al sistema" : "Punto de venta y operaciones"}
                      </div>
                    </div>
                    <div style={{ fontSize: 17, color: r.color, opacity: hoveredRole === key ? 1 : 0.2, transition: "all 0.2s" }}>→</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2 — FORMULARIO */}
          {step === "form" && roleInfo && (
            <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.4s ease both" }}>
              <button onClick={() => { setStep("role"); setErrors({}); }}
                style={{ background: "none", border: "none", color: "#5a8a6a", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 22, padding: 0 }}>
                ← Volver
              </button>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: roleInfo.dimColor, borderRadius: 999, padding: "3px 11px", fontSize: 11, fontWeight: 700, color: roleInfo.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                {roleInfo.icon} {roleInfo.label}
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 4 }}>Crear cuenta</h2>
              <p style={{ color: "#5a8a6a", fontSize: 13, marginBottom: 22 }}>Completá tus datos para acceder al sistema.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Nombre" required error={errors.nombre}>
                    <StyledInput value={fields.nombre} onChange={set("nombre")} placeholder="Nombre" hasError={!!errors.nombre} />
                  </Field>
                  <Field label="Apellido" required error={errors.apellido}>
                    <StyledInput value={fields.apellido} onChange={set("apellido")} placeholder="Apellido" hasError={!!errors.apellido} />
                  </Field>
                </div>

                <Field label="Email" required error={errors.email}>
                  <StyledInput value={fields.email} onChange={set("email")} type="email" placeholder="correo@farmaonline.com" hasError={!!errors.email} />
                </Field>

                <Field label="DNI" required error={errors.dni}>
                  <StyledInput
                    value={fields.dni}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g,""); setFields(f=>({...f,dni:v})); if(errors.dni) setErrors(er=>({...er,dni:null})); }}
                    placeholder="30123456" hasError={!!errors.dni} maxLength={8}
                  />
                </Field>

                {role === "seller" && (
                  <Field label="Sucursal" required error={errors.sucursal}>
                    <select value={fields.sucursal} onChange={set("sucursal")}
                      style={{
                        height: 44, padding: "0 34px 0 13px",
                        background: "#0d2218",
                        border: `1.5px solid ${errors.sucursal ? "#e05555" : "#1a3d28"}`,
                        borderRadius: 9, color: fields.sucursal ? "#d4f0e0" : "#5a8a6a",
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                        outline: "none", appearance: "none", WebkitAppearance: "none", width: "100%",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%235a8a6a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
                      }}
                    >
                      <option value="">Seleccioná una sucursal</option>
                      {SUCURSALES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                )}

                <div style={{ height: 1, background: "#1a3d28" }} />

                <Field label="Contraseña" required error={errors.password}>
                  <PasswordInput value={fields.password} onChange={set("password")} placeholder="Mínimo 8 caracteres" hasError={!!errors.password} />
                  <StrengthBar password={fields.password} />
                </Field>

                <Field label="Repetir contraseña" required error={errors.confirm}>
                  <PasswordInput value={fields.confirm} onChange={set("confirm")} placeholder="Repetí tu contraseña" hasError={!!errors.confirm} />
                </Field>

                <button type="button" onClick={handleSubmit} disabled={loading}
                  style={{
                    height: 46, border: "none", borderRadius: 10,
                    background: roleInfo.color, color: "#052016",
                    fontFamily: "'DM Serif Display',serif", fontSize: 15,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: loading ? 0.7 : 1, transition: "all 0.2s", marginTop: 2,
                  }}
                >
                  {loading
                    ? <div style={{ width: 18, height: 18, border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "rgba(0,0,0,0.6)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    : `Registrarme como ${roleInfo.label}`}
                </button>
              </div>
            </div>
          )}

          {/* PASO 3 — ÉXITO */}
          {step === "success" && roleInfo && (
            <div style={{ width: "100%", maxWidth: 380, textAlign: "center", animation: "fadeUp 0.4s ease both" }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: roleInfo.dimColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 18px" }}>
                {roleInfo.icon}
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, marginBottom: 8 }}>¡Registro exitoso!</h2>
              <p style={{ color: "#5a8a6a", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                Cuenta creada para <span style={{ color: roleInfo.color }}>{fields.nombre} {fields.apellido}</span> como {roleInfo.label}.
              </p>

              <div style={{ background: "#091c12", border: "1px solid #1a3d28", borderRadius: 12, padding: "18px 20px", textAlign: "left", marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13 }}>
                  {[
                    ["Email", fields.email],
                    ["DNI", fields.dni],
                    ...(role === "seller" && fields.sucursal ? [["Sucursal", fields.sucursal]] : []),
                    ["Rol", roleInfo.label],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#5a8a6a", minWidth: 60 }}>{k}:</span>
                      <span style={{ color: k === "Rol" ? roleInfo.color : "#d4f0e0" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={reset}
                style={{ background: "#091c12", border: "1px solid #1a3d28", borderRadius: 9, padding: "10px 18px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#d4f0e0" }}>
                ← Registrar otro usuario
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
