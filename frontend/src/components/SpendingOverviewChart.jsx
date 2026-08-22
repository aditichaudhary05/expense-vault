import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import SpotlightCard from './SpotlightCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(18, 15, 28, 0.95)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>
          {data.formatted_date || label}
        </p>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }} className="font-number">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingOverviewChart = ({ data = [], period = '1M', setPeriod }) => {
  const periods = ['1W', '1M', '3M', '6M', '1Y'];

  return (
    <SpotlightCard className="card-col card-h-full">
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Spending Overview</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Daily spending performance over time</p>
        </div>

        {/* Period Pills */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          gap: '0.2rem'
        }}>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod && setPeriod(p)}
              style={{
                background: period === p ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.35), rgba(45, 212, 191, 0.2))' : 'transparent',
                color: period === p ? '#ffffff' : 'var(--text-secondary)',
                border: period === p ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="turquoiseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="formatted_date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={5}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--accent-turquoise)" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#turquoiseGradient)" 
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#06b6d4', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No spending data recorded for this period
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};

export default SpendingOverviewChart;
