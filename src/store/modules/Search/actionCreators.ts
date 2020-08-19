import * as actionTypes from './constants'

export const changeHotKeyWords = (data: any[]) => ({
  type: actionTypes.SET_HOT_KEYWRODS,
  data,
})

export const changeSuggestList = (data: any[]) => ({
  type: actionTypes.SET_SUGGEST_LIST,
  data,
})

export const changeResultSongs = (data: any[]) => ({
  type: actionTypes.SET_RESULT_SONGS_LIST,
  data,
})

export const changeEnterLoading = (data: boolean) => ({
  type: actionTypes.SET_ENTER_LOADING,
  data,
})
