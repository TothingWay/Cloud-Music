/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useCallback, useRef } from 'react'
import style from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data'
import discDefault from '@/assets/disc_default.png'
import { PlayerProps } from './data'
import * as actionTypes from '@/store/modules/Player/actionCreators'
import { CSSTransition } from 'react-transition-group'
// const discDefault = require('@/assets/disc_default.png')

function MiniPlayer(props: PlayerProps) {
  const miniPlayerRef = useRef<HTMLDivElement>(null)

  const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  )

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
      <img
        className={style['play']}
        src={currentSong.al ? currentSong.al.picUrl : discDefault}
        alt="disc_default"
      />
    </div>
  )
}

export default memo(MiniPlayer)
