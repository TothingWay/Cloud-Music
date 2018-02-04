<template>
  <div class="remdList">
    <h2 class="title">推荐歌单</h2>
    <flexbox :gutter="2">
      <flexbox-item v-for="(item, index) in remdList1" :key="index">
        <div class="stance">
          <img v-lazy="item.img">
        </div>
        <p class="remd-text" v-text="item.name"></p>
        <span class="playCount"><i class="fa fa-headphones"></i><span v-text="item.playCount"></span></span>
      </flexbox-item>
    </flexbox>
    <flexbox :gutter="2">
      <flexbox-item v-for="(item, index) in remdList2" :key="index">
        <div class="stance">
          <img v-lazy="item.img">
        </div>
        <p class="remd-text" v-text="item.name"></p>
        <span class="playCount"><i class="fa fa-headphones"></i><span v-text="item.playCount"></span></span>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
export default {
  props: ['remdList1', 'remdList2'],
  components: {
    Flexbox,
    FlexboxItem
  }
}
</script>
<style lang='scss' scoped>
.remdList {
  padding-top: 15px;
  overflow: hidden;
  position: relative;
}
.vux-flexbox {
  align-items: flex-start;
  padding-bottom: 16px;
  .vux-flexbox-item {
    position: relative;
    .stance {
      padding-top: 100%;
      position: relative;
      &:after{
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 20px;
        z-index: 2;
        background-image: linear-gradient(180deg,rgba(0,0,0,.2),transparent);
      }
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      outline: 0;
      width: 100%;
    }
    .remd-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding: 6px 2px 0 6px;
      line-height: 1.2;
      font-size: 13px;
    }
    .playCount {
      position: absolute;
      right: 5px;
      top: 2px;
      padding-left: 13px;
      color: #fff;
      font-size: 12px;
      text-shadow: 1px 0 0 rgba(0,0,0,.15);
      z-index: 3;
    }
  }
}
</style>
