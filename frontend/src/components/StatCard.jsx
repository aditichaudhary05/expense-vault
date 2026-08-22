import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, PieChart, Receipt, Pencil } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import SpotlightCard from './SpotlightCard';

const iconMap = {
  wallet: Wallet,
  budget: PieChart,
  expenses: Receipt,
  trend: TrendingUp
};

const StatCard = ({ title, amount, subtitle, trend, percentChange, progress, type = 'wallet', onEdit }) => {
  const Icon = iconMap[type] || Wallet;

  const isPositive = percentChange > 0;

  return (
    <SpotlightCard className="card-col">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                  e.currentTarget.style.color = 'var(--accent-purple)';
                  e.currentTarget.style.borderColor = 'var(--accent-purple)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                title={`Edit ${title.toLowerCase()}`}
              >
                <Pencil size={14} />
              </button>
            )}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-turquoise)'
            }}>
              <Icon size={16} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }} className="font-number">
          {typeof amount === 'number' ? formatCurrency(amount) : amount}
        </div>
      </div>

      <div>
        {/* Progress bar if present */}
        {progress !== undefined && (
          <div style={{ margin: '0.75rem 0' }}>
            <div style={{
              height: '6px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, progress))}%`,
                background: progress > 90 
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                  : 'linear-gradient(90deg, var(--accent-turquoise), var(--accent-aqua))',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            {subtitle}
          </span>

          {percentChange !== undefined && percentChange !== null && (
            <div className={isPositive ? 'badge-red' : 'badge-green'}>
              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              <span>{Math.abs(percentChange)}%</span>
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default StatCard;
