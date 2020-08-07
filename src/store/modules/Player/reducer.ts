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
    }
  })
}
