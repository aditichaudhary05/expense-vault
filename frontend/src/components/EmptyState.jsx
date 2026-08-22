import React from 'react';
import { Plus, Wallet, SearchX } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const EmptyState = ({ title = 'No expenses yet', message = 'Start tracking your spending by adding your first expense.', onAddExpense, isSearch = false }) => {
  return (
    <SpotlightCard className="card-col card-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.1))',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-mauve)',
        marginBottom: '1.25rem',
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)'
      }}>
        {isSearch ? <SearchX size={32} /> : <Wallet size={32} />}
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: '1.75rem', lineHeight: '1.5' }}>
        {message}
      </p>

      {onAddExpense && (
        <button onClick={onAddExpense} className="btn-primary">
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      )}
    </SpotlightCard>
  );
};

export default EmptyState;
