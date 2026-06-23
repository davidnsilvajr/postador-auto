// Cliente de API do Postador Auto.
// Em dev, usa caminhos relativos (/api/v1/...) que o Vite faz proxy para :8000.
// Em producao, defina VITE_API_URL com a URL do backend.

const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

// userId corrente — definido pelo AuthProvider via setCurrentUserId().
let _currentUserId = ''

export function setCurrentUserId(uid: string) {
  _currentUserId = uid
}

export function getCurrentUserId(): string {
  return _currentUserId
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers ?? {}),
    },
  })

  const text = await res.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const detail =
      (data && (data.detail || data.error || data.message)) || res.statusText
    throw new ApiError(
      typeof detail === 'string' ? detail : JSON.stringify(detail),
      res.status
    )
  }
  return data as T
}

const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// ---------------- Tipos ----------------

export interface Guideline {
  primary_color?: string
  secondary_color?: string
  tagline?: string
  keywords?: string[]
  brand_voice_description?: string
  do_not_say?: string[]
  must_include?: string[]
  logo_url?: string
}

export interface Persona {
  id: string
  user_id: string
  name: string
  industry?: string
  website?: string
  description?: string
  tone_of_voice?: string
  target_audience?: string
  company_info?: string
  brand_guidelines?: Guideline[] | Guideline
}

export interface GeneratedContent {
  captions: Record<string, string>
  caption?: string | null
  hashtags: string[]
  image_prompt?: string | null
  image_url?: string | null
  image_error?: string | null
  variations: string[]
  best_posting_times: string[]
  content_pillars: string[]
}

export interface SocialAccount {
  id: string
  user_id: string
  platform: string
  page_id?: string
  username?: string
  status?: string
}

export interface Post {
  id: string
  caption: string
  hashtags?: string[]
  platforms?: string[]
  media?: { type: string; url: string; alt_text?: string }[]
  status?: string
  brand_id?: string
}

// ---------------- Endpoints ----------------

export const api = {
  // Personas (tabela `brands`)
  listPersonas: (userId = _currentUserId) =>
    http.get<Persona[]>(`/api/v1/brands/?user_id=${encodeURIComponent(userId)}`),
  getPersona: (id: string) => http.get<Persona>(`/api/v1/brands/${id}`),
  createPersona: (data: Partial<Persona> & { name: string }) =>
    http.post<Persona>('/api/v1/brands/', { user_id: _currentUserId, ...data }),
  updatePersona: (id: string, updates: Partial<Persona>) =>
    http.put<Persona>(`/api/v1/brands/${id}`, updates),
  deletePersona: (id: string) => http.del<{ status: string }>(`/api/v1/brands/${id}`),
  saveGuideline: (id: string, guideline: Guideline) =>
    http.post<Guideline>(`/api/v1/brands/${id}/guideline`, guideline),
  uploadLogo: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<{ url: string }>(`/api/v1/brands/${id}/logo`, {
      method: 'POST',
      body: form,
    })
  },

  // Geracao de conteudo com IA
  generate: (payload: {
    brand_id: string
    topic: string
    campaign?: string
    tone?: string
    platforms?: string[]
    language?: string
    generate_image?: boolean
  }) => http.post<GeneratedContent>('/api/v1/posts/generate', payload),

  // Posts
  createPost: (data: Record<string, unknown>) =>
    http.post<Post>('/api/v1/posts/', { user_id: _currentUserId, ...data }),
  listPosts: (params: { brand_id?: string; status?: string } = {}) => {
    const q = new URLSearchParams({ user_id: _currentUserId })
    if (params.brand_id) q.set('brand_id', params.brand_id)
    if (params.status) q.set('status', params.status)
    return http.get<Post[]>(`/api/v1/posts/?${q.toString()}`)
  },
  publishNow: (postId: string, platforms: string[]) =>
    http.post<Record<string, unknown>>(`/api/v1/posts/${postId}/publish-now`, platforms),
  schedulePost: (postId: string, platform: string, scheduledAt: string) =>
    http.post(`/api/v1/posts/${postId}/schedule`, {
      platform,
      scheduled_at: scheduledAt,
      user_id: _currentUserId,
    }),

  // Contas sociais
  listAccounts: (userId = _currentUserId) =>
    http.get<SocialAccount[]>(`/api/v1/social-accounts/?user_id=${encodeURIComponent(userId)}`),
  connectAccount: (data: { platform: string; access_token: string; page_id?: string }) =>
    http.post<SocialAccount>('/api/v1/social-accounts/', { user_id: _currentUserId, ...data }),
  disconnectAccount: (id: string) =>
    http.del<{ status: string }>(`/api/v1/social-accounts/${id}`),
}

export { ApiError }
