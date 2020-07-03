import axios from 'axios'

const service = axios.create({
  baseURL: process.env.baseURL,
})

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('网络错误', error)
  }
)

export default service