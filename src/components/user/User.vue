<template>
  <transition name="slide">
    <div class="user">
      <x-header :left-options="{backText: ''}" title="我喜欢"></x-header>
      <scroll :data="collectList" ref="scroll">
        <songList @select="selectItem" :list="collectList"></songList>
        <divider v-show="!collectList.length">暂无喜欢歌曲</divider>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { XHeader, Divider } from 'vux'
import { mapGetters, mapActions } from 'vuex'
import SongList from '../common/SongList'
import Scroll from '../common/Scroll'
import Song from '../../assets/js/song'
import { scrollMixin } from '../../assets/js/mixin'

export default {
  mixins: [scrollMixin],
  computed: {
    ...mapGetters([
      'collectList'
    ])
  },
  components: {
    XHeader,
    SongList,
    Scroll,
    Divider
  },
  methods: {
    selectItem (item, index) {
      let clt = []
      this.collectList.forEach((item) => {
        clt.push(new Song(item))
      })
      this.selectPlay({
        list: clt,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ]),
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  }
}
</script>
<style lang='scss' scoped>
.user {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.3s
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
  .vux-header /deep/{
    background-color: #374047;
    font-size: 16px;
    .vux-header-left .left-arrow {
      &:before {
        border-color: #fff !important;
        top: 7px;
      }
    }
    .vux-header-title {
      height: 38px;
    }
  }
  .vux-divider {
    padding: 10px 15px;
    font-size: 14px;
    margin-top: 20px;
  }
  .wrapper {
    width: 100%;
    height: auto;
    position: absolute;
    top: 44px;
    bottom: 0;
  }
}
</style>
