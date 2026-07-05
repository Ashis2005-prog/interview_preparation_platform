import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('prepiq_token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('prepiq_token')
      localStorage.removeItem('prepiq_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register:    (d) => api.post('/auth/register', d),
  login:       (d) => api.post('/auth/login', d),
  me:          ()  => api.get('/auth/me'),
  preferences: (p) => api.patch('/auth/preferences', p),
}
export const questionsAPI = {
  getAll:          (p) => api.get('/questions', { params: p }),
  search:          (q, limit=8) => api.get('/questions/search', { params: { q, limit } }),
  recommendations: () => api.get('/questions/recommendations'),
  solve:           (id) => api.post('/questions/'+id+'/solve'),
  star:            (id) => api.post('/questions/'+id+'/star'),
}
export const roadmapAPI = {
  get:          ()     => api.get('/roadmap'),
  completeNode: (id)   => api.post('/roadmap/complete/'+id),
}
export const aiAPI = {
  message:    (messages) => api.post('/ai/message', { messages }),
  getHistory: ()         => api.get('/ai/history'),
}
export const progressAPI = {
  getStats:    () => api.get('/progress/stats'),
  getActivity: () => api.get('/progress/activity'),
  log:         () => api.post('/progress/log'),
}
export const usersAPI = {
  leaderboard: () => api.get('/users/leaderboard'),
}

export default api
