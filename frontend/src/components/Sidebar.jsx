import React from 'react';

export default function Sidebar({
  currentPage,
  onNavigate,
  stats,
  mobileOpen,
  onCloseMobile,
  onSelectCategory,
  selectedCategory,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'all', label: 'All Tasks', icon: '📋', badge: stats ? stats.totalTasks : null },
    { id: 'today', label: "Today's Tasks", icon: '☀️', badge: stats ? stats.todayTasks : null, badgeClass: 'warning' },
    { id: 'upcoming', label: 'Upcoming Tasks', icon: '⏳' },
    { id: 'completed', label: 'Completed Tasks', icon: '✓', badge: stats ? stats.completedTasks : null },
    { id: 'overdue', label: 'Overdue Tasks', icon: '⚠️', badge: stats ? stats.overdueTasks : null, badgeClass: 'danger' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  const categories = ['Study', 'Personal', 'Work', 'Other'];

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-box" style={{ width: 34, height: 34, borderRadius: 8 }}>
              ✓
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                TaskPulse
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Daily Task Manager</div>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              style={{ color: '#94a3b8', fontSize: '1.25rem' }}
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <div className="link-left">
                  <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
                  <span className={`nav-badge ${item.badgeClass || ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="nav-section-title">Categories</div>
          {categories.map((cat) => {
            const count = stats && stats.categoryBreakdown ? stats.categoryBreakdown[cat] || 0 : 0;
            const isSelected = selectedCategory === cat && currentPage === 'all';
            return (
              <button
                key={cat}
                className={`sidebar-link ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  onSelectCategory(cat);
                  onNavigate('all');
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <div className="link-left">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor:
                        cat === 'Study'
                          ? '#8b5cf6'
                          : cat === 'Work'
                          ? '#3b82f6'
                          : cat === 'Personal'
                          ? '#ec4899'
                          : '#94a3b8',
                      display: 'inline-block',
                    }}
                  />
                  <span>{cat}</span>
                </div>
                {count > 0 && <span className="nav-badge">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div>Task Management v1.0</div>
          <div style={{ color: '#10b981', fontWeight: 600 }}>Active</div>
        </div>
      </aside>
    </>
  );
}
