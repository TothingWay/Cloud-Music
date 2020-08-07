export interface currentSongType {
  [propName: string]: any
}

export interface playStateType {
  fullScreen: boolean
  playing: boolean
  sequencePlayList: Array<unknown>
  playList: Array<unknown>
  mode: number
  currentIndex: number
  showPlayList: boolean
  currentSong: currentSongType
  percent: number
}
