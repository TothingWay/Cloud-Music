// 创建随机播放列表
function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle (arr) {
  let randomArr = arr.slice()
  for (let i = 0; i < randomArr.length; i++) {
    let j = random(0, i)
    let t = randomArr[i]
    randomArr[i] = randomArr[j]
    randomArr[j] = t
  }
  return randomArr
}

export function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
