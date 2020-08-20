import request from '@/utils/request'

export const getLyricRequest = (id: number) => {
  return request({
    url: `/lyric`,
    method: 'get',
    params: {
      id,
    },
  })
}

export const getSongDetailRequest = (id: number) => {
  return request({
    url: `/song/detail`,
    method: 'get',
    params: {
      ids: id,
    },
  })
}
