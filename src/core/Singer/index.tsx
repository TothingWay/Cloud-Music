/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import { CSSTransition } from 'react-transition-group'
import '@/styles/global.scss'
import style from './index.module.scss'
import Header from '@/components/Header'
import SongList from '@/components/SongList'
import Scroll from '@/components/Scroll'
import { scrollFunc } from '@/components/Scroll/data.d'
import { storeType } from '@/store/data'
import { useSelector, useDispatch } from 'react-redux'
import * as actionTypes from '@/store/modules/Singer/actionCreators'
import { getSingerInfoRequest } from '@/api/singer'
import { withRouter, RouteComponentProps } from 'react-router'
import Loading from '@/components/Loading'

function Singer(props: RouteComponentProps<any>) {
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
  }, [])

  const handleScroll = useCallback((pos) => {
    const height = initialHeight.current!
    const newY = pos.y
    const imageDOM = imageWrapper.current!
    const headerDOM = header.current!
    const layerDOM = layer.current!
    const minScrollY = -(height - OFFSET) + 48

    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height)

    if (newY > 0) {
      //处理往下拉的情况,效果：图片放大，按钮跟着偏移
      imageDOM.style['transform'] = `scale(${1 + percent})`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } else if (newY >= minScrollY) {
      //往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      layerDOM.style.zIndex = `1`
      imageDOM.style.paddingTop = '75%'
      imageDOM.style.height = `0`
      imageDOM.style.zIndex = `-1`
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${48 - OFFSET}px`
      layerDOM.style.zIndex = `1`
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = `100`
      //此时图片高度与Header一致
      imageDOM.style.height = `48px`
      imageDOM.style.paddingTop = `0`
      imageDOM.style.zIndex = `99`
    }
  }, [])

  const artist = useSelector((state: storeType) => state.singer.artist)
  const songsOfArtist = useSelector(
    (state: storeType) => state.singer.songsOfArtist,
  )
  const loading = useSelector((state: storeType) => state.singer.loading)

  const dispatch = useDispatch()

  const dispatchSingerData = useCallback(
    (id) => {
      getSingerInfoRequest(id)
        .then((data: any) => {
          dispatch(actionTypes.changeArtist(data.artist))
          dispatch(actionTypes.changeSongs(data.hotSongs))
          dispatch(actionTypes.changeEnterLoading(false))
        })
        .catch(() => {
          console.log('获取歌手单曲数据失败！')
        })
    },
    [dispatch],
  )

  useEffect(() => {
    const id = props.match.params.id
    dispatchSingerData(id)
    // 之前写的 UI 处理逻辑省略
  }, [dispatchSingerData, props])

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
        <Header
          blur={false}
          ref={header}
          title={artist.name}
          handleClick={handleBack}
        />
        <div
          ref={imageWrapper}
          className={style['img-wrapper']}
          style={{ backgroundImage: `url(${artist.picUrl})` }}
        >
          <div className={style['filter']} />
        </div>
        <div ref={layer} className={style['bg-layer']}></div>
        <div className={style['song-list-wrapper']} ref={songScrollWrapper}>
          <Scroll
            className={style['song-scroll-wrapper']}
            ref={songScroll}
            onScroll={handleScroll}
          >
            <SongList songs={songsOfArtist} />
          </Scroll>
        </div>
        {loading ? <Loading /> : null}
      </div>
    </CSSTransition>
  )
}

export default memo(withRouter(Singer))
