<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="full"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @afterLeave="afterLeave"
    >
      <div class="fullScreen" v-show="fullScreen">
        <div class="blur-bg" :style="imgUrl">
          <div class="bg-mask"></div>
        </div>
        <div class="header">
          <div class="back" @click="shrinkPlayer">
            <div class="down-arrow"></div>
          </div>
          <h2>{{currentsong.songName}}</h2>
          <h4>{{currentsong.singerName}}</h4>
          <transition name="fade">
            <img v-if="show" src="../../assets/images/needle.png" class="needle" :class="{'needle-pause':!playing}">
          </transition>
        </div>
        <div class="song-wrap" @click="toggleWrap">
          <transition name="fade">
            <div class="song-cd" v-show="show" mode="out-in">
              <div class="disc" ref="disc">
                <div class="rotate" :class="rotate">
                  <img src="../../assets/images/disc.png" class="disc-img">
                  <img :src="currentsong.picUrl" class="disc-cover">
                </div>
              </div>
            </div>
          </transition>
          <transition name="fade" mode="out-in">
            <scroll class="lyric" ref="lyric" v-show="!show" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p v-for="(line, index) in currentLyric.lines" ref="lyricLine" :class="{'lyricActive':currentLyricLine === index}" class="text" :key="index">{{line.txt}}</p>
                </div>
                <p v-if="currentLyric && !currentLyric.lines.length" class="noLyric">暂无歌词</p>
              </div>
            </scroll>
          </transition>
        </div>
        <div class="footer">
          <div class="progress-container">
            <span class="currentTime">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-container">
              <div class="progress-bar" ref="progressBar" @click="clickProgress">
                <div class="innerbar">
                  <div class="progress" ref="progress" :style="{width:percent}"></div>
                  <div class="progress-btn-container" ref="progressBtn"
                       @touchstart.prevent="btnTouchStart"
                       @touchmove.prevent="btnTouchMove"
                       @touchend="btnTouchEnd"
                  >
                    <div class="progress-btn"></div>
                  </div>
                </div>
              </div>
            </div>
            <span class="duration">{{formatTime(currentsong.duration/1000)}}</span>
          </div>
          <div class="operators">
            <div class="icon" @click="changeMode">
              <i class="iconfont operate" :class="playMode"></i>
            </div>
            <div class="icon" :class="disable">
              <i @click="prev" class="iconfont icon-pre direct"></i>
            </div>
            <div class="icon center" :class="disable">
              <i @click="togglePlay" class="iconfont play" :class="{'icon-play': !playing , 'icon-pause': playing}"></i>
            </div>
            <div class="icon" :class="disable">
              <i @click="next" class="iconfont icon-next direct"></i>
            </div>
            <div class="icon">
              <i class="fa fa-heart-o collect"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openPlayer">
        <div class="disc">
          <div class="img-wrap" :class="rotate">
            <img :src="currentsong.picUrl" width="40" height="40">
          </div>
        </div>
        <div class="describe">
          <h2 class="name">{{currentsong.songName}}</h2>
          <p class="singer-name">{{currentsong.singerName}}</p>
        </div>
        <div class="control setplay">
          <progressCircle :percent="percent">
            <i @click.stop="togglePlay" class="iconfont circle-content" :class="{'icon-play': !playing , 'icon-pause': playing}"></i>
          </progressCircle>
        </div>
        <div class="control music-list">
          <x-icon type="ios-list-outline" size="32"></x-icon>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentsong.musicUrl" @ended="audioEnd" @timeupdate="timeUpdate" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import autoprefix from '../../assets/js/autoprefix'
import progressCircle from './progress-bar'
import { playMode } from '../../assets/js/config'
import { shuffle } from '../../assets/js/until'
import Lyric from 'lyric-parser'
import Scroll from '../common/Scroll'
import { setTimeout } from 'timers'

const transform = autoprefix('transform')
const progressBtnWidth = 16

