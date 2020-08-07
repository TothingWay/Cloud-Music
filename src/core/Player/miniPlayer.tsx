/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useCallback, useRef } from 'react'
import style from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data'
import discDefault from '@/assets/disc_default.png'
import { PlayerProps } from './data'
import * as actionTypes from '@/store/modules/Player/actionCreators'

function MiniPlayer(props: PlayerProps) {
  const { radius, percent = 0 } = props

  const dashArray = Math.PI * 100
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray

  const miniPlayerRef = useRef<HTMLDivElement>(null)

  const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  )

  const playing = useSelector((state: storeType) => state.player.playing)

  const dispatch = useDispatch()

  const toggleFullScreenDispatch = useCallback(() => {
    dispatch(actionTypes.changeFullScreen(true))
  }, [dispatch])

  return (
    <div
      ref={miniPlayerRef}
      className={style['mini-player']}
      onClick={toggleFullScreenDispatch}
    >
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={style['progress-background']}
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        />
        <circle
          className={style['progress-bar']}
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <img
        className={`play ${playing ? '' : style['pause']}}`}
        src={currentSong.al ? currentSong.al.picUrl : discDefault}
        alt="disc_default"
      />
    </div>
  )
}

export default memo(MiniPlayer)
