// components/Layout.jsx — Improved sidebar + main content shell
import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '▦', desc: 'Overview' },
  { to: '/consumers', label: 'Consumers', icon: '◈', desc: 'Manage users' },
  { to: '/billing', label: 'Billing', icon: '◎', desc: 'Bills & payments' },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080c14', fontFamily: '"Sora", "DM Sans", sans-serif' }}>
      <aside style={{
        width: '240px', flexShrink: 0,
        background: 'linear-gradient(180deg, #0d1422 0%, #0a1018 100%)',
        borderRight: '1px solid rgba(99,179,237,0.08)',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.4), transparent)'
        }} />
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', boxShadow: '0 0 20px rgba(59,130,246,0.3)'
            }}>⚡</div>
            <div>
              <p style={{ color: '#f0f6ff', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px', margin: 0 }}>SmartElec</p>
              <p style={{ color: '#4a6080', fontSize: '11px', marginTop: '1px', marginBottom: 0 }}>Admin Panel</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 10px' }}>
          <p style={{ color: '#2d4a6b', fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 10px 6px', margin: 0 }}>NAVIGATION</p>
          {navItems.map(({ to, label, icon, desc }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
                textDecoration: 'none', transition: 'all 0.15s ease',
                background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.08))' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 12px rgba(59,130,246,0.1)' : 'none',
              })}>
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: '16px', color: isActive ? '#60a5fa' : '#3d5a7a', width: '20px', textAlign: 'center' }}>{icon}</span>
                  <div>
                    <p style={{ color: isActive ? '#e2f0ff' : '#6b8ab0', fontSize: '13px', fontWeight: 500, margin: 0 }}>{label}</p>
                    <p style={{ color: isActive ? '#4a7aaa' : '#2d4060', fontSize: '10px', margin: 0 }}>{desc}</p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ background: 'rgba(59,130,246,0.06)', borderRadius: '8px', padding: '10px 12px', border: '1px solid rgba(59,130,246,0.1)' }}>
            <p style={{ color: '#3d6090', fontSize: '10px', margin: 0 }}>● MySQL Connected</p>
            <p style={{ color: '#2a4060', fontSize: '10px', marginTop: '2px', marginBottom: 0 }}>smartelectricity · port 3306</p>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', background: '#080c14' }}>
        <Outlet />
      </main>
    </div>
  );
}
