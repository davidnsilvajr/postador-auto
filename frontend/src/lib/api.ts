const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers: extraHeaders = {} } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Posts
  posts: {
    list: (params?: Record<string, string>) => {
      const q = new URLSearchParams(params);
      return apiFetch(`/posts?${q}`);
    },
    get: (id: string) => apiFetch(`/posts/${id}`),
    create: (data: unknown) => apiFetch('/posts', { method: 'POST', body: data }),
    update: (id: string, data: unknown) => apiFetch(`/posts/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => apiFetch(`/posts/${id}`, { method: 'DELETE' }),
    approve: (id: string, action: string, feedback?: string) =>
      apiFetch(`/posts/${id}/approve`, { method: 'POST', body: { action, feedback } }),
    schedule: (id: string, data: unknown) =>
      apiFetch(`/posts/${id}/schedule`, { method: 'POST', body: data }),
    publishNow: (id: string, platforms: string[]) =>
      apiFetch(`/posts/${id}/publish-now`, { method: 'POST', body: { platforms } }),
    generate: (data: unknown) => apiFetch('/posts/generate', { method: 'POST', body: data }),
    getCalendar: (start: string, end: string) =>
      apiFetch(`/posts/calendar?start_date=${start}&end_date=${end}`),
    stats: () => apiFetch('/posts/stats/summary'),
  },

  // Brands
  brands: {
    list: (userId: string) => apiFetch(`/brands?user_id=${userId}`),
    get: (id: string) => apiFetch(`/brands/${id}`),
    create: (data: unknown) => apiFetch('/brands', { method: 'POST', body: data }),
    update: (id: string, data: unknown) => apiFetch(`/brands/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => apiFetch(`/brands/${id}`, { method: 'DELETE' }),
    saveGuideline: (brandId: string, data: unknown) =>
      apiFetch(`/brands/${brandId}/guideline`, { method: 'POST', body: data }),
    uploadLogo: (brandId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_BASE}/brands/${brandId}/logo`, { method: 'POST', body: formData });
    },
    getContentPillars: (brandId: string) => apiFetch(`/brands/${brandId}/content-pillars`),
    getMonthlyCalendar: (brandId: string, year: number, month: number) =>
      apiFetch(`/brands/${brandId}/monthly-calendar/${year}/${month}`),
  },

  // Analytics
  analytics: {
    summary: (params?: Record<string, string>) => {
      const q = params ? new URLSearchParams(params).toString() : '';
      return apiFetch(`/analytics/summary?${q}`);
    },
    trending: (category?: string) =>
      apiFetch(`/analytics/trending-topics${category ? `?category=${category}` : ''}`),
  },

  // Social Accounts
  socialAccounts: {
    list: (userId: string) => apiFetch(`/social-accounts?user_id=${userId}`),
    connect: (data: unknown) => apiFetch('/social-accounts', { method: 'POST', body: data }),
    disconnect: (id: string) => apiFetch(`/social-accounts/${id}`, { method: 'DELETE' }),
  },
};

export type { T };
