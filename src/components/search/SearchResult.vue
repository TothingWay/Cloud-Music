<template>
  <scroll class="search-result"
          :data="scrollData"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="scrollList">
    <group>
      <cell-box v-show="searchResult.length" v-for="(item, index) in singerList" @click.native="openSinger(item)" :key="'singer'+index" :link="{path:'/singer/'+item.id}">
        <div class="icon">
          <img v-lazy="item.img1v1Url" width="50" height="50">
        </div>
        <div class="content artists">
          <div class="name">歌手：{{item.name}}</div>
        </div>
      </cell-box>
      <cell-box v-for="(item, index) in searchResult" :key="index" @click.native="selectItem(item)">
        <div class="content">
          <div class="name">{{item.songName}}</div>
          <div class="disc">{{item.singerName}}{{filterAlias(item.alias)}}</div>
          <i class="fa fa-play-circle"></i>
        </div>
      </cell-box>
      <divider v-show="!hasMore && !searchResult.length">无结果</divider>
      <div class="loaded">
        <spinner v-show="searchResult.length && hasMore" type="crescent" size="30px"></spinner>
      </div>
    </group>
  </scroll>
</template>

<script>
import Scroll from '../common/Scroll'
import { Group, CellBox, Spinner, Divider } from 'vux'
import { createSearchSong } from '../../assets/js/song'
import { mapMutations, mapActions } from 'vuex'
export default {
  props: {
    keywords: {
      type: String,
      default: ''
    },
    singerList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      page: 0,
      searchResult: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  computed: {
    scrollData () {
      return this.searchResult.concat(this.singerList)
    }
  },
  components: {
    Scroll,
    Group,
    CellBox,
    Spinner,
    Divider
  },
  methods: {
    getSearchResult (keywords, page) {
      let This = this
      This.hasMore = true
      This.http.search(keywords, page)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.result.songs && res.data.result.songs.length) {
              This.searchResult = This.normalizeSongs(res.data.result.songs)

              for (let i = 0; i < This.searchResult.length; i++) {
                // 获取音乐url
                This.http.getMusicUrl(This.searchResult[i].id)
                  .then(function (res) {
                    if (res.data.code === 200) {
                      This.searchResult[i].musicUrl = res.data.data[0].url
                    }
                  })
                  .catch(function (err) {
                    console.log(err)
                  })
              }

              if (!res.data.result.songs.length || This.searchResult.length >= res.data.result.songCount || res.data.result.songCount === 0) {
                This.hasMore = false
              }
            } else {
              This.hasMore = false
              This.searchResult = []
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    normalizeSongs (list) {
      let retrn = []
      list.forEach((item) => {
        retrn.push(createSearchSong(item))
      })
      return retrn
    },
    filterAlias (alias) {
      let ret = []
      if (!alias.length) {
        return ''
      }
      alias.forEach((item) => {
        ret.push(item)
      })
      return ' - ' + ret.join(' / ')
    },
    openSinger (singer) {
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    selectItem (item) {
      this.insertSong(item)
    },
    // 上拉加载更多
    searchMore () {
      let This = this
      if (!this.hasMore) {
        return
      }
      This.page++
      This.http.search(this.keywords, this.page)
        .then((res) => {
          if (res.data.code === 200) {
            let moreData = This.normalizeSongs(res.data.result.songs)
            for (let i = 0; i < moreData.length; i++) {
              // 获取音乐url
              This.http.getMusicUrl(moreData[i].id)
                .then(function (res) {
                  if (res.data.code === 200) {
                    moreData[i].musicUrl = res.data.data[0].url
                  }
                })
                .catch(function (err) {
                  console.log(err)
                })
            }

            This.searchResult = This.searchResult.concat(moreData)

            if (!res.data.result.songs.length || This.searchResult.length >= res.data.result.songCount || res.data.result.songCount === 0) {
              This.hasMore = false
              console.log(res.data.result.songCount)
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    scrollList () {
      this.$emit('scrollList')
    }
  },
  watch: {
    keywords (newValue) {
      this.getSearchResult(newValue, 0)
      this.page = 0
    }
  }
}
</script>
<style lang='scss' scoped>
.search-result /deep/ {
  z-index: 4;
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100% !important;
  background-color: #fff;
  .weui-cells {
    &:before,
    &:after {
      border: none;
    }
  }
  .vux-divider {
    padding: 10px 15px;
    font-size: 14px;
    margin-top: 20px;
  }
}
.artists {
  box-sizing: border-box;
  padding-left: 10px;
}
.content {
  width: 100%;
  position: relative;
  .fa-play-circle {
    font-size: 20px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -10px;
    color: #ccc;
  }
}
.name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: normal;
}
.disc {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: normal;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}
.loaded {
  text-align: center;
  span {
    margin-bottom: 15px;
  }
}

</style>
