import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import style from './index.module.scss'
import BScroll from '@better-scroll/core'
import slide from '@better-scroll/slide'

BScroll.use(slide)

type SlideProps = {
  refresh?: boolean
  threshold?: number
  loop?: boolean
  slideBanner: Array<any>
}

const Slide = forwardRef<any, SlideProps>((props, ref) => {
  const [slide, setSlide] = useState<BScroll | null>()
  const [playTimer, setPlayTimer] = useState<number>(0)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const SlideRef = useRef<HTMLDivElement>(null)

  // Attribute props
  const { threshold = 100, loop = true, slideBanner = [] } = props

  const nextPage = useCallback(() => {
    if (slide) {
      slide.next()
    }
  }, [slide])

  const prePage = useCallback(() => {
    if (slide) {
      slide.prev()
    }
  }, [slide])

  const autoGoNext = useCallback(() => {
    clearTimeout(playTimer)
    setPlayTimer(
      window.setTimeout(() => {
        nextPage()
      }, 3000),
    )
  }, [nextPage, playTimer])

  // init BScroll
  useEffect(() => {
    if (slide || !slideBanner.length) return
    clearTimeout(playTimer)
    // eslint-disable-next-line
    const bScroll = new BScroll(SlideRef.current!, {
      scrollX: true,
      scrollY: false,
      probeType: 2,
      slide: {
        loop,
        threshold,
      },
      momentum: false,
      bounce: false,
    })
    setSlide(bScroll)
    return () => {
      setSlide(null)
    }
    // eslint-disable-next-line
  }, [])

  // user touches the slide area
  useEffect(() => {
    if (!slide) return
    const clearPlayTimer = () => {
      clearTimeout(playTimer)
    }
    slide.on('beforeScrollStart', clearPlayTimer)
    return () => {
      slide.off('beforeScrollStart', clearPlayTimer)
    }
  }, [playTimer, slide])

  // auto go next page
  useEffect(() => {
    if (!slide || !autoGoNext) return
    slide.on('scrollEnd', autoGoNext)
    return () => {
      slide.off('scrollEnd', autoGoNext)
    }
  }, [autoGoNext, slide])

  // watch slide change
  useEffect(() => {
    if (!slide) return
    const slideWillChange = (page: any) => {
      setCurrentPageIndex(page.pageX)
    }
    slide.on('slideWillChange', slideWillChange)
    return () => {
      slide.off('slideWillChange', slideWillChange)
    }
  }, [slide])

  // refresh slide
  /* useEffect(() => {
    if (refresh && slide) {
      clearTimeout(playTimer)
      slide.refresh()
    }
  }) */

  useImperativeHandle(ref, () => ({
    currentPageIndex,
    nextPage,
    prePage,
    refresh() {
      if (slide) {
        slide.refresh()
        slide.goToPage(0, 0)
      }
    },
    getBScroll() {
      if (slide) {
        return slide
      }
    },
  }))

  return (
    <div className={style['slide-banner-scroll']} ref={SlideRef}>
      <div className={style['slide-banner-wrapper']}>
        {slideBanner.map((item) => {
          return (
            <div key={item.imageUrl} className={style['slide-item']}>
              <img
                src={item.imageUrl}
                width="100%"
                height="100%"
                alt="images"
              />
            </div>
          )
        })}
      </div>

      <div className={style['docs-wrapper']}>
        {slideBanner.map((item, index) => {
          return (
            <span
              key={item + index}
              className={`${style['doc']} ${
                currentPageIndex === index ? style['active'] : ''
              }`}
            ></span>
          )
        })}
      </div>
    </div>
  )
})

export default React.memo(Slide)
