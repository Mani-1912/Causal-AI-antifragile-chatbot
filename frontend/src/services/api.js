import axios from 'axios'

const API = axios.create({ baseURL: '/api', timeout: 120000 })

export const startChat    = ()             => API.post('/chat/start')
export const sendMessage  = (session_id, message) =>
  API.post('/chat/message', { session_id, message })

export const getDiseaseInfo = (disease) => API.get('/disease/info', { params: { disease } })
export const getDiseaseList = ()         => API.get('/disease/list')

export const searchHospitals = (params) => API.get('/hospitals/search', { params })

export const submitFeedback = (payload) => API.post('/feedback', payload)
export const getFeedbackStats = ()       => API.get('/feedback/stats')

export const healthCheck = () => API.get('/health')
