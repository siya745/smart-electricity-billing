// pages/Billing.jsx — Improved billing overview
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PageHeader, Spinner, ErrorMsg, Badge, Table, Button, tdStyle } from '../components/UI';

export default function Billing() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadBills = async () => {
      try { const res = await api.get('/bills'); setBills(res.data); }
      catch { setError('Failed to load bills.'); }
      finally { setLoading(false); }
    };
    loadBills();
  }, []);

  const filtered = bills.filter(b => filter === 'All' || b.payment_status === filter);
  const pendingCount = bills.filter(b => b.payment_status === 'Pending').length;
  const paidCount = bills.filter(b => b.payment_status === 'Paid').length;
  const totalRevenue = bills.filter(b => b.payment_status === 'Paid').reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <PageHeader title="Billing" subtitle="All bills across consumers" />

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '22px' }}>
        {[
          { label: 'Total Bills', value: bills.length, color: '#60a5fa' },
          { label: 'Pending', value: pendingCount, color: '#fbbf24' },
          { label: 'Collected', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#34d399' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'linear-gradient(135deg,#0d1525,#0a1220)', border: '1px solid rgba(99,179,237,0.07)', borderRadius: '12px', padding: '16px 18px' }}>
            <p style={{ color: '#3d5a7a', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{label}</p>
            <p style={{ color, fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: '"JetBrains Mono", monospace' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
        {[['All', bills.length], ['Pending', pendingCount], ['Paid', paidCount]].map(([f, count]) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s',
            background: filter === f ? 'linear-gradient(135deg,#2563eb,#1d9cf0)' : 'rgba(255,255,255,0.04)',
            color: filter === f ? '#fff' : '#4a6a8a',
            border: filter === f ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
            boxShadow: filter === f ? '0 0 12px rgba(37,99,235,0.25)' : 'none',
          }}>
            {f} <span style={{ opacity: 0.7 }}>({count})</span>
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error && <ErrorMsg message={error} />}

      {!loading && !error && (
        <Table headers={['Bill ID', 'Consumer', 'Month', 'Units', 'Amount', 'Due Date', 'Status', '']}>
          {filtered.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', color: '#2d4a6b', padding: '40px' }}>No bills found</td></tr>
          ) : filtered.map((b) => (
            <tr key={b.bill_id} style={{ transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={tdStyle}><span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '12px' }}>#{b.bill_id}</span></td>
              <td style={tdStyle}>
                <button onClick={() => navigate(`/consumers/${b.consumer_id}`)}
                  style={{ background: 'none', border: 'none', color: '#c2d8f0', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                  onMouseEnter={e => e.target.style.color = '#60a5fa'} onMouseLeave={e => e.target.style.color = '#c2d8f0'}>
                  {b.consumer_name}
                </button>
              </td>
              <td style={tdStyle}><span style={{ color: '#6a8aaa', fontSize: '13px' }}>{b.month}</span></td>
              <td style={tdStyle}><span style={{ color: '#5a7a9a', fontSize: '13px' }}>{b.total_units} kWh</span></td>
              <td style={tdStyle}><span style={{ color: '#c2d8f0', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', fontSize: '13px' }}>₹{Number(b.amount).toLocaleString('en-IN')}</span></td>
              <td style={tdStyle}><span style={{ color: '#4a6a8a', fontSize: '12px' }}>{b.due_date?.split('T')[0]}</span></td>
              <td style={tdStyle}><Badge text={b.payment_status} /></td>
              <td style={tdStyle}>
                <Button variant="ghost" style={{ padding: '5px 12px', fontSize: '12px' }}
                  onClick={() => navigate(`/consumers/${b.consumer_id}?tab=payments`)}>View</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
