import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import SearchFilterBar from '../components/SearchFilterBar';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseModal from '../components/ExpenseModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import expenseService from '../services/expenseService';

const Expenses = ({ onMobileMenuToggle }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State - initialize search from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: 'All',
    month: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    order: 'DESC'
  });

  // Modals & Actions
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Expenses based on filters
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getExpenses(filters);
      if (res.success) {
        setExpenses(res.data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      addToast(err.message || 'Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  // Sync search term to URL params
  useEffect(() => {
    if (filters.search) {
      setSearchParams({ q: filters.search }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [filters.search, setSearchParams]);

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
    setFilters({
      search: '',
      category: 'All',
      month: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      order: 'DESC'
    });
  };

  const handleSortChange = (field) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'DESC' ? 'ASC' : 'DESC'
    }));
  };

  // Save Expense
  const handleSaveExpense = async (data) => {
    try {
      setActionLoading(true);
      if (expenseToEdit) {
        const res = await expenseService.updateExpense(expenseToEdit.id, data);
        if (res.success) addToast(`"${data.title}" updated successfully!`);
      } else {
        const res = await expenseService.createExpense(data);
        if (res.success) addToast(`"${data.title}" added successfully!`);
      }
      setModalOpen(false);
      setExpenseToEdit(null);
      await fetchExpenses();
    } catch (err) {
      addToast(err.message || 'Failed to save expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Expense
  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    try {
      setActionLoading(true);
      const res = await expenseService.deleteExpense(expenseToDelete.id);
      if (res.success) addToast(`Expense permanently deleted.`);
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      await fetchExpenses();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Expenses"
        subtitle="Track and manage your spending"
        onMobileMenuToggle={onMobileMenuToggle}
        searchTerm={filters.search}
        setSearchTerm={(term) => setFilters((prev) => ({ ...prev, search: term }))}
        onAddExpense={() => {
          setExpenseToEdit(null);
          setModalOpen(true);
        }}
      />

      {/* Filter Controls */}
      <SearchFilterBar
        filters={filters}
        setFilters={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Table / List / Empty State */}
      {loading ? (
        <div className="flex justify-center text-muted" style={{ padding: '4rem 0' }}>
          Loading transactions...
        </div>
      ) : expenses.length > 0 ? (
        <ExpenseTable
          expenses={expenses}
          onEdit={(exp) => {
            setExpenseToEdit(exp);
            setModalOpen(true);
          }}
          onDelete={(exp) => {
            setExpenseToDelete(exp);
            setDeleteModalOpen(true);
          }}
          sortBy={filters.sortBy}
          order={filters.order}
          onSortChange={handleSortChange}
        />
      ) : (
        <EmptyState
          title={filters.search || filters.category !== 'All' ? 'No matching expenses' : 'No expenses yet'}
          message={filters.search || filters.category !== 'All' ? 'Try adjusting your filters or search query.' : 'Start tracking your spending by adding your first expense.'}
          isSearch={Boolean(filters.search || filters.category !== 'All')}
          onAddExpense={() => {
            setExpenseToEdit(null);
            setModalOpen(true);
          }}
        />
      )}

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete expense?"
        message={`Are you sure you want to permanently delete "${expenseToDelete?.title || 'this expense'}"?`}
        loading={actionLoading}
      />

      {/* Toasts */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Expenses;
