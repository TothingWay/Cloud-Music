import {recommendStateType} from './data.d'
import * as actionTypes from './constants'
import produce from 'immer'

const defaultState: recommendStateType = {
  bannerList: [],
  recommendList: [],
  enterLoading: true,
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHANGE_BANNER:
        draft.bannerList = action.data
        break
      case actionTypes.CHANGE_RECOMMEND_LIST:
        draft.recommendList = action.data
        break
      case actionTypes.CHANGE_ENTER_LOADING:
        draft.enterLoading = action.data
        break
    }
  })
}
