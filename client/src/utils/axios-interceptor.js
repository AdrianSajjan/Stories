import axios from 'axios'
import store from '../store'
import { logout, updateTokens } from '../actions/auth'

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['access-token'] = token
  } else {
    delete axios.defaults.headers.common['access-token']
  }
}

export const useInterceptors = (token) => {
  if (!token) return

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      if (error.response.status !== 401 || originalRequest._retry)
        return Promise.reject(error)

      if (originalRequest.url === 'http://localhost:5000/api/auth/oauth2') {
        store.dispatch(logout())
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      const res = await axios.post('/api/auth/oauth2', { refreshToken })
      store.dispatch(updateTokens(res.data))
      setAuthToken(res.data.access_token)

      return axios(originalRequest)
    }
  )
}
