import request from '@/utils/request'

// 热门歌手
export const getHotSingerListRequest = (count: string) => {
  return request({
    url: `/top/artists?offset=${count}`,
    method: 'get',
  })
}

// 歌手分类
export const getSingerListRequest = (
  area: string,
  alpha: string,
  type: string,
  offset: string
) => {
  return request({
    url: `/artist/list`,
    method: 'get',
    params: {
      area,
      initial: alpha.toLowerCase(),
      type,
      offset
    }
  })
}