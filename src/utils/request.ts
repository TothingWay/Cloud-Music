import axios from 'axios'

const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('网络错误', error)
  }
)

export default service