import * as actionTypes from './constants'
import { rankStateType } from './data'
import produce from 'immer'

const defaultState: rankStateType = {
  rankList: [],
  loading: true,
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHANGE_RANK_LIST:
        draft.rankList = action.data
        break
      case actionTypes.CHANGE_LOADING:
        draft.loading = action.data
        break
    }
  })
}
