import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: ReceiptText },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="sidebar-inner">
      {/* Brand Header */}
      <div className="brand-header">
        <Link to="/dashboard" className="brand-link gap-sm">
          <img src="/logo.png" alt="ExpenseVault" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <h1 style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }} className="text-white font-bold">
            Expense<span className="gradient-text">Vault</span>
          </h1>
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-close-sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="nav-items">
        <p className="sidebar-label">
          Menu
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'active-pill sidebar-nav-link' : 'sidebar-nav-link'
              }
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.925rem'
              })}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'active-pill sidebar-nav-link' : 'sidebar-nav-link'
              }
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '0.9rem'
              })}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="aside-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="overlay-backdrop"
        />
      )}

      <div
        style={{
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="mobile-drawer"
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
