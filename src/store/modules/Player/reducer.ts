/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { findIndex } from '@/utils/index'
import * as actionTypes from './constants'
import { playStateType } from './data'
import produce from 'immer'
import { playMode } from '@/api/config'

const defaultState: playStateType = {
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: {},
  percent: 0,
  speed: 1,
}

const handleInsertSong = (
  state: playStateType,
  song: any,
  draft: playStateType,
) => {
  const playList = JSON.parse(JSON.stringify(state.playList))
  const sequenceList = JSON.parse(JSON.stringify(state.sequencePlayList))
  let currentIndex = state.currentIndex
  //看看有没有同款
  const fpIndex = findIndex(song, playList)
  // 如果是当前歌曲直接不处理
  if (fpIndex === currentIndex && currentIndex !== -1) return state
  currentIndex++
  // 把歌放进去,放到当前播放曲目的下一个位置
  playList.splice(currentIndex, 0, song)
  // 如果列表中已经存在要添加的歌
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1
  const fsIndex = findIndex(song, sequenceList)
  sequenceList.splice(sequenceIndex, 0, song)
  if (fsIndex > -1) {
    if (sequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
      sequenceIndex--
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  draft.playList = playList
  draft.sequencePlayList = sequenceList
  draft.currentIndex = currentIndex
}

const handleDeleteSong = (
  state: playStateType,
  song: any,
  draft: playStateType,
) => {
  const playList = JSON.parse(JSON.stringify(state.playList))
  const sequenceList = JSON.parse(JSON.stringify(state.sequencePlayList))
  let currentIndex = state.currentIndex

  const fpIndex = findIndex(song, playList)
  playList.splice(fpIndex, 1)
  if (fpIndex < currentIndex) currentIndex--

  const fsIndex = findIndex(song, sequenceList)
  sequenceList.splice(fsIndex, 1)

  draft.playList = playList
  draft.sequencePlayList = sequenceList
  draft.currentIndex = currentIndex
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft: playStateType) => {
    switch (action.type) {
      case actionTypes.SET_CURRENT_SONG:
        draft.currentSong = action.data
        break
      case actionTypes.SET_FULL_SCREEN:
        draft.fullScreen = action.data
        break
      case actionTypes.SET_PLAYING_STATE:
        draft.playing = action.data
        break
      case actionTypes.SET_SEQUECE_PLAYLIST:
        draft.sequencePlayList = action.data
        break
      case actionTypes.SET_PLAYLIST:
        draft.playList = action.data
        break
      case actionTypes.SET_PLAY_MODE:
        draft.mode = action.data
        break
      case actionTypes.SET_CURRENT_INDEX:
        draft.currentIndex = action.data
        break
      case actionTypes.SET_SHOW_PLAYLIST:
        draft.showPlayList = action.data
        break
      case actionTypes.SET_PERCENT:
        draft.percent = action.data
        break
      case actionTypes.INSERT_SONG:
        handleInsertSong(state, action.data, draft)
        break
      case actionTypes.DELETE_SONG:
        handleDeleteSong(state, action.data, draft)
        break
      case actionTypes.CHANGE_SPEED:
        draft.speed = action.data
        break
    }
  })
}
