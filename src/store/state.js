import { playMode } from '../assets/js/config'
const state = {
  singer: {},
  // 播放
  playing: false,
  // 全屏
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 顺序播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放歌曲的序号
  currentIndex: -1
}
export default state
