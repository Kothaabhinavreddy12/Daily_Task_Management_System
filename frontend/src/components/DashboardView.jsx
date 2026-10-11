import React from 'react';
import TaskCard from './TaskCard';

export default function DashboardView({
  stats,
  tasks,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onNavigate,
}) {
  const total = stats ? stats.totalTasks : 0;
  const pending = stats ? stats.pendingTasks : 0;
  const inProgress = stats ? stats.inProgressTasks : 0;
  const completed = stats ? stats.completedTasks : 0;
  const overdue = stats ? stats.overdueTasks : 0;
  const todayCount = stats ? stats.todayTasks : 0;
  const completionPercentage = stats ? stats.completionPercentage : 0;

  // Filter tasks for dashboard widgets
  const todayTasks = tasks.filter((t) => t.dueToday && t.status !== 'Completed');
  const upcomingTasks = tasks
    .filter((t) => !t.overdue && !t.dueToday && t.status !== 'Completed' && t.dueDate)
    .slice(0, 4);
  const recentTasks = tasks.slice(0, 5);

  const priorities = stats && stats.priorityBreakdown ? stats.priorityBreakdown : { High: 0, Medium: 0, Low: 0 };
  const highCount = priorities['High'] || 0;
  const medCount = priorities['Medium'] || 0;
  const lowCount = priorities['Low'] || 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Daily Productivity Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 2 }}>
            Keep track of your day, prioritize important milestones, and achieve your goals.
          </p>
        </div>
        <button className="btn-primary" onClick={onOpenAddTask}>
          <span style={{ fontSize: '1.1rem' }}>+</span>
          <span>Create New Task</span>
        </button>
      </div>

      {/* Metrics Summary Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Total Tasks</span>
            <div className="metric-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              📋
            </div>
          </div>
          <div className="metric-value">{total}</div>
          <div className="metric-footer">Across all categories</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Today's Tasks</span>
            <div className="metric-icon-box" style={{ background: 'var(--warning-light)', color: 'var(--warning-text)' }}>
              ☀️
            </div>
          </div>
          <div className="metric-value">{todayCount}</div>
          <div className="metric-footer">Due for completion today</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Pending</span>
            <div className="metric-icon-box" style={{ background: 'var(--info-light)', color: 'var(--info-text)' }}>
              ⏳
            </div>
          </div>
          <div className="metric-value">{pending}</div>
          <div className="metric-footer">Awaiting start</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">In Progress</span>
            <div className="metric-icon-box" style={{ background: '#ede9fe', color: '#6d28d9' }}>
              ⚡
            </div>
          </div>
          <div className="metric-value">{inProgress}</div>
          <div className="metric-footer">Currently working on</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Completed</span>
            <div className="metric-icon-box" style={{ background: 'var(--success-light)', color: 'var(--success-text)' }}>
              ✓
            </div>
          </div>
          <div className="metric-value">{completed}</div>
          <div className="metric-footer">Successfully finished</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">Overdue</span>
            <div className="metric-icon-box" style={{ background: 'var(--danger-light)', color: 'var(--danger-text)' }}>
              ⚠️
            </div>
          </div>
          <div className="metric-value" style={{ color: overdue > 0 ? 'var(--danger)' : 'inherit' }}>
            {overdue}
          </div>
          <div className="metric-footer">Requires immediate attention</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-sections">
        {/* Left Column: Progress & Recent Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Progress Overview Panel */}
          <div className="card-panel progress-card">
            <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
              <div className="panel-title">
                <span>🎯</span> Overall Completion Progress
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {completionPercentage}%
              </span>
            </div>

            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>{completed} of {total} tasks completed</span>
              <span>
                {completionPercentage === 100
                  ? '🎉 All tasks finished! Fantastic job!'
                  : completionPercentage >= 50
                  ? 'Great momentum, keep going!'
                  : 'Start tackling your priority tasks!'}
              </span>
            </div>
          </div>

          {/* Today's Focus Tasks */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>☀️</span> Today's Focus ({todayTasks.length})
              </div>
              <button
                onClick={() => onNavigate('today')}
                style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                View all →
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No pending tasks scheduled for today. You are all caught up!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {todayTasks.slice(0, 4).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>📋</span> Recent Activity & Tasks
              </div>
              <button
                onClick={() => onNavigate('all')}
                style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                View all tasks →
              </button>
            </div>

            {recentTasks.length === 0 ? (
              <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No tasks available yet. Click "Create New Task" to begin!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    compact
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Priority Distribution & Upcoming Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Priority Distribution */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>📊</span> Priority Breakdown
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-labels">
                <span style={{ color: 'var(--danger-text)', fontWeight: 600 }}>High Priority</span>
                <span>{highCount}</span>
              </div>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill"
                  style={{
                    width: total ? `${(highCount / total) * 100}%` : '0%',
                    backgroundColor: 'var(--danger)',
                  }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-labels">
                <span style={{ color: 'var(--warning-text)', fontWeight: 600 }}>Medium Priority</span>
                <span>{medCount}</span>
              </div>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill"
                  style={{
                    width: total ? `${(medCount / total) * 100}%` : '0%',
                    backgroundColor: 'var(--warning)',
                  }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-labels">
                <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Low Priority</span>
                <span>{lowCount}</span>
              </div>
              <div className="priority-bar-track">
                <div
                  className="priority-bar-fill"
                  style={{
                    width: total ? `${(lowCount / total) * 100}%` : '0%',
                    backgroundColor: 'var(--success)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="card-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>⏳</span> Upcoming Deadlines
              </div>
              <button
                onClick={() => onNavigate('upcoming')}
                style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                All →
              </button>
            </div>

            {upcomingTasks.length === 0 ? (
              <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No upcoming deadlines on schedule.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.category} • {t.priority}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        whiteSpace: 'nowrap',
                        background: 'var(--primary-light)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {t.daysRemaining !== null && t.daysRemaining >= 0
                        ? t.daysRemaining === 1
                          ? 'Tomorrow'
                          : `In ${t.daysRemaining} days`
                        : t.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
