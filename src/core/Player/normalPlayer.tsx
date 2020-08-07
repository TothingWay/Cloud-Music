/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useCallback } from 'react'
import style from './index.module.scss'
import { getName, prefixStyle, formatPlayTime } from '@/utils'
import SvgIcon from '@/components/SvgIcon'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import { PlayerProps } from './data'
import '@/styles/global.scss'
import * as actionTypes from '@/store/modules/Player/actionCreators'
import { useSelector, useDispatch } from 'react-redux'
import ProgressBar from '@/components/ProgressBar'
import { storeType } from '@/store/data'
import { playMode } from '@/api/config'

function NormalPlayer(props: PlayerProps) {
  const { song, fullScreen, currentTime, duration, percent, mode } = props

  const { onProgressChange, handlePrev, handleNext, changeMode } = props

  const playing = useSelector((state: storeType) => state.player.playing)

  const normalPlayerRef = useRef<HTMLDivElement>(null)
  const cdWrapperRef = useRef<HTMLDivElement>(null)

  const transform: any = prefixStyle('transform')

  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingRight = 40
    const paddingBottom = 130
    const paddingTop = 10
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心的横坐标距离和纵坐标距离

    const x = window.innerWidth / 2 + paddingRight
    const y = -(window.innerHeight - paddingTop - width / 2 - paddingBottom)

    return {
      x,
      y,
      scale,
    }
  }

  const enter = () => {
    normalPlayerRef.current!.style.display = 'block'
    const { x, y, scale } = _getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`,
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`,
      },
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear',
      },
    })
    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current!
    animations.unregisterAnimation('move')
    cdWrapperDom.style.animation = ''
  }

  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = 'all 0.4s'
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = ''
    normalPlayerRef.current!.style.display = 'none'
    // setCurrentState('')
  }

  const dispatch = useDispatch()

  const toggleFullScreenDispatch = useCallback(() => {
    dispatch(actionTypes.changeFullScreen(false))
  }, [dispatch])

  const clickPlaying = useCallback(
    (e: React.MouseEvent, state: boolean) => {
      e.stopPropagation()
      dispatch(actionTypes.changePlayingState(state))
    },
    [dispatch],
  )

  const getPlayMode = () => {
    if (mode === playMode.sequence) {
      return <SvgIcon iconClass="player-cycle" />
    } else if (mode === playMode.loop) {
      return <SvgIcon iconClass="player-single" />
    } else if (mode === playMode.random) {
      return <SvgIcon iconClass="player-random" />
    }
  }

  return (
    <CSSTransition
      classNames="normalPlayer"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <div ref={normalPlayerRef} className={style['normal-player-container']}>
        <div className={style['background']}>
          <img
            src={song.al && song.al.picUrl + '?param=300x300'}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className={`${style['background']} ${style['layer']}`}></div>
        <div className={`${style['top']} top`}>
          <SvgIcon
            iconClass="back"
            className={style['back']}
            onClick={toggleFullScreenDispatch}
          />
          <h1 className={style['title']}>{song.name}</h1>
          <h1 className={style['subtitle']}>{getName(song.ar || [])}</h1>
        </div>

        <div ref={cdWrapperRef} className={style['middle']}>
          <div className={style['CD-wrapper']}>
            <div className={style['cd']}>
              <img
                className={`${style['image']} ${style['play']} ${
                  playing ? '' : style['pause']
                }`}
                src={song.al && song.al.picUrl + '?param=400x400'}
                alt=""
              />
            </div>
          </div>
        </div>

        <div className={`${style['bottom']} bottom`}>
          <div className={style['progress-wrapper']}>
            <span className={`${style['time']} ${style['time-l']}`}>
              {formatPlayTime(currentTime)}
            </span>
            <div className={style['progress-bar-wrapper']}>
              <ProgressBar percentChange={onProgressChange} percent={percent} />
            </div>
            <div className={`${style['time']} ${style['time-r']}`}>
              {formatPlayTime(duration)}
            </div>
          </div>
          <div className={style['operators']}>
            <div
              className={`${style['icon']} ${style['i-left']}`}
              onClick={changeMode}
            >
              {getPlayMode()}
            </div>
            <div
              className={`${style['icon']} ${style['i-left']}`}
              onClick={handlePrev}
            >
              <SvgIcon iconClass="player-prev" />
            </div>
            <div
              className={`${style['icon']} ${style['i-center']}`}
              onClick={(e) => clickPlaying(e, !playing)}
            >
              {playing ? (
                <SvgIcon iconClass="player-play" />
              ) : (
                <SvgIcon iconClass="player-stop" />
              )}
            </div>
            <div
              className={`${style['icon']} ${style['i-right']}`}
              onClick={handleNext}
            >
              <SvgIcon iconClass="player-next" />
            </div>
            <div className={`${style['icon']} ${style['i-right']}`}>
              <SvgIcon iconClass="player-list" />
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default NormalPlayer
