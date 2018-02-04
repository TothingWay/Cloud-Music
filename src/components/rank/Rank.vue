<template>
  <scroll>
    <div class="rank">
      <h2 class="title">云音乐官方榜</h2>
      <!-- 热歌榜 -->
      <hotList @getHot="getHot"></hotList>
      <!-- 飙升榜 -->
      <soaringList @getSoaring="getSoaring"></soaringList>
      <!-- 新歌榜 -->
      <newList @getNew="getNew"></newList>
      <!-- 原创榜 -->
      <originalList @getOriginal="getOriginal"></originalList>
      <!-- 嘻哈榜 -->
      <hipHopList @getHipHop="getHipHop"></hipHopList>
    </div>
    <div class="mask" v-show="load">
      <div class="loading">
        <spinner type="crescent" size="30px"></spinner>
      </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../common/Scroll'
import { Spinner } from 'vux'
import HotList from '../rank/HotList'
import SoaringList from '../rank/SoaringList'
import NewList from '../rank/NewList'
import OriginalList from '../rank/OriginalList'
import HipHopList from '../rank/HipHopList'
export default {
  data () {
    return {
      hotList: [],
      soaringList: [],
      newList: [],
      originalList: [],
      hipHopList: []
    }
  },
  computed: {
    load: function () {
      return this.hotList === undefined || this.soaringList === undefined || this.newList === undefined || this.originalList === undefined || this.hipHopList === undefined
    }
  },
  components: {
    Spinner,
    Scroll,
    HotList,
    SoaringList,
    NewList,
    OriginalList,
    HipHopList
  },
  methods: {
    // loading根据数据是否加载完成来显示关闭
    // 接受嘻哈榜数据
    getHot (data) {
      this.hotList = data
    },
    getSoaring (data) {
      this.soaringList = data
    },
    getNew (data) {
      this.newList = data
    },
    getOriginal (data) {
      this.originalList = data
    },
    getHipHop (data) {
      this.hipHopList = data
    }
  },
  created () {
    this.getHot()
    this.getSoaring()
    this.getNew()
    this.getOriginal()
    this.getHipHop()
  }
}
</script>
<style lang='scss' scoped>
h2.title {
  padding-top: 15px;
  margin-bottom: 12px;
  &::after {
    margin-top: -1px;
  }
}
</style>
