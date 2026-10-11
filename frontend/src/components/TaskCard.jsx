import React from 'react';

export default function TaskCard({
  task,
  compact = false,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const isCompleted = task.status === 'Completed';

  // Category class helper
  const getCategoryClass = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c === 'study') return 'study';
    if (c === 'work') return 'work';
    if (c === 'personal') return 'personal';
    return 'other';
  };

  // Priority class helper
  const getPriorityClass = (pri) => {
    const p = (pri || '').toLowerCase();
    if (p === 'high') return 'high';
    if (p === 'low') return 'low';
    return 'medium';
  };

  // Status class helper
  const getStatusClass = (st) => {
    const s = (st || '').toLowerCase();
    if (s === 'completed') return 'completed';
    if (s.includes('progress')) return 'in-progress';
    return 'pending';
  };

  return (
    <div className={`task-card-item ${isCompleted ? 'completed-card' : ''}`}>
      <div>
        <div className="task-card-badges">
          <span className={`badge-category ${getCategoryClass(task.category)}`}>
            {task.category || 'Other'}
          </span>
          <span className={`badge-priority ${getPriorityClass(task.priority)}`}>
            {task.priority === 'High' ? '🔥 ' : task.priority === 'Low' ? '🌱 ' : '⚡ '}
            {task.priority || 'Medium'}
          </span>
          {task.overdue && !isCompleted && (
            <span className="due-date-indicator overdue">
              ⚠️ Overdue
            </span>
          )}
          {task.dueToday && !isCompleted && (
            <span className="due-date-indicator today">
              ☀️ Due Today
            </span>
          )}
        </div>

        <div className="task-card-top">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1 }}>
            <button
              className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
              onClick={() => onStatusChange(task.id, isCompleted ? 'Pending' : 'Completed')}
              title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
              aria-label="Toggle task status"
            >
              {isCompleted ? '✓' : ''}
            </button>
            <div style={{ flex: 1 }}>
              <div className={`task-card-title ${isCompleted ? 'completed-title' : ''}`}>
                {task.title}
              </div>
              {task.description && !compact && (
                <div className="task-card-description">{task.description}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="task-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Status selector dropdown */}
          <select
            className={`status-pill ${getStatusClass(task.status)}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            title="Change status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {task.dueDate && (
            <span className={`due-date-indicator ${task.overdue ? 'overdue' : task.dueToday ? 'today' : 'normal'}`}>
              📅 {task.dueDate}
            </span>
          )}
        </div>

        <div className="action-btns-group">
          <button
            className="icon-btn edit"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDelete(task)}
            title="Delete Task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
