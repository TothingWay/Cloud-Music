import request from '@/utils/request'

// 排行榜所有榜单内容摘要
export const getAlbumDetailRequest = (id: number) => {
  return request({
    url: `/playlist/detail`,
    method: 'get',
    params: {
      id,
    },
  })
}
