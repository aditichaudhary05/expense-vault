import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Bell, Menu, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Header = ({ title = 'Welcome back', subtitle = "Here's your personal expense overview", onAddExpense, onMobileMenuToggle, searchTerm, setSearchTerm }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [localSearch, setLocalSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const displayName = user ? user.name : 'User';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="flex items-center justify-between flex-wrap gap-2xl" style={{ padding: '0.5rem 0 1.5rem 0' }}>
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-lg">
        <button
          onClick={onMobileMenuToggle}
          className="btn-secondary mobile-only p-md rounded-md"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="font-bold tracking-tight text-white leading-tight" style={{ fontSize: '1.65rem' }}>
            {title}
          </h2>
          <p className="text-base text-muted mt-xxs">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Controls & User Profile */}
      <div className="flex items-center gap-xl flex-wrap">
        {/* Quick Search */}
        <div className="relative min-w-220">
          <Search size={16} color="var(--text-muted)" style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm !== undefined ? searchTerm : localSearch}
            onChange={(e) => {
              if (setSearchTerm) {
                setSearchTerm(e.target.value);
              } else {
                setLocalSearch(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !setSearchTerm) {
                const q = localSearch.trim();
                navigate(q ? `/expenses?q=${encodeURIComponent(q)}` : '/expenses');
              }
            }}
            onBlur={() => {
              if (!setSearchTerm && localSearch.trim()) {
                navigate(`/expenses?q=${encodeURIComponent(localSearch.trim())}`);
              }
            }}
            className="form-input h-42 text-base rounded-full bg-muted"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Notifications Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            className="btn-secondary w-56 h-56 p-0 rounded-full relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Notifications"
          >
            <Bell size={26} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="notification-dropdown">
              <div className="flex items-center justify-between border-b" style={{ padding: '0.85rem 1rem' }}>
                <h4 className="text-lg font-bold text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-transparent text-turquoise text-sm font-semibold cursor-pointer"
                    style={{ border: 'none' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-auto" style={{ maxHeight: '320px' }}>
                {notifications.length === 0 ? (
                  <div className="text-center text-muted text-base" style={{ padding: '2rem 1rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className="notification-item flex gap-lg border-b cursor-pointer transition-colors"
                      style={{
                        padding: '0.85rem 1rem',
                        background: n.read ? 'transparent' : 'rgba(6, 182, 212, 0.05)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(6, 182, 212, 0.05)'}
                    >
                      <div className="w-34 h-34 rounded-full flex items-center justify-center" style={{ flexShrink: 0, background: n.severity === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)' }}>
                        {n.severity === 'danger'
                          ? <AlertCircle size={16} color="#ef4444" />
                          : <AlertTriangle size={16} color="#f59e0b" />
                        }
                      </div>
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <div className="flex items-center justify-between gap-md">
                          <p className="font-semibold text-white text-ellipsis" style={{ fontSize: '0.825rem', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="rounded-full" style={{ width: '7px', height: '7px', background: 'var(--accent-turquoise)', flexShrink: 0 }} />
                          )}
                        </div>
                        <p className="text-sm text-muted leading-normal mt-xxs">
                          {n.message}
                        </p>
                        <p className="text-sm text-muted mt-xxs" style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-base rounded-full bg-muted border cursor-pointer transition-colors"
          style={{ padding: '0.25rem 0.65rem 0.25rem 0.25rem', transition: 'border-color 0.2s ease, background 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          }}
          title="Profile Settings"
        >
          <div className="w-34 h-34 rounded-full flex items-center justify-center font-bold text-white overflow-hidden" style={{ background: user?.avatar_url ? 'none' : 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full" style={{ objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <span className="text-base font-semibold text-primary" style={{ paddingRight: '0.25rem' }}>
            {displayName}
          </span>
        </button>

        {/* + Add Expense Primary Button */}
        <button
          onClick={onAddExpense}
          className="btn-primary h-42"
          style={{ padding: '0 1.25rem' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
