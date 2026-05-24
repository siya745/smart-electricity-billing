// pages/Dashboard.jsx — Improved dashboard
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { StatCard, Spinner, ErrorMsg } from '../components/UI';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch {
        setError('Failed to load dashboard stats. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</div>
          <h1 style={{ color: '#f0f6ff', fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Dashboard</h1>
        </div>
        <p style={{ color: '#3d5a7a', fontSize: '13px', margin: 0 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}

      {stats && (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <StatCard label="Total Consumers" value={stats.totalConsumers} icon="◈" accent="blue" />
            <StatCard label="Total Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} icon="₹" accent="green" />
            <StatCard label="Pending Bills" value={stats.pendingBills} icon="⏳" accent="yellow" />
            <StatCard label="Total Meters" value={stats.totalMeters} icon="⚡" accent="purple" />
          </div>

          {/* Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Quick Actions */}
            <div style={{ background: 'linear-gradient(135deg,#0d1525,#0a1220)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px' }}>🗂</span>
                <h3 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>Quick Actions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: '◈', text: 'Go to Consumers to add or manage consumers', highlight: 'Consumers' },
                  { icon: '◎', text: 'Go to Billing to view and pay pending bills', highlight: 'Billing' },
                  { icon: '→', text: 'Click any consumer name to view their full details', highlight: null },
                ].map(({ icon, text, highlight }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#3b82f6', fontSize: '13px', width: '16px' }}>{icon}</span>
                    <p style={{ color: '#4a6a8a', fontSize: '12px', margin: 0 }}>
                      {highlight ? (
                        <>{text.split(highlight)[0]}<span style={{ color: '#60a5fa', fontWeight: 600 }}>{highlight}</span>{text.split(highlight)[1]}</>
                      ) : text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div style={{ background: 'linear-gradient(135deg,#0d1525,#0a1220)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px' }}>🖥</span>
                <h3 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>System Info</h3>
              </div>
              {[
                { label: 'Database', value: 'MySQL · smartelectricity', ok: true },
                { label: 'Backend', value: 'Node.js · Port 5000', ok: true },
                { label: 'Frontend', value: 'React + Vite · Port 3000', ok: true },
              ].map(({ label, value, ok }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#3d5a7a', fontSize: '12px' }}>{label}</span>
                  <span style={{ color: ok ? '#34d399' : '#f87171', fontSize: '12px', fontFamily: '"JetBrains Mono", monospace', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ok ? '#34d399' : '#f87171', display: 'inline-block' }} />
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
