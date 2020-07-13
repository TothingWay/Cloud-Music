import { rankStateType } from './data'
import * as actionTypes from './constants'

export const changeRankList = (data: rankStateType[]) => ({
  type: actionTypes.CHANGE_RANK_LIST,
  data
})

export const changeLoading = (data:boolean) => ({
  type: actionTypes.CHANGE_LOADING,
  data
})