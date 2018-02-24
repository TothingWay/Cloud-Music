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
          <transition name="fade">
            <img v-if="show" src="../../assets/images/circle.png" class="circle">
          </transition>
        </div>
        <div class="song-wrap" @click="toggleWrap">
          <div class="song-cd" ref="songCd">
            <div class="disc" ref="disc">
              <div class="rotate" :class="rotate">
                <img src="../../assets/images/disc.png" class="disc-img">
                <img :src="currentsong.picUrl" class="disc-cover">
              </div>
            </div>
          </div>
          <scroll class="lyric" ref="lyric" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper" style="opacity: 0;" ref="lyricWrapper">
              <div v-if="currentLyric">
                <p v-for="(line, index) in currentLyric.lines" ref="lyricLine" :class="{'lyricActive':currentLyricLine === index}" class="text" :key="index">{{line.txt}}</p>
              </div>
              <p v-if="currentLyric && !currentLyric.lines.length" class="noLyric">暂无歌词</p>
            </div>
          </scroll>
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
              <i class="iconfont operate" :class="iconMode"></i>
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
              <i class="fa collect" @click="toggleCollect(currentsong)" :class="getCollectIcon(currentsong)"></i>
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
        <div class="control music-list" @click.stop="showPlaylists">
          <x-icon type="ios-list-outline" size="32"></x-icon>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio id="audio" ref="audio" :src="currentsong.musicUrl" @ended="audioEnd" @timeupdate="timeUpdate" @play="ready" @error="error"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import autoprefix from '../../assets/js/autoprefix'
import progressCircle from './progress-bar'
import { playMode } from '../../assets/js/config'
import { shuffle } from '../../assets/js/until'
import Lyric from 'lyric-parser'
import Scroll from '../common/Scroll'
import { setTimeout } from 'timers'
import animation from '../../assets/js/animation'
import Playlist from '../playlist/Playlist'

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
      'sequenceList',
      'collectList'
    ]),
    iconMode () {
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
        return
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
        return
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
          if (this.currentsong.lyric !== lyric) {
            return
          }
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
      if (this.$refs.songCd.style.opacity === '0') {
        animation(this.$refs.songCd, { opacity: '100' })
        animation(this.$refs.lyricWrapper, { opacity: '0' })
      } else {
        animation(this.$refs.songCd, { opacity: '0' })
        animation(this.$refs.lyricWrapper, { opacity: '100' })
      }
    },
    // 歌曲播放列表显示隐藏
    showPlaylists () {
      this.$refs.playlist.show()
    },
    // 收藏
    getCollectIcon (song) {
      if (this.isCollect(song)) {
        return 'fa-heart'
      } else {
        return 'fa-heart-o'
      }
    },
    toggleCollect (song) {
      if (this.isCollect(song)) {
        this.deleteCollectList(song)
      } else {
        this.saveCollectList(song)
      }
    },
    isCollect (song) {
      const index = this.collectList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveCollectList',
      'deleteCollectList'
    ])
  },
  created () {
    this.touch = {}
  },
  components: {
    progressCircle,
    Scroll,
    Playlist
  },
  watch: {
    currentsong (newValue, oldValue) {
      if (!newValue.id) {
        return
      }
      if (newValue.id === oldValue.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
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
    .needle,
    .circle {
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
      position: absolute;
      vertical-align: center;
      height: 100%;
      width: 100%;
      display: inline-block;
      top: 0;
      left: 0;
      .disc {
        width: 300px;
        height: 300px;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -150px;
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
    bottom: 20px;
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
      .red, .fa-heart {
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
