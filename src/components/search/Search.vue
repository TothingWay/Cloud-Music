<template>
  <div class="m-header">
    <div class="icon" v-show="showIcon">
      <i class="fa fa-music" slot="overwrite-left"></i>
    </div>
    <div class="search" ref="search">
      <label for="search" v-show="showIcon" @click="focus">
        <icon type="search"></icon>
        <span>搜索</span>
      </label>
      <input type="text" id="search" ref="searchInput" @keyup.enter="search" v-model="keywords" @click="focus">
      <icon type="search" class="searching" v-show="!showIcon"></icon>
      <icon type="clear" class="clear" @click.native="clearInput" v-show="keywords"></icon>
    </div>
    <a slot="right" class="record">
      <transition name="focus" mode="out-in">
        <i class="fa fa-address-book-o" v-if="showIcon"></i>
        <span v-if="!showIcon" @click="blur">取消</span>
      </transition>
    </a>
    <div class="search-content" v-show="!showIcon">
      <scroll :data="scrollData" ref="scroll">
        <div class="hotkey">
          <h3 class="title">热门搜索</h3>
          <ul class="hotList">
            <li @click="addKeywords(item.k)" v-for="(item, index) in hotkey" :key="index">
              {{item.k}}
            </li>
          </ul>
          <h3 class="title" v-show="searchHistory.length">搜索历史</h3>
          <ul class="history" v-show="searchHistory.length">
            <li v-for="(item, index) in searchHistory" @click="selectHistory(item)" :key="index">
              <icon type="waiting-circle"></icon>
              <span>{{item}}</span>
              <x-icon class="close" type="ios-close-empty" size="30" @click.native.stop="deleteHistory(item)"></x-icon>
            </li>
          </ul>
        </div>
      </scroll>
      <suggest :keywords="keywords" v-show="showSuggest" @scrollSuggest="blurInput" @select="select" @singerData="singerData"></suggest>
      <searchResult v-show="selectkey" @scrollList="blurInput" :singerList="singerList" :keywords="selectkey"></searchResult>
    </div>
  </div>
</template>

