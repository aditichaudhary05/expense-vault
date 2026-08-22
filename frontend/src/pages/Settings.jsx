import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SpotlightCard from '../components/SpotlightCard';
import { User, Wallet, Bell, Save, Check, Loader2, LogOut, Camera } from 'lucide-react';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Settings = ({ onMobileMenuToggle }) => {
  const { user: authUser, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const [settings, setSettings] = useState({ monthlyBudget: '30000', budgetAlerts: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [saved, setSaved] = useState(false);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsRes] = await Promise.all([
          api.get('/auth/settings')
        ]);
        if (settingsRes.success) {
          setSettings({
            monthlyBudget: String(settingsRes.data.monthlyBudget),
            budgetAlerts: settingsRes.data.budgetAlerts
          });
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (authUser) {
      setProfile({ name: authUser.name, email: authUser.email });
      if (authUser.avatar_url) setAvatarPreview(authUser.avatar_url);
    }
  }, [authUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be under 2MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setAvatarFile(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const [profileRes, settingsRes] = await Promise.all([
        api.put('/auth/profile', { name: profile.name, email: profile.email, avatar_url: avatarFile }),
        api.put('/auth/settings', {
          monthlyBudget: parseFloat(settings.monthlyBudget) || 30000,
          budgetAlerts: settings.budgetAlerts
        })
      ]);

      if (profileRes.success && setUser) {
        setUser(profileRes.data);
      }

      setSaved(true);
      addToast('Settings saved successfully!');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header
          title="Settings"
          subtitle="Manage your profile and application preferences"
          onMobileMenuToggle={onMobileMenuToggle}
        />
        <div className="loading-center">
          <Loader2 size={24} className="animate-spin text-turquoise" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Settings"
        subtitle="Manage your profile and application preferences"
        onMobileMenuToggle={onMobileMenuToggle}
      />

      <div className="max-w-md">
        <form onSubmit={handleSave} className="settings-form">
          {/* Profile Section */}
          <SpotlightCard>
            <div className="settings-icon-header">
              <User size={20} color="#06b6d4" />
              <h3 className="section-title">Profile Details</h3>
            </div>

            <div className="settings-grid">
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="avatar-upload"
                  style={avatarPreview ? { background: 'none' } : undefined}
                  title="Change avatar"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full" style={{ objectFit: 'cover' }} />
                  ) : (
                    <User size={32} color="rgba(6, 182, 212, 0.5)" />
                  )}
                  <div className="avatar-overlay">
                    <Camera size={13} color="#ffffff" />
                  </div>
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-2 gap-2xl">
                <div>
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Budget & Currency Preferences */}
          <SpotlightCard>
            <div className="settings-icon-header">
              <Wallet size={20} color="#a855f7" />
              <h3 className="section-title">Financial Preferences</h3>
            </div>

            <div className="grid gap-2xl">
              <div>
                <label className="form-label">
                  Monthly Budget Limit (₹)
                </label>
                <input
                  type="number"
                  value={settings.monthlyBudget}
                  onChange={(e) => setSettings({ ...settings, monthlyBudget: e.target.value })}
                  className="form-input font-number"
                />
              </div>
            </div>
          </SpotlightCard>

          {/* Notifications */}
          <SpotlightCard>
            <div className="settings-icon-header">
              <Bell size={20} color="#ec4899" />
              <h3 className="section-title">Notifications</h3>
            </div>

            <div className="settings-row">
              <div>
                <h4 className="font-semibold text-white" style={{ fontSize: '0.9rem' }}>Budget Exceeded Alerts</h4>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Notify when monthly spending exceeds 90% of budget</p>
              </div>
              <input
                type="checkbox"
                checked={settings.budgetAlerts}
                onChange={(e) => setSettings({ ...settings, budgetAlerts: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }}
              />
            </div>
          </SpotlightCard>

          {/* Logout */}
          <SpotlightCard>
            <div className="settings-row">
              <div>
                <h4 className="font-semibold text-white" style={{ fontSize: '0.95rem' }}>Sign Out</h4>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Log out of your ExpenseVault account</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="btn-danger"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </SpotlightCard>

          {/* Save Button */}
          <div className="save-row">
            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '0.75rem 1.75rem' }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : <Save size={18} />}
              <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Settings;
