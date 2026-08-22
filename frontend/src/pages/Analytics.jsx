import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ExpenseModal from '../components/ExpenseModal';
import SpotlightCard from '../components/SpotlightCard';
import analyticsService from '../services/analyticsService';
import expenseService from '../services/expenseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { Calendar, Award, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(18, 15, 28, 0.95)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>{label}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
          {formatCurrency(payload[0].value)}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {data.transactions} transactions
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = ({ onMobileMenuToggle }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  );

  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes, monRes] = await Promise.all([
        analyticsService.getSummary(selectedMonth),
        analyticsService.getCategoryBreakdown(selectedMonth),
        analyticsService.getMonthlyAnalytics()
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (monRes.success) setMonthlyData(monRes.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedMonth]);

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prev = new Date(year, month - 2, 1);
    setSelectedMonth(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month, 1);
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
  };

  return (
    <div>
      <Header
        title="Spending Analytics"
        subtitle="Understand your spending patterns and trends"
        onMobileMenuToggle={onMobileMenuToggle}
        onAddExpense={() => setModalOpen(true)}
      />

      {/* Month Selector Bar */}
      <SpotlightCard className="card-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handlePrevMonth} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
            {formatMonthYear(selectedMonth)}
          </span>
          <button onClick={handleNextMonth} className="btn-secondary" style={{ padding: '0.4rem 0.6rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Spent</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
              {formatCurrency(summary ? summary.totalSpent : 0)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Transactions</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
              {summary ? summary.transactionCount : 0}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Avg Transaction</span>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
              {formatCurrency(summary && summary.transactionCount > 0 ? Math.round(summary.totalSpent / summary.transactionCount) : 0)}
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <SpotlightCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: '#06b6d4' }}>
            <Calendar size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Average</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
            {formatCurrency(summary ? summary.dailyAverage : 0)}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}> / day</span>
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: '#a855f7' }}>
            <Award size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Highest Category</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>
            {summary?.highestCategory?.category || 'None'}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {formatCurrency(summary?.highestCategory?.total || 0)} ({summary?.highestCategory?.percentage || 0}% of total)
          </p>
        </SpotlightCard>

        <SpotlightCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: '#10b981' }}>
            <DollarSign size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Largest Expense</span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {summary?.largestExpense?.title || 'None'}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }} className="font-number">
            {formatCurrency(summary?.largestExpense?.amount || 0)}
          </p>
        </SpotlightCard>
      </div>

      {/* Main Analytics Charts Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div className="col-span-7 grid-col-12-lg">
          <SpotlightCard className="card-col card-min-380">
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Monthly Spending</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Month-by-month spending aggregates for {currentDate.getFullYear()}</p>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#67e8f9" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#134e4a" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="totalSpent" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SpotlightCard>
        </div>

        <div className="col-span-5 grid-col-12-lg">
          <CategoryBreakdown categories={categories} />
        </div>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (data) => {
          await expenseService.createExpense(data);
          setModalOpen(false);
          await loadAnalytics();
        }}
      />
    </div>
  );
};

export default Analytics;
