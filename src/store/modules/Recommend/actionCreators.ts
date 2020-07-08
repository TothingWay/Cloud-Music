import * as actionTypes from './constants'
import { recommendStateType } from './data.d'

export const changeBannerList = (data: recommendStateType) => ({
  type: actionTypes.CHANGE_BANNER,
  data,
})

export const changeRecommendList = (data: recommendStateType) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data,
})

export const changeEnterLoading = (data: boolean) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
})