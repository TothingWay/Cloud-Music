import * as actionTypes from './constants'
import { AlbumDetailProps } from './data'
import produce from 'immer'

const defaultState: AlbumDetailProps = {
  currentAlbum: {},
  pullUpLoading: false,
  enterLoading: true,
  startIndex: 0,
  totalCount: 0,
}

export default (state = defaultState, action: any) => {
  return produce(state, draft => {
    switch (action.type) {
      case actionTypes.CHANGE_CURRENT_ALBUM:
        draft.currentAlbum = action.data
        break
      case actionTypes.CHANGE_PULLUP_LOADING:
        draft.pullUpLoading = action.data
        break
      case actionTypes.CHANGE_ENTER_LOADING:
        draft.enterLoading = action.data
        break
      case actionTypes.CHANGE_START_INDEX:
        draft.startIndex = action.data
        draft.pullUpLoading = false
        break
    }
  })
}