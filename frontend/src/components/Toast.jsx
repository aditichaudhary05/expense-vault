import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts = [], removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      zIndex: 2000,
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(20, 18, 30, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '500',
              animation: 'scaleUp 0.2s ease-out'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="var(--color-success)" />}
            {isError && <AlertCircle size={18} color="var(--color-danger)" />}
            {!isSuccess && !isError && <Info size={18} color="var(--accent-mauve)" />}

            <span>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
