import { rankListType } from './../store/modules/Rank/data.d'
//防抖函数
export const debounce = (
  func: (func: () => void) => void,
  delay: number,
): (() => void) => {
  let timer: any
  return function (this: any, ...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, delay)
  }
}

// 计算 Count
export const calculateCount = (count: number) => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

// 判断是否是iphoneX
export const isIphoneXDevice = () => {
  const device =
    window.devicePixelRatio &&
    window.devicePixelRatio === 3 &&
    window.screen.width === 375 &&
    navigator.userAgent.indexOf('iPhone') > -1

  return device
}

//处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = (rankList: rankListType[]) => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1
    }
  }
}

// 处理歌手列表拼接歌手名字
export const getName = (list: Array<{ name: string }>) => {
  let str = ''
  list.map((item, index) => {
    str += index === 0 ? item.name : '/' + item.name
    return item
  })
  return str
}

const elementStyle = document.createElement('div').style

const vendor = (() => {
  //首先通过transition属性判断是何种浏览器
  const transformNames: any = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransfrom',
    ms: 'msTransform',
    standard: 'Transform',
  }
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

// 给css3相关属性增加浏览器前缀，处理浏览器兼容性问题
export function prefixStyle(style: string) {
  if (vendor === false || vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 拼接出歌曲的url链接
export const getSongUrl = (id: number) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

//转换歌曲播放时间
export const formatPlayTime = (interval: any) => {
  interval = interval | 0 // |0表示向下取整
  const minute = (interval / 60) | 0
  const second = (interval % 60).toString().padStart(2, '0')
  return `${minute}:${second}`
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 随机算法
export function shuffle(arr: Array<any>) {
  const new_arr: any[] = []
  arr.forEach((item) => {
    new_arr.push(item)
  })
  for (let i = 0; i < new_arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = new_arr[i]
    new_arr[i] = new_arr[j]
    new_arr[j] = t
  }
  return new_arr
}

// 找到当前的歌曲索引
export const findIndex = (song: any, list: Array<any>) => {
  return list.findIndex((item) => {
    return song.id === item.id
  })
}
