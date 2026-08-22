import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  FileText, 
  Film, 
  HeartPulse, 
  GraduationCap, 
  CreditCard,
  Edit2, 
  Trash2 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORY_COLORS } from '../utils/constants';
import SpotlightCard from './SpotlightCard';

const categoryIconMap = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: FileText,
  Entertainment: Film,
  Health: HeartPulse,
  Education: GraduationCap,
  Other: CreditCard
};

const RecentExpenses = ({ expenses = [], onEdit, onDelete, onViewAll }) => {
  return (
    <SpotlightCard className="card-col">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Recent Expenses</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Latest transactions</p>
        </div>

        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
          >
            View All
          </button>
        )}
      </div>

      {expenses && expenses.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {expenses.map((expense) => {
            const Icon = categoryIconMap[expense.category] || CreditCard;
            const categoryColor = CATEGORY_COLORS[expense.category] || '#64748b';

            return (
              <div
                key={expense.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                className="expense-row-hover"
              >
                {/* Left: Category Icon + Title & Subtext */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${categoryColor}18`,
                    border: `1px solid ${categoryColor}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: categoryColor,
                    flexShrink: 0
                  }}>
                    <Icon size={19} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.15rem' }}>
                      {expense.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {expense.category} · {formatDate(expense.expense_date)}
                    </p>
                  </div>
                </div>

                {/* Right: Amount + Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }} className="font-number">
                    {formatCurrency(expense.amount)}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s ease'
                        }}
                        title="Edit expense"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(expense)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.85,
                          transition: 'opacity 0.2s ease'
                        }}
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No recent expenses found
        </div>
      )}
    </SpotlightCard>
  );
};

export default RecentExpenses;
