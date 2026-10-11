import React, { useState, useEffect } from 'react';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit = null,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        category: taskToEdit.category || 'Other',
        priority: taskToEdit.priority || 'Medium',
        dueDate: taskToEdit.dueDate || '',
        status: taskToEdit.status || 'Pending',
      });
    } else {
      // Default for new task
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: tomorrowStr,
        status: 'Pending',
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        dueDate: formData.dueDate ? formData.dueDate : null,
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || 'Failed to save task' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {taskToEdit ? '✏️ Edit Task' : '✨ Create New Task'}
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger-text)',
                  fontSize: '0.8125rem',
                }}
              >
                ⚠️ {errors.submit}
              </div>
            )}

            {/* Task Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Task Title <span className="req">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g., Complete college assignment"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-description">
                Description
              </label>
              <textarea
                id="task-description"
                name="description"
                className="form-textarea"
                placeholder="Provide additional context, checklist items, or notes..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Category and Priority in a 2-column row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-category">
                  Category
                </label>
                <select
                  id="task-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">
                  Priority Level
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">🌱 Low Priority</option>
                  <option value="Medium">⚡ Medium Priority</option>
                  <option value="High">🔥 High Priority</option>
                </select>
              </div>
            </div>

            {/* Due Date and Status in a 2-column row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-dueDate">
                  Due Date / Deadline
                </label>
                <input
                  id="task-dueDate"
                  name="dueDate"
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-status">
                  Initial Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
