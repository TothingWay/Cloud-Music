import * as actionTypes from './constants';

export interface bannerType {
  imageUrl: string
  url: string
}
export interface recommendType {
  id: string
  name: string
  picUrl: string
  trackCount: number
  playCount: number
}

export interface RecommendStateType {
  bannerList: bannerType[]
  recommendList: recommendType[]
  enterLoading: boolean
}

export interface changeBannerListType {
  type: typeof actionTypes.CHANGE_BANNER;
  data: RecommendStateType
}

export interface changeRecommendListType {
  type: typeof actionTypes.CHANGE_RECOMMEND_LIST;
  data: RecommendStateType
}

export interface changeEnterLoadingType {
  type: typeof actionTypes.CHANGE_ENTER_LOADING;
  data: boolean
}