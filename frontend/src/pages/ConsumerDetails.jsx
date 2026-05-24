// pages/ConsumerDetails.jsx — Improved detailed view for a single consumer
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Spinner, ErrorMsg, Badge, Modal, FormField, Input, Select, Button, Table, tdStyle } from '../components/UI';

export default function ConsumerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consumer, setConsumer] = useState(null);
  const [meters, setMeters] = useState([]);
  const [bills, setBills] = useState([]);
  const [readings, setReadings] = useState({});
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('meters');
  const [meterModal, setMeterModal] = useState(false);
  const [readingModal, setReadingModal] = useState(false);
  const [billModal, setBillModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState('');
  const [meterForm, setMeterForm] = useState({ meter_id: '', installation_date: '', status: 'Active' });
  const [readingForm, setReadingForm] = useState({ reading_id: '', meter_id: '', reading_date: '', units_consumed: '' });
  const [billForm, setBillForm] = useState({ bill_id: '', month: '', total_units: '', amount: '', due_date: '', payment_status: 'Pending' });
  const [paymentForm, setPaymentForm] = useState({ payment_id: '', bill_id: '', payment_date: '', payment_mode: 'Online', amount_paid: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cRes, mRes, bRes] = await Promise.all([api.get(`/consumers/${id}`), api.get(`/meters/by-consumer/${id}`), api.get(`/bills/by-consumer/${id}`)]);
      setConsumer(cRes.data); setMeters(mRes.data); setBills(bRes.data);
      const readingMap = {};
      for (const m of mRes.data) { const r = await api.get(`/readings/by-meter/${m.meter_id}`); readingMap[m.meter_id] = r.data; }
      setReadings(readingMap);
      const paymentMap = {};
      for (const b of bRes.data) { const p = await api.get(`/payments/by-bill/${b.bill_id}`); paymentMap[b.bill_id] = p.data; }
      setPayments(paymentMap);
    } catch { setError('Failed to load consumer details.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, [id]);

  const addMeter = async () => {
    if (!meterForm.meter_id) return setFormError('Meter ID is required');
    setSaving(true);
    try { await api.post('/meters', { ...meterForm, consumer_id: id }); setMeterModal(false); setMeterForm({ meter_id: '', installation_date: '', status: 'Active' }); loadData(); }
    catch (err) { setFormError(err.response?.data?.error || 'Failed to add meter'); }
    finally { setSaving(false); }
  };
  const addReading = async () => {
    if (!readingForm.reading_id || !readingForm.meter_id || !readingForm.units_consumed) return setFormError('All fields are required');
    setSaving(true);
    try { await api.post('/readings', readingForm); setReadingModal(false); setReadingForm({ reading_id: '', meter_id: '', reading_date: '', units_consumed: '' }); loadData(); }
    catch (err) { setFormError(err.response?.data?.error || 'Failed to add reading'); }
    finally { setSaving(false); }
  };
  const addBill = async () => {
    if (!billForm.bill_id || !billForm.month || !billForm.amount || !billForm.due_date) return setFormError('bill_id, month, amount and due_date are required');
    setSaving(true);
    try { await api.post('/bills', { ...billForm, consumer_id: id }); setBillModal(false); setBillForm({ bill_id: '', month: '', total_units: '', amount: '', due_date: '', payment_status: 'Pending' }); loadData(); }
    catch (err) { setFormError(err.response?.data?.error || 'Failed to add bill'); }
    finally { setSaving(false); }
  };
  const addPayment = async () => {
    if (!paymentForm.payment_id || !paymentForm.amount_paid) return setFormError('payment_id and amount_paid are required');
    setSaving(true);
    try { await api.post('/payments', { ...paymentForm, bill_id: selectedBillId }); setPaymentModal(false); setPaymentForm({ payment_id: '', bill_id: '', payment_date: '', payment_mode: 'Online', amount_paid: '' }); loadData(); }
    catch (err) { setFormError(err.response?.data?.error || 'Failed to record payment'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { key: 'meters', label: 'Meters', count: meters.length },
    { key: 'readings', label: 'Readings', count: Object.values(readings).flat().length },
    { key: 'bills', label: 'Bills', count: bills.length },
    { key: 'payments', label: 'Payments', count: Object.values(payments).flat().length },
  ];

  if (loading) return <div style={{ padding: '32px' }}><Spinner /></div>;
  if (error) return <div style={{ padding: '32px' }}><ErrorMsg message={error} /></div>;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      {/* Back */}
      <button onClick={() => navigate('/consumers')}
        style={{ background: 'none', border: 'none', color: '#3d6090', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, marginBottom: '20px', fontFamily: 'inherit', transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={e => e.currentTarget.style.color = '#3d6090'}>
        ← Back to Consumers
      </button>

      {/* Consumer Card */}
      {consumer && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(6,182,212,0.04))',
          border: '1px solid rgba(59,130,246,0.15)', borderRadius: '16px', padding: '22px 26px', marginBottom: '24px',
          boxShadow: '0 0 30px rgba(59,130,246,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>◈</div>
                <h1 style={{ color: '#f0f6ff', fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>{consumer.name}</h1>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ color: '#4a6a8a', fontSize: '13px' }}>ID: <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>#{consumer.consumer_id}</span></span>
                <span style={{ color: '#4a6a8a', fontSize: '13px' }}>📞 {consumer.phone}</span>
                {consumer.address && <span style={{ color: '#4a6a8a', fontSize: '13px' }}>📍 {consumer.address}</span>}
              </div>
            </div>
            <Badge text={consumer.connection_type} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
        {tabs.map(({ key, label, count }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            background: 'none', border: 'none', padding: '10px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
            color: activeTab === key ? '#60a5fa' : '#4a6a8a',
            borderBottom: activeTab === key ? '2px solid #3b82f6' : '2px solid transparent',
            marginBottom: '-1px',
          }}>
            {label}
            <span style={{ marginLeft: '6px', background: activeTab === key ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)', color: activeTab === key ? '#60a5fa' : '#3d5a7a', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontFamily: '"JetBrains Mono", monospace' }}>{count}</span>
          </button>
        ))}
      </div>

      {/* ── METERS TAB ── */}
      {activeTab === 'meters' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>Meters</h2>
            <Button onClick={() => { setFormError(''); setMeterModal(true); }}>+ Add Meter</Button>
          </div>
          <Table headers={['Meter ID', 'Installation Date', 'Status']}>
            {meters.length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', color: '#2d4a6b', padding: '40px' }}>No meters registered</td></tr>
              : meters.map((m) => (
              <tr key={m.meter_id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tdStyle}><span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '12px' }}>#{m.meter_id}</span></td>
                <td style={tdStyle}><span style={{ color: '#6a8aaa', fontSize: '13px' }}>{m.installation_date?.split('T')[0] || '—'}</span></td>
                <td style={tdStyle}><Badge text={m.status} /></td>
              </tr>
            ))}
          </Table>
        </section>
      )}

      {/* ── READINGS TAB ── */}
      {activeTab === 'readings' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>Meter Readings</h2>
            <Button onClick={() => { setFormError(''); setReadingModal(true); }}>+ Add Reading</Button>
          </div>
          {meters.map((m) => (
            <div key={m.meter_id} style={{ marginBottom: '20px' }}>
              <p style={{ color: '#3d5a7a', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>Meter <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>#{m.meter_id}</span></p>
              <Table headers={['Reading ID', 'Date', 'Units Consumed']}>
                {(readings[m.meter_id] || []).length === 0 ? <tr><td colSpan={3} style={{ textAlign: 'center', color: '#2d4a6b', padding: '24px' }}>No readings yet</td></tr>
                  : (readings[m.meter_id] || []).map((r) => (
                  <tr key={r.reading_id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}><span style={{ color: '#5a7a9a', fontFamily: 'monospace', fontSize: '12px' }}>{r.reading_id}</span></td>
                    <td style={tdStyle}><span style={{ color: '#6a8aaa', fontSize: '13px' }}>{r.reading_date?.split('T')[0]}</span></td>
                    <td style={tdStyle}><span style={{ color: '#34d399', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>{r.units_consumed} kWh</span></td>
                  </tr>
                ))}
              </Table>
            </div>
          ))}
        </section>
      )}

      {/* ── BILLS TAB ── */}
      {activeTab === 'bills' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>Bills</h2>
            <Button onClick={() => { setFormError(''); setBillModal(true); }}>+ Add Bill</Button>
          </div>
          <Table headers={['Bill ID', 'Month', 'Units', 'Amount', 'Due Date', 'Status']}>
            {bills.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: '#2d4a6b', padding: '40px' }}>No bills yet</td></tr>
              : bills.map((b) => (
              <tr key={b.bill_id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tdStyle}><span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '12px' }}>#{b.bill_id}</span></td>
                <td style={tdStyle}><span style={{ color: '#6a8aaa', fontSize: '13px' }}>{b.month}</span></td>
                <td style={tdStyle}><span style={{ color: '#5a7a9a', fontSize: '13px' }}>{b.total_units}</span></td>
                <td style={tdStyle}><span style={{ color: '#c2d8f0', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>₹{Number(b.amount).toLocaleString('en-IN')}</span></td>
                <td style={tdStyle}><span style={{ color: '#4a6a8a', fontSize: '12px' }}>{b.due_date?.split('T')[0]}</span></td>
                <td style={tdStyle}><Badge text={b.payment_status} /></td>
              </tr>
            ))}
          </Table>
        </section>
      )}

      {/* ── PAYMENTS TAB ── */}
      {activeTab === 'payments' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#c2d8f0', fontWeight: 600, fontSize: '14px', margin: 0 }}>Payments</h2>
            <Button variant="success" onClick={() => { setFormError(''); setPaymentModal(true); }}>+ Record Payment</Button>
          </div>
          {bills.map((b) => (payments[b.bill_id] || []).length > 0 && (
            <div key={b.bill_id} style={{ marginBottom: '20px' }}>
              <p style={{ color: '#3d5a7a', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
                Bill <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>#{b.bill_id}</span> · {b.month}
              </p>
              <Table headers={['Payment ID', 'Date', 'Mode', 'Amount Paid']}>
                {payments[b.bill_id].map((p) => (
                  <tr key={p.payment_id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}><span style={{ color: '#5a7a9a', fontFamily: 'monospace', fontSize: '12px' }}>{p.payment_id}</span></td>
                    <td style={tdStyle}><span style={{ color: '#6a8aaa', fontSize: '13px' }}>{p.payment_date?.split('T')[0]}</span></td>
                    <td style={tdStyle}><Badge text={p.payment_mode} /></td>
                    <td style={tdStyle}><span style={{ color: '#34d399', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>₹{Number(p.amount_paid).toLocaleString('en-IN')}</span></td>
                  </tr>
                ))}
              </Table>
            </div>
          ))}
          {Object.values(payments).every(p => p.length === 0) && (
            <p style={{ color: '#2d4a6b', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>No payments recorded yet.</p>
          )}
        </section>
      )}

      {/* ── METER MODAL ── */}
      {meterModal && (
        <Modal title="Add Meter" onClose={() => setMeterModal(false)}>
          {formError && <ErrorMsg message={formError} />}
          <FormField label="Meter ID"><Input type="number" value={meterForm.meter_id} onChange={e => setMeterForm({...meterForm, meter_id: e.target.value})} placeholder="e.g. 5001" /></FormField>
          <FormField label="Installation Date"><Input type="date" value={meterForm.installation_date} onChange={e => setMeterForm({...meterForm, installation_date: e.target.value})} /></FormField>
          <FormField label="Status"><Select value={meterForm.status} onChange={e => setMeterForm({...meterForm, status: e.target.value})}><option>Active</option><option>Inactive</option><option>Faulty</option></Select></FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={() => setMeterModal(false)}>Cancel</Button>
            <Button onClick={addMeter} disabled={saving}>{saving ? 'Adding…' : 'Add Meter'}</Button>
          </div>
        </Modal>
      )}

      {/* ── READING MODAL ── */}
      {readingModal && (
        <Modal title="Add Reading" onClose={() => setReadingModal(false)}>
          {formError && <ErrorMsg message={formError} />}
          <FormField label="Reading ID"><Input type="number" value={readingForm.reading_id} onChange={e => setReadingForm({...readingForm, reading_id: e.target.value})} placeholder="Unique ID" /></FormField>
          <FormField label="Meter"><Select value={readingForm.meter_id} onChange={e => setReadingForm({...readingForm, meter_id: e.target.value})}><option value="">-- Select Meter --</option>{meters.map(m => <option key={m.meter_id} value={m.meter_id}>#{m.meter_id}</option>)}</Select></FormField>
          <FormField label="Reading Date"><Input type="date" value={readingForm.reading_date} onChange={e => setReadingForm({...readingForm, reading_date: e.target.value})} /></FormField>
          <FormField label="Units Consumed (kWh)"><Input type="number" value={readingForm.units_consumed} onChange={e => setReadingForm({...readingForm, units_consumed: e.target.value})} placeholder="e.g. 200" /></FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={() => setReadingModal(false)}>Cancel</Button>
            <Button onClick={addReading} disabled={saving}>{saving ? 'Adding…' : 'Add Reading'}</Button>
          </div>
        </Modal>
      )}

      {/* ── BILL MODAL ── */}
      {billModal && (
        <Modal title="Create Bill" onClose={() => setBillModal(false)}>
          {formError && <ErrorMsg message={formError} />}
          <FormField label="Bill ID"><Input type="number" value={billForm.bill_id} onChange={e => setBillForm({...billForm, bill_id: e.target.value})} placeholder="Unique Bill ID" /></FormField>
          <FormField label="Month"><Input value={billForm.month} onChange={e => setBillForm({...billForm, month: e.target.value})} placeholder="e.g. April 2025" /></FormField>
          <FormField label="Total Units"><Input type="number" value={billForm.total_units} onChange={e => setBillForm({...billForm, total_units: e.target.value})} placeholder="e.g. 350" /></FormField>
          <FormField label="Amount (₹)"><Input type="number" step="0.01" value={billForm.amount} onChange={e => setBillForm({...billForm, amount: e.target.value})} placeholder="e.g. 1750.00" /></FormField>
          <FormField label="Due Date"><Input type="date" value={billForm.due_date} onChange={e => setBillForm({...billForm, due_date: e.target.value})} /></FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={() => setBillModal(false)}>Cancel</Button>
            <Button onClick={addBill} disabled={saving}>{saving ? 'Creating…' : 'Create Bill'}</Button>
          </div>
        </Modal>
      )}

      {/* ── PAYMENT MODAL ── */}
      {paymentModal && (
        <Modal title="Record Payment" onClose={() => setPaymentModal(false)}>
          {formError && <ErrorMsg message={formError} />}
          <FormField label="Payment ID"><Input type="number" value={paymentForm.payment_id} onChange={e => setPaymentForm({...paymentForm, payment_id: e.target.value})} placeholder="Unique Payment ID" /></FormField>
          <FormField label="Select Bill"><Select value={selectedBillId} onChange={e => setSelectedBillId(e.target.value)}><option value="">-- Select Bill --</option>{bills.filter(b => b.payment_status !== 'Paid').map(b => <option key={b.bill_id} value={b.bill_id}>#{b.bill_id} · {b.month} · ₹{b.amount}</option>)}</Select></FormField>
          <FormField label="Payment Date"><Input type="date" value={paymentForm.payment_date} onChange={e => setPaymentForm({...paymentForm, payment_date: e.target.value})} /></FormField>
          <FormField label="Payment Mode"><Select value={paymentForm.payment_mode} onChange={e => setPaymentForm({...paymentForm, payment_mode: e.target.value})}><option>Online</option><option>Cash</option><option>UPI</option><option>Cheque</option><option>Card</option></Select></FormField>
          <FormField label="Amount Paid (₹)"><Input type="number" step="0.01" value={paymentForm.amount_paid} onChange={e => setPaymentForm({...paymentForm, amount_paid: e.target.value})} placeholder="e.g. 1750.00" /></FormField>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button variant="ghost" onClick={() => setPaymentModal(false)}>Cancel</Button>
            <Button variant="success" onClick={addPayment} disabled={saving}>{saving ? 'Recording…' : 'Record Payment'}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
