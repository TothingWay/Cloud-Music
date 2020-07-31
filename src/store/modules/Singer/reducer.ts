import * as actionTypes from './constants'
import { singerStateType } from './data'
import produce from 'immer'

const defaultState: singerStateType = {
  artist: {},
  songsOfArtist: [],
  loading: true,
}

export default (state = defaultState, action: any) => {
  return produce(state, (draft: singerStateType) => {
    switch (action.type) {
      case actionTypes.CHANGE_ARTIST:
        draft.artist = action.data
        break
      case actionTypes.CHANGE_SONGS_OF_ARTIST:
        draft.songsOfArtist = action.data
        break
      case actionTypes.CHANGE_ENTER_LOADING:
        draft.loading = action.data
        break
    }
  })
}
