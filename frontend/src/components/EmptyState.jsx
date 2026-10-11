import React from 'react';

export default function EmptyState({
  title = 'No tasks found',
  description = 'You have no tasks matching the selected filters. Create a new task or adjust your criteria.',
  actionLabel = '+ Create Task',
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon-circle">📝</div>
      <div className="empty-title">{title}</div>
      <div className="empty-desc">{description}</div>
      {onAction && (
        <button
          className="btn-primary"
          onClick={onAction}
          style={{ marginTop: '0.75rem' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
