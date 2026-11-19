const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';
const TOKEN_KEY = 'opspilot-auth-token';

export type ApiUser = { id: string; name: string; email: string; role: string };
export type ApiTask = { id: number; title: string; department: string; owner: string; due: string; status: 'In progress' | 'Review' | 'Completed'; priority: 'High' | 'Medium' | 'Low' };

function token() { return localStorage.getItem(TOKEN_KEY); }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  if (token()) headers.set('authorization', `Bearer ${token()}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload as T;
}

export const api = {
  login: async (email: string, password: string) => {
    const result = await request<{ token: string; user: ApiUser }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem(TOKEN_KEY, result.token);
    return result.user;
  },
  logout: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => Boolean(token()),
  getTasks: () => request<{ data: ApiTask[]; total: number }>('/api/tasks'),
  createTask: (task: Omit<ApiTask, 'id' | 'status'>) => request<{ data: ApiTask }>('/api/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id: number, status: ApiTask['status']) => request<{ data: ApiTask }>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteTask: (id: number) => request<{ deleted: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' })
};
