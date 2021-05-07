import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('网络错误', error)
  }
)

export default service