<script>
import { Icon, stringTrim } from 'vux'
import Suggest from './Suggest'
import SearchResult from './SearchResult'
import Scroll from '../common/Scroll'
import { mapActions, mapGetters } from 'vuex'
import { clearTimeout } from 'timers'
import { scrollMixin } from '../../assets/js/mixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      showIcon: true,
      keywords: '',
      selectkey: '',
      hotkey: [],
      singerList: []
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    showSuggest () {
      return stringTrim(this.keywords)
    },
    scrollData () {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  components: {
    Icon,
    Suggest,
    SearchResult,
    Scroll
  },
  methods: {
    focus () {
      this.showIcon = false
      this.$refs.search.style.width = 'calc(100% - 74px)'
      this.$refs.search.style.left = '15px'
      this.$refs.searchInput.focus()
      this.selectkey = ''
    },
    blur () {
      this.showIcon = true
      this.$refs.search.style.width = 'calc(100% - 118px)'
      this.$refs.search.style.left = '59px'
      this.keywords = ''
      this.selectkey = ''
    },
    clearInput () {
      this.keywords = ''
      this.selectkey = ''
      this.$refs.searchInput.focus()
    },
    blurInput () {
      this.$refs.searchInput.blur()
    },
    gethotkey () {
      let This = this
      This.http.getHotKey().then((res) => {
        if (res.code === 0) {
          This.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // 热门搜索
    addKeywords (keywords) {
      this.keywords = keywords
    },
    select (item) {
      this.selectkey = item
      this.keywords = item
      this.saveSearchHistory(this.keywords)
    },
    // 回车搜索
    search (keywords) {
      if (stringTrim(this.keywords)) {
        this.saveSearchHistory(this.keywords)
        this.selectkey = this.keywords
        this.$refs.searchInput.blur()
      } else {
        this.keywords = ''
      }
    },
    // 搜索历史记录
    selectHistory (item) {
      if (stringTrim(item)) {
        this.selectkey = item
        this.keywords = item
        this.saveSearchHistory(item)
      }
      this.$refs.searchInput.blur()
    },
    // 删除历史记录
    deleteHistory (item) {
      this.deleteSearchHistory(item)
    },
    // 获取歌手数据
    singerData (data) {
      this.singerList = data
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  created () {
    this.gethotkey()
  },
  watch: {
    showIcon (newValue) {
      let timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    }
  }
}
</script>
<style lang='scss' scoped>
.search-container {
  position: absolute;
  z-index: 150;
  top: 0;
  left: 0;

  width: 100%;
}
.m-header{
  position: relative;
  display: flex;
  overflow: hidden;
  height: 38px;
  padding: 3px 0;
  padding-right: 10px;
  padding-left: 10px;
  background-color: #374047;
  .icon {
    position: absolute;
    left: 15px;

    width: 44px;
    padding-top: 7px;

    color: #fff;
    i {
      display: inline-block;

      margin-left: 5px;

      font-size: 22px;
    }
  }
  .record {
    position: absolute;
    right: 15px;

    display: inline-block;

    width: 44px;
    padding-top: 8px;

    text-align: right;

    color: #fff;
    i {
      display: inline-block;

      margin-right: 5px;

      font-size: 22px;
    }
    span {
      position: relative;
      top: -2px;

      display: inline-block;

      width: 100%;
      height: 100%;
    }
  }
}
.search {
  position: absolute;
  right: 59px;
  left: 59px;

  width: calc(100% - 118px);
  padding-top: 5px;

  transition: all .3s;
  label {
    position: absolute;
    top: 5px;
    left: 0;

    display: block;

    width: 100%;
    height: 28px;

    text-align: center;
    i {
      margin-right: 5px;
    }
    span {
      position: relative;
      top: 1px;

      color: #B2B2B2;

      font-size: 14px;
    }
  }
  input {
    box-sizing: border-box;
    width: 100%;
    height: 28px;
    padding: 4px 15px 4px 30px;

    border: 0;
    border-radius: 100px;
    outline: 0;

    font-size: 14px;
    line-height: 2;
  }
  .searching {
    position: absolute;
    top: 12px;
    left: 8px;
  }
  .clear {
    position: absolute;
    top: 12px;
    right: 8px;
  }
}
.focus-enter-active, .focus-leave-active {
  transition: all 0.3s;
}
.focus-enter, .focus-leave-to {
  transform: translate3d(100px, 0, 0);
}
.search-content {
  position: fixed;
  z-index: 150;
  top: 44px;
  bottom: 0;
  left: 0;

  width: 100%;

  background-color: #fff;
  .wrapper {
    position: absolute;
    height: auto;
    top: 0;
    bottom: 0;
  }
  .hotkey {
    padding: 15px 10px 0;
    .title {
      color: #666;
      position: relative;
      font-size: 14px;
      line-height: 1;
      padding-bottom: 5px;
      font-weight: 400;
    }
    .hotList {
      margin-bottom: 30px;
      margin-top: 7px;
      li {
        position: relative;

        display: inline-block;

        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;

        list-style: none;

        color: #333;

        font-size: 14px;
        line-height: 32px;
        &:after {
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;

          box-sizing: border-box;
          width: 100%;
          height: 100%;

          content: "";
          transform-origin: top left;
          pointer-events: none;

          border: 1px solid rgba(0,0,0,.1);;
          border-radius: 32px;
        }
      }
    }
    .history {
      li {
        width: 100%;
        overflow: hidden;
        font-size: 14px;
        position: relative;
        border-bottom: 1px solid rgba(0,0,0,.1);
        margin-top: 10px;
        padding-bottom: 3px;
        i {
          font-size: 16px;
          color: #999;
          position: relative;
          top: -7px;
        }
        span {
          display: inline-block;
          width: calc(100% - 55px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
        }
        .close {
          position: absolute;
          right: 0;
          top: -4px;
          fill: #999;
        }
      }
    }
  }
}
</style>
