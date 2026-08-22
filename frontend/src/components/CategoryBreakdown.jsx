import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import SpotlightCard from './SpotlightCard';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(18, 15, 28, 0.95)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        padding: '0.65rem 0.9rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: '700' }}>{data.category}</p>
        <p style={{ fontSize: '0.95rem', fontWeight: '700', color: CATEGORY_COLORS[data.category] || '#06b6d4' }} className="font-number">
          {formatCurrency(data.total)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CategoryBreakdown = ({ categories = [] }) => {
  return (
    <SpotlightCard className="card-col card-h-full">
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Where Your Money Goes</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Category spending breakdown</p>
      </div>

      {categories && categories.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          {/* Donut Chart Container */}
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="category"
                  stroke="none"
                >
                  {categories.map((entry, idx) => (
                    <Cell 
                      key={`cell-${entry.category}`} 
                      fill={idx === 0 ? 'var(--accent-turquoise)' : CATEGORY_COLORS[entry.category] || '#64748b'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Category List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
            overflowY: 'auto',
            maxHeight: '160px',
            paddingRight: '0.25rem'
          }}>
            {categories.map((item, idx) => (
              <div 
                key={item.category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: idx === 0 ? 'var(--accent-turquoise)' : CATEGORY_COLORS[item.category] || '#64748b'
                  }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.category}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '700', color: '#ffffff' }} className="font-number">
                    {formatCurrency(item.total)}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', minWidth: '32px', textAlign: 'right' }}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No category data available
        </div>
      )}
    </SpotlightCard>
  );
};

export default CategoryBreakdown;
