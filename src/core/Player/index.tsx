/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useState, useRef, useEffect, useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data'
import NormalPlayer from './normalPlayer'
import * as actionTypes from '@/store/modules/Player/actionCreators'
import { getSongUrl, findIndex, shuffle } from '@/utils'
import Toast from '@/components/Toast'
import { playMode } from '@/api/config'
import PlayList from './playerList'
import { getLyricRequest } from '@/api/player'
import Lyric from '@/utils/lyricParser'

function Player(props: RouteComponentProps) {
  const dispatch = useDispatch()

  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  //歌曲总时长
  const [duration, setDuration] = useState(0)
  const [modeText, setModeText] = useState<string>('')

  const toastRef = useRef<any>(null)

  const songReady = useRef(true)

  const audioRef = useRef<HTMLAudioElement>(null)

  const [preSong, setPreSong] = useState<any>({})

  const [currentPlayingLyric, setPlayingLyric] = useState('')

  const currentLyric = useRef<any>()
  const currentLineNum = useRef(0)

  const fullScreen = useSelector((state: storeType) => state.player.fullScreen)
  const percent = useSelector((state: storeType) => state.player.percent)
  const speed = useSelector((state: storeType) => state.player.speed)
  const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  )
  const currentIndex = useSelector(
    (state: storeType) => state.player.currentIndex,
  )
  const mode = useSelector((state: storeType) => state.player.mode)
  const playList = useSelector((state: storeType) => state.player.playList)
  const playing = useSelector((state: storeType) => state.player.playing)
  const sequencePlayList = useSelector(
    (state: storeType) => state.player.sequencePlayList,
  )

  const changePercentDispatch = useCallback(
    (percent) => {
      dispatch(actionTypes.changePercent(percent))
    },
    [dispatch],
  )

  const changeCurrentIndexDispatch = useCallback(
    (index) => {
      dispatch(actionTypes.changeCurrentIndex(index))
    },
    [dispatch],
  )

  const changeCurrentDispatch = useCallback(
    (song) => {
      dispatch(actionTypes.changeCurrentSong(song))
    },
    [dispatch],
  )

  const togglePlayingDispatch = useCallback(
    (state) => {
      dispatch(actionTypes.changePlayingState(state))
    },
    [dispatch],
  )

  const changePlayListDispatch = useCallback(
    (list) => {
      dispatch(actionTypes.changePlayList(list))
    },
    [dispatch],
  )

  const changeModeDispatch = useCallback(
    (mode) => {
      dispatch(actionTypes.changePlayMode(mode))
    },
    [dispatch],
  )

  const changeMode = useCallback(() => {
    const newMode = (mode + 1) % 3
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList)
      const index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText('顺序循环')
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList)
      setModeText('单曲循环')
    } else if (newMode === 2) {
      //随机播放
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText('随机播放')
    }
    changeModeDispatch(newMode)
    toastRef.current!.show()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //歌曲播放进度
    changePercentDispatch(
      isNaN(currentTime / duration) ? 0 : currentTime / duration,
    )
  }, [changePercentDispatch, currentTime, duration])

  const onProgressChange = useCallback(
    (curPercent) => {
      const newTime = curPercent * duration
      setCurrentTime(newTime)
      audioRef.current!.currentTime = newTime
      if (!playing) {
        togglePlayingDispatch(true)
      }
      if (currentLyric.current) {
        currentLyric.current.seek(newTime * 1000)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      (playList[currentIndex] as any).id === preSong.id ||
      !songReady.current
    )
      return
    songReady.current = false
    const current: any = playList[currentIndex]
    changeCurrentDispatch(current)
    setPreSong(current)
    setPlayingLyric('')
    audioRef.current!.src = getSongUrl(current.id)
    audioRef.current!.autoplay = true
    audioRef.current!.playbackRate = speed
    togglePlayingDispatch(true)
    getLyric(current.id)
    setCurrentTime(0)
    setDuration((current.dt / 1000) | 0)
    // eslint-disable-next-line
  }, [currentIndex, playList]);

  useEffect(() => {
    if (!fullScreen) return
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt,
      })
    }
  }, [fullScreen])

  const handleLyric = ({ lineNum, txt }: { lineNum: number; txt: string }) => {
    if (!currentLyric.current) return
    currentLineNum.current = lineNum
    setPlayingLyric(txt)
  }

  const getLyric = (id: number) => {
    let lyric = ''
    if (currentLyric.current) {
      const lyricCurrent: any = currentLyric.current
      lyricCurrent.stop()
    }
    // 避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true
    }, 3000)
    getLyricRequest(id)
      .then((data: any) => {
        lyric = data.lrc && data.lrc.lyric
        if (!lyric) {
          currentLyric.current = null
          return
        }
        currentLyric.current = new Lyric(lyric, handleLyric, speed)
        currentLyric.current.play()
        currentLineNum.current = 0
        currentLyric.current.seek(0)
      })
      .catch(() => {
        currentLyric.current = ''
        songReady.current = true
        audioRef.current!.play()
      })
  }

  const clickPlaying = (e: React.MouseEvent, state: boolean) => {
    e.stopPropagation()
    togglePlayingDispatch(state)
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000)
    }
  }

  const updateTime = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLAudioElement
    setCurrentTime(target.currentTime)
  }

  //一首歌循环
  const handleLoop = () => {
    audioRef.current!.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current!.play()
    if (currentLyric.current) {
      currentLyric.current.seek(0)
    }
  }

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playList.length - 1
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  useEffect(() => {
    playing ? audioRef.current!.play() : audioRef.current!.pause()
  }, [playing])

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  const handleError = () => {
    songReady.current = true
    alert('播放出错')
  }

  return (
    <div>
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        currentTime={currentTime}
        duration={duration}
        percent={percent}
        onProgressChange={onProgressChange}
        handlePrev={handlePrev}
        handleNext={handleNext}
        clickPlaying={clickPlaying}
        currentLyric={currentLyric.current}
        currentPlayingLyric={currentPlayingLyric}
        currentLineNum={currentLineNum.current}
        mode={mode}
        changeMode={changeMode}
      />
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList clearPreSong={setPreSong.bind(null, {})} />
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )
}

export default memo(withRouter(Player))
