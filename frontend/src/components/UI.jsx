// components/UI.jsx — Improved reusable components

const S = {
  card: { background: 'linear-gradient(135deg, #0d1525, #0a1220)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px' },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', padding: '9px 12px', color: '#e2eaf4', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  },
};

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, accent = 'blue' }) {
  const accents = {
    blue:   { glow: 'rgba(59,130,246,0.15)',  text: '#60a5fa',  bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.15)' },
    green:  { glow: 'rgba(16,185,129,0.15)',  text: '#34d399',  bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)' },
    yellow: { glow: 'rgba(245,158,11,0.15)',  text: '#fbbf24',  bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)' },
    purple: { glow: 'rgba(139,92,246,0.15)',  text: '#a78bfa',  bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.15)' },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div style={{
      ...S.card, padding: '20px 22px',
      boxShadow: `0 0 30px ${a.glow}`,
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 40px ${a.glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 0 30px ${a.glow}`; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#4a6a8a', fontSize: '12px', fontWeight: 500, letterSpacing: '0.3px', marginBottom: '8px', marginTop: 0 }}>{label}</p>
          <p style={{ color: '#f0f6ff', fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-1px', fontFamily: '"JetBrains Mono", monospace' }}>{value}</p>
        </div>
        <div style={{ background: a.bg, border: `1px solid ${a.border}`, borderRadius: '10px', padding: '10px', fontSize: '18px' }}>{icon}</div>
      </div>
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${a.bg}, transparent)`, marginTop: '16px', borderRadius: '2px' }} />
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
      <div>
        <h1 style={{ color: '#f0f6ff', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{title}</h1>
        {subtitle && <p style={{ color: '#4a6a8a', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ text }) {
  if (!text) return null;
  const t = text.toLowerCase();
  let bg, color, border;
  if (t === 'paid' || t === 'active') {
    bg = 'rgba(16,185,129,0.1)'; color = '#34d399'; border = 'rgba(16,185,129,0.2)';
  } else if (t === 'pending') {
    bg = 'rgba(245,158,11,0.1)'; color = '#fbbf24'; border = 'rgba(245,158,11,0.2)';
  } else if (t === 'faulty' || t === 'inactive') {
    bg = 'rgba(239,68,68,0.1)'; color = '#f87171'; border = 'rgba(239,68,68,0.2)';
  } else if (t === 'residential') {
    bg = 'rgba(59,130,246,0.1)'; color = '#60a5fa'; border = 'rgba(59,130,246,0.2)';
  } else if (t === 'commercial') {
    bg = 'rgba(139,92,246,0.1)'; color = '#a78bfa'; border = 'rgba(139,92,246,0.2)';
  } else if (t === 'industrial') {
    bg = 'rgba(251,146,60,0.1)'; color = '#fb923c'; border = 'rgba(251,146,60,0.2)';
  } else {
    bg = 'rgba(99,179,237,0.08)'; color = '#7ab8e8'; border = 'rgba(99,179,237,0.15)';
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      background: bg, color, border: `1px solid ${border}`, letterSpacing: '0.3px'
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, flexShrink: 0 }} />
      {text}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '2px solid rgba(59,130,246,0.15)',
        borderTop: '2px solid #3b82f6',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#3d5a7a', fontSize: '12px', margin: 0 }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── ErrorMsg ──────────────────────────────────────────────────────────────────
export function ErrorMsg({ message }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: '10px', padding: '12px 16px', color: '#f87171', fontSize: '13px',
      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'
    }}>
      <span>⚠</span> {message}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'linear-gradient(160deg, #0d1828, #0a1220)',
        border: '1px solid rgba(99,179,237,0.12)', borderRadius: '16px',
        width: '100%', maxWidth: '440px', margin: '16px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
        animation: 'modalIn 0.2s ease'
      }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:none; } }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 style={{ color: '#e2eaf4', fontWeight: 600, fontSize: '15px', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ color: '#3d5a7a', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '2px 6px', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = '#e2eaf4'} onMouseLeave={e => e.target.style.color = '#3d5a7a'}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────────────────────────
export function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', color: '#7a9ab8', fontSize: '12px', fontWeight: 500, marginBottom: '6px', letterSpacing: '0.2px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>{error}</p>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ className = '', style: propStyle = {}, ...props }) {
  return (
    <input
      style={{ ...S.input, ...propStyle }}
      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.4)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      {...props}
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ children, style: propStyle = {}, ...props }) {
  return (
    <select style={{ ...S.input, cursor: 'pointer', ...propStyle }} {...props}>
      {children}
    </select>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ variant = 'primary', style: propStyle = {}, children, ...props }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg, #2563eb, #1d9cf0)', color: '#fff', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 16px rgba(37,99,235,0.25)' },
    danger:  { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' },
    ghost:   { background: 'rgba(255,255,255,0.05)', color: '#9ab8d0', border: '1px solid rgba(255,255,255,0.08)' },
    success: { background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 16px rgba(5,150,105,0.2)' },
  };
  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        padding: '9px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
        ...styles[variant], ...propStyle
      }}
      onMouseEnter={e => { if (!props.disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ headers, children, emptyMessage = 'No records found' }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.08)', background: 'rgba(13,20,35,0.6)' }}>
      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {headers.map((h) => (
              <th key={h} style={{
                textAlign: 'left', color: '#3d6090', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.5px', textTransform: 'uppercase',
                padding: '12px 16px', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.02)'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', color: '#2d4a6b', padding: '40px', fontSize: '13px' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── TableRow helper style ─────────────────────────────────────────────────────
export const tdStyle = { padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'middle' };
