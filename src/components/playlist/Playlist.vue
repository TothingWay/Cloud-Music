<template>
  <transition name="list">
    <div class="playlist" v-show="showPlaylist" @click="hide">
      <div class="playlist-wrapper" @click.stop>
        <div class="header">
          <span @click="changeMode">
            <i class="iconfont" :class="iconMode"></i>
            <span class="mode">{{modeText}}</span>
          </span>
          <i class="fa fa-trash-o" @click="clearSongList"></i>
        </div>
        <scroll :data="sequenceList" ref="scroll">
          <transition-group name="listItem" tag="ul">
            <li ref="listItem" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <div class="text">
                <i class="fa fa-volume-up" v-show="current(item)"></i>
                <span class="name">{{item.songName}}</span>
                -
                <span class="singer">{{item.singerName}}</span>
              </div>
              <i class="fa collect" @click.stop="toggleCollect(item)" :class="getCollectIcon(item)"></i>
              <x-icon class="delete" type="ios-close-empty" size="26" @click.native.stop="deleteItem(item)"></x-icon>
            </li>
          </transition-group>
        </scroll>
        <div class="close" @click="hide">
          关闭
        </div>
      </div>
      <div v-transfer-dom>
        <confirm v-model="showConfirm"
        title="你确定要清空播放列表吗？"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
        >
        </confirm>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Scroll from '../common/Scroll'
import { setTimeout } from 'timers'
import { playMode } from '../../assets/js/config'
import { Confirm, TransferDomDirective as TransferDom } from 'vux'
import { shuffle } from '../../assets/js/until'

export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      showPlaylist: false,
      showConfirm: false
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentsong',
      'playlist',
      'mode',
      'collectList'
    ]),
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-circle' : this.mode === playMode.loop ? 'icon-single' : 'icon-random'
    },
    modeText () {
      return this.mode === playMode.sequence ? '列表循环' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    show () {
      this.showPlaylist = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentsong)
      }, 20)
    },
    hide () {
      this.showPlaylist = false
    },
    // 显示当前播放歌曲（图标）
    current (item) {
      if (this.currentsong.id === item.id) {
        return true
      } else {
        return false
      }
    },
    // 播放选择的歌曲
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlaying(true)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaying: 'SET_PLAYING'
    }),
    // 滚动到正在播放的歌曲
    scrollToCurrent (current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 300)
    },
    // 删除歌曲
    deleteItem (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    // 清空播放列表
    clearSongList () {
      this.showConfirm = true
    },
    onCancel () {
      this.showConfirm = false
    },
    onConfirm () {
      this.deleteSongList()
      this.hide()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ]),
    // 播放模式
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
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentsong.id
      })
      this.setCurrentIndex(index)
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
  components: {
    Scroll,
    Confirm
  },
  watch: {
    currentsong (newValue, oldValue) {
      if (!this.showPlaylist || newValue.id === oldValue.id) {
        return
      }
      this.scrollToCurrent(newValue)
    }
  }
}
</script>
<style lang='scss' scoped>
.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 351;
  background-color: rgba(#000, .3);
  &.list-enter-active, &.list-leave-active {
    transition: opacity 0.3s;
    .playlist-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-enter, &.list-leave-to {
    opacity: 0;
    .playlist-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .playlist-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(#fff, .95);
  }
  .wrapper {
    height: 100%;
    max-height: 280px;
  }
}
.header {
  position: relative;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  .mode {
    font-size: 14px;
    position: relative;
    top: -1px;
  }
  .iconfont {
    color: #999;
  }
  .fa-trash-o {
    position: absolute;
    right: 10px;
    top: 14px;
    font-size: 16px;
    color: #999;
  }
}

li {
  box-sizing: border-box;
  height: 38px;
  font-size: 14px;
  margin-left: 10px;
  border-bottom: 1px solid #ddd;
  color: #666;
  position: relative;
  padding-top: 7px;
  padding-bottom: 2px;
  &.listItem-enter-active, &.listItem-leave-active {
    transition: all 0.1s;
  }
  &.listItem-enter, &.listItem-leave-to {
    height: 0;
    opacity: 0;
  }
  .text {
    display: inline-block;
    width: calc(100% - 50px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .fa-volume-up {
    color: #2c3e50;
    padding-right: 3px;
  }
  &:last-child {
    border: none;
  }
  .name {
    color: #2c3e50;
  }
  .collect {
    position: absolute;
    right: 35px;
    top: 11px;
    color: #999;
  }
  .fa-heart {
    color: #d93f30;
  }
  .delete {
    position: absolute;
    right: 4px;
    top: 5px;
    fill: #999;
  }
}

.close {
  border-top: 1px solid #ddd;
  text-align: center;
  font-size: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
}

</style>
