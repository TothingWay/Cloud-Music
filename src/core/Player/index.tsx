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

/* const currentSong = {
  al: {
    picUrl:
      'https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg',
  },
  name: '木偶人',
  ar: [{ name: '薛之谦' }],
} */

/* const playList = [
  {
    ftype: 0,
    djId: 0,
    a: null,
    cd: '01',
    crbt: null,
    no: 1,
    st: 0,
    rt: '',
    cf: '',
    alia: ['手游《梦幻花园》苏州园林版推广曲'],
    rtUrls: [],
    fee: 0,
    s_id: 0,
    copyright: 0,
    h: {
      br: 320000,
      fid: 0,
      size: 9400365,
      vd: -45814,
    },
    mv: 0,
    al: {
      id: 84991301,
      name: '拾梦纪',
      picUrl:
        'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
      tns: [],
      pic_str: '109951164627180052',
      pic: 109951164627180050,
    },
    name: '拾梦纪',
    l: {
      br: 128000,
      fid: 0,
      size: 3760173,
      vd: -41672,
    },
    rtype: 0,
    m: {
      br: 192000,
      fid: 0,
      size: 5640237,
      vd: -43277,
    },
    cp: 1416668,
    mark: 0,
    rtUrl: null,
    mst: 9,
    dt: 234947,
    ar: [
      {
        id: 12084589,
        name: '妖扬',
        tns: [],
        alias: [],
      },
      {
        id: 12578371,
        name: '金天',
        tns: [],
        alias: [],
      },
    ],
    pop: 5,
    pst: 0,
    t: 0,
    v: 3,
    id: 1416767593,
    publishTime: 0,
    rurl: null,
  },
] */

function Player(props: RouteComponentProps) {
  const dispatch = useDispatch()

  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  //歌曲总时长
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const fullScreen = useSelector((state: storeType) => state.player.fullScreen)
  const percent = useSelector((state: storeType) => state.player.percent)
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
  // const showPlayList = useSelector(
  //   (state: storeType) => state.player.showPlayList,
  // )

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
  }, [
    changeCurrentIndexDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    currentSong,
    mode,
    sequencePlayList,
  ])

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
    },
    [duration, playing, togglePlayingDispatch],
  )

  useEffect(() => {
    if (!currentSong) return
    changeCurrentIndexDispatch(0) // currentIndex默认为-1，临时改成0
    const current: any = playList[0]
    if (!current) return
    changeCurrentDispatch(current) // 赋值currentSong

    audioRef.current!.src = getSongUrl(current.id)
    setCurrentTime(0) //从头开始播放
    setDuration((current.dt / 1000) | 0) //时长
  }, [
    changeCurrentDispatch,
    changeCurrentIndexDispatch,
    currentSong,
    dispatch,
    playList,
  ])

  const updateTime = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLAudioElement
    setCurrentTime(target.currentTime)
  }

  //一首歌循环
  const handleLoop = () => {
    audioRef.current!.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current!.play()
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

  const [preSong, setPreSong] = useState<any>({})

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      (playList[currentIndex] as any).id === preSong.id
    )
      return
    const current: any = playList[currentIndex]
    changeCurrentDispatch(current) //赋值currentSong
    setPreSong(current)
    audioRef.current!.src = current.id && getSongUrl(current.id)
    setCurrentTime(0) //从头开始播放
    setDuration((current.dt / 1000) | 0) //时长
  }, [
    currentIndex,
    changeCurrentDispatch,
    togglePlayingDispatch,
    preSong.id,
    playList,
  ])

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

  const [modeText, setModeText] = useState<string>('')

  const toastRef = useRef<any>(null)

  const songReady = useRef(true)

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      (playList[currentIndex] as any).id === preSong.id ||
      !songReady.current // 标志位为 false
    )
      return
    const current: any = playList[currentIndex]
    setPreSong(current)
    songReady.current = false // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    changeCurrentDispatch(current) // 赋值 currentSong
    audioRef.current!.src = current.id && getSongUrl(current.id)
    setTimeout(() => {
      // 注意，play 方法返回的是一个 promise 对象
      audioRef.current!.play().then(() => {
        songReady.current = true
      })
    })
    togglePlayingDispatch(true) // 播放状态
    setCurrentTime(0) // 从头开始播放
    current.dt && setDuration((current.dt / 1000) | 0) // 时长
  }, [
    playList,
    currentIndex,
    preSong.id,
    changeCurrentDispatch,
    togglePlayingDispatch,
  ])

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
        mode={mode}
        changeMode={changeMode}
      />
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )
}

export default memo(withRouter(Player))
