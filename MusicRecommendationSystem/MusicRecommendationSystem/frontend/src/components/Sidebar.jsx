import React from 'react';
import { Home, Search, Library, User, Disc3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link 
        to={to} 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          marginBottom: '8px',
          borderRadius: '12px',
          textDecoration: 'none',
          color: active ? 'white' : 'var(--text-secondary)',
          background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
          transition: 'all 0.2s',
          fontWeight: active ? '600' : '400'
        }}
      >
        <Icon size={20} style={{ marginRight: '12px', color: active ? 'var(--accent)' : 'inherit' }} />
        {label}
      </Link>
    );
  };

  return (
    <div className="sidebar glass">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', padding: '0 12px' }}>
        <Disc3 size={32} color="var(--accent)" style={{ marginRight: '12px' }} />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>MuseAI</h2>
      </div>

      <nav>
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/search" icon={Search} label="Search" />
        <NavItem to="/library" icon={Library} label="Your Library" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>
    </div>
  );
};

export default Sidebar;
