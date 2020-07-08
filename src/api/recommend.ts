import request from '@/utils/request'

// banner
export const getBannerListRequest = () => {
  return request({
    url: `/banner`,
    method: 'get'
  })
}

// 歌单
export const getRecommendListRequest = () => {
  return request({
    url: `/personalized`,
    method: 'get'
  })
}