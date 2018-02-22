import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_REMD_LIST] (state, remdList) {
    state.remdList = remdList
  },
  [types.SET_REMD_SONG] (state, remdSong) {
    state.remdSong = remdSong
  },
  [types.SET_RANK_LIST] (state, rankList) {
    state.rankList = rankList
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_COLLECT_LIST] (state, list) {
    state.collectList = list
  }
}

export default mutations
