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
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor (count / 10000) < 10000) {
    return Math.floor (count/1000)/10 + "万";
  } else  {
    return Math.floor (count / 10000000)/ 10 + "亿";
  }
}

// 判断是否是iphoneX
export const isIphoneXDevice = () => {
  const device =
    window.devicePixelRatio &&
    window.devicePixelRatio === 3 &&
    window.screen.width === 375 &&
    (navigator.userAgent.indexOf('iPhone') > -1)

    return device
}