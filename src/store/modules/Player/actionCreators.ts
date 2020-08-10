import { currentSongType } from './data'
import * as actionTypes from './constants'

export const changeCurrentSong = (data: currentSongType) => ({
  type: actionTypes.SET_CURRENT_SONG,
  data,
})

export const changeFullScreen = (data: boolean) => ({
  type: actionTypes.SET_FULL_SCREEN,
  data,
})

export const changePlayingState = (data: boolean) => ({
  type: actionTypes.SET_PLAYING_STATE,
  data,
})

export const changeSequecePlayList = (data: Array<unknown>) => ({
  type: actionTypes.SET_SEQUECE_PLAYLIST,
  data,
})

export const changePlayList = (data: Array<unknown>) => ({
  type: actionTypes.SET_PLAYLIST,
  data,
})

export const changePlayMode = (data: number) => ({
  type: actionTypes.SET_PLAY_MODE,
  data,
})

export const changeCurrentIndex = (data: number) => ({
  type: actionTypes.SET_CURRENT_INDEX,
  data,
})

export const changeShowPlayList = (data: boolean) => ({
  type: actionTypes.SET_SHOW_PLAYLIST,
  data,
})

export const changePercent = (data: boolean) => ({
  type: actionTypes.SET_PERCENT,
  data,
})

export const insertSong = (data: any) => ({
  type: actionTypes.INSERT_SONG,
  data,
})

export const deleteSong = (data: any) => ({
  type: actionTypes.DELETE_SONG,
  data,
})
