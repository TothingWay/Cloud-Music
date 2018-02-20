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
      <div class="hotkey">
        <h3 class="title">热门搜索</h3>
        <ul class="hotList">
          <li @click="addKeywords(item.k)" v-for="(item, index) in hotkey" :key="index">
            {{item.k}}
          </li>
        </ul>
      </div>
      <suggest :keywords="keywords" v-show="keywords" @scrollSuggest="blurInput" @select="select" @singerData="singerData"></suggest>
      <searchResult v-show="selectkey" @scrollList="blurInput" :singerList="singerList" :keywords="selectkey"></searchResult>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vux'
import Suggest from './Suggest'
import SearchResult from './SearchResult'
// import { scrollMixin } from '../../assets/js/mixin'
export default {
  // mixins: [scrollMixin],
  data () {
    return {
      showIcon: true,
      keywords: '',
      selectkey: '',
      hotkey: [],
      singerList: []
    }
  },
  components: {
    Icon,
    Suggest,
    SearchResult
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
    },
    search (keywords) {
      this.selectkey = this.keywords
      this.$refs.searchInput.blur()
    },
    // 获取歌手数据
    singerData (data) {
      this.singerList = data
    }
  },
  created () {
    this.gethotkey()
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
  .hotkey {
    padding: 15px 10px 0;
    .title {
      color: #666;

      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
    }
    .hotList {
      margin: 10px 0 7px;
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
  }
}
</style>
