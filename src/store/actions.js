import * as types from './mutation-types'
import { playMode } from '../assets/js/config'
import { shuffle, findIndex } from '../assets/js/until'
import { saveSearch, deleteSearch } from '../assets/js/cache'

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const insertSong = function ({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 判断当前播放列表是否含有待插入歌曲，并返回索引
  let findPlayIndex = findIndex(playlist, song)
  // 插入当前歌曲索引的下一个位置
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)
  // 播放列表已包含这首歌
  if (findPlayIndex > -1) {
    // 当前插入的序号大于列表中已存在歌曲的序号
    if (currentIndex > findPlayIndex) {
      playlist.splice(findPlayIndex, 1)
      currentIndex--
    } else {
      playlist.splice(findPlayIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let findSIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (findSIndex > -1) {
    // 当前插入的序号大于列表中已存在歌曲的序号
    if (currentSIndex > findSIndex) {
      playlist.splice(findSIndex, 1)
    } else {
      playlist.splice(findSIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const saveSearchHistory = function ({ commit }, keywords) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(keywords))
}

export const deleteSearchHistory = function ({ commit }, keywords) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(keywords))
}
