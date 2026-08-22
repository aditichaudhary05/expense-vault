import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, CreditCard, FileText, Loader2 } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants';

const ExpenseModal = ({ isOpen, onClose, onSave, expenseToEdit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'Food',
        expense_date: expenseToEdit.expense_date || new Date().toISOString().split('T')[0],
        payment_method: expenseToEdit.payment_method || 'UPI',
        description: expenseToEdit.description || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: 'UPI',
        description: ''
      });
    }
    setErrors({});
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.expense_date) newErrors.expense_date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>
              {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {expenseToEdit ? 'Update transaction details' : 'Enter transaction details'}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Expense Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner at Cafe"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
            {errors.title && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>{errors.title}</p>}
          </div>

          {/* Amount & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="450"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input font-number"
              />
              {errors.amount && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>{errors.amount}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Payment Method */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Date *
              </label>
              <input
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                className="form-input"
              />
              {errors.expense_date && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>{errors.expense_date}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="form-select"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add optional note or details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{expenseToEdit ? 'Save Changes' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
