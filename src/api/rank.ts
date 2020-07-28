import request from '@/utils/request'

// 排行榜所有榜单内容摘要
export const getRankListRequest = () => {
  return request({
    url: `/toplist/detail`,
    method: 'get',
  })
}
