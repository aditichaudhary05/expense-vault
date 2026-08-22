import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import SpendingOverviewChart from '../components/SpendingOverviewChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import RecentExpenses from '../components/RecentExpenses';
import ExpenseModal from '../components/ExpenseModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import expenseService from '../services/expenseService';
import analyticsService from '../services/analyticsService';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import api from '../services/api';

const Dashboard = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { checkBudgetAlert } = useNotifications();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [period, setPeriod] = useState('1M');
  const [loading, setLoading] = useState(true);

  // Modals & Actions
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toasts
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

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, categoriesRes, trendRes, recentRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategoryBreakdown(),
        analyticsService.getSpendingTrend(period),
        expenseService.getExpenses({ limit: 6, sortBy: 'date', order: 'DESC' })
      ]);

      if (summaryRes.success) {
        setSummary(summaryRes.data);
        try {
          const settingsRes = await api.get('/auth/settings');
          const budgetAlertsEnabled = settingsRes.success ? settingsRes.data.budgetAlerts : true;
          checkBudgetAlert(summaryRes.data, budgetAlertsEnabled);
        } catch {
          checkBudgetAlert(summaryRes.data, true);
        }
      }
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (trendRes.success) setTrendData(trendRes.data);
      if (recentRes.success) setRecentExpenses(recentRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      addToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  // Handle Add/Edit Save
  const handleSaveExpense = async (data) => {
    try {
      setActionLoading(true);
      if (expenseToEdit) {
        const res = await expenseService.updateExpense(expenseToEdit.id, data);
        if (res.success) {
          addToast(`"${data.title}" updated successfully!`);
        }
      } else {
        const res = await expenseService.createExpense(data);
        if (res.success) {
          addToast(`"${data.title}" added successfully!`);
        }
      }
      setModalOpen(false);
      setExpenseToEdit(null);
      await loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to save expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    try {
      setActionLoading(true);
      const res = await expenseService.deleteExpense(expenseToDelete.id);
      if (res.success) {
        addToast(`Expense permanently deleted.`);
      }
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      await loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Header
        title="Welcome back"
        subtitle="Here's your personal expense overview"
        onMobileMenuToggle={onMobileMenuToggle}
        onAddExpense={() => {
          setExpenseToEdit(null);
          setModalOpen(true);
        }}
      />

      {/* Summary Cards Grid */}
      <div className="grid grid-auto gap-3xl mb-4xl">
        <StatCard
          title="Total Spent"
          amount={summary ? summary.totalSpent : 0}
          subtitle="This month"
          percentChange={summary ? summary.percentChange : 0}
          type="wallet"
        />

        <StatCard
          title="Monthly Budget"
          amount={summary ? summary.monthlyBudget : 30000}
          subtitle={`${summary ? summary.totalSpent.toLocaleString('en-IN') : 0} spent`}
          progress={summary ? summary.budgetUsedPercentage : 0}
          type="budget"
          onEdit={() => navigate('/settings')}
        />

        <StatCard
          title="Remaining"
          amount={summary ? summary.remainingBudget : 0}
          subtitle={`${summary ? (100 - summary.budgetUsedPercentage).toFixed(1) : 100}% of budget`}
          type="trend"
        />

        <StatCard
          title="Expenses"
          amount={summary ? `${summary.transactionCount}` : '0'}
          subtitle="transactions this month"
          type="expenses"
        />
      </div>

      {/* Analytics & Charts Layout Grid */}
      <div className="grid grid-12 gap-4xl mb-4xl">
        {/* Spending Overview (8 Columns on desktop) */}
        <div className="col-span-8 grid-col-12-lg">
          <SpendingOverviewChart
            data={trendData}
            period={period}
            setPeriod={setPeriod}
          />
        </div>

        {/* Category Breakdown (4 Columns on desktop) */}
        <div className="col-span-4 grid-col-12-lg">
          <CategoryBreakdown categories={categories} />
        </div>
      </div>

      {/* Recent Expenses List */}
      <div>
        <RecentExpenses
          expenses={recentExpenses}
          onEdit={(expense) => {
            setExpenseToEdit(expense);
            setModalOpen(true);
          }}
          onDelete={(expense) => {
            setExpenseToDelete(expense);
            setDeleteModalOpen(true);
          }}
          onViewAll={() => navigate('/expenses')}
        />
      </div>

      {/* Add / Edit Expense Modal */}
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

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
