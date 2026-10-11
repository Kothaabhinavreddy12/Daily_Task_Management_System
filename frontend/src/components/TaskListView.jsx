import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import TaskRow from './TaskRow';
import EmptyState from './EmptyState';

export default function TaskListView({
  title = 'All Tasks',
  tasks = [],
  loading = false,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  initialCategory = 'All',
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || 'All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [layoutMode, setLayoutMode] = useState('table'); // 'table' or 'grid'

  // Update categoryFilter if initialCategory changes from sidebar
  React.useEffect(() => {
    if (initialCategory) {
      setCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status && t.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority && t.priority.toLowerCase() === priorityFilter.toLowerCase());
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter((t) => t.category && t.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sorting
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'priority') {
        const pa = priorityWeight[(a.priority || '').toLowerCase()] || 0;
        const pb = priorityWeight[(b.priority || '').toLowerCase()] || 0;
        cmp = pb - pa; // High first by default
      } else if (sortBy === 'dueDate') {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
      } else if (sortBy === 'title') {
        cmp = (a.title || '').localeCompare(b.title || '');
      } else {
        // createdAt
        const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        cmp = cb - ca; // Newest first
      }

      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter, sortBy, sortDirection]);

  const hasActiveFilters =
    search.trim() !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Showing {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
            {hasActiveFilters ? ' (filtered)' : ''}
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddTask}>
          <span style={{ fontSize: '1.1rem' }}>+</span>
          <span>Add Task</span>
        </button>
      </div>

      {/* Toolbar: Search, Filters, Sorters, Layout */}
      <div className="toolbar">
        <div className="toolbar-left">
          {/* Search Input */}
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            className="select-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">Priority: All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            className="select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Category: All</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="toolbar-right">
          {/* Sorter */}
          <select
            className="select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="createdAt">Sort: Created Date</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          {/* Sort Direction Toggle */}
          <button
            className="btn-secondary"
            style={{ padding: '0.45rem 0.65rem', minWidth: 38 }}
            onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--danger)',
                fontWeight: 600,
                padding: '0.45rem 0.65rem',
              }}
            >
              Reset
            </button>
          )}

          {/* Layout Mode Toggle */}
          <div className="layout-toggle">
            <button
              className={`layout-btn ${layoutMode === 'table' ? 'active' : ''}`}
              onClick={() => setLayoutMode('table')}
              title="Table View"
            >
              ☰
            </button>
            <button
              className={`layout-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => setLayoutMode('grid')}
              title="Card View"
            >
              ▦
            </button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          Loading tasks from backend...
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No matching tasks' : 'No tasks in this view'}
          description={
            hasActiveFilters
              ? 'Try relaxing your search query or filters to find what you are looking for.'
              : 'Add your first task to start organizing your daily activities!'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : '+ Add New Task'}
          onAction={hasActiveFilters ? resetFilters : onOpenAddTask}
        />
      ) : layoutMode === 'table' ? (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ width: 48, textAlign: 'center' }}>Done</th>
                <th>Task Details</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
