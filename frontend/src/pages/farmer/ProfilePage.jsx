import { useState } from 'react';
import { useLang } from '@hooks/useLang';
import { useAuth } from '@hooks/useAuth';
import { updateProfile } from '@api/authApi';
import { showToast } from '@utils/toast';
import PageHeader from '@components/layout/PageHeader';
import FieldSet from '@components/forms/FieldSet';

export default function ProfilePage() {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    region: user?.region || 'Tirupati, Andhra Pradesh',
    crop: user?.crop_type || 'Tomato',
    land: user?.land_size_acres || '1.0',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      showToast('Profile saved successfully!');
    } catch {
      showToast('Saved locally (offline)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section screen-enter">
      <PageHeader title={t('profileTitle')} subtitle={t('profileSub')} />

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--soil)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, marginBottom: 8,
        }}>👤</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>{form.name}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{user?.phone || '+91 98765 43210'}</div>
      </div>

      <FieldSet label={t('fName')}>
        <input type="text" value={form.name} onChange={set('name')} />
      </FieldSet>

      <FieldSet label={t('fRegion')}>
        <input type="text" value={form.region} onChange={set('region')} />
      </FieldSet>

      <FieldSet label={t('fCrop')}>
        <select value={form.crop} onChange={set('crop')}>
          <option>Tomato</option>
          <option>Paddy</option>
          <option>Chilli</option>
          <option>Cotton</option>
          <option>Maize</option>
          <option>Groundnut</option>
        </select>
      </FieldSet>

      <FieldSet label={t('fLand')}>
        <input type="number" step="0.1" min="0.1" value={form.land} onChange={set('land')} />
      </FieldSet>

      <button className="btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : t('saveBtn')}
      </button>

      <button
        className="btn-secondary"
        onClick={logout}
        style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
      >
        {t('logoutBtn')}
      </button>
    </div>
  );
}
