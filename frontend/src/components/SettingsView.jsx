import React, { useState } from 'react';

export default function SettingsView({
  darkMode,
  onToggleTheme,
  backendOnline,
  onCheckBackend,
  onSeedData,
  onAddToast,
}) {
  const [apiUrl, setApiUrl] = useState(
    () => localStorage.getItem('task_api_url') || 'http://localhost:8080/api'
  );
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSaveApiUrl = () => {
    localStorage.setItem('task_api_url', apiUrl.trim());
    onAddToast('Backend API URL saved! Reloading data...', 'success');
    onCheckBackend();
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem('task_api_url');
    setApiUrl('http://localhost:8080/api');
    onAddToast('Reset API URL to default (http://localhost:8080/api)', 'info');
    onCheckBackend();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    const ok = await onCheckBackend();
    setTesting(false);
    if (ok) {
      onAddToast('Successfully connected to Spring Boot backend!', 'success');
    } else {
      onAddToast('Could not reach backend. Verify Spring Boot is running on port 8080.', 'error');
    }
  };

  const handleTriggerSeed = async () => {
    setSeeding(true);
    try {
      await onSeedData();
      onAddToast('Sample tasks seeded successfully in MySQL database!', 'success');
    } catch (err) {
      onAddToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Application Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure system preferences, REST API connectivity, and database utilities.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance Settings */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>🎨</span> Appearance & Theme
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Choose between modern light and dark themes. Your preference is automatically remembered.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className={!darkMode ? 'btn-primary' : 'btn-secondary'}
              onClick={() => { if (darkMode) onToggleTheme(); }}
            >
              ☀️ Light Mode
            </button>
            <button
              className={darkMode ? 'btn-primary' : 'btn-secondary'}
              onClick={() => { if (!darkMode) onToggleTheme(); }}
            >
              🌙 Dark Mode
            </button>
          </div>
        </div>

        {/* Backend Connectivity Settings */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>🔌</span> Backend API Connection
            </div>
            <div className={`connection-pill ${backendOnline ? 'online' : 'offline'}`}>
              <span className="pulse-dot" />
              <span>{backendOnline ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            The frontend connects to the Spring Boot REST API for persistent MySQL storage.
          </p>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Spring Boot API Base URL</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1, minWidth: 260 }}
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <button className="btn-primary" onClick={handleSaveApiUrl}>
                Save URL
              </button>
              <button className="btn-secondary" onClick={handleResetApiUrl}>
                Reset Default
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn-secondary"
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? 'Testing...' : '⚡ Test Backend Connection'}
            </button>
          </div>
        </div>

        {/* Database Utilities */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>🗄️</span> Database Utilities & Sample Data
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Seed demonstrative sample tasks into your MySQL database for testing priorities, filters, and deadlines.
          </p>
          <button
            className="btn-secondary"
            onClick={handleTriggerSeed}
            disabled={seeding || !backendOnline}
          >
            {seeding ? 'Seeding...' : '🌱 Seed Sample Tasks'}
          </button>
          {!backendOnline && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>
              Backend must be running to seed data.
            </div>
          )}
        </div>

        {/* System & Architecture Info */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span>ℹ️</span> System Architecture
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8125rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Frontend</div>
              <div style={{ color: 'var(--text-muted)' }}>React 19 + Vite</div>
              <div style={{ color: 'var(--text-muted)' }}>Port: 5173</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Backend</div>
              <div style={{ color: 'var(--text-muted)' }}>Spring Boot 3.3.4 (Java 21)</div>
              <div style={{ color: 'var(--text-muted)' }}>Port: 8080</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Database</div>
              <div style={{ color: 'var(--text-muted)' }}>MySQL 8.0</div>
              <div style={{ color: 'var(--text-muted)' }}>Database: daily_task_management</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
