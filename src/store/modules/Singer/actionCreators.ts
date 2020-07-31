import { artistType } from './data'
import * as actionTypes from './constants'

export const changeArtist = (data: artistType) => ({
  type: actionTypes.CHANGE_ARTIST,
  data,
})

export const changeSongs = (data: Array<unknown>) => ({
  type: actionTypes.CHANGE_SONGS_OF_ARTIST,
  data,
})

//进场loading
export const changeEnterLoading = (data: boolean) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
})
