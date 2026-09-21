import { api, apiError, responseData, storage } from './api'

export const authApi = {
  async login(body, type = 'customer') {
    try {
      const result = responseData(await api.post(`/${type === 'admin' ? 'admin' : 'cus'}/login`, body))
      if (type === 'customer') storage.set(result)
      else if (result.access_token) localStorage.setItem('simplecart_admin_access', result.access_token)
      return result
    } catch (e) { throw apiError(e) }
  },
  async register(body, type = 'customer') {
    try { return responseData(await api.post(`/${type === 'admin' ? 'admin' : 'cus'}/signup`, body)) } catch (e) { throw apiError(e) }
  },
}
