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
  category: string,
  alpha: string,
  type: string,
  offset: string
) => {
  return request({
    url: `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&type=${type}&offset=${offset}`,
    method: 'get',
  })
}
