const API_BASE = import.meta.env.VITE_API_BASE || '/api/index.php';

export async function apiRequest(route, options = {}) {
  const response = await fetch(`${API_BASE}?route=${encodeURIComponent(route)}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong.');
  return payload;
}

export async function getPublicContent(type = '') {
  const response = await apiRequest('content');
  const items = response.items || [];
  return { items: type ? items.filter(item => item.content_type === type) : items };
}
