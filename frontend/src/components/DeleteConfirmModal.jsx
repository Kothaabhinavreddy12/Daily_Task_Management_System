import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  deleting = false,
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> Delete Task
          </h2>
          <button onClick={onClose} style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Are you sure you want to delete this task?
          </p>

          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--danger)',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
            }}
          >
            "{task.title}"
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            This action cannot be undone. The task will be permanently removed from your MySQL database.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => onConfirm(task.id)}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
