import * as actionTypes from './constants'
import { searchStateType } from './data'
import produce from 'immer'

const defaultState: searchStateType = {
  hotList: [],
  songsList: [],
  suggestList: [],
  enterLoading: false,
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.SET_HOT_KEYWRODS:
        draft.hotList = action.data
        break
      case actionTypes.SET_SUGGEST_LIST:
        draft.suggestList = action.data
        break
      case actionTypes.SET_RESULT_SONGS_LIST:
        draft.songsList = action.data
        break
      case actionTypes.SET_ENTER_LOADING:
        draft.enterLoading = action.data
        break
    }
  })
}
