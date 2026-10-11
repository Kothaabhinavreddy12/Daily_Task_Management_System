import React from 'react';

export default function TaskRow({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const isCompleted = task.status === 'Completed';

  const getCategoryClass = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c === 'study') return 'study';
    if (c === 'work') return 'work';
    if (c === 'personal') return 'personal';
    return 'other';
  };

  const getPriorityClass = (pri) => {
    const p = (pri || '').toLowerCase();
    if (p === 'high') return 'high';
    if (p === 'low') return 'low';
    return 'medium';
  };

  const getStatusClass = (st) => {
    const s = (st || '').toLowerCase();
    if (s === 'completed') return 'completed';
    if (s.includes('progress')) return 'in-progress';
    return 'pending';
  };

  return (
    <tr>
      {/* Checkbox */}
      <td style={{ width: 48, textAlign: 'center' }}>
        <button
          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onStatusChange(task.id, isCompleted ? 'Pending' : 'Completed')}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          aria-label="Toggle task status"
        >
          {isCompleted ? '✓' : ''}
        </button>
      </td>

      {/* Task Title & Description */}
      <td>
        <div className={`task-title-cell ${isCompleted ? 'completed-text' : ''}`}>
          <span>{task.title}</span>
        </div>
        {task.description && (
          <div className="task-desc-subtle">{task.description}</div>
        )}
      </td>

      {/* Category */}
      <td>
        <span className={`badge-category ${getCategoryClass(task.category)}`}>
          {task.category || 'Other'}
        </span>
      </td>

      {/* Priority */}
      <td>
        <span className={`badge-priority ${getPriorityClass(task.priority)}`}>
          {task.priority === 'High' ? '🔥 ' : task.priority === 'Low' ? '🌱 ' : '⚡ '}
          {task.priority || 'Medium'}
        </span>
      </td>

      {/* Due Date */}
      <td>
        {task.dueDate ? (
          <span
            className={`due-date-indicator ${
              task.overdue && !isCompleted ? 'overdue' : task.dueToday && !isCompleted ? 'today' : 'normal'
            }`}
          >
            {task.overdue && !isCompleted ? '⚠️ ' : task.dueToday && !isCompleted ? '☀️ ' : '📅 '}
            {task.dueDate}
          </span>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No deadline</span>
        )}
      </td>

      {/* Status */}
      <td>
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
      </td>

      {/* Actions */}
      <td style={{ textAlign: 'right' }}>
        <div className="action-btns-group" style={{ justifyContent: 'flex-end' }}>
          <button
            className="icon-btn edit"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}
