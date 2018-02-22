<template>
  <transition name="slide">
    <div class="remdListDetail">
      <x-header :left-options="{backText: ''}">歌单</x-header>
      <div class="bgimg" :style="bgImage" ref="bgimg">
        <div class="filter" ref="filter"></div>
      </div>
      <div class="remdList-info">
        <div class="pic">
          <img :src="remdList.img" width="120" height="120">
        </div>
        <div class="disc">
          <div class="title">{{this.title}}</div>
          <p class="playCount"><i class="fa fa-headphones"></i> {{this.remdList.playCount}}</p>
        </div>
      </div>
      <scroll :data="songs" ref="list">
        <div class="song-list-wrapper">
          <songList @select="selectItem" :list="songs"></songList>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { XHeader } from 'vux'
import SongList from '../common/SongList'
import { createSong } from '../../assets/js/song'
import Scroll from '../common/Scroll'
import { scrollMixin } from '../../assets/js/mixin'

export default {
  mixins: [scrollMixin],
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.remdList.name
    },
    bgImage () {
      return `background-image:url(${this.remdList.img})`
    },
    ...mapGetters([
      'remdList'
    ])
  },
  components: {
    XHeader,
    SongList,
    Scroll
  },
  methods: {
    getRemdList () {
      let This = this
      if (!This.remdList.id) {
        This.$router.push('/recommend')
        return
      }
      This.http.remdListDetail(This.remdList.id)
        .then((res) => {
          if (res.data.code === 200) {
            let data = res.data.playlist.tracks
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
    },
    normalizeSongs (list) {
      let retrn = []
      list.forEach((item) => {
        retrn.push(createSong(item))
      })
      return retrn
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
    this.getRemdList()
  },
  mounted () {
    // 获取图片高度
    this.imgHeight = this.$refs.bgimg.clientHeight
    // 动态计算
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  }
}
</script>
<style lang='scss' scoped>
.slide-enter-active,.slide-leave-active {
  transition: all .3s;
}
.slide-enter,.slide-leave-to {
  transform: translate3d(100%,0,0)
}
.remdListDetail {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
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
.bgimg {
  position: relative;
  z-index: 101;
  width: 100%;
  padding-top: 60%;
  height: 0;
  background-size: cover;
  filter: blur(30px);
  transform: scale(1.25);
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7,17,27,.2);
  }
}
.remdList-info {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  padding-left: 22px;
  padding-right: 22px;
  z-index: 103;
  width: 100%;
  top: 70px;
  .disc {
    box-sizing: border-box;
    word-wrap:break-word;
    word-break: normal;
    width: calc(100% - 184px);
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  .title {
    color: #fff;
    line-height: 1.3;
    margin-bottom: 20px;
  }
  .playCount {
    color: rgba(255, 255, 255, .8);
    font-size: 14px;
  }
}
.wrapper {
  position: absolute;
  height: auto;
  width: 100%;
  bottom: 0;
}
.song-list-wrapper {
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 104;
}
</style>
