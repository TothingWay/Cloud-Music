import request from '@/utils/request'

export const getBannerListRequest = () => {
  return request({
    url: `/banner`,
    method: 'get'
  })
}

export const getRecommendListRequest = () => {
  return request({
    url: `/personalized`,
    method: 'get'
  })
}