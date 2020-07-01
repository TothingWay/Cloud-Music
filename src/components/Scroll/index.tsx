import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  ReactNode,
} from 'react'
import { debounce } from '@/utils'
import style from './index.module.scss'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'

import PullDownLoading from '@/components/Loading/neteaseStroke'

BScroll.use(Pullup)
BScroll.use(PullDown)

type ScrollProps = {
  children?: ReactNode
  direction?: 'vertical' | 'horizental'
  click?: boolean
  refresh?: boolean
  onScroll?: Function
  pullUpLoading?: boolean
  pullDownLoading?: boolean
  pullUp?: Function
  pullDown?: Function
  bounceTop?: boolean //是否支持向上吸顶
  bounceBottom?: boolean //是否支持向下吸顶
  threshold?: number
  stop?: number
}

const Scroll = forwardRef<any, ScrollProps>((props, ref) => {
  const [bScroll, setBScroll] = useState<BScroll | null>()
  const [strokeDashoffset, setStrokeDashoffset] = useState(2825)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDownY, setPullDownY] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Attribute props
  const {
    direction = 'vertical',
    click = true,
    refresh = true,
    // pullUpLoading = false,
    pullDownLoading = false,
    bounceTop = true,
    bounceBottom = true,
    threshold = 70,
    stop = 80,
  } = props

  // Method props
  const { pullUp, pullDown, onScroll } = props

  let pullUpDebounce = useMemo(() => {
    if (pullUp) {
      return debounce(pullUp, 500)
    }
  }, [pullUp])

  let pullDownDebounce = useMemo(() => {
    if (pullDown) {
      return debounce(pullDown, 500)
    }
  }, [pullDown])

  // init BScroll
  useEffect(() => {
    if (bScroll) return
    const scroll = new BScroll(scrollRef.current!, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      pullDownRefresh: {
        threshold,
        stop,
      },
      stopPropagation: true
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  // watch onScroll
  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', onScroll)
    return () => {
      bScroll.off('scroll', onScroll)
    }
  }, [onScroll, bScroll])

  // watch pullUp
  useEffect(() => {
    if (!bScroll || !pullUp) return
    const handlePullUp = () => {
      //判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce && pullUpDebounce()
      }
    }
    bScroll.on('scrollEnd', handlePullUp)
    return () => {
      bScroll.off('scrollEnd', handlePullUp)
    }
  }, [pullUp, pullUpDebounce, bScroll])

  // watch pullDown finished
  useEffect(() => {
    if (!bScroll || !pullDown) return

    const handlePullDown = (pos: any) => {
      //判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce && pullDownDebounce()
      }
    }
    bScroll.on('touchEnd', handlePullDown)
    return () => {
      bScroll.off('touchEnd', handlePullDown)
    }
  }, [pullDown, pullDownDebounce, bScroll])

  // watch pullingDown
  useEffect(() => {
    if (!bScroll || !pullDownLoading) return
    let pullingDown = (pos: any) => {
      const pullDownMaxY = pos.y > threshold ? threshold : pos.y
      setIsPulling(true)
      setPullDownY(pos.y)
      setStrokeDashoffset(Math.min(2825,2825 - (pullDownMaxY * 2825) / threshold ))
    }
    bScroll.on('scroll', pullingDown)

    return () => {
      bScroll.off('scroll', pullingDown)
    }
  }, [strokeDashoffset, bScroll, pullDownLoading, threshold])

  // refresh BScroll
  useEffect(() => {
    if (refresh && bScroll) {
      // 下拉加载时不调用 refresh 方法
      if (isPulling) {
        return
      }
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    },
    finishPullDown() {
      if (bScroll) {
        setIsPulling(false)
        bScroll.finishPullDown()
      }
    },
  }))

  /* const PullUpdisplayStyle = pullUpLoading
    ? { display: '' }
    : { display: 'none' }
  const PullDowndisplayStyle = pullDownLoading
    ? { display: '' }
    : { display: 'none' } */

  return (
    <div className={style['scroll-wrapper']} ref={scrollRef}>
      <div className={style["scroll-content"]}>
        {props.children}
      </div>
      {/* 滑到底部加载动画 */}
      {/* <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading> */}
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading strokeDashoffset={strokeDashoffset} pullDownY={pullDownY}/>
    </div>
  )
})

export default Scroll
