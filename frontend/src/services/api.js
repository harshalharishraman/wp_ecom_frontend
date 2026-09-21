import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' })

const ACCESS_KEY = 'simplecart_customer_access'
const REFRESH_KEY = 'simplecart_customer_refresh'

export const storage = {
  get access() { return localStorage.getItem(ACCESS_KEY) },
  get refresh() { return localStorage.getItem(REFRESH_KEY) },
  set(data) {
    if (data?.access_token) localStorage.setItem(ACCESS_KEY, data.access_token)
    if (data?.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

// The backend envelope is { status, msg, data }, but several error paths swap the
// arguments, producing { status: null, msg: <number>, data: <message string> }.
export const envelopeMessage = (body) => {
  if (!body || typeof body !== 'object') return ''
  if (typeof body.msg === 'string' && body.msg) return body.msg
  if (typeof body.data === 'string' && body.data) return body.data
  return ''
}

// The backend reports an invalid/expired access token as HTTP 500 with this message.
const isAuthFailure = (error) => {
  const status = error.response?.status
  if (status === 401 || status === 403) return true
  return status === 500 && /token|jwt/i.test(envelopeMessage(error.response?.data))
}

api.interceptors.request.use((config) => {
  const token = config.userType === 'admin' ? localStorage.getItem('simplecart_admin_access') : storage.access
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

const refreshCustomerToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${api.defaults.baseURL}/cus/refresh`, { refresh_token: storage.refresh })
      .then((result) => {
        const data = result.data?.data
        if (!data?.access_token) throw new Error('Refresh failed')
        storage.set(data)
        return data.access_token
      })
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const canRetry =
      original &&
      original.userType !== 'admin' &&
      !original._retry &&
      !original.url?.includes('/refresh') &&
      !original.url?.includes('/login') &&
      storage.refresh &&
      isAuthFailure(error)
    if (!canRetry) throw error
    original._retry = true
    try {
      const token = await refreshCustomerToken()
      original.headers.Authorization = `Bearer ${token}`
      return api(original)
    } catch (refreshError) {
      storage.clear()
      localStorage.removeItem('simplecart_user')
      localStorage.removeItem('simplecart_user_type')
      window.location.href = '/login'
      throw refreshError
    }
  },
)

export const responseData = (response) => {
  const body = response.data
  if (typeof body?.status === 'number' && body.status >= 400) throw new Error(envelopeMessage(body) || 'Request failed')
  return body?.data ?? {}
}

export const apiError = (error) => {
  const message = envelopeMessage(error.response?.data) || error.response?.data?.message
  if (message) return new Error(message)
  if (error.code === 'ERR_NETWORK') return new Error('Cannot reach the server. Check your connection and try again.')
  return new Error(error.message || 'Something went wrong')
}
