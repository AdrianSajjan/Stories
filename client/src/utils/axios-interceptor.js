import axios from 'axios'
import store from '../store'
import { logout, updateTokens } from '../actions/auth'

export const useRequestInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        console.log(token)
        config.headers['access-token'] = token
      }
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )
}

export const useResponseInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      if (error.response.status !== 401 || originalRequest._retry)
        return Promise.reject(error)

      if (originalRequest.url === '/api/auth/oauth2') {
        store.dispatch(logout())
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      const res = await axios.post('/api/auth/oauth2', { refreshToken })
      store.dispatch(updateTokens(res.data))

      return axios(originalRequest)
    }
  )
}
