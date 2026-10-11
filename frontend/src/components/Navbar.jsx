import React from 'react';

export default function Navbar({
  darkMode,
  onToggleTheme,
  backendOnline,
  onOpenAddTask,
  onToggleMobileSidebar,
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <div className="navbar-brand">
          <div className="brand-icon-box">✓</div>
          <div>
            <span style={{ fontWeight: 800 }}>Daily Task</span>
            <span style={{ color: 'var(--primary)', marginLeft: 4, fontWeight: 700 }}>Management</span>
          </div>
        </div>

        <div className="navbar-date">
          <span>📅</span>
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Backend Connectivity Status */}
        <div className={`connection-pill ${backendOnline ? 'online' : 'offline'}`}>
          <span className="pulse-dot" />
          <span>{backendOnline ? 'Backend Connected' : 'Offline / Reconnecting'}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Add Task Button */}
        <button className="btn-primary" onClick={onOpenAddTask}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
