<template>
  <div class="remdSong">
    <h2 class="title">最新音乐</h2>
    <group>
      <CellBox v-for="(item,index) in remdSong" :key="index">
        <img v-lazy="item.song.album.picUrl" class="img">
        <div class="music">
          <div class="name ellipsis"><span class="songName" v-text="item.name"></span><span class="alias" v-if="item.song.alias.length!==0">（{{item.song.alias[0]}}）</span></div>
          <div class="singer ellipsis">
            <span v-for="(singer,index2) in item.song.artists" :key="index2">
              {{singer.name}}
              <span v-if="index2<item.song.artists.length-1">/</span>
            </span>
            -
            <span v-text="item.song.album.name"></span>
          </div>
          <i class="fa fa-play-circle"></i>
        </div>
      </CellBox>
    </group>
  </div>
</template>

<script>
import { CellBox, Group } from 'vux'
export default {
  props: ['remdSong'],
  components: {
    CellBox,
    Group
  }
}
</script>
<style lang='scss' scoped>
.remdSong /deep/{
  position: relative;
  h2.title {
    margin-top: 20px;
  }
  .weui-cell{
    font-size: 16px;
    .img {
      display: inline-block;
      width: 40px;
      outline: 0;
    }
    .music {
      display: inline-block;
      width: calc(100% - 55px);
      position: relative;
      padding-left: 15px;
      .fa-play-circle {
        font-size: 20px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -10px;
        color: #ccc;
      }
      .name {
        padding-right: 30px;
        .alias {
          color: #888;
          font-size: 15px;
        }
      }
      .singer {
        color: #999;
        font-size: 12px;
        margin-top: 4px;
        padding-right: 30px;
      }
      .total {
        font-size: 13px;
        color: #999;
        line-height: 1;
      }
    }
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
    }
  }
}

</style>
