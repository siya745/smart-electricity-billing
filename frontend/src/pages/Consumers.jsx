// pages/Consumers.jsx — Improved consumers list

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import {
  PageHeader,
  Spinner,
  ErrorMsg,
  Badge,
  Modal,
  FormField,
  Input,
  Select,
  Button,
  Table,
  tdStyle
} from '../components/UI';

const emptyForm = {
  consumer_id: '',
  name: '',
  address: '',
  phone: '',
  connection_type: 'Residential'
};

export default function Consumers() {

  const navigate = useNavigate();

  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');

  // ================= LOAD CONSUMERS =================

  const loadConsumers = async () => {

    try {

      setLoading(true);

      const res = await api.get('/consumers');

      // FIXED HERE
      setConsumers(res.data.data || []);

      setError('');

    } catch (err) {

      console.error(err);

      setError('Failed to load consumers.');

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadConsumers();
  }, []);

  // ================= FORM HANDLERS =================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setFormError('');
  };

  const openAdd = () => {

    setForm(emptyForm);

    setEditMode(false);

    setFormError('');

    setShowModal(true);
  };

  const openEdit = (c) => {

    setForm({ ...c });

    setEditMode(true);

    setFormError('');

    setShowModal(true);
  };

  const validate = () => {

    if (!form.consumer_id)
      return 'Consumer ID is required';

    if (!form.name.trim())
      return 'Name is required';

    if (!form.phone.trim())
      return 'Phone is required';

    return '';
  };

  // ================= SAVE =================

  const handleSave = async () => {

    const err = validate();

    if (err)
      return setFormError(err);

    setSaving(true);

    try {

      if (editMode) {

        await api.put(
          `/consumers/${form.consumer_id}`,
          form
        );

      } else {

        await api.post(
          '/consumers',
          form
        );
      }

      setShowModal(false);

      loadConsumers();

    } catch (err) {

      setFormError(
        err.response?.data?.error ||
        'Failed to save'
      );

    } finally {

      setSaving(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        'Delete this consumer?'
      )
    ) return;

    try {

      await api.delete(`/consumers/${id}`);

      loadConsumers();

    } catch (err) {

      alert(
        err.response?.data?.error ||
        'Delete failed'
      );
    }
  };

  // ================= FILTER =================

  const filtered = consumers.filter(c =>

    !search ||

    c.name?.toLowerCase()
      .includes(search.toLowerCase()) ||

    String(c.consumer_id)
      .includes(search) ||

    c.phone?.includes(search)

  );

  // ================= UI =================

  return (

    <div
      style={{
        padding: '32px 36px',
        maxWidth: '1100px'
      }}
    >

      <PageHeader
        title="Consumers"
        subtitle={`${consumers.length} total consumers`}
        action={
          <Button onClick={openAdd}>
            + Add Consumer
          </Button>
        }
      />

      {/* SEARCH */}

      <div style={{ marginBottom: '16px' }}>

        <Input
          placeholder="Search by name, ID, or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />

      </div>

      {loading && <Spinner />}

      {error && <ErrorMsg message={error} />}

      {!loading && !error && (

        <Table
          headers={[
            'ID',
            'Name',
            'Phone',
            'Address',
            'Type',
            'Actions'
          ]}
        >

          {filtered.length === 0 ? (

            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                  color: '#2d4a6b',
                  padding: '40px',
                  fontSize: '13px'
                }}
              >
                No consumers found
              </td>
            </tr>

          ) : filtered.map((c) => (

            <tr
              key={c.consumer_id}
            >

              <td style={tdStyle}>
                #{c.consumer_id}
              </td>

              <td style={tdStyle}>

                <button
                  onClick={() =>
                    navigate(`/consumers/${c.consumer_id}`)
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c2d8f0',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>

              </td>

              <td style={tdStyle}>
                {c.phone}
              </td>

              <td style={tdStyle}>
                {c.address || '—'}
              </td>

              <td style={tdStyle}>
                <Badge text={c.connection_type} />
              </td>

              <td style={tdStyle}>

                <div
                  style={{
                    display: 'flex',
                    gap: '6px'
                  }}
                >

                  <Button
                    variant="ghost"
                    onClick={() => openEdit(c)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(c.consumer_id)
                    }
                  >
                    Delete
                  </Button>

                </div>

              </td>

            </tr>

          ))}

        </Table>

      )}

    </div>
  );
}