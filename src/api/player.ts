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
