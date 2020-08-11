/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useCallback, useRef, useState } from 'react'
import style from './index.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data'
import { CSSTransition } from 'react-transition-group'
import { playMode } from '@/api/config'
import Scroll from '@/components/Scroll'
import * as actionTypes from '@/store/modules/Player/actionCreators'
import { prefixStyle, findIndex, shuffle, getName } from '@/utils'
import '@/styles/global.scss'
import SvgIcon from '@/components/SvgIcon'
import Confirm from '@/components/confirm'

function PlayList(props: { clearPreSong: () => void }) {
  const { clearPreSong } = props

  const showPlayList = useSelector(
    (state: storeType) => state.player.showPlayList,
  )

  const currentIndex = useSelector(
    (state: storeType) => state.player.currentIndex,
  )

  const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  )

  const playList = useSelector((state: storeType) => state.player.playList)

  const sequencePlayList = useSelector(
    (state: storeType) => state.player.sequencePlayList,
  )

  const mode = useSelector((state: storeType) => state.player.mode)

  const dispatch = useDispatch()

  const togglePlayListDispatch = useCallback(
    (state) => {
      dispatch(actionTypes.changeShowPlayList(state))
    },
    [dispatch],
  )

  const togglePlayingStateDispatch = useCallback(
    (state) => {
      dispatch(actionTypes.changePlayingState(state))
    },
    [dispatch],
  )

  const changeCurrentIndexDispatch = useCallback(
    (index) => {
      dispatch(actionTypes.changeCurrentIndex(index))
    },
    [dispatch],
  )

  const changeModeDispatch = useCallback(
    (mode) => {
      dispatch(actionTypes.changePlayMode(mode))
    },
    [dispatch],
  )

  const changePlayListDispatch = useCallback(
    (list) => {
      dispatch(actionTypes.changePlayList(list))
    },
    [dispatch],
  )

  const changeSequecePlayListDispatch = useCallback(
    (list) => {
      dispatch(actionTypes.changeSequecePlayList(list))
    },
    [dispatch],
  )

  const deleteSongDispatch = useCallback(
    (song) => {
      dispatch(actionTypes.deleteSong(song))
    },
    [dispatch],
  )

  const changeCurrentSongDispatch = useCallback(
    (song) => {
      dispatch(actionTypes.changeCurrentSong(song))
    },
    [dispatch],
  )

  const clearDispatch = useCallback(() => {
    dispatch(changePlayListDispatch([]))
    dispatch(changeSequecePlayListDispatch([]))
    dispatch(changeCurrentIndexDispatch(-1))
    dispatch(togglePlayListDispatch(false))
    dispatch(changeCurrentSongDispatch({}))
    dispatch(togglePlayingStateDispatch(false))
  }, [
    changeCurrentIndexDispatch,
    changeCurrentSongDispatch,
    changePlayListDispatch,
    changeSequecePlayListDispatch,
    dispatch,
    togglePlayListDispatch,
    togglePlayingStateDispatch,
  ])

  const changeMode = () => {
    const newMode = (mode + 1) % 3
    if (newMode === 0) {
      changePlayListDispatch(sequencePlayList)
      const index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
    } else if (newMode === 1) {
      changePlayListDispatch(sequencePlayList)
    } else if (newMode === 2) {
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    changeModeDispatch(newMode)
  }

  const playListRef = useRef<HTMLDivElement>(null)
  const listWrapperRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)
  const [isShow, setIsShow] = useState(false)
  const [distance, setDistance] = useState(0)

  const transform: any = prefixStyle('transform')

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    listWrapperRef.current!.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current!.style['transition'] = 'all 0.3s'
    listWrapperRef.current!.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitCB = useCallback(() => {
    listWrapperRef.current!.style[
      transform
    ] = `translate3d(0, ${distance}px, 0)`
  }, [distance, transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current!.style['transition'] = 'all 0.3s'
    listWrapperRef.current!.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current!.style[transform] = `translate3d(0px, 100%, 0px)`
  }, [transform])

  const getPlayMode = () => {
    let iconClass, text
    if (mode === playMode.sequence) {
      iconClass = 'player-cycle'
      text = '顺序播放'
    } else if (mode === playMode.loop) {
      iconClass = 'player-single'
      text = '单曲循环'
    } else {
      iconClass = 'player-random'
      text = '随机播放'
    }
    return (
      <div>
        <SvgIcon className={style['svg-icon']} iconClass={iconClass} />
        <span className={style['text']} onClick={changeMode}>
          {text}
        </span>
      </div>
    )
  }

  const handleShowClear = () => {
    const ref: any = confirmRef.current!
    ref.show()
  }

  const handleConfirmClear = () => {
    clearDispatch()
    // 修复清空播放列表后点击同样的歌曲，播放器不出现的bug
    clearPreSong()
  }

  const handleDeleteSong = (e: React.MouseEvent, song: any) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  const getCurrentIcon = (item: any) => {
    const current = currentSong.id === item.id
    const className = current ? style['icon-play'] : ''
    const iconClass = current ? 'player-stop' : ''
    return <SvgIcon className={className} iconClass={iconClass} />
  }

  const handleChangeCurrentIndex = (index: number) => {
    if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }

  const [canTouch, setCanTouch] = useState(true)
  const [initialed, setInitialed] = useState<boolean>()
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canTouch || initialed) return
    listWrapperRef.current!.style['transition'] = ''
    setDistance(0)
    setStartY(e.nativeEvent.touches[0].pageY)
    setInitialed(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canTouch || !initialed) return
    const distance = e.nativeEvent.touches[0].pageY - startY
    if (distance < 0) return
    setDistance(distance)
    listWrapperRef.current!.style.transform = `translate3d(0, ${distance}px, 0)`
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setInitialed(false)
    if (distance >= 150) {
      togglePlayListDispatch(false)
    } else {
      listWrapperRef.current!.style['transition'] = 'all 0.3s'
      listWrapperRef.current!.style[transform] = `translate3d(0px, 0px, 0px)`
    }
  }

  const handleScroll = (pos: any) => {
    const state = pos.y === 0
    setCanTouch(state)
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
      onExit={onExitCB}
    >
      <div
        ref={playListRef}
        style={isShow === true ? { display: 'block' } : { display: 'none' }}
        onClick={() => togglePlayListDispatch(false)}
        className={style['play-list-wrapper']}
      >
        <div
          className={style['list-wrapper']}
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={style['list-header']}>
            <h1 className={style['title']}>
              {getPlayMode()}
              <SvgIcon
                className={style['clear']}
                iconClass="delete"
                onClick={handleShowClear}
              />
            </h1>
          </div>
          <div className={style['scroll-wrapper']}>
            <Scroll onScroll={(pos) => handleScroll(pos)} bounceTop={false}>
              <ul className={style['list-content']}>
                {playList.map((item: any, index) => {
                  return (
                    <li
                      className={style['item']}
                      key={item.id}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className={style['text']}>
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className={style['like']}>
                        <SvgIcon iconClass="collect" />
                      </span>
                      <span
                        className={style['delete']}
                        onClick={(e) => handleDeleteSong(e, item)}
                      >
                        <SvgIcon iconClass="delete" />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Scroll>
          </div>
        </div>
        <Confirm
          ref={confirmRef}
          text={'是否删除全部？'}
          cancelBtnText={'取消'}
          confirmBtnText={'确定'}
          handleConfirm={handleConfirmClear}
        />
      </div>
    </CSSTransition>
  )
}
export default memo(PlayList)
