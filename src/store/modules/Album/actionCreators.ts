import { CurrentAlbum } from './data'
import * as actionTypes from './constants'

export const changeCurrentAlbum = (data: CurrentAlbum) => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data
})

export const changePullUpLoading = (data:boolean) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
})

export const changeEnterLoading = (data:boolean) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const changeTotalCount = (data:number) => ({
  type: actionTypes.CHANGE_TOTAL_COUNT,
  data
})

export const changeStartIndex = (data:number) => ({
  type: actionTypes.CHANGE_START_INDEX,
  data
})