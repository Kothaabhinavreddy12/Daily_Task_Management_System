/**
 * API Service for Daily Task Management System
 * Communicates with Spring Boot backend REST endpoints
 */

const getBaseUrl = () => {
  const custom = localStorage.getItem('task_api_url');
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  // If running in development with Vite proxy, use relative /api
  // Otherwise default to standard backend port
  return 'http://localhost:8080/api';
};

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const errorMsg =
      (data && data.message) ||
      (data && data.error) ||
      (data && data.errors && Object.values(data.errors).join(', ')) ||
      `HTTP error ${res.status}: ${res.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const taskApi = {
  /**
   * Fetch all tasks with optional search, filters, and sorting
   */
  async getTasks(filters = {}) {
    const baseUrl = getBaseUrl();
    const query = new URLSearchParams();

    if (filters.search) query.append('search', filters.search);
    if (filters.status && filters.status !== 'All') query.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') query.append('priority', filters.priority);
    if (filters.category && filters.category !== 'All') query.append('category', filters.category);
    if (filters.filterType) query.append('filterType', filters.filterType);
    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.sortDirection) query.append('sortDirection', filters.sortDirection);

    const queryString = query.toString();
    const url = `${baseUrl}/tasks${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    const json = await handleResponse(res);
    return json.data || [];
  },

  /**
   * Fetch single task by ID
   */
  async getTaskById(id) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/${id}`);
    const json = await handleResponse(res);
    return json.data;
  },

  /**
   * Create new task
   */
  async createTask(taskData) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  /**
   * Update entire task
   */
  async updateTask(id, taskData) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  /**
   * Update task status (Pending, In Progress, Completed)
   */
  async updateStatus(id, status) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await handleResponse(res);
    return json.data;
  },

  /**
   * Delete task by ID
   */
  async deleteTask(id) {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Fetch dashboard statistics summary
   */
  async getStats() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/stats`);
    const json = await handleResponse(res);
    return json.data;
  },

  /**
   * Fetch today's tasks
   */
  async getTodayTasks() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/today`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  /**
   * Fetch overdue tasks
   */
  async getOverdueTasks() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/overdue`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  /**
   * Fetch upcoming tasks
   */
  async getUpcomingTasks() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/upcoming`);
    const json = await handleResponse(res);
    return json.data || [];
  },

  /**
   * Seed / reset sample tasks in database
   */
  async seedSampleData() {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/tasks/seed`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  /**
   * Health check / ping backend
   */
  async ping() {
    const baseUrl = getBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/tasks/stats`, {
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
