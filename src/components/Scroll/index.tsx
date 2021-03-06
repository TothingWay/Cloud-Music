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
import { scrollFunc } from './data.d'

import PullDownLoading from '@/components/Loading/neteaseStroke'
import PullUpLoading from '@/components/Loading/more'

BScroll.use(Pullup)
BScroll.use(PullDown)

type ScrollProps = {
  children?: ReactNode
  direction?: 'vertical' | 'horizental'
  click?: boolean
  stopPropagation?: boolean
  refresh?: boolean
  onScroll?: (pos: any) => void
  pullUpLoading?: boolean
  pullDownLoading?: boolean
  pullUp?: (pos: any) => void
  pullDown?: (pos: any) => void
  bounceTop?: boolean //是否支持向上吸顶
  bounceBottom?: boolean //是否支持向下吸顶
  threshold?: number
  stop?: number
  className?: string
}

const Scroll = forwardRef<scrollFunc, ScrollProps>((props, ref) => {
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
    pullUpLoading = false,
    pullDownLoading = false,
    bounceTop = true,
    bounceBottom = true,
    threshold = 70,
    stop = 80,
    stopPropagation = true,
    className,
  } = props

  // Method props
  const { pullUp, pullDown, onScroll } = props

  const pullUpDebounce = useMemo(() => {
    if (pullUp) {
      return debounce(pullUp, 500)
    }
  }, [pullUp])

  const pullDownDebounce = useMemo(() => {
    if (pullDown) {
      return debounce(pullDown, 500)
    }
  }, [pullDown])

  // init BScroll
  useEffect(() => {
    if (bScroll) return
    // eslint-disable-next-line
    const scroll = new BScroll(scrollRef.current!, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      pullDownRefresh: pullDownLoading
        ? {
            threshold,
            stop,
          }
        : false,
      pullUpLoad: pullUpLoading,
      stopPropagation: stopPropagation,
    } as any)
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
    const pullingDown = (pos: any) => {
      const pullDownMaxY = pos.y > threshold ? threshold : pos.y
      setIsPulling(true)
      setPullDownY(pos.y)
      setStrokeDashoffset(
        Math.min(2825, 2825 - (pullDownMaxY * 2825) / threshold),
      )
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

  return (
    <div className={`${style['scroll-wrapper']} ${className}`} ref={scrollRef}>
      <div className={direction === 'horizental' ? style['scroller'] : ''}>
        {props.children}
        {/* 滑到底部加载动画 */}
        <div
          className={style['pull-up-loading']}
          style={pullUpLoading ? { display: 'block' } : { display: 'none' }}
        >
          <PullUpLoading />
        </div>
      </div>
      {/* 顶部下拉刷新动画 */}
      {pullDownLoading ? (
        <PullDownLoading
          strokeDashoffset={strokeDashoffset}
          pullDownY={pullDownY}
        />
      ) : null}
    </div>
  )
})

export default Scroll
