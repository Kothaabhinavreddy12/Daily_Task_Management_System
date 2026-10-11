import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import TaskListView from './components/TaskListView';
import SettingsView from './components/SettingsView';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { taskApi } from './api/taskApi';

export default function App() {
  // Navigation & View state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('task_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark/light theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('task_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // Helper to add toast notification
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load tasks and statistics from backend
  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const [fetchedTasks, fetchedStats] = await Promise.all([
        taskApi.getTasks(),
        taskApi.getStats(),
      ]);
      setTasks(fetchedTasks || []);
      setStats(fetchedStats || null);
      setBackendOnline(true);
    } catch (err) {
      console.warn('Backend fetch error:', err.message);
      setBackendOnline(false);
      if (!quiet) {
        addToast(
          'Could not connect to backend. Please ensure Spring Boot is running on port 8080.',
          'error'
        );
      }
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    loadData();
    // Heartbeat check every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // CRUD Handlers
  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskFormData) => {
    try {
      if (taskToEdit) {
        await taskApi.updateTask(taskToEdit.id, taskFormData);
        addToast(`Task "${taskFormData.title}" updated successfully!`, 'success');
      } else {
        await taskApi.createTask(taskFormData);
        addToast(`Task "${taskFormData.title}" created successfully!`, 'success');
      }
      await loadData(true);
    } catch (err) {
      throw err;
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus, overdue: newStatus === 'Completed' ? false : t.overdue }
            : t
        )
      );
      await taskApi.updateStatus(taskId, newStatus);
      addToast(`Status updated to "${newStatus}"`, 'info');
      await loadData(true);
    } catch (err) {
      addToast(err.message || 'Failed to update task status', 'error');
      await loadData(true);
    }
  };

  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (taskId) => {
    setDeleting(true);
    try {
      await taskApi.deleteTask(taskId);
      addToast('Task deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      await loadData(true);
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSeedData = async () => {
    await taskApi.seedSampleData();
    await loadData();
  };

  // Keyboard shortcut listener (N for new task)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) &&
        !isTaskModalOpen &&
        !isDeleteModalOpen
      ) {
        e.preventDefault();
        handleOpenAddTask();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, isDeleteModalOpen]);

  // Determine which page content to render
  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return (
        <DashboardView
          stats={stats}
          tasks={tasks}
          onOpenAddTask={handleOpenAddTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={handleOpenDelete}
          onStatusChange={handleStatusChange}
          onNavigate={(page) => setCurrentPage(page)}
        />
      );
    }

    if (currentPage === 'settings') {
      return (
        <SettingsView
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          backendOnline={backendOnline}
          onCheckBackend={async () => {
            const ok = await taskApi.ping();
            setBackendOnline(ok);
            if (ok) await loadData(true);
            return ok;
          }}
          onSeedData={handleSeedData}
          onAddToast={addToast}
        />
      );
    }

    // Filtered page views (Today, Upcoming, Completed, Overdue, All)
    let pageTitle = 'All Tasks';
    let filteredTasks = tasks;

    if (currentPage === 'today') {
      pageTitle = "Today's Tasks";
      filteredTasks = tasks.filter((t) => t.dueToday);
    } else if (currentPage === 'upcoming') {
      pageTitle = 'Upcoming Tasks';
      filteredTasks = tasks.filter(
        (t) => !t.overdue && !t.dueToday && t.status !== 'Completed' && t.dueDate
      );
    } else if (currentPage === 'completed') {
      pageTitle = 'Completed Tasks';
      filteredTasks = tasks.filter((t) => t.status === 'Completed');
    } else if (currentPage === 'overdue') {
      pageTitle = 'Overdue Tasks';
      filteredTasks = tasks.filter((t) => t.overdue && t.status !== 'Completed');
    }

    return (
      <TaskListView
        title={pageTitle}
        tasks={filteredTasks}
        loading={loading}
        onOpenAddTask={handleOpenAddTask}
        onEditTask={handleOpenEditTask}
        onDeleteTask={handleOpenDelete}
        onStatusChange={handleStatusChange}
        initialCategory={selectedCategory}
      />
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page !== 'all') setSelectedCategory('All');
        }}
        stats={stats}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        <Navbar
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          backendOnline={backendOnline}
          onOpenAddTask={handleOpenAddTask}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        <main className="content-area">{renderContent()}</main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
