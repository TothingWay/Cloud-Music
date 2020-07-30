/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { RouteComponentProps } from 'react-router'
import '@/styles/global.scss'
import style from './index.module.scss'
import Header from '@/components/Header'
import SongList from '@/components/SongList'
import Scroll from '@/components/Scroll'
import { scrollFunc } from '@/components/Scroll/data.d'

const artist = {
  picUrl:
    'https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg',
  name: '薛之谦',
  hotSongs: [
    {
      id: 1,
      name: '我好像在哪见过你',
      ar: [{ name: '薛之谦' }],
      al: {
        name: '薛之谦专辑',
      },
    },
    {
      id: 2,
      name: '我好像在哪见过你',
      ar: [{ name: '薛之谦' }],
      al: {
        name: '薛之谦专辑',
      },
    },
    // 省略 20 条
  ],
}

function Singer(props: RouteComponentProps) {
  const [showStatus, setShowStatus] = useState(true)

  const imageWrapper = useRef<HTMLDivElement>(null)
  const songScrollWrapper = useRef<HTMLDivElement>(null)
  const songScroll = useRef<scrollFunc>(null)
  const header = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  // 图片初始高度
  const initialHeight = useRef(0)
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  useEffect(() => {
    const h = imageWrapper.current!.offsetHeight
    songScrollWrapper.current!.style.top = `${h - OFFSET}px`
    initialHeight.current = h

    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current!.style.top = `${h - OFFSET}px`
    songScroll.current!.refresh()
    //eslint-disable-next-line
  }, []);

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <div className={style['container']}>
        <Header ref={header} title={'头部'} handleClick={handleBack} />
        <div
          ref={imageWrapper}
          className={style['img-wrapper']}
          style={{ background: `url(${artist.picUrl})` }}
        >
          <div className={style['filter']} />
        </div>
        <div ref={layer} className={style['bg-layer']}></div>
        <div className={style['song-list-wrapper']} ref={songScrollWrapper}>
          <Scroll ref={songScroll}>
            <SongList songs={artist.hotSongs} />
          </Scroll>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Singer
