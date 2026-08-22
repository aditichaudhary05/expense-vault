import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import SpotlightCard from './SpotlightCard';

const SearchFilterBar = ({ filters, setFilters, onClearFilters }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SpotlightCard className="card-md" style={{ marginBottom: '1.5rem' }}>
      <div className="filter-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        alignItems: 'end'
      }}>
        {/* Search */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Search Expenses
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search title, category, description..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleChange('category', e.target.value)}
            className="form-select"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Month
          </label>
          <input
            type="month"
            value={filters.month || ''}
            onChange={(e) => handleChange('month', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Min Amount */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Min Amount (₹)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minAmount || ''}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            className="form-input font-number"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Max Amount (₹)
          </label>
          <input
            type="number"
            placeholder="50000"
            value={filters.maxAmount || ''}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            className="form-input font-number"
          />
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={onClearFilters}
            className="btn-secondary"
            style={{ width: '100%', height: '42px' }}
          >
            <RotateCcw size={15} />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default SearchFilterBar;