export default {
  data () {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLyricLine: 0,
      show: true
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentsong',
      'currentIndex',
      'singer',
      'playing',
      'mode',
      'sequenceList'
    ]),
    playMode () {
      return this.mode === playMode.sequence ? 'icon-circle' : this.mode === playMode.loop ? 'icon-single' : 'icon-random'
    },
    imgUrl () {
      return `background-image:url(${this.currentsong.picUrl})`
    },
    rotate () {
      return this.playing ? 'play' : 'play pause'
    },
    disable () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / (this.currentsong.duration / 1000)
    }
  },
  methods: {
    // 缩小播放器
    shrinkPlayer () {
      this.setFullScreen(false)
    },
    // 打开播放器
    openPlayer () {
      this.setFullScreen(true)
    },
    // vuex
    ...mapMutations({
      // 是否全屏
      setFullScreen: 'SET_FULL_SCREEN',
      // 播放暂停
      setPlaying: 'SET_PLAYING',
      // 当前歌曲索引
      setCurrentIndex: 'SET_CURRENT_INDEX',
      // 播放模式
      setPlayMode: 'SET_PLAY_MODE',
      // 设置当前播放列表
      setPlayList: 'SET_PLAYLIST',
      // 设置当前播放歌词
      setCurrentSong: 'SET_CURRENT_LYRIC'
    }),
    // 动画相关
    enter (el, done) {
      const {x, y, scale} = this.getPos()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.disc, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.disc.style.animation = ''
    },
    leave (el, done) {
      this.$refs.disc.style.transition = 'all 0.4s'
      const {x, y, scale} = this.getPos()
      this.$refs.disc.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.disc.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.disc.style.transition = ''
      this.$refs.disc.style[transform] = ''
    },
    getPos () {
      // 迷你播放器碟片
      const miniDiscWidth = 40
      const miniDiscLeft = 35
      const miniDiscbottom = 30
      // 全屏播放器碟片
      const fullDiscTop = 116
      const fullDiscWidth = 116
      // 缩放比例
      const scale = miniDiscWidth / fullDiscWidth
      // 迷你碟片初始位置
      const x = -(window.innerWidth / 2 - miniDiscLeft)
      const y = window.innerHeight - fullDiscTop - fullDiscWidth / 2 - miniDiscbottom
      return {
        x,
        y,
        scale
      }
    },
    // 播放控制相关
    togglePlay () {
      if (!this.songReady) {
        return
      }
      this.setPlaying(!this.playing)
      // 歌词播放暂停
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentsong.id
      })
      this.setCurrentIndex(index)
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    // audio相关
    ready () {
      this.songReady = true
    },
    error () {
      // 使网络错误或者歌曲url失效的情况下功能能够正常使用
      this.songReady = true
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    audioEnd () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // audio 时间
    timeUpdate (ev) {
      this.currentTime = ev.target.currentTime
    },
    formatTime (time) {
      time = Math.floor(time)
      const minute = Math.floor(time / 60) < 10 ? '0' + Math.floor(time / 60) : Math.floor(time / 60)
      const second = time % 60 < 10 ? '0' + (time % 60) : time % 60
      return `${minute}:${second}`
    },
    // 进度条事件
    btnTouchStart (ev) {
      this.touch.init = true
      this.touch.startX = ev.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    btnTouchMove (ev) {
      if (!this.touch.init) {
        return
      }
      const disX = ev.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + disX))
      this.setOffset(offsetWidth)
    },
    btnTouchEnd () {
      this.touch.init = false
      this.setCurrentTime()
    },
    clickProgress (ev) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = ev.pageX - rect.left
      this.setOffset(offsetWidth)
      this.setCurrentTime()
    },
    setOffset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px ,0,0)`
    },
    setCurrentTime () {
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / progressBarWidth
      this.$refs.audio.currentTime = this.currentsong.duration / 1000 * percent
      if (!this.playing) {
        this.togglePlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentsong.duration * percent)
      }
    },
    // 歌词相关
    getLyric () {
      this.currentsong.getLyric()
        .then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.currentLyricLine = 0
        })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLyricLine = lineNum
      if (lineNum > 5) {
        let eleLine = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyric.scrollToElement(eleLine, 1000)
      } else {
        this.$refs.lyric.scrollTo(0, 0, 1000)
      }
    },
    // 界面切换
    toggleWrap () {
      this.show = !this.show
    }
  },
  created () {
    this.touch = {}
  },
  components: {
    progressCircle,
    Scroll
  },
  watch: {
    currentsong (newValue, oldValue) {
      if (newValue.id === oldValue.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing (newValue) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newValue ? audio.play() : audio.pause()
      })
    },
    percent (newValue) {
      if (newValue >= 0 && !this.touch.init) {
        // 进度条总长度
        const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 进度条偏移长度
        const offsetWidth = newValue * progressBarWidth
        this.setOffset(offsetWidth)
      }
    },
    fullScreen (newValue) {
      if (newValue) {
        setTimeout(() => {
          this.$refs.lyric.refresh()
        }, 20)
      }
    }
  }
}
</script>
<style lang='scss' scoped>

@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1518500096163'); /* IE9*/
  src: url('iconfont.eot?t=1518500096163#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
  url('iconfont.ttf?t=1518500096163') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1518500096163#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-next:before { content: "\e60b"; }

.icon-pre:before { content: "\e60d"; }

.icon-play:before { content: "\e662"; }

.icon-pause:before { content: "\e670"; }

.icon-random:before { content: "\e66b"; }

.icon-circle:before { content: "\e66c"; }

.icon-single:before { content: "\e66d"; }

.fullScreen {
  transition: all .5s ease-in-out;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 300;
  background-color: #222;
  color: #fff;
  .blur-bg {
    transition: all .5s ease-in-out;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    filter: blur(20px);
    transform: scale(1.25);
    width: 100%;
    background-size: cover;
    background-position: bottom center;
    .bg-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      opacity: .3;
      width: 100%;
      background-color: #000;
    }
  }
  .header {
    position: relative;
    z-index: 100;
    padding-top: 6px;
    padding-bottom: 5px;
    text-align: center;
    line-height: 1.3;
    border-bottom: 1px solid rgba(#fff, .15);
    h2 {
      width: 70%;
      margin: 0 auto;
      font-size: 15px;
      font-weight: normal;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    h4 {
      width: 70%;
      margin: 0 auto;
      font-size: 12px;
      font-weight: normal;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .back {
      position: absolute;
      left: 22px;
      top: 12px;
      .down-arrow {
        width: 12px;
        height: 12px;
        border: 1px solid #fff;
        border-width: 1px 0 0 1px;
        transform: rotate(225deg);
      }
    }
    .needle {
      position: absolute;
      width: 96px;
      height: 137px;
      top: 46px;
      left: 50%;
      margin-left: -15px;
      transform-origin: 15px 2px;
      transition: all .3s;
    }
    .needle-pause {
      transform: rotate(-30deg);
    }
  }
  .song-wrap {
    position: fixed;
    width: 100%;
    top: 116px;
    bottom: 170px;
    z-index: 99;
    white-space: nowrap;
    .song-cd {
      position: relative;
      vertical-align: center;
      height: 100%;
      width: 100%;
      display: inline-block;
      .disc {
        position: relative;
        margin: 0 auto;
        width: 300px;
        height: 300px;
      }
      .rotate {
        position: relative;
        width: 100%;
        height: 100%;
        &.play {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
        .disc-img {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
        }
        .disc-cover {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          width: 188px;
          height: 188px;
          margin: -94px 0 0 -94px;
        }
      }
    }
    .lyric {
      top: -40px;
      display: inline-block;
      width: 100%;
      height: 100%;
      .lyric-wrapper {
        width: 90%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        height: 100%;
      }
      .text {
        line-height: 32px;
        color: hsla(0,0,100%,.5);
        font-size: 14px;
      }
      .lyricActive {
        color: #fff;
      }
      .noLyric {
        color: #fff;
        font-size: 14px;
        position: relative;
        top: 45%;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 40px;
    width: 100%;
  }
  .operators {
    display: flex;
    align-items: center;
    .icon {
      flex: 1;
      text-align: center;
      .operate {
        font-size: 26px;
        position: relative;
        top: 1px;
      }
      .direct {
        font-size: 24px;
      }
      .collect {
        font-size: 25px;
        position: relative;
        top: 1px;
      }
      .red {
        color: #d93f30;
      }
      .play {
        font-size: 50px;
      }
    }
    .center {
      padding: 0 15px;
      text-align: center;
    }
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
    }
  }
  .progress-container {
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0;
    .currentTime {
      text-align: left;
      font-size: 12px;
      flex: 0 0 40px;
      line-height: 30px;
      width: 30px;
    }
    .progress-bar-container {
      flex: 1;
    }
    .progress-bar {
      height: 30px;
    }
    .innerbar {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(#fff,.3);
    }
    .progress {
      position: absolute;
      height: 100%;
      background: #04BE02;
    }
    .progress-btn-container {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
    }
    .progress-btn {
      position: relative;
      top: 7px;
      left: 7px;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 6px solid #fff;
      border-radius: 50%;
      background: #04BE02;
    }
    .duration {
      text-align: right;
      color: #fff;
      font-size: 12px;
      flex: 0 0 40px;
      line-height: 30px;
      width: 30px;
    }
  }
}
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 350;
  width: 100%;
  height: 60px;
  background: #fff;
  box-shadow: 0 0 5px rgb(241, 241, 241);
  .disc {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 15px;
    .img-wrap {
      width: 100%;
      height: 100%;
      &.play {
        animation: rotate 20s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
      img {
        border-radius: 50%;
      }
    }
  }
  .describe {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name {
      margin-bottom: 2px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
    }
    .singer-name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 12px;
      color: #999;
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding-right: 15px;
    .icon-musicList {
      font-size: 32px;
    }
    .circle-content {
      position: absolute;
      top: -11px;
      left: -2px;
    }
  }
  .setplay {
    padding-right: 20px;
    i {
      font-size: 32px;
    }
  }
  .music-list {
    position: relative;
    top: 2px;
  }
}
.full-enter-active, .full-leave-active {
  transition: all 0.4s;
  .header, .footer {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}
.full-enter, .full-leave-to {
  opacity: 0;
  .header {
    transform: translate3d(0, -100px, 0);
  }
  .footer{
    transform: translate3d(0, 100px, 0);
  }
}
.mini-enter-active, .mini-leave-active {
  transition: all 0.4s;
}
.mini-enter, .mini-leave-to {
  opacity: 0;
}
.disable {
  color: #999;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
