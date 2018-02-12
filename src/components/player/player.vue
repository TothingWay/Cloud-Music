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
          <h4>{{singer.name}}</h4>
          <img src="../../assets/images/needle.png" class="needle">
        </div>
        <div class="song-wrap">
          <div class="song-cd">
            <div class="disc" ref="disc">
              <div class="rotate" :class="rotateCls">
                <img src="../../assets/images/disc.png" class="disc-img">
                <img :src="currentsong.picUrl" class="disc-cover">
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="operators">
            <div class="icon right">
              <i class="iconfont icon-circle operate"></i>
            </div>
            <div class="icon right" :class="disable">
              <i @click="prev" class="iconfont icon-pre direct"></i>
            </div>
            <div class="icon center" :class="disable">
              <i @click="togglePlay" class="iconfont play" :class="{'icon-play': !playing , 'icon-pause': playing}"></i>
            </div>
            <div class="icon left" :class="disable">
              <i @click="next" class="iconfont icon-next direct"></i>
            </div>
            <div class="icon left">
              <i class="fa fa-heart-o collect"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openPlayer">
        <div class="disc">
          <div class="img-wrap" :class="rotateCls">
            <img :src="currentsong.picUrl" width="40" height="40">
          </div>
        </div>
        <div class="describe">
          <h2 class="name">{{currentsong.songName}}</h2>
          <p class="singer-name">{{singer.name}}</p>
        </div>
        <div class="control setplay">
          <i @click.stop="togglePlay" class="iconfont" :class="{'icon-play': !playing , 'icon-pause': playing}"></i>
        </div>
        <div class="control music-list">
          <x-icon type="ios-list-outline" size="32"></x-icon>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentsong.musicUrl" @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import autoprefix from '../../assets/js/autoprefix'

const transform = autoprefix('transform')

export default {
  data () {
    return {
      songReady: false
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentsong',
      'currentIndex',
      'singer',
      'playing'
    ]),
    imgUrl () {
      return `background-image:url(${this.currentsong.picUrl})`
    },
    rotateCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disable () {
      return this.songReady ? '' : 'disable'
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
      setCurrentIndex: 'SET_CURRENT_INDEX'
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
      this.setPlaying(!this.playing)
    },
    next () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    ready () {
      this.songReady = true
    },
    error () {
      // 使网络错误或者歌曲url失效的情况下功能能够正常使用
      this.songReady = true
    }
  },
  watch: {
    currentsong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing (newValue) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newValue ? audio.play() : audio.pause()
      })
    }
  }
}
</script>
<style lang='scss' scoped>

@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1518411284431'); /* IE9*/
  src: url('iconfont.eot?t=1518411284431#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
  url('iconfont.ttf?t=1518411284431') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1518411284431#iconfont') format('svg'); /* iOS 4.1- */
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

.icon-musicList:before { content: "\e95c"; }

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
        border: 1px solid #ccc;
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
    }
  }
  .song-wrap {
    position: fixed;
    width: 100%;
    top: 116px;
    bottom: 170px;
    z-index: 99;
    .song-cd {
      position: relative;
      vertical-align: center;
      height: 0;
      height: 100%;
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
      padding: 0 20px;
      text-align: center;
    }
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
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
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
