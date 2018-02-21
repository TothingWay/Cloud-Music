export default function (obj, json, times, fx, fn) {
  // 如果 times fx fn 都没有传
  if (typeof times === 'undefined') {
    times = 400
    fx = 'ease'
  }
  // 如果 times 没传，但fx传了
  if (typeof times === 'string') {
    // 在上面的基础上判断是否传入fn
    if (typeof fx === 'function') {
      fx = fn
    }
    fx = times
    times = 400
  } else if (typeof times === 'function') { // 只传入fn
    fn = times
    times = 400
    fx = 'ease'
  } else if (typeof times === 'number') { // 传入times，fx fn待定
    if (typeof fx === 'function') { // 在上面的基础上判断 fn 是否传入
      fn = fx
      fx = 'ease'
    } else if (typeof fx === 'undefined') {
      fx = 'ease'
    }
  }

  // 设置初始值
  var iCur = {}
  for (var attr in json) {
    iCur[attr] = 0
    if (attr === 'opacity') {
      iCur[attr] = Math.round(getStyle(obj, attr) * 100)
    } else {
      iCur[attr] = parseInt(getStyle(obj, attr))
    }
  }

  var startTime = now()

  clearInterval(obj.timer)
  obj.timer = setInterval(function () {
    var changeTime = now()
    // 得到当前时间（变化的）
    var t = times - Math.max(0, startTime - changeTime + times) // 范围为 0 ~ times

    for (var attr in json) {
      // 通过 Tween 算法执行动画，并得到目标点
      var value = Tween[fx](t, iCur[attr], json[attr] - iCur[attr], times)
      if (attr === 'opacity') {
        obj.style[attr] = value / 100
        obj.style.filter = 'alpha(opacity=' + value + ')'
      } else {
        obj.style[attr] = value + 'px'
      }
    }
    // 动画结束，清楚定时器，如果有函数则执行函数，并把函数中的this指向obj
    if (t === times) {
      clearInterval(obj.timer)
      fn && fn.call(obj)
    }
  }, 13)
}

function now () {
  return (new Date()).getTime()
}

function getStyle (obj, attr) {
  return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr]
}
/*
    Tween算法 （公式）

    4个参数： (t,b,c,d)
      t (当前时间): current time ( 可变的，指当前对象运动的当前时间 )
      b (初始值): beginning value ( 固定值 )
      c (变化量): change in value ( 固定值 )
      d (持续时间): duration ( 固定值 )

    return （ 目标点  ）

*/
var Tween = {
  linear: function (t, b, c, d) { // 匀速
    return c * t / d + b
  },
  easeIn: function (t, b, c, d) { // 加速曲线
    return c * (t /= d) * t + b
  },
  easeOut: function (t, b, c, d) { // 减速曲线
    return -c * (t /= d) * (t - 2) + b
  },
  ease: function (t, b, c, d) { // 加速减速曲线
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b
  },
  easeInStrong: function (t, b, c, d) { // 加加速曲线
    return c * (t /= d) * t * t * t + b
  },
  easeOutStrong: function (t, b, c, d) { // 减减速曲线
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  },
  easeStrong: function (t, b, c, d) { // 加加速减减速曲线
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b
  },
  backIn: function (t, b, c, d, s) { // 回退加速（回退渐入）
    if (typeof s === 'undefined') {
      s = 1.70158
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b
  },
  backOut: function (t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 3.70158 // 回缩的距离
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
  },
  back: function (t, b, c, d, s) {
    if (typeof s === 'undefined') {
      s = 1.70158
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
  },
  bounceIn: function (t, b, c, d) { // 弹球减振（弹球渐出）
    return c - Tween['bounceOut'](d - t, 0, c, d) + b
  },
  bounceOut: function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
    }
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
  },
  bounce: function (t, b, c, d) {
    if (t < d / 2) {
      return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b
    }
    return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
  }
}
