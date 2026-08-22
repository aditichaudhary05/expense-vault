import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--border-color)',
          borderTopColor: '#06b6d4',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await signup(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputLabel = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.4rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'var(--bg-primary)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="ExpenseVault" style={{ width: '42px', height: '42px', borderRadius: '12px' }} />
        </div>

        {/* Card */}
        <div className="glass-panel" style={{ padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem', textAlign: 'center' }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.75rem' }}>
            Start taking control of your expenses today.
          </p>

          {error && (
            <div style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--color-danger)',
              fontSize: '0.82rem',
              fontWeight: '500',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={inputLabel}>Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={submitting}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={inputLabel}>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={inputLabel}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={submitting}
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={inputLabel}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={submitting}
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex'
                  }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginTop: '1.25rem'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#06b6d4', fontWeight: '600', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
