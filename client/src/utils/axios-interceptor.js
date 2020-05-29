import axios from 'axios'
//import store from '../store'

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
    (error) => {
      if (error.response.status === 401) {
        console.error('Invalid Token Logging Out')
      }

      return Promise.reject(error)
    }
  )
}
