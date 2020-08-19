import request from '@/utils/request'

export const getHotKeyWordsRequest = () => {
  return request({
    url: `/search/hot`,
    method: 'get',
  })
}

export const getSuggestListRequest = (keywords: string) => {
  return request({
    url: `/search/suggest`,
    method: 'get',
    params: {
      keywords,
    },
  })
}

export const getResultSongsListRequest = (keywords: string) => {
  return request({
    url: `/search`,
    method: 'get',
    params: {
      keywords,
    },
  })
}
