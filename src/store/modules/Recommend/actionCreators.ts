import * as actionTypes from './constants'
import {
  RecommendStateType,
  changeBannerListType,
  changeRecommendListType,
} from './data.d'

export const changeBannerList = (
  data: RecommendStateType
): changeBannerListType => ({
  type: actionTypes.CHANGE_BANNER,
  data,
})

export const changeRecommendList = (
  data: RecommendStateType
): changeRecommendListType => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data,
})