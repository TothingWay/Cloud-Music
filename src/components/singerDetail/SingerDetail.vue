<template>
  <transition name="slide">
    <div class="singerDetail">
      <x-header :left-options="{backText: ''}">{{singerName}}</x-header>
      <div class="img" :style="singerBg" ref="img">
        <div class="filter" ref="filter"></div>
      </div>
      <div class="layer" ref="layer"></div>
      <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" ref="list" class="list">
        <div class="song-list-wrapper">
          <songList @select="selectItem" :list="songs"></songList>
        </div>
        <div class="loading" v-show="!songs.length">
          <spinner type="crescent" size="30px"></spinner>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { XHeader, Spinner } from 'vux'
import Scroll from '../common/Scroll'
import SongList from '../common/SongList'
import autoprefix from '../../assets/js/autoprefix'
import { createSong } from '../../assets/js/song'
import { scrollMixin } from '../../assets/js/mixin'

const transform = autoprefix('transform')
const backdropFilter = autoprefix('backdro-filter')
export default {
  mixins: [scrollMixin],
  data () {
    return {
      songs: [],
      scrollY: 0,
      currentLineNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'singer',
      'playing'
    ]),
    singerName: function () {
      return this.singer.alias ? this.singer.alias.length !== 0 ? this.singer.name + ' (' + this.singer.alias[0] + ')' : this.singer.name : ''
    },
    singerBg: function () {
      return `background-image:url(${this.singer.picUrl})`
    }
  },
  components: {
    XHeader,
    Scroll,
    SongList,
    Spinner
  },
  methods: {
    getSong () {
      let This = this
      if (!This.singer.id) {
        This.$router.push('/singer')
        return
      }
      // 获取歌手数据
      This.http.getArtists(This.singer.id)
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.hotSongs
            This.songs = This.normalizeSongs(data)

            for (let i = 0; i < This.songs.length; i++) {
              // 获取音乐url
              This.http.getMusicUrl(This.songs[i].id)
                .then(function (res) {
                  if (res.data.code === 200) {
                    This.songs[i].musicUrl = res.data.data[0].url
                  }
                })
                .catch(function (err) {
                  console.log(err)
                })
            }
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    normalizeSongs (list) {
      let retrn = []
      list.forEach((item) => {
        retrn.push(createSong(item))
      })
      return retrn
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ]),
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  created () {
    this.getSong()
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // 获取图片高度
    this.imgHeight = this.$refs.img.clientHeight
    // 最大偏移
    this.maxTranslateY = -this.imgHeight + 46
    // 动态计算
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.maxTranslateY, newY)
      let imgzIndex = 0
      let imgScale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      const proportion = Math.abs(newY / this.imgHeight)
      if (newY > 0) {
        imgScale = 1 + proportion
        imgzIndex = 10
      } else {
        blur = Math.min(20 * proportion, 20)
      }
      this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`
      if (newY < this.maxTranslateY) {
        imgzIndex = 10
        this.$refs.img.style.paddingTop = 0
        this.$refs.img.style.height = 46 + 'px'
      } else {
        this.$refs.img.style.paddingTop = '70%'
        this.$refs.img.style.height = 0
      }
      this.$refs.img.style.zIndex = imgzIndex
      this.$refs.img.style[transform] = `scale(${imgScale})`
    }
  }
}
</script>
<style lang='scss' scoped>
.singerDetail {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  .wrapper {
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
}
.slide-enter-active,.slide-leave-active {
  transition: all .3s;
}
.slide-enter,.slide-leave-to {
  transform: translate3d(100%,0,0)
}
.vux-header /deep/{
  width: 100%;
  z-index: 102;
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  .vux-header-title {
    font-size: 16px;
  }
  .vux-header-left {
    .left-arrow {
      &:before {
        border-color: #fff;
      }
    }
  }
}
.img {
  position: relative;
  width: 100%;
  padding-top: 70%;
  height: 0;
  transform-origin: top;
  background-size: cover;
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7,17,27,.4);
  }
}

.layer {
  position: relative;
  height: 100%;
  background-color: #fff;
}
.list {
  overflow: visible;
  z-index: 9;
  background-color: #fff;
}
.loading {
  z-index: 100;
}
</style>
