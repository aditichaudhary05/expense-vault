import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: '1.25rem 1.75rem 2.5rem 1.75rem',
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        minWidth: 0
      }}>
        {React.cloneElement(children, { onMobileMenuToggle: () => setMobileOpen(true) })}
      </main>
    </div>
  );
};

export default MainLayout;
