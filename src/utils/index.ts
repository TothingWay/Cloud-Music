import { rankListType } from './../store/modules/Rank/data.d'
//防抖函数
export const debounce = (func: Function, delay: number) => {
  let timer: any
  return function(this: any, ...args: any[]) {
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
