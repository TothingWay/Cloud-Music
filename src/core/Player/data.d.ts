export interface PlayerProps {
  song?: any
  fullScreen?: boolean
  radius?: number
  percent?: number
  currentTime?: number
  duration?: number
  mode?: number
  percentChange?: (percent: number) => void
  onProgressChange?: (percent: number) => void
  handlePrev?: () => void
  handleNext?: () => void
  changeMode?: () => void
  clickPlaying?: (e, state) => void
  currentLineNum?: number
  currentPlayingLyric?: string
  currentLyric?: any
}
