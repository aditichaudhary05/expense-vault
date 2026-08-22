import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '1.75rem', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--color-danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--color-danger)'
          }}>
            <AlertTriangle size={24} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
            {title || 'Delete expense?'}
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.75rem' }}>
            {message || 'Are you sure you want to permanently delete this expense? This action cannot be undone.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
              style={{ flex: 1, height: '40px' }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                height: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'var(--color-danger)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)',
                transition: 'opacity 0.2s ease'
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
