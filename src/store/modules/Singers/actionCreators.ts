import { singerListType } from './data.d'
import * as actionTypes from './constants'

export const changeSingerList = (data: singerListType[]) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data,
})

export const changeOffset = (data: number) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data,
})

//进场loading
export const changeEnterLoading = (data: boolean) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
})

//滑动最底部loading
export const changePullUpLoading = (data: boolean) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data,
})

export const changeCategory = (data: string) => ({
  type: actionTypes.CHANGE_CATOGORY,
  data,
})

export const changeAlpha = (data: string) => ({
  type: actionTypes.CHANGE_ALPHA,
  data,
})

export const changeSingerType = (data: string) => ({
  type: actionTypes.CHANGE_SINGER_TYPE,
  data,
})
