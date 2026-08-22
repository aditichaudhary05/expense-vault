import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="ExpenseVault" style={{ width: '42px', height: '42px', borderRadius: '12px' }} />
        </div>

        {/* Card */}
        <div className="glass-panel" style={{ padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem', textAlign: 'center' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.75rem' }}>
            Sign in to continue managing your expenses.
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
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.4rem'
              }}>Email</label>
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.4rem'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Login
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
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#06b6d4', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
