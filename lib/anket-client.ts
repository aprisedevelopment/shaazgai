const API_BASE = '/api/anket';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`API Error (${res.status}) at ${endpoint}:`, text);
    let errorObj;
    try {
      errorObj = JSON.parse(text);
    } catch {
      errorObj = { error: 'Unknown API error' };
    }
    throw new Error(errorObj.error || 'Алдаа гарлаа');
  }

  return res.json();
}

// Applications API
export const applicationsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    position?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.position) query.set('position', params.position);
    if (params?.search) query.set('search', params.search);
    const queryStr = query.toString();
    return fetchApi(`/applications${queryStr ? `?${queryStr}` : ''}`);
  },

  get: (id: string) => fetchApi(`/applications/${id}`),

  create: (data: any) =>
    fetchApi('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/applications/${id}`, {
      method: 'DELETE',
    }),
};

// Jobs API
export const jobsApi = {
  list: (all = false) => fetchApi(`/jobs${all ? '?all=true' : ''}`),

  get: (id: string) => fetchApi(`/jobs/${id}`),

  create: (data: any) =>
    fetchApi('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchApi(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/jobs/${id}`, {
      method: 'DELETE',
    }),
};

// Track API
export const trackApi = {
  search: (phone: string, registerNumber: string) =>
    fetchApi('/track', {
      method: 'POST',
      body: JSON.stringify({ phone, register_number: registerNumber }),
    }),
};
