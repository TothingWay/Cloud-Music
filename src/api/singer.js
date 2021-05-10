import request from '@/utils/request'
import pinyin from 'pinyin'

const HOT_NAME = '热'

// 歌手分类
export const getSingerListRequest = (area = -1, type = -1, limit = 100) => {
  return new Promise((resolve) => {
    request({
      url: `/artist/list`,
      method: 'get',
      params: {
        area,
        type,
        limit
      }
    })
      .then((res) => {
        if (res.code === 200) {
          const singerList = res.artists
          const singerMap = {
            hot: {
              title: HOT_NAME,
              list: singerList.slice(0, 10)
            }
          }

          singerList.forEach((item) => {
            // 把歌手名转成拼音
            const p = pinyin(item.name, {
              style: pinyin.STYLE_NORMAL
            })
            if (!p || !p.length) {
              return
            }
            // 获取歌手名拼音的首字母
            const key = p[0][0].slice(0, 1).toUpperCase()
            if (key) {
              if (!singerMap[key]) {
                singerMap[key] = {
                  title: key,
                  list: []
                }
              }
              // 每个字母下面会有多名歌手
              singerMap[key].list.push([item][0])
            }
          })

          // 热门歌手
          const hot = []
          // 字母歌手
          const letter = []

          // 遍历处理 singerMap，让结果有序
          for (const key in singerMap) {
            const item = singerMap[key]
            if (item.title.match(/[a-zA-Z]/)) {
              letter.push(item)
            } else if (item.title === HOT_NAME) {
              hot.push(item)
            }
          }

          // 按字母顺序排序
          letter.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0)
          })

          resolve(hot.concat(letter))
        } else {
          resolve([])
        }
      })
      .catch(() => {
        resolve([])
      })
  })
}

// 获取歌手单曲
export const getSingerInfoRequest = (id) => {
  return request({
    url: `artists`,
    method: 'get',
    params: {
      id
    }
  })
}
