import React from 'react';
import { Edit2, Trash2, ArrowUpDown, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORY_COLORS } from '../utils/constants';
import SpotlightCard from './SpotlightCard';

const ExpenseTable = ({ expenses = [], onEdit, onDelete, sortBy, order, onSortChange }) => {
  return (
    <SpotlightCard className="card-no-pad">
      {/* Desktop Table View */}
      <div className="desktop-only overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr className="bg-muted text-muted text-sm font-bold text-uppercase tracking-wider border-b">
              <th className="th-cell">Expense</th>
              <th className="th-cell">Category</th>
              <th 
                className="th-cell th-sortable"
                onClick={() => onSortChange && onSortChange('amount')}
              >
                <div className="flex items-center gap-sm">
                  <span>Amount</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th 
                className="th-cell th-sortable"
                onClick={() => onSortChange && onSortChange('date')}
              >
                <div className="flex items-center gap-sm">
                  <span>Date</span>
                  <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="th-cell">Payment</th>
              <th className="th-cell">Notes</th>
              <th className="th-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const categoryColor = CATEGORY_COLORS[expense.category] || '#64748b';

              return (
                <tr
                  key={expense.id}
                  className="table-row-hover"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {/* Expense Title */}
                  <td className="td-cell">
                    <div className="font-semibold text-white text-lg">
                      {expense.title}
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="td-cell">
                    <span className="inline-flex items-center gap-sm text-sm font-semibold rounded-full" style={{ padding: '0.25rem 0.65rem', background: `${categoryColor}18`, color: categoryColor, border: `1px solid ${categoryColor}33` }}>
                      {expense.category}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="td-cell font-bold text-white text-lg font-number">
                    {formatCurrency(expense.amount)}
                  </td>

                  {/* Date */}
                  <td className="td-cell text-secondary text-base">
                    {formatDate(expense.expense_date)}
                  </td>

                  {/* Payment Method */}
                  <td className="td-cell text-muted text-base">
                    {expense.payment_method || 'Cash'}
                  </td>

                  {/* Notes */}
                  <td className="td-cell text-muted overflow-hidden text-ellipsis" style={{ fontSize: '0.825rem', maxWidth: '200px', whiteSpace: 'nowrap' }}>
                    {expense.description || '—'}
                  </td>

                  {/* Actions */}
                  <td className="td-cell text-right">
                    <div className="flex items-center justify-end gap-sm">
                      <button
                        onClick={() => onEdit(expense)}
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        title="Edit expense"
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onDelete(expense)}
                        className="btn-danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="mobile-only flex flex-col p-lg gap-lg">
        {expenses.map((expense) => {
          const categoryColor = CATEGORY_COLORS[expense.category] || '#64748b';

          return (
            <div
              key={expense.id}
              className="mobile-card"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-white">{expense.title}</h4>
                <span className="text-2xl font-extrabold text-white font-number">
                  {formatCurrency(expense.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-base">
                <span className="rounded-full font-semibold" style={{ padding: '0.2rem 0.55rem', background: `${categoryColor}18`, color: categoryColor, border: `1px solid ${categoryColor}33` }}>
                  {expense.category}
                </span>

                <span className="text-muted">
                  {formatDate(expense.expense_date)} · {expense.payment_method || 'Cash'}
                </span>
              </div>

              {expense.description && (
                <p className="text-base text-muted p-md" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                  {expense.description}
                </p>
              )}

              <div className="flex items-center justify-end gap-md pt-md" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  onClick={() => onEdit(expense)}
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onDelete(expense)}
                  className="btn-danger"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
};

export default ExpenseTable;
