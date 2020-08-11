/**version:1.0.0
 * 传入歌词，按照正则表达式解析
 * 解析的数据结构为：
 * {
 *   txt:歌词，
 *   time:ms
 * }
 */
// eslint-disable-next-line
const timeExp = /\[(\d{2,}):(\d{2})(?:[\.\:](\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

interface tagRegMapTypes {
  title: string
  artist: string
  album: string
  offset: string
  by: string
}

const tagRegMap: tagRegMapTypes = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by',
}

function validateTagRegMap(value: string): value is keyof typeof tagRegMap {
  return value in tagRegMap
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop({ lineNum, txt }: { lineNum: number; txt: string }) {}

export default class Lyric {
  lrc: string
  tags: tagRegMapTypes
  lines: Array<any>
  handler: ({ lineNum, txt }: { lineNum: number; txt: string }) => void
  state: 0 | 1
  curLineIndex: number
  speed: number
  offset: number
  startStamp: number
  timer: any

  constructor(lrc: string, hanlder = noop, speed = 1) {
    this.lrc = lrc
    this.tags = tagRegMap
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLineIndex = 0
    this.speed = speed
    this.offset = 0
    this.startStamp = 0

    this._init()
  }

  _init() {
    this._initTag()

    this._initLines()
  }

  _initTag() {
    for (const tag in tagRegMap) {
      if (!validateTagRegMap(tag)) {
        throw Error('invalid tagRegMap')
      }
      const matches = this.lrc.match(
        new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'),
      )
      this.tags[tag] = (matches && (matches[1] || '')) as any
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          if (result[3].length === 3) {
            result[3] = (Number(result[3]) / 10) as any
          }
          this.lines.push({
            time:
              Number(result[1]) * 60 * 1000 +
              Number(result[2]) * 1000 +
              (Number(result[3]) || 0) * 10,
            txt,
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findcurLineIndex(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i: number) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i,
    })
  }

  _playRest(isSeek = false) {
    const line = this.lines[this.curLineIndex]
    let delay
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      //拿到上一行的歌词开始时间，算间隔
      const preTime = this.lines[this.curLineIndex - 1]
        ? this.lines[this.curLineIndex - 1].time
        : 0
      delay = line.time - preTime
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++)
      if (
        this.curLineIndex < this.lines.length &&
        this.state === STATE_PLAYING
      ) {
        this._playRest()
      }
    }, delay / this.speed)
  }

  changeSpeed(speed: number) {
    this.speed = speed
  }

  play(offset = 0, isSeek = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curLineIndex = this._findcurLineIndex(offset)
    //现在正处于第this.curLineIndex-1行
    this._callHandler(this.curLineIndex - 1)
    this.offset = offset
    this.startStamp = +new Date() - offset

    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest(isSeek)
    }
  }

  togglePlay(offset: number) {
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.offset = offset
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    this.offset = 0
    clearTimeout(this.timer)
  }

  seek(offset: number) {
    this.play(offset, true)
  }
}
